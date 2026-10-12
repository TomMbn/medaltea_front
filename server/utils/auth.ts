import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

export interface AuthenticatedUser {
    id: string
}

const CACHE_TTL_MS = 60_000
const verified = new Map<string, { id: string; expires: number }>()

export function readToken(event: H3Event): string | undefined {
    return getCookie(event, 'token') || getCookie(event, 'accessToken') || getCookie(event, 'sb-access-token') || undefined
}

/**
 * Vérifie le token auprès du backend (GET /users/me) et renvoie un identifiant utilisateur stable.
 * Lève une 401 si le token est absent ou refusé.
 */
export async function requireUser(event: H3Event): Promise<AuthenticatedUser> {
    const token = readToken(event)
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Désolé, vous devez être connecté pour discuter avec Léya.',
        })
    }

    const tokenHash = createHash('sha256').update(token).digest('hex')
    const cached = verified.get(tokenHash)
    if (cached && cached.expires > Date.now()) return { id: cached.id }

    const { apiBase } = useRuntimeConfig()
    let profile: any
    try {
        profile = await $fetch(`${apiBase}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
        })
    } catch (error: any) {
        const status = error?.response?.status ?? error?.statusCode
        if (status === 401 || status === 403) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Session expirée. Veuillez vous reconnecter.',
            })
        }
        console.error('Auth verification failed:', error?.message || error)
        throw createError({
            statusCode: 503,
            statusMessage: 'Service d\'authentification indisponible. Réessayez dans un instant.',
        })
    }

    const rawId = profile?.id ?? profile?.sub ?? profile?.userId ?? profile?.email
    // Sans identifiant exploitable, on retombe sur l'empreinte du token (jamais le token lui-même).
    const id = rawId ? String(rawId) : tokenHash.slice(0, 24)

    if (verified.size > 500) verified.clear()
    verified.set(tokenHash, { id, expires: Date.now() + CACHE_TTL_MS })
    return { id }
}
