/**
 * Passerelle vers le backend : le navigateur n'appelle jamais le VPS directement.
 * - liste blanche de routes (rien d'autre n'est relayé, notamment pas PUT/DELETE/POST /praticiens) ;
 * - le token (cookie httpOnly) est ajouté en Bearer côté serveur pour les routes protégées ;
 * - champs privés (email, userId) retirés des fiches publiques.
 */
type Rule = {
    method: string
    pattern: RegExp
    auth: boolean
    query?: string[]
    body?: string[]
    cacheable?: boolean
}

const RULES: Rule[] = [
    { method: 'GET', pattern: /^specialites$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens$/, auth: false, cacheable: true, query: ['specialityId', 'city'] },
    { method: 'GET', pattern: /^praticiens\/\d+$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/(consultation-types|availabilities)$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/slots$/, auth: false, query: ['from', 'to', 'consultationTypeId'] },
    { method: 'GET', pattern: /^appointments\/me$/, auth: true, query: ['from', 'to', 'status'] },
    { method: 'POST', pattern: /^appointments$/, auth: true, body: ['praticienId', 'consultationTypeId', 'startAt', 'userNote'] },
    { method: 'PATCH', pattern: /^appointments\/\d+\/status$/, auth: true, body: ['status', 'reason'] },

    // Profil
    { method: 'GET', pattern: /^users\/me$/, auth: true },

    // Espace praticien
    { method: 'GET', pattern: /^praticiens\/me\/appointments$/, auth: true, query: ['from', 'to', 'status'] },
    { method: 'PATCH', pattern: /^praticiens\/me\/settings$/, auth: true, body: ['autoConfirm'] },
    { method: 'GET', pattern: /^praticiens\/me\/consultation-types$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/consultation-types$/, auth: true, body: ['name', 'durationMin', 'price', 'mode'] },
    { method: 'PATCH', pattern: /^praticiens\/me\/consultation-types\/\d+$/, auth: true, body: ['name', 'durationMin', 'price', 'mode'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/consultation-types\/\d+$/, auth: true },
    { method: 'GET', pattern: /^praticiens\/me\/availabilities$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/availabilities$/, auth: true, body: ['dayOfWeek', 'startTime', 'endTime'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/availabilities\/\d+$/, auth: true },
    { method: 'GET', pattern: /^praticiens\/me\/unavailabilities$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/unavailabilities$/, auth: true, body: ['startAt', 'endAt', 'reason'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/unavailabilities\/\d+$/, auth: true },
]

const PRIVATE_FIELDS = ['mail', 'userId']

function stripPrivate(data: any): any {
    if (Array.isArray(data)) return data.map(stripPrivate)
    if (data && typeof data === 'object') {
        const copy = { ...data }
        for (const field of PRIVATE_FIELDS) delete copy[field]
        if (copy.praticien) copy.praticien = stripPrivate(copy.praticien)
        return copy
    }
    return data
}

function pick(source: Record<string, any>, keys: string[]) {
    const out: Record<string, any> = {}
    for (const key of keys) if (source?.[key] !== undefined && source[key] !== '') out[key] = source[key]
    return out
}

function validateAppointment(body: Record<string, any>) {
    const praticienId = Number(body.praticienId)
    const consultationTypeId = Number(body.consultationTypeId)
    if (!Number.isInteger(praticienId) || !Number.isInteger(consultationTypeId) || typeof body.startAt !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Demande de rendez-vous invalide.' })
    }
    if (body.userNote !== undefined && (typeof body.userNote !== 'string' || body.userNote.length > 500)) {
        throw createError({ statusCode: 400, statusMessage: 'Le motif ne doit pas dépasser 500 caractères.' })
    }
    return { ...body, praticienId, consultationTypeId }
}

export default defineEventHandler(async (event) => {
    const path = (getRouterParam(event, 'path') || '').replace(/^\/+|\/+$/g, '')
    // HEAD est traité comme GET (sondes, caches, outils de test)
    const method = event.method.toUpperCase() === 'HEAD' ? 'GET' : event.method.toUpperCase()

    const rule = RULES.find(r => r.method === method && r.pattern.test(path))
    if (!rule) throw createError({ statusCode: 404, statusMessage: 'Route introuvable.' })

    const headers: Record<string, string> = {}
    if (rule.auth) {
        const token = readToken(event)
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: 'Vous devez être connecté.' })
        }
        headers.Authorization = `Bearer ${token}`
    }

    let body: Record<string, any> | undefined
    if (rule.body) {
        body = pick((await readBody(event)) ?? {}, rule.body)
        if (path === 'appointments') body = validateAppointment(body)
    }
    const query = rule.query ? pick(getQuery(event), rule.query) : undefined
    if (query?.specialityId !== undefined && !/^\d+$/.test(String(query.specialityId))) {
        throw createError({ statusCode: 400, statusMessage: 'Spécialité invalide.' })
    }
    if (query?.city !== undefined) query.city = String(query.city).slice(0, 100)

    const { apiBase } = useRuntimeConfig()
    let response
    try {
        response = await $fetch.raw(`${apiBase}/${path}`, {
            method: method as any, headers, query, body, timeout: 10000, ignoreResponseError: true,
        })
    } catch (error: any) {
        console.error('Backend unreachable:', error?.message || error)
        throw createError({ statusCode: 502, statusMessage: 'Le service est momentanément indisponible.' })
    }

    // Un token refusé par le backend équivaut à une session expirée.
    setResponseStatus(event, response.status)
    setHeader(event, 'Cache-Control', rule.cacheable && response.status === 200
        ? 'public, s-maxage=15, stale-while-revalidate=30'
        : 'no-store')

    if (response.status === 204) return sendNoContent(event)
    return stripPrivate(response._data)
})
