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
  // Un appel léger par spécialité (une seule fiche demandée) : le total vient de l'en-tête X-Total-Count.
  // La liste des spécialités est lue dans le même appel : le contexte Nuxt est perdu après un `await` dans un composable.
  const { data } = await useAsyncData<Record<string, number>>(
    'praticiens-counts',
    async () => {
      const list = await $fetch<Speciality[]>('/api/backend/specialites').catch(() => [] as Speciality[])
      const entries = await Promise.all(list.map(async (s) => {
        try {
          const res = await $fetch.raw('/api/backend/praticiens', { query: { specialityId: s.id, limit: 1 } })
          return [specialityKey(s.name), Number(res.headers.get('x-total-count')) || 0] as const
        } catch {
          return [specialityKey(s.name), 0] as const
        }
      }))
      return Object.fromEntries(entries)
    },
    { default: () => ({}) },
  )
  const countFor = (slug: string) => data.value?.[specialityKeyForSlug(slug)] ?? 0
  return { countFor }
}
