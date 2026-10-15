// Le token d'authentification est dans un cookie httpOnly, invisible côté client.
// `leya_session` et `leya_role` sont de simples témoins (sans donnée sensible) posés par le serveur :
// ils ne servent qu'à adapter l'interface, le backend contrôle les accès.
export const useSession = () => {
  const flag = useCookie('leya_session')
  const roleCookie = useCookie<'pro' | 'patient' | null>('leya_role')
  const praticienCookie = useCookie<string | null>('leya_praticien')

  // Démonstration : un espace praticien d'essai, sans compte (le vrai cookie de session n'est pas touché)
  const demo = useCookie<string | null>('leya_demo')
  const inDemo = computed(() => demo.value === '1')

  const isLoggedIn = computed(() => inDemo.value || !!flag.value)
  const role = computed<'pro' | 'patient' | null>(() => (inDemo.value ? 'pro' : isLoggedIn.value ? roleCookie.value || null : null))
  const isPro = computed(() => role.value === 'pro')
  const praticienId = computed<number | null>(() => (inDemo.value ? DEMO_ID : isPro.value && Number(praticienCookie.value) > 0 ? Number(praticienCookie.value) : null))

  /** Pour les sessions ouvertes avant l'introduction du rôle : le demande au serveur. */
  async function syncRole() {
    if (inDemo.value || !isLoggedIn.value || roleCookie.value) return role.value
    try {
      await $fetch('/api/session')
    } finally {
      refreshCookie('leya_session')
      refreshCookie('leya_role')
      refreshCookie('leya_praticien')
    }
    return role.value
  }

  /** À appeler après une connexion ou une inscription réussie. */
  function refresh() {
    refreshCookie('leya_session')
    refreshCookie('leya_role')
    refreshCookie('leya_praticien')
  }

  async function logout() {
    if (inDemo.value) { forgetDemo(); demo.value = null; return }
    try {
      // Appareil partagé : le compte suivant ne doit pas recevoir les notifications de celui-ci
      await disablePush()
      await $fetch('/api/logout', { method: 'POST' })
    } finally {
      flag.value = null
      roleCookie.value = null
      praticienCookie.value = null
    }
  }

  return { isLoggedIn, role, isPro, praticienId, syncRole, refresh, logout }
}
