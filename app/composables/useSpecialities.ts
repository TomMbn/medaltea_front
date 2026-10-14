export interface Speciality {
  id: number
  name: string
  // Identifiant stable, identique au slug des pages /medecines (ex : hypnotherapie)
  slug: string
}

export interface Discipline {
  slug: string
  name: string
  praticienCount: number
}

export async function useSpecialities() {
  const { data } = await useAsyncData<Speciality[]>(
    'specialities',
    () => $fetch<Speciality[]>('/api/backend/specialites').catch(() => []),
    { default: () => [] },
  )

  const specialities = computed<Speciality[]>(() => (Array.isArray(data.value) ? data.value : []))

  const findBySlug = (slug?: string | null) => (slug ? specialities.value.find(s => s.slug === slug) : undefined)

  return { specialities, findBySlug }
}

/** Nombre réel de praticiens par médecine, calculé par l'API (GET /disciplines). */
export async function useSpecialityCounts() {
  const { data } = await useAsyncData<Discipline[]>(
    'disciplines',
    () => $fetch<Discipline[]>('/api/backend/disciplines').catch(() => []),
    { default: () => [] },
  )
  const countFor = (slug: string) =>
    (Array.isArray(data.value) ? data.value : []).find(d => d.slug === slug)?.praticienCount ?? 0
  return { countFor }
}
