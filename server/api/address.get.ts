/**
 * Saisie assistée d'adresse (Base Adresse Nationale, géocodeur public et gratuit de la Géoplateforme IGN,
 * qui remplace api-adresse.data.gouv.fr).
 * L'appel passe par notre serveur : le navigateur du visiteur ne contacte pas de service tiers.
 */
export default defineEventHandler(async (event) => {
    const q = String(getQuery(event).q ?? '').trim().slice(0, 120)
    if (q.length < 3) return []

    setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    try {
        const res: any = await $fetch('https://data.geopf.fr/geocodage/search/', {
            query: { q, limit: 5, autocomplete: 1, index: 'address' },
            timeout: 5000,
        })
        return (res?.features ?? []).map((f: any) => ({
            label: f.properties?.label,
            street: f.properties?.name,
            postalCode: f.properties?.postcode,
            city: f.properties?.city,
        })).filter((a: any) => a.label && a.street && a.postalCode && a.city)
    } catch {
        // Service indisponible : l'interface bascule sur la saisie manuelle.
        return []
    }
})
