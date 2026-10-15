// Démonstration de l'espace praticien : données fictives gardées dans l'onglet, rien n'est envoyé au serveur.
export const useDemo = () => {
  const cookie = useCookie<string | null>('leya_demo')
  const active = computed(() => cookie.value === '1')

  /** Démarre une démonstration neuve (navigateur uniquement). */
  function start() {
    resetDemo()
    cookie.value = '1'
    // Écrit tout de suite : useCookie ne le fait qu'un instant plus tard, après les premiers appels de la page
    document.cookie = 'leya_demo=%221%22; path=/; SameSite=Lax'
  }
  function stop() {
    forgetDemo()
    cookie.value = null
    document.cookie = 'leya_demo=; path=/; max-age=0'
  }
  return { active, start, stop, reset: resetDemo, simulate: simulateRequest }
}
