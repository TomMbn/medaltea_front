// Réservé au rôle administrateur (le backend refuse de toute façon les routes d'administration aux autres comptes).
// Sans session : /admin affiche la connexion dédiée à l'équipe, les autres pages y renvoient puis y reviennent.
export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, role, syncRole } = useSession()
  if (!isLoggedIn.value) {
    if (to.path === '/admin') return
    return navigateTo({ path: '/admin', query: { redirect: to.fullPath } })
  }
  const current = role.value ?? (import.meta.client ? await syncRole() : null)
  if (current && current !== 'admin') return navigateTo('/')
})
