// Mesure d'audience Umami auto-hébergée. Le script et la collecte passent par le domaine principal
// (UMAMI_PROXY_PATH, réécritures Vercel de nuxt.config.ts) pour limiter le blocage par les bloqueurs de publicité.
// Sans hôte ni identifiant de site (développement), aucun script n'est chargé.

// Rappel appelé par le script avant chaque envoi (data-before-send). L'adresse arrive toujours sans paramètres
// (data-exclude-search : /chatbot?q=… peut contenir le premier message envoyé au chatbot) ; seuls les paramètres
// de campagne utm_* de la page d'arrivée y sont remis, avec des valeurs courtes et sans caractères libres.
// S'il n'est pas chargé, rien de plus n'est envoyé : l'adresse reste sans paramètres.
const BEFORE_SEND = `window.__leyaUmamiBeforeSend=function(t,p){try{if(p&&typeof p.url==='string'){`
  + `var s=new URLSearchParams(location.search),k=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'],o=[];`
  + `for(var i=0;i<k.length;i++){var v=s.get(k[i]);if(v&&/^[A-Za-z0-9._ -]{1,100}$/.test(v))o.push(k[i]+'='+encodeURIComponent(v))}`
  + `if(o.length){var u=new URL(p.url,location.href);if(u.pathname===location.pathname&&!u.search){u.search=o.join('&');p.url=u.toString()}}`
  + `}}catch(e){}return p}`

export default defineNuxtPlugin(() => {
  const { umami } = useRuntimeConfig().public
  if (!umami.host || !umami.websiteId) return

  useHead({
    script: [
      { key: 'umami-before-send', innerHTML: BEFORE_SEND },
      {
        key: 'umami',
        src: `${UMAMI_PROXY_PATH}/s.js`,
        defer: true,
        'data-website-id': umami.websiteId,
        'data-host-url': UMAMI_PROXY_PATH,
        // Mesure limitée au domaine de production (pas les prévisualisations Vercel)
        ...(umami.domains ? { 'data-domains': umami.domains } : {}),
        'data-exclude-search': 'true',
        'data-exclude-hash': 'true',
        'data-do-not-track': 'true',
        'data-before-send': '__leyaUmamiBeforeSend',
        // Vitesse réelle des pages (LCP, INP, CLS, FCP, TTFB) : données techniques, sans identifiant
        'data-performance': 'true',
      },
    ],
  })
})
