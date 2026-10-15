// Réservé au rôle administrateur (le backend refuse de toute façon les routes d'administration aux autres comptes).
export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, role, syncRole } = useSession()
  if (!isLoggedIn.value) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  const current = role.value ?? (import.meta.client ? await syncRole() : null)
  if (current && current !== 'admin') return navigateTo('/')
})
