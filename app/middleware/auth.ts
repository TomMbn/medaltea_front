export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useSession()

  if (!isLoggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
