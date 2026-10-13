<template>
  <div class="overflow-x-hidden min-h-screen">
    <PraticienHero :geo="geo" @locate="locate" @unlocate="unlocate" />
    <div id="resultats" class="scroll-mt-28">
      <PraticienResults
        :praticiens="items"
        :total="total"
        :q="q"
        :speciality-name="speciality?.name ?? ''"
        :error="!!error"
        :loading="pending || loadingMore"
        :sort="sort"
        :only-bookable="onlyBookable"
        :geo="geo"
        :geo-error="geoError"
        :radius="radius"
        @update:sort="setSort"
        @update:only-bookable="setOnlyBookable"
        @update:radius="radius = $event"
        @unlocate="unlocate"
        @more="loadMore"
      />
    </div>
    <PraticienWhy />
    <div class="bg-[#e0ecf2]">
      <div class="w-11/12 max-w-[1440px] mx-auto">
        <LandingFAQ class="pb-16" />
        <TheFooter />
      </div>
    </div>
  </div>
</template>

<script setup>
const PAGE_SIZE = 12
const SORTS = { pertinence: undefined, disponibilite: 'nextAvailability', prix: 'price', distance: 'distance' }

const route = useRoute()
const router = useRouter()
const q = computed(() => String(route.query.q ?? '').trim().slice(0, 100))
const { findBySlug } = await useSpecialities()
const speciality = computed(() => findBySlug(String(route.query.specialite ?? '')))
const onlyBookable = computed(() => route.query.reservable === '1')

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
  ...(geo.value ? { lat: geo.value.lat, lng: geo.value.lng, radiusKm: radius.value } : {}),
  limit: PAGE_SIZE,
}))

async function fetchPage(offset) {
  const res = await $fetch.raw('/api/backend/praticiens', { query: { ...apiQuery.value, offset } })
  return { items: Array.isArray(res._data) ? res._data : [], total: Number(res.headers.get('x-total-count')) || 0 }
}

const { data: first, error, pending } = await useAsyncData('praticiens-search', () => fetchPage(0), { watch: [apiQuery] })
const more = ref([])
const loadingMore = ref(false)
watch(first, () => { more.value = [] })

const items = computed(() => [...(first.value?.items ?? []), ...more.value])
const total = computed(() => first.value?.total ?? 0)

async function loadMore() {
  if (loadingMore.value || items.value.length >= total.value) return
  loadingMore.value = true
  try {
    const page = await fetchPage(items.value.length)
    more.value = [...more.value, ...page.items]
  } finally {
    loadingMore.value = false
  }
}

function setQuery(patch) {
  const next = { ...route.query, ...patch }
  for (const key of Object.keys(next)) if (next[key] === undefined || next[key] === '') delete next[key]
  router.replace({ path: route.path, query: next, hash: '#resultats' })
}
const setSort = (value) => setQuery({ tri: value === 'pertinence' ? undefined : value })
const setOnlyBookable = (value) => setQuery({ reservable: value ? '1' : undefined })

function locate() {
  geoError.value = ''
  if (!navigator.geolocation) { geoError.value = 'La géolocalisation n\'est pas disponible sur cet appareil.'; return }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Position arrondie (environ 1 km) : suffisante pour trier, sans précision inutile.
      geo.value = { lat: Math.round(pos.coords.latitude * 100) / 100, lng: Math.round(pos.coords.longitude * 100) / 100 }
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
const isFiltered = computed(() => Object.keys(route.query).some(k => ['q', 'specialite', 'tri', 'reservable'].includes(k)))

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
</script>
