import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { message, history } = body;

    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;

    // --- RATE LIMITING PROTECTION (IP BASED) ---
    // On Vercel, the IP is in x-forwarded-for. Otherwise, we fallback to event.node.req.socket.remoteAddress
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0] || event.node.req.socket.remoteAddress || 'unknown';
    const storage = useStorage('cache');
    const rateLimitKey = `rate-limit:${ip}`;
    const limit = 10; // Messages per day
    const timeframe = 24 * 60 * 60 * 1000; // 24h in ms

    // Get current usage from Nitro Storage
    const usage: any = await storage.getItem(rateLimitKey) || { count: 0, firstRequest: Date.now() };
    const now = Date.now();

    // Reset if period is over (24h)
    if (now - (usage.firstRequest || 0) > timeframe) {
        usage.count = 0;
        usage.firstRequest = now;
    }

    if (usage.count >= limit) {
        throw createError({
            statusCode: 429,
            statusMessage: "Limite quotidienne atteinte. Reviens demain pour discuter avec Altea !",
        });
    }

    // Increment usage
    usage.count++;
    await storage.setItem(rateLimitKey, usage);
    
    if (!apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: "GEMINI_API_KEY is not configured.",
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

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
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return { text };
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw createError({
            statusCode: error.status || 500,
            statusMessage: "Erreur IA: " + (error.message || "Problème de connexion"),
        });
    }
});
