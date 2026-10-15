// Pages réservées aux visiteurs (connexion, inscription) : un utilisateur déjà connecté est renvoyé dans son espace.
export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, role, syncRole } = useSession()
  if (!isLoggedIn.value) return

  const current = role.value ?? (import.meta.client ? await syncRole() : null)
  const redirect = String(to.query.redirect ?? '')
  // Un patient arrivé par l'entrée « praticien » peut vouloir changer de compte : on le laisse sur la page.
  const proContext = to.query.espace === 'pro' || redirect.startsWith('/pro')
  if (proContext && current !== 'pro') return
  if (!current) return

  // Redirection interne uniquement (évite les redirections ouvertes vers un site externe)
  const safeTarget = redirect.startsWith('/') && !redirect.startsWith('//') && !/^\/(login|register)(\/|\?|$)/.test(redirect) ? redirect : ''
  return navigateTo(safeTarget || (current === 'pro' ? '/pro' : '/chatbot'), { replace: true })
})
