import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { message, history } = body;

    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;

    // --- AUTHENTICATION CHECK ---
    const token = getCookie(event, 'token');
    const accessToken = getCookie(event, 'accessToken');
    const sbAccessToken = getCookie(event, 'sb-access-token');

    const tokenValue = token || accessToken || sbAccessToken;
    if (!tokenValue) {
        throw createError({
            statusCode: 401,
            statusMessage: "Désolé, vous devez être connecté pour discuter avec Altea.",
        });
    }

    // --- DAILY USAGE LIMIT (SERVER SIDE) ---
    const MAX_DAILY = 10;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    // Use a simplified hash or slice of the token as a unique identifier for the user
    // We use common session identifiers from Supabase or custom auth
    const userId = tokenValue.substring(tokenValue.length - 12); 
    const storageKey = `usage:${today}:${userId}`;
    
    const storage = useStorage('cache'); // Using memory/cache storage context
    const currentUsage: any = (await storage.getItem(storageKey)) || 0;

    if (currentUsage >= MAX_DAILY) {
        throw createError({
            statusCode: 429,
            statusMessage: `Limite journalière atteinte (${MAX_DAILY}/${MAX_DAILY}). Revenez demain pour discuter avec Altea !`,
        });
    }

    // Increment usage immediately or later? 
    // Usually better to increment before calling the AI to prevent race conditions or abuse during long streams
    await storage.setItem(storageKey, currentUsage + 1);

    // --- IP BASED RATE LIMIT (ADDITIONAL PROTECTION) ---
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0] || event.node.req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `rate-limit:ip:${today}:${ip}`;
    const ipUsage : any = await storage.getItem(rateLimitKey) || 0;
    
    if (ipUsage >= 30) { // Safety limit for IPs to prevent bot storms even if authenticated
        throw createError({
            statusCode: 429,
            statusMessage: "Trop de requêtes depuis votre adresse IP. Reviens demain !",
        });
    }
    await storage.setItem(rateLimitKey, ipUsage + 1);
    
    if (!apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: "GEMINI_API_KEY is not configured.",
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // --- DISABLE BUFFERING ---
        setResponseHeaders(event, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Content-Type-Options': 'nosniff',
        });

        // Configured for alternative medicine expertise
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `Tu es l'assistant de santé expert de Medaltea, spécialisé dans les médecines douces et alternatives. 
      Ton rôle est d'écouter les symptômes des utilisateurs avec empathie et de leur suggérer des solutions de médecine alternative adaptées (naturopathie, ostéopathie, phytothérapie, aromathérapie, acupuncture, techniques de respiration, etc.).
      
      CONSIGNES :
      1. Propose des types de praticiens à consulter pour ce problème précis.
      2. Suggère des remèdes naturels, produits ou techniques spécifiques de manière pédagogique.
      3. Garde un ton professionnel, chaleureux et très encourageant.
      4. Précise que ces conseils complètent une prise en charge médicale conventionnelle sans s'y substituer.
      5. Utilise Markdown (gras, listes à puces) pour une lecture agréable sur mobile.
      6. Adopte un ton neutre ou inclusif. Ne fais aucune supposition sur le genre de l'utilisateur (évite de s'adresser systématiquement au féminin).`
        });

        const chat = model.startChat({
            history: (history || []).map((m: any) => ({
                role: m.role,
                parts: m.parts
            })),
        });

        const result = await chat.sendMessageStream(message);

        // We use sendIterable to stream the response chunks back to the client
        return sendIterable(event, (async function* () {
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    yield chunkText;
                }
            }
        })());

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw createError({
            statusCode: error.status || 500,
            statusMessage: "Erreur IA: " + (error.message || "Problème de connexion"),
        });
    }
});
