import type { H3Event } from 'h3'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours
const LEGACY_COOKIES = ['token', 'accessToken', 'sb-access-token']

const baseOptions = () => ({
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
})

/** Pose le token en cookie httpOnly (illisible par JavaScript) + un témoin non sensible pour l'interface. */
export function setSessionCookies(event: H3Event, token: string) {
    setCookie(event, 'token', token, { ...baseOptions(), httpOnly: true })
    setCookie(event, 'leya_session', '1', { ...baseOptions(), httpOnly: false })
}

export function clearSessionCookies(event: H3Event) {
    for (const name of LEGACY_COOKIES) deleteCookie(event, name, { path: '/' })
    deleteCookie(event, 'leya_session', { path: '/' })
}

/** Extrait le token de la réponse du backend (access_token, avec repli sur les anciens noms). */
export function extractToken(payload: any): string | undefined {
    const token = payload?.access_token ?? payload?.accessToken ?? payload?.token ?? payload?.data?.token
    return typeof token === 'string' && token ? token : undefined
}

/** Appelle le backend d'authentification et pose la session si un token est renvoyé. */
const AUTH_FIELDS: Record<'login' | 'register' | 'register-pro', string[]> = {
    login: ['mail', 'password'],
    register: ['mail', 'password'],
    'register-pro': ['mail', 'password', 'lastName', 'firstName', 'address', 'country', 'city', 'postalCode', 'phoneNumber', 'schedules', 'price', 'specialityIds'],
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

    if (token) setSessionCookies(event, token)
    // Le token n'est jamais renvoyé au navigateur.
    return { success: true, authenticated: !!token }
}
