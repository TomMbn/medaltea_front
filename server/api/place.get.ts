/**
 * Reconnaît une ville ou un code postal dans le texte d'une recherche de praticien (« Cholet », « 49300 »).
 * Renvoie la commune et son centre, pour chercher dans un rayon autour d'elle ; sinon `null` (le texte est alors un nom de praticien).
 * Géocodeur public de la Géoplateforme IGN, appelé depuis notre serveur (le navigateur ne contacte pas de service tiers).
 */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\bst\b/g, 'saint').replace(/\bste\b/g, 'sainte').replace(/[^a-z0-9]+/g, ' ').trim()

export default defineEventHandler(async (event) => {
    const q = String(getQuery(event).q ?? '').trim().slice(0, 80)
    setHeader(event, 'Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    if (q.length < 2) return null

    try {
        const res: any = await $fetch('https://data.geopf.fr/geocodage/search/', {
            query: { q, limit: 5, index: 'address', type: 'municipality' },
            timeout: 4000,
        })
        const hits = (res?.features ?? []).map((f: any) => ({
            name: String(f.properties?.city ?? f.properties?.name ?? ''),
            postalCode: String(f.properties?.postcode ?? ''),
            population: Number(f.properties?.population) || 0,
            latitude: Number(f.geometry?.coordinates?.[1]),
            longitude: Number(f.geometry?.coordinates?.[0]),
        })).filter((h: any) => h.name && Number.isFinite(h.latitude) && Number.isFinite(h.longitude))

        const wanted = norm(q)
        const isPostal = /^\d{5}$/.test(q)
        // Seul un nom de commune exact (ou un code postal complet) compte : « Martin » reste un nom de praticien
        const matches = hits.filter((h: any) => (isPostal ? h.postalCode === q : norm(h.name) === wanted))
        if (!matches.length) return null
        // Homonymes (Saint-Denis…) : la métropole d'abord, puis la plus peuplée
        const overseas = (h: any) => (h.postalCode.startsWith('97') || h.postalCode.startsWith('98') ? 1 : 0)
        const best = matches.sort((a: any, b: any) => overseas(a) - overseas(b) || b.population - a.population)[0]
        return { name: best.name, postalCode: best.postalCode, latitude: Math.round(best.latitude * 1e4) / 1e4, longitude: Math.round(best.longitude * 1e4) / 1e4 }
    } catch {
        return null
    }
})
