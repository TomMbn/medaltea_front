<template>
  <div class="page-search relative overflow-x-hidden min-h-screen bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">
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
          :speciality-name="speciality?.name ?? ''"
          :error="!!error"
          :loading="pending"
          :sort="sort"
          :only-bookable="onlyBookable"
          :mode="mode"
          :soon="soon"
          :rated="rated"
          :accessible="accessible"
          :geo="geo"
          :geo-error="geoError"
          :radius="radius"
          @update:sort="setSort"
          @update:only-bookable="setOnlyBookable"
          @update:mode="setMode"
          @update:soon="setSoon"
          @update:rated="setRated"
          @update:accessible="setAccessible"
          @update:radius="radius = $event"
          @locate="locate"
          @unlocate="unlocate"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
const PAGE_SIZE = 10
const SORTS = { pertinence: undefined, disponibilite: 'nextAvailability', prix: 'price', distance: 'distance' }

const route = useRoute()
const router = useRouter()
const q = computed(() => String(route.query.q ?? '').trim().slice(0, 100))
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
const RESULT_KEYS = ['q', 'specialite', 'tri', 'reservable', 'mode', 'dispo', 'note', 'pmr', 'page', 'tous']
const isResults = computed(() => Object.keys(route.query).some(k => RESULT_KEYS.includes(k)))
const page = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1))
// Remet à zéro la barre de recherche quand on arrive d'un autre critère (lien, retour arrière)
const searchKey = computed(() => `${route.query.q ?? ''}|${route.query.specialite ?? ''}`)

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
  ...(q.value ? { q: q.value } : {}),
  ...(SORTS[sort.value] ? { sort: SORTS[sort.value] } : {}),
  ...(onlyBookable.value ? { bookable: true } : {}),
  ...(mode.value ? { mode: mode.value } : {}),
  ...(soon.value ? { availableWithinDays: 7 } : {}),
  ...(rated.value ? { minRating: 4 } : {}),
  ...(accessible.value ? { wheelchairAccessible: true } : {}),
  ...(geo.value ? { lat: geo.value.lat, lng: geo.value.lng, radiusKm: radius.value } : {}),
  limit: PAGE_SIZE,
}))

async function fetchPage(offset) {
  const res = await $fetch.raw('/api/backend/praticiens', { query: { ...apiQuery.value, offset } })
  return { items: Array.isArray(res._data) ? res._data : [], total: Number(res.headers.get('x-total-count')) || 0 }
}

const { data: first, error, pending } = await useAsyncData(
  'praticiens-search',
  () => (isResults.value ? fetchPage((page.value - 1) * PAGE_SIZE) : Promise.resolve({ items: [], total: 0 })),
  { watch: [apiQuery, isResults, page] },
)

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
const setMode = (value) => setQuery({ mode: value || undefined, page: undefined })
const setSoon = (value) => setQuery({ dispo: value ? '7' : undefined, page: undefined })
const setRated = (value) => setQuery({ note: value ? '4' : undefined, page: undefined })
const setAccessible = (value) => setQuery({ pmr: value ? '1' : undefined, page: undefined })

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
