import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  const accessToken = useCookie('accessToken')
  const sbAccessToken = useCookie('sb-access-token')

  const isLoggedIn = !!token.value || !!accessToken.value || !!sbAccessToken.value

  if (!isLoggedIn) {
    return navigateTo('/login')
  }
})
