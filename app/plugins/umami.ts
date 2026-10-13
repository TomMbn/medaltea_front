// Mesure d'audience Umami auto-hébergée. Le script et la collecte passent par le domaine principal
// (UMAMI_PROXY_PATH, réécritures Vercel de nuxt.config.ts) pour limiter le blocage par les bloqueurs de publicité.
// Sans hôte ni identifiant de site (développement), aucun script n'est chargé.
export default defineNuxtPlugin(() => {
  const { umami } = useRuntimeConfig().public
  if (!umami.host || !umami.websiteId) return

  useHead({
    script: [{
      src: `${UMAMI_PROXY_PATH}/s.js`,
      defer: true,
      'data-website-id': umami.websiteId,
      'data-host-url': UMAMI_PROXY_PATH,
      // Mesure limitée au domaine de production (pas les prévisualisations Vercel)
      ...(umami.domains ? { 'data-domains': umami.domains } : {}),
      // Adresses sans paramètres ni ancre : /chatbot?q=… peut contenir le premier message envoyé au chatbot
      'data-exclude-search': 'true',
      'data-exclude-hash': 'true',
      'data-do-not-track': 'true',
    }],
  })
})
