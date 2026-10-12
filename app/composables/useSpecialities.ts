export interface Speciality {
  id: number
  name: string
}

/** « Ostéopathie » → « osteopathie » : clé stable utilisée dans les URL (?specialite=osteopathie). */
export const specialityKey = (name: unknown) =>
  String(name ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Les pages de médecines utilisent parfois un autre nom que l'API (hypnothérapie ↔ Hypnose).
const ALIASES: Record<string, string> = { hypnotherapie: 'hypnose' }
export const specialityKeyForSlug = (slug: string) => ALIASES[slug] ?? slug

export async function useSpecialities() {
  const { data } = await useAsyncData<Speciality[]>(
    'specialities',
    () => $fetch<Speciality[]>('/api/backend/specialites').catch(() => []),
    { default: () => [] },
  )

  const specialities = computed<Speciality[]>(() => (Array.isArray(data.value) ? data.value : []))

  const findBySlug = (slug?: string | null) => {
    if (!slug) return undefined
    const key = ALIASES[slug] ?? slug
    return specialities.value.find(s => specialityKey(s.name) === key)
  }

  return { specialities, findBySlug }
}

/** Nombre réel de praticiens par médecine (remplace les anciens chiffres fixes de medecines.ts). */
export async function useSpecialityCounts() {
  const { data } = await useAsyncData<any[]>(
    'praticiens-all',
    () => $fetch<any[]>('/api/backend/praticiens').catch(() => []),
    { default: () => [] },
  )
  const countFor = (slug: string) => {
    const key = specialityKeyForSlug(slug)
    return (Array.isArray(data.value) ? data.value : []).filter(
      p => (p.specialities || []).some((s: Speciality) => specialityKey(s.name) === key),
    ).length
  }
  return { countFor }
}
