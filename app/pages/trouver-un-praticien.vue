<template>
  <div class="page-search relative overflow-x-clip min-h-screen bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">
    <!-- Page « Recherche » -->
    <template v-if="!isResults">
      <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="page-mortar hidden xl:block absolute pointer-events-none select-none opacity-[0.08]" style="animation: none;" />
      <PraticienHero :geo="geo" @locate="locate" @unlocate="unlocate" />
      <PraticienCarousel />
      <PraticienWhy />
    </template>

    <!-- Page « Résultats » -->
    <template v-else>
      <div class="pt-28 lg:pt-[140px]">
        <PraticienSearchBar :key="searchKey" :geo="geo" />
      </div>
      <div id="resultats" class="scroll-mt-28">
        <PraticienResults
          :praticiens="items"
          :total="total"
          :page="page"
          :page-size="PAGE_SIZE"
          :q="q"
          :place="!geo && place ? place.name : ''"
          :place-radius="PLACE_RADIUS_KM"
          :by-name="byName"
          :speciality-name="speciality?.name ?? ''"
          :error="!!error"
          :loading="pending"
          :sort="sort"
          :only-bookable="onlyBookable"
          :mode="mode"
          :soon="soon"
          :rated="rated"
          :accessible="accessible"
          :prefs-available="prefsUsable"
          :use-prefs="usePrefs"
          :budget="usePrefs ? (prefs?.budgetBand ?? null) : null"
          :geo="geo"
          :geo-error="geoError"
          :radius="radius"
          :view="view"
          :map-items="mapItems"
          :map-total="mapTotal"
          :map-loading="mapPending"
          :map-searching="!!mapBbox"
          @update:view="setView"
          @map-search="mapBbox = $event"
          @map-reset="mapBbox = null"
          @update:sort="setSort"
          @update:only-bookable="setOnlyBookable"
          @update:mode="setMode"
          @update:soon="setSoon"
          @update:rated="setRated"
          @update:accessible="setAccessible"
          @update:use-prefs="setUsePrefs"
          @update:radius="radius = $event"
          @locate="locate"
          @unlocate="unlocate"
          @search-by-name="searchByName"
          @search-by-place="searchByPlace"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { usePreferences } from '~/composables/usePreferences'

const PAGE_SIZE = 10
const SORTS = { pertinence: undefined, disponibilite: 'nextAvailability', prix: 'price', distance: 'distance' }

const route = useRoute()
const router = useRouter()
const q = computed(() => String(route.query.q ?? '').trim().slice(0, 100))
// « Cholet » est une ville, pas un nom de praticien : on cherche alors autour de cette ville (comme les autres annuaires),
// sans ramener les praticiens qui s'appellent Cholet ou dont l'adresse contient ce mot. `nom=1` force la recherche par nom.
const PLACE_RADIUS_KM = 15
const byName = computed(() => route.query.nom === '1')
const { data: place } = await useAsyncData(
  'praticiens-place',
  async () => {
    if (!q.value || byName.value) return null
    const found = await $fetch('/api/place', { query: { q: q.value } }).catch(() => null)
    return found && typeof found === 'object' ? found : null
  },
  { watch: [q, byName] },
)
const { findBySlug } = await useSpecialities()
const speciality = computed(() => findBySlug(String(route.query.specialite ?? '')))
const onlyBookable = computed(() => route.query.reservable === '1')
// Deux écrans : la page « Recherche » (sans critère) et la page « Résultats » (dès qu'un critère est choisi)
// Filtres : mode de consultation, disponibilité sous 7 jours, note de 4 et plus, accès à mobilité réduite
const MODES = ['cabinet', 'visio', 'domicile']
const mode = computed(() => (MODES.includes(String(route.query.mode)) ? String(route.query.mode) : ''))
const soon = computed(() => route.query.dispo === '7')
const rated = computed(() => route.query.note === '4')
const accessible = computed(() => route.query.pmr === '1')
// Préférences du compte (patient connecté) : ville localisée + distance (filtre) et budget (repère « Dans votre budget »).
// Le type de consultation n'est pas un filtre ici : seules les fiches de praticiens inscrits en ont, il exclurait tout l'annuaire.
const { prefs, load: loadPrefs } = usePreferences()
onMounted(loadPrefs)
const usePrefs = computed(() => route.query.prefs === '1')
const prefLocation = computed(() => (prefs.value?.latitude != null && prefs.value?.longitude != null ? { lat: prefs.value.latitude, lng: prefs.value.longitude } : null))
const prefsUsable = computed(() => !!prefs.value && (!!prefLocation.value || !!prefs.value.budgetBand))
const RESULT_KEYS = ['vue', 'q', 'nom', 'specialite', 'tri', 'reservable', 'mode', 'dispo', 'note', 'pmr', 'prefs', 'page', 'tous']
const isResults = computed(() => Object.keys(route.query).some(k => RESULT_KEYS.includes(k)))
const page = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1))
// Remet à zéro la barre de recherche quand on arrive d'un autre critère (lien, retour arrière)
const searchKey = computed(() => `${route.query.q ?? ''}|${route.query.specialite ?? ''}|${route.query.dispo ?? ''}`)

// Position (facultative) : gardée en mémoire seulement, jamais dans l'adresse de la page.
const geo = ref(null)
const geoError = ref('')
// Rayon de recherche autour de la position : sans lui, l'annuaire renvoie aussi les praticiens très éloignés.
const radius = ref(30)
const sort = computed(() => {
  const wanted = String(route.query.tri ?? 'pertinence')
  if (wanted === 'distance' && !geo.value) return 'pertinence'
  return wanted in SORTS ? wanted : 'pertinence'
})

const apiQuery = computed(() => ({
  ...(speciality.value ? { specialityId: speciality.value.id } : {}),
  ...(q.value && !place.value ? (byName.value ? { name: q.value } : { q: q.value }) : {}),
  ...(place.value && !geo.value ? { lat: place.value.latitude, lng: place.value.longitude, radiusKm: PLACE_RADIUS_KM } : {}),
  ...(SORTS[sort.value] ? { sort: SORTS[sort.value] } : {}),
  ...(onlyBookable.value ? { bookable: true } : {}),
  ...(mode.value ? { mode: mode.value } : {}),
  // Position choisie à la main (« Autour de moi ») prioritaire sur celle des préférences
  ...(usePrefs.value && prefLocation.value && !geo.value && !place.value ? { ...prefLocation.value, ...(prefs.value?.radiusKm ? { radiusKm: prefs.value.radiusKm } : {}) } : {}),
  ...(soon.value ? { availableWithinDays: 7 } : {}),
  ...(rated.value ? { minRating: 4 } : {}),
  ...(accessible.value ? { wheelchairAccessible: true } : {}),
  ...(geo.value ? { lat: geo.value.lat, lng: geo.value.lng, radiusKm: radius.value } : {}),
  limit: PAGE_SIZE,
}))

// Recherche « par nom » : le paramètre `name` de l'API cherche uniquement dans le prénom et le nom (le texte libre `q` cherche aussi la ville et l'adresse).
async function fetchPage(offset) {
  const res = await $fetch.raw('/api/backend/praticiens', { query: { ...apiQuery.value, offset } })
  return { items: Array.isArray(res._data) ? res._data : [], total: Number(res.headers.get('x-total-count')) || 0 }
}

const { data: first, error, pending } = await useAsyncData(
  'praticiens-search',
  () => (isResults.value ? fetchPage((page.value - 1) * PAGE_SIZE) : Promise.resolve({ items: [], total: 0 })),
  { watch: [apiQuery, isResults, page] },
)

// Vue « Carte » : jusqu'à 100 praticiens (mêmes filtres), puis la zone choisie sur la carte (« Rechercher dans cette zone »)
const view = computed(() => (route.query.vue === 'carte' ? 'carte' : 'liste'))
const mapBbox = ref(null)
const mapQuery = computed(() => {
  const { limit, ...rest } = apiQuery.value
  if (mapBbox.value) {
    // Une zone remplace la position et le rayon (incompatibles avec bbox)
    const { lat, lng, radiusKm, ...zone } = rest
    const { sort: s, ...noSort } = zone
    return { ...noSort, ...(s && s !== 'distance' ? { sort: s } : {}), bbox: mapBbox.value.map(n => Number(n).toFixed(5)).join(','), limit: 100 }
  }
  return { ...rest, limit: 100 }
})
const { data: mapData, pending: mapPending } = await useAsyncData(
  'praticiens-map',
  async () => {
    if (!(isResults.value && view.value === 'carte')) return { items: [], total: 0 }
    const res = await $fetch.raw('/api/backend/praticiens', { query: mapQuery.value })
    const list = Array.isArray(res._data) ? res._data : []
    return { items: list, total: Number(res.headers.get('x-total-count')) || 0 }
  },
  { watch: [mapQuery, view, isResults], server: false, lazy: true },
)
const mapItems = computed(() => mapData.value?.items ?? [])
const mapTotal = computed(() => mapData.value?.total ?? 0)
// Un nouveau critère de recherche efface la zone choisie sur la carte
watch([() => route.query.q, () => route.query.specialite], () => { mapBbox.value = null })
const setView = (value) => setQuery({ vue: value === 'carte' ? 'carte' : undefined, page: undefined })

const items = computed(() => first.value?.items ?? [])
const total = computed(() => first.value?.total ?? 0)

function setQuery(patch) {
  const next = { ...route.query, ...patch }
  for (const key of Object.keys(next)) if (next[key] === undefined || next[key] === '') delete next[key]
  router.replace({ path: route.path, query: next, hash: '#resultats' })
}
// La position ou le rayon changent : retour à la première page
watch([geo, radius], () => { if (page.value > 1) setQuery({ page: undefined }) })

// Changer le tri ou un filtre ramène à la première page
const setSort = (value) => setQuery({ tri: value === 'pertinence' ? undefined : value, page: undefined })
const setOnlyBookable = (value) => setQuery({ reservable: value ? '1' : undefined, page: undefined })
const setUsePrefs = (value) => setQuery({ prefs: value ? '1' : undefined, page: undefined })
const setMode = (value) => setQuery({ mode: value || undefined, page: undefined })
const setSoon = (value) => setQuery({ dispo: value ? '7' : undefined, page: undefined })
const setRated = (value) => setQuery({ note: value ? '4' : undefined, page: undefined })
const setAccessible = (value) => setQuery({ pmr: value ? '1' : undefined, page: undefined })

// Texte reconnu comme une ville mais cherché comme un nom (lien « Chercher plutôt un praticien nommé… »)
const searchByName = () => setQuery({ nom: '1', page: undefined })
const searchByPlace = () => setQuery({ nom: undefined, page: undefined })

function locate() {
  geoError.value = ''
  if (!navigator.geolocation) { geoError.value = 'La géolocalisation n\'est pas disponible sur cet appareil.'; return }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Position arrondie (environ 1 km) : suffisante pour trier, sans précision inutile.
      geo.value = { lat: Math.round(pos.coords.latitude * 100) / 100, lng: Math.round(pos.coords.longitude * 100) / 100 }
      // Depuis la page « Recherche », la position mène aux résultats autour de soi
      if (!isResults.value) router.push({ path: route.path, query: { tous: '1' }, hash: '#resultats' })
    },
    (err) => { geoError.value = err.code === 1 ? 'Position refusée : autorisez la localisation dans votre navigateur pour trier par distance.' : 'Impossible de déterminer votre position.' },
    { timeout: 10000, maximumAge: 300000 },
  )
}
function unlocate() {
  geo.value = null
  if (route.query.tri === 'distance') setSort('pertinence')
}

const title = 'Trouver un praticien — Léya'
const description = 'Trouvez facilement des praticiens en médecines alternatives près de chez vous. Prenez rendez-vous en ligne.'

// Les variantes filtrées (recherche, tri, spécialité) ne sont pas indexées : la page de base fait foi.
const isFiltered = isResults

useSeoMeta({
  robots: () => (isFiltered.value ? 'noindex, follow' : 'index, follow'),
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://leya-sante.fr/og-image.jpg',
  ogUrl: 'https://leya-sante.fr/trouver-un-praticien',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://leya-sante.fr/og-image.jpg',
})

useWebPageSchema({ name: 'Trouver un praticien', description, breadcrumbs: [{ name: 'Trouver un praticien', path: '/trouver-un-praticien' }] })
</script>

<style scoped>
/* Illustration de fond placée comme dans la maquette (1728 px) */
.page-search { --u: calc(min(100vw, 1728px) / 1728); }
.page-mortar { left: calc(50% + var(--u) * 376); top: calc(var(--u) * 1200); width: calc(var(--u) * 650); }
</style>
