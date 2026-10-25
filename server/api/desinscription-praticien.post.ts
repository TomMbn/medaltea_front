/**
 * Désinscription en un clic (RFC 8058) : cible de l'en-tête List-Unsubscribe des e-mails envoyés aux praticiens
 * non inscrits. La messagerie envoie un POST sur `?f=<id fiche>&t=<jeton>` ; le corps (« List-Unsubscribe=One-Click ») est ignoré.
 * Réponse toujours 204, que le lien soit valide ou non (le backend vérifie la signature et ne révèle rien).
 * Le jeton n'est jamais journalisé.
 */
const PRATICIEN_ID = /^\d{1,10}$/
// Jeton HMAC-SHA256 en base64url (43 caractères) ; le backend refuse au-delà de 64
const TOKEN = /^[A-Za-z0-9_-]{1,64}$/

export default defineEventHandler(async (event) => {
    setHeader(event, 'Cache-Control', 'no-store')
    const { f, t } = getQuery(event)
    if (typeof f !== 'string' || !PRATICIEN_ID.test(f) || typeof t !== 'string' || !TOKEN.test(t)) return sendNoContent(event)

    const { apiBase } = useRuntimeConfig()
    try {
        await $fetch.raw(`${apiBase}/listing-outreach/unsubscribe`, {
            method: 'POST', body: { praticienId: Number(f), token: t }, timeout: 10000, ignoreResponseError: true,
        })
    } catch (error: any) {
        // La messagerie ne réessaie pas : on le signale dans les journaux, sans le jeton
        console.error('Désinscription en un clic : backend injoignable', error?.message || error)
    }
    return sendNoContent(event)
})
