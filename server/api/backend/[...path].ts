/**
 * Passerelle vers le backend : le navigateur n'appelle jamais le VPS directement.
 * - liste blanche de routes (rien d'autre n'est relayé, notamment pas PUT/DELETE/POST /praticiens) ;
 * - le token (cookie httpOnly) est ajouté en Bearer côté serveur pour les routes protégées ;
 * - champs privés (email, userId, identifiants professionnels) retirés des fiches publiques.
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
    { method: 'GET', pattern: /^praticiens$/, auth: false, cacheable: true, query: ['specialityId', 'city', 'q', 'language', 'publicType', 'claimed', 'bookable', 'sort', 'limit', 'offset', 'lat', 'lng', 'radiusKm'] },
    { method: 'GET', pattern: /^praticiens\/\d+$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/slug\/[a-z0-9-]{1,120}$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/next-slot$/, auth: false, query: ['consultationTypeId'] },
    { method: 'GET', pattern: /^praticiens\/\d+\/(consultation-types|availabilities)$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/slots$/, auth: false, query: ['from', 'to', 'consultationTypeId'] },
    { method: 'GET', pattern: /^appointments\/me$/, auth: true, query: ['from', 'to', 'status'] },
    { method: 'POST', pattern: /^appointments$/, auth: true, body: ['praticienId', 'consultationTypeId', 'startAt', 'userNote'] },
    { method: 'PATCH', pattern: /^appointments\/\d+\/status$/, auth: true, body: ['status', 'reason'] },

    // Profil
    { method: 'GET', pattern: /^users\/me$/, auth: true },

    // Revendication d'une fiche répertoriée (compte pro)
    { method: 'POST', pattern: /^praticiens\/\d+\/claim-requests$/, auth: true, body: ['message', 'rpps', 'siret'] },
    { method: 'GET', pattern: /^praticiens\/me\/claim-requests$/, auth: true },

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

const PRIVATE_FIELDS = ['mail', 'userId', 'rpps', 'siret', 'adeli', 'googlePlaceId', 'googlePlaceIdRefreshedAt']

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

const SORTS = ['distance', 'price', 'nextAvailability']
const PUBLIC_TYPES = ['babies', 'children', 'teenagers', 'adults', 'seniors', 'pregnant_women', 'athletes']

function validateListQuery(query?: Record<string, any>) {
    if (!query) return
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    if (query.limit !== undefined && !(/^\d+$/.test(String(query.limit)) && +query.limit >= 1 && +query.limit <= 50)) throw bad('Limite invalide.')
    if (query.offset !== undefined && !/^\d{1,6}$/.test(String(query.offset))) throw bad('Décalage invalide.')
    if (query.sort !== undefined && !SORTS.includes(String(query.sort))) throw bad('Tri invalide.')
    if (query.publicType !== undefined && !PUBLIC_TYPES.includes(String(query.publicType))) throw bad('Public invalide.')
    for (const flag of ['claimed', 'bookable']) {
        if (query[flag] !== undefined && !['true', 'false'].includes(String(query[flag]))) throw bad('Filtre invalide.')
    }
    const inRange = (value: unknown, min: number, max: number) => /^-?\d{1,3}(\.\d{1,6})?$/.test(String(value)) && +String(value) >= min && +String(value) <= max
    if (query.lat !== undefined && !inRange(query.lat, -90, 90)) throw bad('Latitude invalide.')
    if (query.lng !== undefined && !inRange(query.lng, -180, 180)) throw bad('Longitude invalide.')
    if (query.radiusKm !== undefined && !inRange(query.radiusKm, 1, 500)) throw bad('Rayon invalide.')
    if ((query.lat === undefined) !== (query.lng === undefined)) throw bad('Position incomplète.')
    if (query.sort === 'distance' && query.lat === undefined) throw bad('Le tri par distance nécessite une position.')
    if (query.consultationTypeId !== undefined && !/^\d+$/.test(String(query.consultationTypeId))) throw bad('Prestation invalide.')
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
    if (query?.q !== undefined) query.q = String(query.q).slice(0, 100)
    if (query?.language !== undefined) query.language = String(query.language).slice(0, 10)
    validateListQuery(query)

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

    // Total des résultats (pagination de l'annuaire)
    const total = response.headers.get('x-total-count')
    if (total && /^\d+$/.test(total)) setHeader(event, 'X-Total-Count', total)

    if (response.status === 204) return sendNoContent(event)
    return stripPrivate(response._data)
})
