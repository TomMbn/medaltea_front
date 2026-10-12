export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useSession()

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
