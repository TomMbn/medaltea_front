export interface SearchPrefs {
  city: string | null
  latitude: number | null
  longitude: number | null
  radiusKm: number | null
  budgetBand: string | null
  modes: string[]
}

// Requête en cours (navigateur uniquement : le chargement n'est jamais lancé côté serveur)
let inflight: Promise<SearchPrefs | null> | null = null

/**
 * Préférences de recherche du patient connecté (ville, distance, budget, modes) : chargées une fois,
 * côté navigateur seulement (données privées). Sert à préremplir la recherche et à filtrer les résultats.
 */
export const usePreferences = () => {
  const { isLoggedIn, isPro } = useSession()
  const prefs = useState<SearchPrefs | null>('leya-prefs', () => null)
  const loaded = useState('leya-prefs-loaded', () => false)

  // Déconnexion : on oublie les préférences du compte précédent
  watch(isLoggedIn, (on) => { if (!on) { prefs.value = null; loaded.value = false; inflight = null } })

  // Plusieurs composants peuvent demander le chargement en même temps : tous attendent la même requête.
  async function load() {
    if (!isLoggedIn.value || isPro.value) return prefs.value
    if (loaded.value) return prefs.value
    inflight ??= $fetch<SearchPrefs>('/api/backend/users/me/preferences')
      .then((p) => { prefs.value = p })
      .catch(() => { prefs.value = null })
      .finally(() => { loaded.value = true })
      .then(() => prefs.value)
    return inflight
  }

  return { prefs, load }
}

/** Le tarif d'appel d'une fiche entre-t-il dans la tranche de budget choisie ? */
export function inBudget(band: string | null | undefined, price: number | null | undefined): boolean {
  if (!band || price == null || !Number.isFinite(Number(price))) return false
  const p = Number(price)
  if (band === 'lt50') return p < 50
  if (band === '50_70') return p >= 50 && p <= 70
  if (band === 'gt70') return p > 70
  return false
}
