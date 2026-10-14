/** Préfixe du proxy Umami sur le domaine principal (réécritures Vercel déclarées dans nuxt.config.ts) */
export const UMAMI_PROXY_PATH = '/_ly'

/** Événement de mesure Umami (anonyme, sans cookie). Sans effet si le script n'est pas chargé ou est bloqué. */
export function trackEvent(name: string, data?: Record<string, string | number | boolean>) {
  try {
    ;(window as any).umami?.track?.(name, data)
  } catch { /* la mesure ne doit jamais gêner l'utilisateur */ }
}

/** Comme trackEvent, mais attend jusqu'à 5 s le chargement du script (page affichée dès l'arrivée, ex. erreur 404). */
export function trackEventWhenReady(name: string, data?: Record<string, string | number | boolean>, attempts = 10) {
  if (typeof window === 'undefined') return
  if ((window as any).umami?.track || attempts <= 0) return trackEvent(name, data)
  setTimeout(() => trackEventWhenReady(name, data, attempts - 1), 500)
}
