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
    /** Conserve les valeurs vides (effacer un champ) */
    keepEmpty?: boolean
    /** Réponse destinée au propriétaire de la fiche : champs privés conservés */
    own?: boolean
}

const RULES: Rule[] = [
    { method: 'GET', pattern: /^specialites$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^disciplines$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens$/, auth: false, cacheable: true, query: ['specialityId', 'city', 'q', 'language', 'publicType', 'claimed', 'bookable', 'sort', 'limit', 'offset', 'lat', 'lng', 'radiusKm'] },
    { method: 'GET', pattern: /^praticiens\/\d+$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/slug\/[a-z0-9-]{1,120}$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/next-slot$/, auth: false, query: ['consultationTypeId'] },
    { method: 'GET', pattern: /^praticiens\/\d+\/(consultation-types|availabilities)$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/slots$/, auth: false, query: ['from', 'to', 'consultationTypeId'] },
    // Note Google lue en direct : jamais mise en cache (conditions Google Maps Platform), sans les avis
    { method: 'GET', pattern: /^praticiens\/\d+\/google-rating$/, auth: false },
    { method: 'GET', pattern: /^appointments\/me$/, auth: true, query: ['from', 'to', 'status'] },
    { method: 'POST', pattern: /^appointments$/, auth: true, body: ['praticienId', 'consultationTypeId', 'startAt', 'userNote'] },
    { method: 'PATCH', pattern: /^appointments\/\d+\/status$/, auth: true, body: ['status', 'reason'] },

    // Profil
    // Profil du compte connecté : l'utilisateur reçoit ses propres informations (dont son email)
    { method: 'GET', pattern: /^users\/me$/, auth: true, own: true },
    { method: 'PATCH', pattern: /^users\/me$/, auth: true, body: ['firstName', 'lastName', 'phoneNumber'], own: true },
    { method: 'GET', pattern: /^users\/me\/export$/, auth: true, own: true },
    // Suppression du compte (mot de passe exigé par le backend ; un compte pro supprime aussi sa fiche)
    { method: 'DELETE', pattern: /^users\/me$/, auth: true, body: ['password'] },
    // Droit d'opposition au suivi d'usage (statistiques pseudonymisées)
    { method: 'GET', pattern: /^tracking\/preferences$/, auth: true },
    { method: 'PUT', pattern: /^tracking\/preferences$/, auth: true, body: ['optOut'] },

    // Revendication d'une fiche répertoriée (compte pro)
    { method: 'POST', pattern: /^praticiens\/\d+\/claim-requests$/, auth: true, body: ['message', 'rpps', 'siret'] },
    { method: 'GET', pattern: /^praticiens\/me\/claim-requests$/, auth: true },

    // Ma fiche (propriétaire uniquement : le backend vérifie le compte)
    { method: 'GET', pattern: /^praticiens\/me$/, auth: true, own: true },
    { method: 'PUT', pattern: /^praticiens\/\d+$/, auth: true, keepEmpty: true, body: ['firstName', 'lastName', 'specialityIds', 'bio', 'address', 'addressComplement', 'postalCode', 'city', 'latitude', 'longitude', 'phoneNumber', 'website', 'socialLinks', 'rpps', 'adeli', 'siret', 'practicingSince', 'languages', 'wheelchairAccessible', 'paymentMethods', 'reimbursementInfo', 'publicTypes', 'isActive'] },
    { method: 'POST', pattern: /^praticiens\/me\/diplomas$/, auth: true, body: ['title', 'organization', 'year'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/diplomas\/\d+$/, auth: true },

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

const PAYMENT_METHODS = ['card', 'cash', 'check', 'transfer']
const SOCIAL_KEYS = ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']
const TEXT_LIMITS: Record<string, number> = {
    firstName: 80, lastName: 80, bio: 2000, address: 200, addressComplement: 200, postalCode: 5, city: 100,
    phoneNumber: 20, website: 200, rpps: 11, adeli: 9, siret: 14, reimbursementInfo: 500,
}

/** Modification de la fiche : types, longueurs et formats vérifiés avant d'atteindre le backend. */
function validatePraticienUpdate(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    const out: Record<string, any> = {}
    for (const [key, value] of Object.entries(body)) {
        if (key in TEXT_LIMITS) {
            if (typeof value !== 'string' || value.length > TEXT_LIMITS[key]) throw bad(`Champ « ${key} » invalide.`)
            out[key] = value.trim()
        } else if (key === 'specialityIds') {
            if (!Array.isArray(value) || value.length > 10 || !value.every(v => Number.isInteger(v) && v > 0)) throw bad('Spécialités invalides.')
            out[key] = value
        } else if (key === 'languages') {
            if (!Array.isArray(value) || value.length > 15 || !value.every(v => typeof v === 'string' && /^[a-z]{2}$/.test(v))) throw bad('Langues invalides.')
            out[key] = value
        } else if (key === 'paymentMethods') {
            if (!Array.isArray(value) || !value.every(v => PAYMENT_METHODS.includes(v))) throw bad('Moyens de paiement invalides.')
            out[key] = value
        } else if (key === 'publicTypes') {
            if (!Array.isArray(value) || !value.every(v => PUBLIC_TYPES.includes(v))) throw bad('Public invalide.')
            out[key] = value
        } else if (key === 'wheelchairAccessible' || key === 'isActive') {
            if (typeof value !== 'boolean') throw bad(`Champ « ${key} » invalide.`)
            out[key] = value
        } else if (key === 'practicingSince') {
            if (!Number.isInteger(value) || value < 1950 || value > new Date().getFullYear()) throw bad('Année de début d\'exercice invalide.')
            out[key] = value
        } else if (key === 'latitude' || key === 'longitude') {
            // null : l'adresse a changé et n'a pas pu être localisée (on n'efface pas par défaut, seulement sur demande explicite)
            if (value === null) { out[key] = null; continue }
            const max = key === 'latitude' ? 90 : 180
            if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > max) throw bad('Coordonnées invalides.')
            out[key] = value
        } else if (key === 'socialLinks') {
            if (!value || typeof value !== 'object' || Array.isArray(value)) throw bad('Réseaux sociaux invalides.')
            const links: Record<string, string> = {}
            for (const social of SOCIAL_KEYS) {
                const url = value[social]
                if (url === undefined || url === '') continue
                if (typeof url !== 'string' || url.length > 200 || !/^https:\/\/\S+$/.test(url)) throw bad(`Lien « ${social} » invalide (https requis).`)
                links[social] = url
            }
            out[key] = links
        }
    }
    if (out.postalCode && !/^\d{5}$/.test(out.postalCode)) throw bad('Code postal invalide (5 chiffres).')
    if (out.rpps && !/^\d{11}$/.test(out.rpps)) throw bad('RPPS invalide (11 chiffres).')
    if (out.siret && !/^\d{14}$/.test(out.siret)) throw bad('SIRET invalide (14 chiffres).')
    if (out.adeli && !/^[0-9A-Za-z]{9}$/.test(out.adeli)) throw bad('ADELI invalide (9 caractères).')
    if (out.website && !/^https?:\/\/\S+$/.test(out.website)) throw bad('Site web invalide (http ou https).')
    if (out.phoneNumber && !/^\+?\d{10,15}$/.test(out.phoneNumber.replace(/[\s.]/g, ''))) throw bad('Téléphone invalide.')
    return out
}

/** Profil : texte court, ou null pour effacer une information. */
function validateProfileUpdate(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    const out: Record<string, any> = {}
    const limits: Record<string, number> = { firstName: 80, lastName: 80, phoneNumber: 20 }
    for (const [key, max] of Object.entries(limits)) {
        const value = body[key]
        if (value === undefined) continue
        if (value === null) { out[key] = null; continue }
        if (typeof value !== 'string' || value.length > max) throw bad(`Champ « ${key} » invalide.`)
        out[key] = value.trim()
    }
    if (out.phoneNumber && !/^\+?\d{10,15}$/.test(out.phoneNumber.replace(/[\s.]/g, ''))) throw bad('Téléphone invalide.')
    return out
}

function validateDiploma(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 150) throw bad('Intitulé du diplôme invalide.')
    const out: Record<string, any> = { title: body.title.trim() }
    if (body.organization !== undefined) {
        if (typeof body.organization !== 'string' || body.organization.length > 150) throw bad('Organisme invalide.')
        out.organization = body.organization.trim()
    }
    if (body.year !== undefined) {
        if (!Number.isInteger(body.year) || body.year < 1950 || body.year > new Date().getFullYear()) throw bad('Année invalide.')
        out.year = body.year
    }
    return out
}

function pickKeepEmpty(source: Record<string, any>, keys: string[]) {
    const out: Record<string, any> = {}
    for (const key of keys) if (source?.[key] !== undefined) out[key] = source[key]
    return out
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
        const raw = (await readBody(event)) ?? {}
        body = rule.keepEmpty ? pickKeepEmpty(raw, rule.body) : pick(raw, rule.body)
        if (path === 'appointments') body = validateAppointment(body)
        if (method === 'PUT' && /^praticiens\/\d+$/.test(path)) body = validatePraticienUpdate(body)
        if (path === 'praticiens/me/diplomas') body = validateDiploma(body)
        if (method === 'PATCH' && path === 'users/me') body = validateProfileUpdate(body)
        if (method === 'DELETE' && path === 'users/me') {
            if (typeof body.password !== 'string' || !body.password || body.password.length > 200) {
                throw createError({ statusCode: 400, statusMessage: 'Mot de passe requis.' })
            }
        }
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

    // Compte supprimé : la session n'a plus lieu d'être
    if (method === 'DELETE' && path === 'users/me' && response.status === 204) clearSessionCookies(event)

    if (response.status === 204) return sendNoContent(event)
    // Le propriétaire de la fiche reçoit ses propres champs privés (RPPS, SIRET…), jamais les autres
    return rule.own ? response._data : stripPrivate(response._data)
})
