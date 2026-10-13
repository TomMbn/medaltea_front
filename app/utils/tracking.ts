/** Événement de mesure Umami (anonyme, sans cookie). Sans effet si le script n'est pas chargé ou est bloqué. */
export function trackEvent(name: string, data?: Record<string, string | number | boolean>) {
  try {
    ;(window as any).umami?.track?.(name, data)
  } catch { /* la mesure ne doit jamais gêner l'utilisateur */ }
}
