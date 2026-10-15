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
    { method: 'GET', pattern: /^praticiens$/, auth: false, cacheable: true, query: ['specialityId', 'city', 'q', 'language', 'publicType', 'claimed', 'bookable', 'sort', 'limit', 'offset', 'lat', 'lng', 'radiusKm', 'mode', 'availableWithinDays', 'minRating', 'wheelchairAccessible', 'bbox'] },
    { method: 'GET', pattern: /^praticiens\/\d+$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/slug\/[a-z0-9-]{1,120}$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/next-slot$/, auth: false, query: ['consultationTypeId'] },
    { method: 'GET', pattern: /^praticiens\/\d+\/(consultation-types|availabilities)$/, auth: false, cacheable: true },
    { method: 'GET', pattern: /^praticiens\/\d+\/slots$/, auth: false, query: ['from', 'to', 'consultationTypeId'] },
    // Note Google lue en direct : jamais mise en cache (conditions Google Maps Platform), sans les avis
    { method: 'GET', pattern: /^praticiens\/\d+\/google-rating$/, auth: false },
    { method: 'GET', pattern: /^appointments\/me$/, auth: true, query: ['from', 'to', 'status'] },
    // Fichier iCal d'un de mes rendez-vous (ajout à l'agenda)
    { method: 'GET', pattern: /^appointments\/\d+\/ics$/, auth: true },
    { method: 'POST', pattern: /^appointments$/, auth: true, body: ['praticienId', 'consultationTypeId', 'startAt', 'userNote'] },
    { method: 'PATCH', pattern: /^appointments\/\d+\/status$/, auth: true, body: ['status', 'reason'] },
    // Proposer un autre créneau (praticien), puis l'accepter ou le refuser (patient)
    { method: 'POST', pattern: /^appointments\/\d+\/proposal$/, auth: true, body: ['startAt'] },
    { method: 'POST', pattern: /^appointments\/\d+\/proposal\/(accept|decline)$/, auth: true },
    // Réservation sans compte (lot 2) : publique, protégée par Turnstile côté backend
    { method: 'POST', pattern: /^appointments\/guest$/, auth: false, body: ['praticienId', 'consultationTypeId', 'startAt', 'firstName', 'lastName', 'email', 'phoneNumber', 'userNote', 'consentContact', 'consentHealthData', 'captchaToken', 'website'] },
    // Gestion du rendez-vous par le lien secret (43 caractères) : jamais mis en cache ni journalisé
    { method: 'GET', pattern: /^appointments\/guest\/[A-Za-z0-9_-]{43}$/, auth: false },
    { method: 'POST', pattern: /^appointments\/guest\/[A-Za-z0-9_-]{43}\/cancel$/, auth: false },
    { method: 'DELETE', pattern: /^appointments\/guest\/[A-Za-z0-9_-]{43}\/data$/, auth: false },
    { method: 'GET', pattern: /^appointments\/guest\/[A-Za-z0-9_-]{43}\/ics$/, auth: false },
    // Compteur de vues de fiche (le backend ignore les fiches non revendiquées)
    { method: 'POST', pattern: /^praticiens\/\d+\/view$/, auth: false },

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

    // Préférences du patient (ville, rayon, budget, modes) et notifications
    { method: 'GET', pattern: /^users\/me\/preferences$/, auth: true, own: true },
    { method: 'PUT', pattern: /^users\/me\/preferences$/, auth: true, keepEmpty: true, body: ['city', 'latitude', 'longitude', 'radiusKm', 'budgetBand', 'modes'], own: true },
    { method: 'GET', pattern: /^users\/me\/notification-preferences$/, auth: true, own: true },
    { method: 'PATCH', pattern: /^users\/me\/notification-preferences$/, auth: true, keepEmpty: true, body: ['appointmentRequest', 'appointmentDecision', 'reminderDayBefore', 'proposal'], own: true },
    // Notifications push (abonnement du navigateur)
    { method: 'GET', pattern: /^push\/public-key$/, auth: false, cacheable: true },
    { method: 'POST', pattern: /^push\/subscriptions$/, auth: true, keepEmpty: true, body: ['endpoint', 'keys'] },
    { method: 'DELETE', pattern: /^push\/subscriptions$/, auth: true, body: ['endpoint'] },

    // Revendication d'une fiche répertoriée (compte pro)
    { method: 'POST', pattern: /^praticiens\/\d+\/claim-requests$/, auth: true, body: ['message', 'rpps', 'siret'] },
    { method: 'GET', pattern: /^praticiens\/me\/claim-requests$/, auth: true },

    // Ma fiche (propriétaire uniquement : le backend vérifie le compte)
    { method: 'GET', pattern: /^praticiens\/me$/, auth: true, own: true },
    { method: 'PUT', pattern: /^praticiens\/\d+$/, auth: true, keepEmpty: true, body: ['firstName', 'lastName', 'specialityIds', 'bio', 'address', 'addressComplement', 'postalCode', 'city', 'latitude', 'longitude', 'phoneNumber', 'website', 'socialLinks', 'rpps', 'adeli', 'siret', 'tagline', 'accessInfo', 'practicingSince', 'languages', 'wheelchairAccessible', 'paymentMethods', 'reimbursementInfo', 'publicTypes', 'isActive'] },
    { method: 'POST', pattern: /^praticiens\/me\/diplomas$/, auth: true, body: ['title', 'organization', 'year'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/diplomas\/\d+$/, auth: true },

    // Espace praticien
    { method: 'GET', pattern: /^praticiens\/me\/appointments$/, auth: true, query: ['from', 'to', 'status'] },
    { method: 'GET', pattern: /^praticiens\/me\/stats$/, auth: true, query: ['from', 'to'], own: true },
    // Abonnement d'agenda (le lien renvoyé est lu par l'application d'agenda, pas par le site)
    { method: 'POST', pattern: /^praticiens\/me\/calendar-token$/, auth: true, own: true },
    { method: 'DELETE', pattern: /^praticiens\/me\/calendar-token$/, auth: true },
    { method: 'PATCH', pattern: /^praticiens\/me\/settings$/, auth: true, body: ['autoConfirm'] },
    { method: 'GET', pattern: /^praticiens\/me\/consultation-types$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/consultation-types$/, auth: true, body: ['name', 'durationMin', 'price', 'mode', 'kind'] },
    { method: 'PATCH', pattern: /^praticiens\/me\/consultation-types\/\d+$/, auth: true, body: ['name', 'durationMin', 'price', 'mode', 'kind'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/consultation-types\/\d+$/, auth: true },
    { method: 'GET', pattern: /^praticiens\/me\/availabilities$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/availabilities$/, auth: true, body: ['dayOfWeek', 'startTime', 'endTime'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/availabilities\/\d+$/, auth: true },
    { method: 'GET', pattern: /^praticiens\/me\/unavailabilities$/, auth: true },
    { method: 'POST', pattern: /^praticiens\/me\/unavailabilities$/, auth: true, body: ['startAt', 'endAt', 'reason'] },
    { method: 'DELETE', pattern: /^praticiens\/me\/unavailabilities\/\d+$/, auth: true },
    // Administration (le backend réserve ces routes au rôle admin)
    { method: 'GET', pattern: /^admin\/praticiens$/, auth: true, query: ['q', 'claimed', 'isVerified', 'limit', 'offset'], own: true },
    { method: 'GET', pattern: /^admin\/claim-requests$/, auth: true, query: ['status'], own: true },
    { method: 'PATCH', pattern: /^admin\/claim-requests\/\d+$/, auth: true, body: ['decision', 'reason'], own: true },
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
const MODES = ['cabinet', 'visio', 'domicile']
const PUBLIC_TYPES = ['babies', 'children', 'teenagers', 'adults', 'seniors', 'pregnant_women', 'athletes']

function validateListQuery(query?: Record<string, any>) {
    if (!query) return
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    if (query.limit !== undefined && !(/^\d+$/.test(String(query.limit)) && +query.limit >= 1 && +query.limit <= 50)) throw bad('Limite invalide.')
    if (query.offset !== undefined && !/^\d{1,6}$/.test(String(query.offset))) throw bad('Décalage invalide.')
    if (query.sort !== undefined && !SORTS.includes(String(query.sort))) throw bad('Tri invalide.')
    if (query.publicType !== undefined && !PUBLIC_TYPES.includes(String(query.publicType))) throw bad('Public invalide.')
    if (query.mode !== undefined && !MODES.includes(String(query.mode))) throw bad('Mode invalide.')
    if (query.availableWithinDays !== undefined && !(/^\d{1,2}$/.test(String(query.availableWithinDays)) && +query.availableWithinDays >= 1 && +query.availableWithinDays <= 30)) throw bad('Délai invalide.')
    if (query.minRating !== undefined && !(/^[1-5]$/.test(String(query.minRating)))) throw bad('Note invalide.')
    if (query.wheelchairAccessible !== undefined && String(query.wheelchairAccessible) !== 'true') throw bad('Filtre invalide.')
    if (query.bbox !== undefined) {
        const box = String(query.bbox).split(',').map(Number)
        if (box.length !== 4 || !box.every(Number.isFinite) || Math.abs(box[0]) > 180 || Math.abs(box[2]) > 180 || Math.abs(box[1]) > 90 || Math.abs(box[3]) > 90) throw bad('Zone de carte invalide.')
        if (query.radiusKm !== undefined) throw bad('La zone de carte est incompatible avec le rayon.')
    }
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
    firstName: 80, lastName: 80, bio: 2000, tagline: 160, accessInfo: 300, address: 200, addressComplement: 200, postalCode: 5, city: 100,
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

const BUDGETS = ['lt50', '50_70', 'gt70']
const nullableNumber = (v: unknown, min: number, max: number) => v === null || (typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max)

/** Préférences du patient : aucune donnée de santé, valeurs bornées. */
function validatePreferences(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    const out: Record<string, any> = {}
    for (const [key, value] of Object.entries(body)) {
        if (key === 'city') {
            if (value !== null && (typeof value !== 'string' || value.length > 100)) throw bad('Ville invalide.')
        } else if (key === 'latitude') {
            if (!nullableNumber(value, -90, 90)) throw bad('Latitude invalide.')
        } else if (key === 'longitude') {
            if (!nullableNumber(value, -180, 180)) throw bad('Longitude invalide.')
        } else if (key === 'radiusKm') {
            if (value !== null && ![5, 10, 20].includes(value as number)) throw bad('Rayon invalide.')
        } else if (key === 'budgetBand') {
            if (value !== null && !BUDGETS.includes(value as string)) throw bad('Budget invalide.')
        } else if (key === 'modes') {
            if (value !== null && (!Array.isArray(value) || !value.every(v => MODES.includes(v)))) throw bad('Modes invalides.')
        }
        out[key] = value
    }
    return out
}

function validateNotificationPrefs(body: Record<string, any>) {
    for (const value of Object.values(body)) {
        if (typeof value !== 'boolean') throw createError({ statusCode: 400, statusMessage: 'Préférence invalide.' })
    }
    return body
}

function validatePushSubscription(body: Record<string, any>) {
    const bad = createError({ statusCode: 400, statusMessage: 'Abonnement invalide.' })
    const { endpoint, keys } = body
    if (typeof endpoint !== 'string' || endpoint.length > 1000 || !/^https:\/\/\S+$/.test(endpoint)) throw bad
    if (keys === undefined) return { endpoint }
    if (!keys || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string' || keys.p256dh.length > 200 || keys.auth.length > 100) throw bad
    return { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } }
}

/** Réservation invité : formats vérifiés avant d'atteindre le backend ; rien n'est journalisé. */
function validateGuestBooking(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    const praticienId = Number(body.praticienId)
    const consultationTypeId = Number(body.consultationTypeId)
    if (!Number.isInteger(praticienId) || !Number.isInteger(consultationTypeId) || typeof body.startAt !== 'string' || Number.isNaN(Date.parse(body.startAt))) throw bad('Demande de rendez-vous invalide.')
    for (const key of ['firstName', 'lastName']) {
        if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > 80) throw bad('Prénom ou nom invalide.')
    }
    if (typeof body.email !== 'string' || body.email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) throw bad('Adresse e-mail invalide.')
    if (typeof body.phoneNumber !== 'string' || !/^\+?\d{10,15}$/.test(body.phoneNumber.replace(/[\s.]/g, ''))) throw bad('Téléphone invalide.')
    if (body.userNote !== undefined && (typeof body.userNote !== 'string' || body.userNote.length > 500)) throw bad('Le motif ne doit pas dépasser 500 caractères.')
    if (body.consentContact !== true) throw bad('Votre accord est nécessaire pour transmettre vos informations.')
    if (body.userNote && body.consentHealthData !== true) throw bad('Votre accord est nécessaire pour transmettre le motif.')
    if (typeof body.captchaToken !== 'string' || !body.captchaToken || body.captchaToken.length > 2100) throw bad('Vérification de sécurité manquante.')
    return {
        praticienId, consultationTypeId, startAt: body.startAt,
        firstName: body.firstName.trim(), lastName: body.lastName.trim(), email: body.email.trim(),
        phoneNumber: body.phoneNumber.replace(/[\s.]/g, ''),
        ...(body.userNote ? { userNote: body.userNote, consentHealthData: true } : {}),
        consentContact: true, captchaToken: body.captchaToken,
        // Champ « piège » : invisible pour un humain, donc normalement vide (le backend répond alors 201 sans rien enregistrer s'il est rempli)
        ...(typeof body.website === 'string' && body.website ? { website: body.website.slice(0, 200) } : {}),
    }
}

function validateProposal(body: Record<string, any>) {
    if (typeof body.startAt !== 'string' || Number.isNaN(Date.parse(body.startAt))) throw createError({ statusCode: 400, statusMessage: 'Créneau invalide.' })
    return { startAt: body.startAt }
}

function validateDecision(body: Record<string, any>) {
    const bad = (message: string) => createError({ statusCode: 400, statusMessage: message })
    if (!['approved', 'rejected'].includes(body.decision)) throw bad('Décision invalide.')
    if (body.reason !== undefined && (typeof body.reason !== 'string' || body.reason.length > 500)) throw bad('Motif invalide.')
    return body
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
        if (method === 'PUT' && path === 'users/me/preferences') body = validatePreferences(body)
        if (method === 'PATCH' && path === 'users/me/notification-preferences') body = validateNotificationPrefs(body)
        if (path === 'push/subscriptions') body = validatePushSubscription(body)
        if (path === 'appointments/guest') body = validateGuestBooking(body)
        if (/^appointments\/\d+\/proposal$/.test(path)) body = validateProposal(body)
        if (/^admin\/claim-requests\/\d+$/.test(path)) body = validateDecision(body)
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
    // Recherche tolérante : la ponctuation saisie à la main ne doit pas faire échouer la recherche
    // (« Angers, », « Angers (49000) », « Angers. »). La casse et les accents sont déjà ignorés par l'API.
    const looseText = (v: unknown) => String(v)
        .replace(/[()\[\]{}.,;:!?"“”«»]+/g, ' ')
        .replace(/(^|\s)[-–—'’]+|[-–—'’]+(?=\s|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100)
    if (query?.city !== undefined) query.city = looseText(query.city)
    if (query?.q !== undefined) query.q = looseText(query.q)
    if (query && (query.q === '' || query.city === '')) { if (query.q === '') delete query.q; if (query.city === '') delete query.city }
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

    // Limitation de débit : on relaie le délai d'attente
    const retryAfter = response.headers.get('retry-after')
    if (retryAfter && /^\d+$/.test(retryAfter)) setHeader(event, 'Retry-After', retryAfter)

    // Total des résultats (pagination de l'annuaire)
    const total = response.headers.get('x-total-count')
    if (total && /^\d+$/.test(total)) setHeader(event, 'X-Total-Count', total)

    // Compte supprimé : la session n'a plus lieu d'être
    if (method === 'DELETE' && path === 'users/me' && response.status === 204) clearSessionCookies(event)

    if (response.status === 204) return sendNoContent(event)
    // Fichier iCal : renvoyé tel quel, en téléchargement
    if (/^appointments\/(\d+|guest\/[A-Za-z0-9_-]{43})\/ics$/.test(path) && response.status === 200 && typeof response._data === 'string') {
        setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
        setHeader(event, 'Content-Disposition', 'attachment; filename="rendez-vous-leya.ics"')
        return response._data
    }
    // Le propriétaire de la fiche reçoit ses propres champs privés (RPPS, SIRET…), jamais les autres
    return rule.own ? response._data : stripPrivate(response._data)
})
