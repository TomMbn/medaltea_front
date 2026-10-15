import type { H3Event } from 'h3'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours
const LEGACY_COOKIES = ['token', 'accessToken', 'sb-access-token']

const baseOptions = () => ({
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
})

export type Role = 'pro' | 'patient' | 'admin'

/**
 * Pose le token en cookie httpOnly (illisible par JavaScript) + deux témoins non sensibles pour l'interface :
 * `leya_session` (connecté) et `leya_role` (pro / patient / admin). L'accès aux données reste contrôlé par le backend.
 */
export function setSessionCookies(event: H3Event, token: string, role: Role = 'patient', praticienId: number | null = null) {
    setCookie(event, 'token', token, { ...baseOptions(), httpOnly: true })
    setCookie(event, 'leya_session', '1', { ...baseOptions(), httpOnly: false })
    setCookie(event, 'leya_role', role, { ...baseOptions(), httpOnly: false })
    // Identifiant public de la fiche (lien « Ma fiche publique ») : aucune donnée sensible.
    if (role === 'pro' && praticienId) setCookie(event, 'leya_praticien', String(praticienId), { ...baseOptions(), httpOnly: false })
    else deleteCookie(event, 'leya_praticien', { path: '/' })
}

export function clearSessionCookies(event: H3Event) {
    for (const name of LEGACY_COOKIES) deleteCookie(event, name, { path: '/' })
    deleteCookie(event, 'leya_session', { path: '/' })
    deleteCookie(event, 'leya_role', { path: '/' })
    deleteCookie(event, 'leya_praticien', { path: '/' })
}

/**
 * Le rôle est calculé par le backend (profil du compte : patient, pro ou admin). À défaut, un compte praticien est reconnu
 * au fait que l'API de ses prestations lui répond ; un patient reçoit une erreur d'autorisation (403/404).
 */
export async function detectRole(token: string): Promise<Role> {
    const { apiBase } = useRuntimeConfig()
    try {
        const me: any = await $fetch(`${apiBase}/users/me`, { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 })
        if (me?.role === 'admin' || me?.role === 'pro' || me?.role === 'patient') return me.role
    } catch { /* repli ci-dessous */ }
    try {
        await $fetch(`${apiBase}/praticiens/me/consultation-types`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
        })
        return 'pro'
    } catch {
        return 'patient'
    }
}

/** Extrait le token de la réponse du backend (access_token, avec repli sur les anciens noms). */
export function extractToken(payload: any): string | undefined {
    const token = payload?.access_token ?? payload?.accessToken ?? payload?.token ?? payload?.data?.token
    return typeof token === 'string' && token ? token : undefined
}

/** Appelle le backend d'authentification et pose la session si un token est renvoyé. */
/**
 * Retrouve l'identifiant de la fiche du compte connecté : réponse d'inscription, puis profil, puis recherche
 * par identifiant utilisateur ou email dans la liste. À remplacer par GET /praticiens/me quand il existera.
 */
export async function findPraticienId(token: string, mail?: string, response?: any): Promise<number | null> {
    const direct = Number(response?.praticien?.id ?? response?.praticienId)
    if (Number.isInteger(direct) && direct > 0) return direct

    const { apiBase } = useRuntimeConfig()
    try {
        const me: any = await $fetch(`${apiBase}/users/me`, { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 })
        const fromProfile = Number(me?.praticien?.id ?? me?.praticienId)
        if (Number.isInteger(fromProfile) && fromProfile > 0) return fromProfile

        const userId = me?.id ?? me?.sub ?? me?.userId
        const list: any[] = await $fetch(`${apiBase}/praticiens`, { timeout: 8000 })
        const fiches = Array.isArray(list) ? list : []
        // L'email saisi à l'inscription ou à la connexion est le critère le plus direct ; l'identifiant utilisateur sert de repli.
        const byMail = mail ? fiches.find(p => p?.mail && String(p.mail).toLowerCase() === mail.toLowerCase()) : undefined
        const byUser = userId != null ? fiches.find(p => p?.userId != null && String(p.userId) === String(userId)) : undefined
        const match = byMail ?? byUser
        return match?.id ? Number(match.id) : null
    } catch {
        return null
    }
}

const AUTH_FIELDS: Record<'login' | 'register' | 'register-pro', string[]> = {
    login: ['mail', 'password'],
    register: ['mail', 'password'],
    'register-pro': ['mail', 'password', 'lastName', 'firstName', 'address', 'country', 'city', 'postalCode', 'latitude', 'longitude', 'phoneNumber', 'schedules', 'price', 'specialityIds', 'tagline', 'publicTypes', 'rpps', 'adeli'],
}

export async function authenticate(event: H3Event, path: 'login' | 'register' | 'register-pro') {
    const raw = (await readBody(event)) ?? {}
    const body: Record<string, any> = {}
    for (const key of AUTH_FIELDS[path]) if (raw[key] !== undefined && raw[key] !== '') body[key] = raw[key]
    const { apiBase } = useRuntimeConfig()

    let response: any
    try {
        response = await $fetch(`${apiBase}/auth/${path}`, { method: 'POST', body, timeout: 10000 })
    } catch (error: any) {
        const status = error?.response?.status ?? error?.statusCode ?? 502
        throw createError({
            statusCode: status,
            statusMessage: error?.data?.message
                ? [].concat(error.data.message).join(' ')
                : 'Erreur du service d\'authentification.',
        })
    }

    let token = extractToken(response)

    // Le backend ne renvoie pas toujours de token à l'inscription : on connecte alors
    // l'utilisateur avec les mêmes identifiants, pour qu'il n'ait pas à se reconnecter.
    if (!token && path !== 'login' && body.mail && body.password) {
        try {
            const login = await $fetch(`${apiBase}/auth/login`, {
                method: 'POST',
                body: { mail: body.mail, password: body.password },
                timeout: 10000,
            })
            token = extractToken(login)
        } catch (error: any) {
            // Le compte est créé : on laisse l'interface renvoyer vers la page de connexion.
            console.error('Auto-login after registration failed:', error?.message || error)
        }
    }

    let role: Role | null = null
    let praticienId: number | null = null
    if (token) {
        // L'inscription pro crée toujours un praticien ; sinon on interroge le backend.
        role = path === 'register-pro' ? 'pro' : await detectRole(token)
        if (role === 'pro') praticienId = await findPraticienId(token, body.mail, response)
        setSessionCookies(event, token, role, praticienId)
    }
    // Le token n'est jamais renvoyé au navigateur.
    return { success: true, authenticated: !!token, role, praticienId }
}
