// Le token d'authentification est dans un cookie httpOnly, invisible côté client.
// `leya_session` est un simple témoin (sans donnée sensible) posé par le serveur au login.
export const useSession = () => {
  const flag = useCookie('leya_session')
  const isLoggedIn = computed(() => !!flag.value)

  async function logout() {
    try {
      await $fetch('/api/logout', { method: 'POST' })
    } finally {
      flag.value = null
    }
  }

  return { isLoggedIn, logout }
}
