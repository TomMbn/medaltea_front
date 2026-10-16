/**
 * Photo de profil : envoi (multipart) et suppression. Route dédiée : la passerelle générique ne relaie que du JSON.
 * Le backend recadre l'image en carré, retire les métadonnées et ne garde que deux WebP.
 */
const MAX_BYTES = 2 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png', 'image/webp']

const fail = (statusCode: number, statusMessage: string) => createError({ statusCode, statusMessage })

export default defineEventHandler(async (event) => {
    const token = readToken(event)
    if (!token) throw fail(401, 'Vous devez être connecté.')

    const { apiBase } = useRuntimeConfig()

    if (event.method === 'DELETE') {
        let res
        try {
            res = await $fetch.raw(`${apiBase}/praticiens/me/photo`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, timeout: 10000, ignoreResponseError: true })
        } catch (error: any) {
            console.error('Backend unreachable:', error?.message || error)
            throw fail(502, 'Le service est momentanément indisponible.')
        }
        setHeader(event, 'Cache-Control', 'no-store')
        if (res.status === 204 || res.status === 200) return sendNoContent(event)
        throw fail(res.status === 401 || res.status === 403 ? res.status : 502, res.status === 401 ? 'Vous devez être connecté.' : res.status === 403 ? 'Réservé aux praticiens.' : 'Impossible de supprimer la photo.')
    }
    if (event.method !== 'POST') throw fail(405, 'Méthode non autorisée.')

    const parts = await readMultipartFormData(event)
    const file = parts?.find(p => p.name === 'file' && p.filename)
    if (!file?.data?.length) throw fail(400, 'Aucun fichier reçu.')
    if (!TYPES.includes(file.type || '')) throw fail(400, 'Format non pris en charge (JPEG, PNG ou WebP).')
    if (file.data.length > MAX_BYTES) throw fail(413, 'Fichier trop lourd (2 Mo maximum).')

    const form = new FormData()
    form.append('file', new Blob([new Uint8Array(file.data)], { type: file.type }), 'photo')

    let response
    try {
        response = await $fetch.raw(`${apiBase}/praticiens/me/photo`, {
            method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form, timeout: 20000, ignoreResponseError: true,
        })
    } catch (error: any) {
        console.error('Backend unreachable:', error?.message || error)
        throw fail(502, 'Le service est momentanément indisponible.')
    }

    setHeader(event, 'Cache-Control', 'no-store')
    if (response.status === 200) {
        const { photoUrl, photoThumbUrl } = (response._data ?? {}) as Record<string, unknown>
        return { photoUrl, photoThumbUrl }
    }

    const backendMessage = (response._data as { message?: string | string[] } | undefined)?.message
    const text = Array.isArray(backendMessage) ? backendMessage.join(' ') : backendMessage
    if (response.status === 429) {
        const retry = Number(response.headers.get('retry-after'))
        if (Number.isFinite(retry) && retry > 0) setHeader(event, 'Retry-After', Math.ceil(retry))
        throw fail(429, 'Trop d\'envois de photo. Réessayez plus tard.')
    }
    if (response.status === 413) throw fail(413, 'Fichier trop lourd (2 Mo maximum).')
    if (response.status === 422) throw fail(422, 'Cette image ne peut pas être traitée. Essayez une photo plus simple ou plus petite.')
    if (response.status === 503) throw fail(503, 'L\'envoi de photo est momentanément indisponible.')
    if (response.status === 401 || response.status === 403) throw fail(response.status, response.status === 401 ? 'Vous devez être connecté.' : 'Réservé aux praticiens.')
    throw fail(response.status === 400 ? 400 : 502, response.status === 400 && typeof text === 'string' && text ? text : 'Impossible d\'envoyer la photo.')
})
