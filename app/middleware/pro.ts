// Réservé aux comptes praticiens (à utiliser avec le middleware `auth`).
export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, role, syncRole } = useSession()
  if (!isLoggedIn.value) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })

  const current = role.value ?? (import.meta.client ? await syncRole() : null)
  if (current === 'patient') return navigateTo({ path: '/praticiens-pro', query: { compte: 'patient' } })
})
