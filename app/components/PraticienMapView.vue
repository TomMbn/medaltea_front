<template>
  <div class="relative">
    <ClientOnly>
      <LeyaMap
        ref="mapRef"
        class="h-[460px] sm:h-[560px] xl:h-[860px]"
        :markers="markers"
        :selected-id="selectedId"
        :fit="!searching"
        :fit-points="fitPoints"
        :fit-padding-right="430"
        cluster
        aria-label="Carte des praticiens"
        @select="selectFromMap"
        @moved="onMoved"
      />
      <template #fallback>
        <div class="h-[460px] sm:h-[560px] xl:h-[860px] rounded-[28px] bg-bleu-100" aria-hidden="true"></div>
      </template>
    </ClientOnly>

    <!-- Relancer la recherche sur la zone affichée -->
    <button
      v-if="moved || searching"
      type="button"
      class="absolute left-1/2 xl:left-[calc((100%-428px)/2)] -translate-x-1/2 top-4 xl:top-6 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-[9px] text-[16px] font-medium text-vert-900 leading-[normal] shadow-douce hover:bg-bleu-50 transition-colors disabled:opacity-60"
      :disabled="loading"
      @click="moved ? searchZone() : $emit('reset')"
    >
      <Search :size="14" aria-hidden="true" />
      {{ moved ? 'Rechercher dans cette zone' : 'Revenir aux résultats' }}
    </button>

    <!-- Praticiens de la zone -->
    <aside class="relative z-10 mt-4 xl:mt-0 xl:absolute xl:right-6 xl:top-6 xl:bottom-6 xl:w-[404px] rounded-[28px] bg-white p-5 xl:p-5 flex flex-col shadow-douce" aria-labelledby="zone-title">
      <h2 id="zone-title" class="font-unbounded font-normal text-[18px] leading-[normal] text-vert-900" role="status" aria-live="polite">{{ zoneTitle }}</h2>
      <p v-if="loading" class="mt-4 text-[16px] text-neutre-600">Chargement…</p>
      <p v-else-if="!items.length" class="mt-4 text-[16px] text-neutre-600 leading-[normal]">Aucun praticien dans cette zone. Déplacez ou dézoomez la carte, puis relancez la recherche.</p>
      <ul v-else ref="listRef" class="mt-3 flex-1 min-h-0 max-h-[480px] xl:max-h-none overflow-y-auto flex flex-col gap-3 pr-1" aria-label="Praticiens dans cette zone">
        <li v-for="p in items" :key="p.id" :data-id="p.id">
          <div
            class="flex gap-[14px] rounded-[20px] border-[1.5px] p-3 cursor-pointer transition-colors"
            :class="p.id === selectedId ? 'border-vert-600 bg-white' : 'border-transparent hover:bg-bleu-50'"
            @click="select(p)"
          >
            <span class="relative w-20 h-24 shrink-0 rounded-[14px] overflow-hidden flex items-center justify-center text-white font-unbounded text-[22px]" :style="photoOf(p) ? undefined : { backgroundColor: colors[p.id % colors.length] }" aria-hidden="true">
              <img v-if="photoOf(p) && !failed.has(p.id)" :src="photoOf(p)" alt="" width="80" height="96" loading="lazy" referrerpolicy="no-referrer" class="w-full h-full object-cover bg-bleu-50" style="animation: none;" @error="failed.add(p.id)" />
              <template v-else>{{ initials(p) }}</template>
            </span>
            <span class="min-w-0 flex-1 flex flex-col gap-[6px] leading-[normal]">
              <NuxtLink :to="`/praticiens/${p.slug || p.id}`" class="text-[18px] font-semibold text-vert-900 hover:underline truncate" @click.stop>{{ p.firstName }} {{ p.lastName }}</NuxtLink>
              <span class="text-[16px] text-vert-600 truncate">{{ [p.specialities?.[0]?.name, distance(p)].filter(Boolean).join(' · ') }}</span>
              <span class="flex flex-wrap items-center gap-2 text-[16px] text-vert-900">
                <span v-if="rating(p)" class="inline-flex items-center gap-1"><Star :size="14" class="fill-current" aria-hidden="true" /> {{ rating(p) }}</span>
                <span v-if="slot(p)" class="rounded-full bg-vert-600 px-4 py-[9px] text-[16px] font-medium text-white">{{ slot(p) }}</span>
                <span v-else-if="price(p)" class="text-neutre-600">dès {{ price(p) }} €</span>
              </span>
            </span>
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, reactive } from 'vue'
import { Search, Star } from 'lucide-vue-next'

const props = defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  // Une recherche « dans cette zone » est active (la carte ne se recadre plus toute seule)
  searching: { type: Boolean, default: false },
})
const emit = defineEmits(['search-zone', 'reset'])

const mapRef = ref(null)
const listRef = ref(null)
const selectedId = ref(null)
const moved = ref(false)
let lastBbox = null
const failed = reactive(new Set())

const markers = computed(() => props.items
  .filter(p => p.latitude != null && p.longitude != null && Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)))
  .map(p => ({ id: p.id, lat: Number(p.latitude), lng: Number(p.longitude), price: price(p) && p.bookable !== false ? price(p) : null, label: `${p.firstName} ${p.lastName}` })))

// Cadrage de départ : la zone où se trouvent la plupart des résultats (les fiches très éloignées restent sur la carte, hors cadre)
const rad = (d) => (d * Math.PI) / 180
const kmBetween = (a, b) => {
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
const median = (arr) => { const v = [...arr].sort((x, y) => x - y); return v[Math.floor(v.length / 2)] }
const fitPoints = computed(() => {
  const pts = markers.value.map(m => [m.lat, m.lng])
  if (pts.length < 4) return []
  const mid = [median(pts.map(p => p[0])), median(pts.map(p => p[1]))]
  const near = pts.filter(p => kmBetween(mid, p) <= 30)
  return near.length >= 3 ? near : []
})

const zoneTitle = computed(() => (props.searching ? `${props.total} praticien${props.total > 1 ? 's' : ''} dans cette zone` : `${props.total} praticien${props.total > 1 ? 's' : ''} sur la carte`))

function onMoved(e) { lastBbox = e.bbox; moved.value = true }
function searchZone() {
  if (!lastBbox) return
  moved.value = false
  selectedId.value = null
  emit('search-zone', lastBbox)
}

function select(p) {
  selectedId.value = p.id
  mapRef.value?.focus(p.id)
}
async function selectFromMap(id) {
  selectedId.value = id
  await nextTick()
  listRef.value?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const initials = (p) => `${(p.firstName || '?')[0]}${(p.lastName || '')[0] || ''}`.toUpperCase()
function photoOf(p) {
  const url = p.photoThumbUrl || p.photoUrl
  try { return new URL(url).protocol === 'https:' ? url : '' } catch { return '' }
}
const price = (p) => p.priceFrom ?? p.price ?? null
const rating = (p) => (p.averageRating && p.reviewCount > 0 ? String(Number(p.averageRating).toFixed(1)).replace('.', ',') : '')
function distance(p) {
  const km = Number(p.distanceKm)
  if (!Number.isFinite(km) || p.distanceKm == null) return ''
  return km < 1 ? 'moins de 1 km' : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`
}
const dayKey = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: PARIS_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
function slot(p) {
  const iso = p.nextAvailabilityAt
  if (!iso || p.bookable === false || Number.isNaN(Date.parse(iso))) return ''
  const d = new Date(iso)
  const time = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(d)
  const days = Math.round((Date.parse(dayKey(d)) - Date.parse(dayKey(new Date()))) / 86400000)
  const label = days <= 0 ? 'Auj.' : days === 1 ? 'Dem.' : days < 7 ? new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'short' }).format(d).replace('.', '').replace(/^./, c => c.toUpperCase()) : new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, day: 'numeric', month: 'short' }).format(d)
  return `${label} ${time}`
}
</script>
