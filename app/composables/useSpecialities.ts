export interface Speciality {
  id: number
  name: string
  /** Identifiant stable fourni par l'API (URL des pages /medecines et filtre ?specialite=). */
  slug?: string
  /** Fiches publiques de la discipline, fourni par l'API. */
  praticienCount?: number
}

/** « Ostéopathie » → « osteopathie » : ancienne clé d'URL, conservée pour les liens existants (?specialite=hypnose). */
export const specialityKey = (name: unknown) =>
  String(name ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Clé à utiliser dans les URL : le slug de l'API, sinon l'ancienne clé dérivée du nom. */
export const specialityUrlKey = (s: Speciality) => s.slug || specialityKey(s.name)

// Anciennes URL : « hypnose » désignait la discipline dont le slug est « hypnotherapie ».
const LEGACY_KEYS: Record<string, string> = { hypnose: 'hypnotherapie' }

export async function useSpecialities() {
  const { data } = await useAsyncData<Speciality[]>(
    'specialities',
    () => $fetch<Speciality[]>('/api/backend/specialites').catch(() => []),
    { default: () => [] },
  )

  const specialities = computed<Speciality[]>(() => (Array.isArray(data.value) ? data.value : []))

  const findBySlug = (slug?: string | null) => {
    if (!slug) return undefined
    const wanted = LEGACY_KEYS[slug] ?? slug
    return specialities.value.find(s => s.slug === wanted)
      ?? specialities.value.find(s => specialityKey(s.name) === specialityKey(wanted))
  }

  return { specialities, findBySlug }
}

/** Nombre réel de praticiens par médecine (fourni par l'API dans /specialites, un seul appel). */
export async function useSpecialityCounts() {
  const { specialities } = await useSpecialities()
  const countFor = (slug: string) => {
    const wanted = LEGACY_KEYS[slug] ?? slug
    const match = specialities.value.find(s => s.slug === wanted)
      ?? specialities.value.find(s => specialityKey(s.name) === specialityKey(wanted))
    return match?.praticienCount ?? 0
  }
  return { countFor }
}
