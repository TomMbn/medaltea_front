// Le token d'authentification est dans un cookie httpOnly, invisible côté client.
// `leya_session` et `leya_role` sont de simples témoins (sans donnée sensible) posés par le serveur :
// ils ne servent qu'à adapter l'interface, le backend contrôle les accès.
export const useSession = () => {
  const flag = useCookie('leya_session')
  const roleCookie = useCookie<'pro' | 'patient' | null>('leya_role')

  const isLoggedIn = computed(() => !!flag.value)
  const role = computed<'pro' | 'patient' | null>(() => (isLoggedIn.value ? roleCookie.value || null : null))
  const isPro = computed(() => role.value === 'pro')

  /** Pour les sessions ouvertes avant l'introduction du rôle : le demande au serveur. */
  async function syncRole() {
    if (!isLoggedIn.value || roleCookie.value) return role.value
    try {
      await $fetch('/api/session')
    } finally {
      refreshCookie('leya_session')
      refreshCookie('leya_role')
    }
    return role.value
  }

  /** À appeler après une connexion ou une inscription réussie. */
  function refresh() {
    refreshCookie('leya_session')
    refreshCookie('leya_role')
  }

  async function logout() {
    try {
      await $fetch('/api/logout', { method: 'POST' })
    } finally {
      flag.value = null
      roleCookie.value = null
    }
  }

  return { isLoggedIn, role, isPro, syncRole, refresh, logout }
}
