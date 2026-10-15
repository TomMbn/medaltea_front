// Le token d'authentification est dans un cookie httpOnly, invisible côté client.
// `leya_session` et `leya_role` sont de simples témoins (sans donnée sensible) posés par le serveur :
// ils ne servent qu'à adapter l'interface, le backend contrôle les accès.
export const useSession = () => {
  const flag = useCookie('leya_session')
  const roleCookie = useCookie<'pro' | 'patient' | null>('leya_role')
  const praticienCookie = useCookie<string | null>('leya_praticien')

  const isLoggedIn = computed(() => !!flag.value)
  const role = computed<'pro' | 'patient' | null>(() => (isLoggedIn.value ? roleCookie.value || null : null))
  const isPro = computed(() => role.value === 'pro')
  const praticienId = computed<number | null>(() => (isPro.value && Number(praticienCookie.value) > 0 ? Number(praticienCookie.value) : null))

  /** Pour les sessions ouvertes avant l'introduction du rôle : le demande au serveur. */
  async function syncRole() {
    if (!isLoggedIn.value || roleCookie.value) return role.value
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
