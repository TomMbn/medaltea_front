/**
 * État de la session pour l'interface : vérifie le token auprès du backend et (re)pose le rôle.
 * Sert notamment aux sessions ouvertes avant l'introduction du rôle.
 */
export default defineEventHandler(async (event) => {
    setHeader(event, 'Cache-Control', 'no-store')

    const token = readToken(event)
    if (!token) return { authenticated: false, role: null }

    try {
        await requireUser(event) // 401 si le token est refusé par le backend
    } catch (error: any) {
        if (error?.statusCode === 401) {
            clearSessionCookies(event)
            return { authenticated: false, role: null }
        }
        throw error
    }

    const role = await detectRole(token)
    const known = Number(getCookie(event, 'leya_praticien')) || null
    const praticienId = role === 'pro' ? (known ?? await findPraticienId(token)) : null
    setSessionCookies(event, token, role, praticienId)
    return { authenticated: true, role, praticienId }
})
