<template>
  <div v-if="slugs.length" class="mt-7">
    <p class="text-[18px] font-semibold text-vert-900 leading-[normal]">Praticiens près de chez vous</p>

    <template v-if="state === 'idle' || state === 'error'">
      <button type="button" class="mt-3 inline-flex items-center gap-2 rounded-full bg-white border border-bleu-100 px-5 min-h-[44px] text-[16px] font-medium text-vert-900 hover:bg-bleu-50 transition-colors" @click="find()">
        <MapPin :size="16" aria-hidden="true" /> {{ savedCity ? `Voir les praticiens près ${de(savedCity)}` : 'Voir les praticiens près de moi' }}
      </button>
      <p class="mt-2 text-[14px] leading-[normal] text-neutre-600">
        <template v-if="savedCity">Nous utilisons la ville de votre profil ; vous pourrez choisir votre position actuelle ensuite.</template>
        <template v-else>Votre navigateur vous demandera l’autorisation d’utiliser votre position.</template>
        Elle sert uniquement à chercher des praticiens : elle n’est ni enregistrée ni transmise à l’assistant.
      </p>
      <p v-if="state === 'error'" class="mt-2 text-[16px] leading-[normal] text-corail-700" role="alert">{{ errorText }}</p>
    </template>

    <p v-else-if="state === 'loading'" class="mt-3 text-[16px] text-neutre-600" role="status">Recherche en cours…</p>

    <template v-else-if="state === 'done'">
      <p class="mt-2 text-[16px] leading-[normal] text-neutre-600">
        {{ origin === 'prefs' ? `Autour ${de(placeName || 'votre ville')}` : 'Autour de votre position' }} ·
        <button v-if="origin === 'prefs'" type="button" class="underline font-medium text-vert-900 hover:text-vert-600" @click="find(true)">Utiliser ma position actuelle</button>
        <NuxtLink v-else to="/mon-compte" class="underline font-medium text-vert-900 hover:text-vert-600">Choisir ma ville</NuxtLink>
      </p>
      <p v-if="notice" class="mt-1 text-[16px] leading-[normal] text-corail-700" role="status">{{ notice }}</p>
      <ul v-if="cards.length" class="mt-3 flex flex-wrap items-start gap-4">
        <li v-for="c in cards" :key="c.id" class="flex flex-col gap-2">
          <NuxtLink :to="`/praticiens/${c.slug || c.id}`" class="flex w-[min(340px,100%)] items-center gap-3 rounded-[20px] bg-white p-3 shadow-douce hover:-translate-y-0.5 transition-transform">
            <span class="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-vert-600 text-white flex items-center justify-center font-unbounded text-[16px]" aria-hidden="true">
              <img v-if="c.photo" :src="c.photo" alt="" width="52" height="52" loading="lazy" referrerpolicy="no-referrer" class="h-full w-full object-cover" style="animation: none;" @error="c.photo = ''" />
              <template v-else>{{ c.initials }}</template>
            </span>
            <span class="min-w-0 flex flex-col leading-[normal]">
              <span class="break-words text-[16px] text-vert-900">{{ c.name }}</span>
              <span class="break-words text-[16px] text-vert-600">{{ [c.speciality, c.distance].filter(Boolean).join(' · ') }}</span>
            </span>
          </NuxtLink>
          <span v-if="c.slot" class="self-start rounded-full bg-vert-600 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-white">{{ c.slot }}</span>
        </li>
      </ul>
      <p v-else class="mt-3 text-[16px] leading-[normal] text-neutre-600">Aucun praticien trouvé à proximité pour le moment.</p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MapPin } from 'lucide-vue-next'
import { usePreferences } from '~/composables/usePreferences'

// Praticiens proches pour les médecines citées dans la réponse : recherche à la demande, position non conservée.
const props = defineProps({ slugs: { type: Array, default: () => [] } })

const state = ref('idle') // idle | loading | done | error
const errorText = ref('')
const cards = ref([])
// D'où vient le lieu : ville du profil (prefs) ou position du navigateur (geo)
const origin = ref('geo')
const placeName = ref('')
const notice = ref('')

const { prefs, load: loadPrefs } = usePreferences()
onMounted(() => { loadPrefs() })
// Ville du profil (patient connecté) : utilisée telle quelle si elle existe
const savedCity = computed(() => (prefs.value?.latitude != null && prefs.value?.longitude != null ? (prefs.value.city || 'votre ville') : ''))

function position() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('indisponible'))
    navigator.geolocation.getCurrentPosition(
      // Position arrondie (environ 1 km) : suffisante pour chercher à proximité
      pos => resolve({ lat: Math.round(pos.coords.latitude * 100) / 100, lng: Math.round(pos.coords.longitude * 100) / 100 }),
      err => reject(err),
      { timeout: 10000, maximumAge: 300000 },
    )
  })
}

// « de Nantes » / « d'Angers » (élision devant une voyelle ou un h)
const de = (city) => (/^[aeiouyéèêàâîïôûh]/i.test(city) ? `d’${city}` : `de ${city}`)

const initialsOf = (p) => `${(p.firstName || '?')[0]}${(p.lastName || '')[0] || ''}`.toUpperCase()
const photoOf = (p) => { try { const u = p.photoThumbUrl || p.photoUrl; return u && new URL(u).protocol === 'https:' ? u : '' } catch { return '' } }
const distanceOf = (p) => {
  const km = Number(p.distanceKm)
  if (!Number.isFinite(km) || p.distanceKm == null) return ''
  return km < 1 ? 'moins de 1 km' : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`
}
function slotOf(p) {
  const iso = p.nextAvailabilityAt
  if (!iso || p.bookable === false || Number.isNaN(Date.parse(iso))) return ''
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'short' }).format(d).replace('.', '').replace(/^./, c => c.toUpperCase())
  const time = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(d).replace(/^0/, '')
  return `${day} ${time}`
}

async function find(forceGeo = false) {
  state.value = 'loading'
  errorText.value = ''
  try {
    // Ville des préférences du compte si elle existe, sinon position du navigateur
    await loadPrefs().catch(() => {})
    const saved = prefs.value?.latitude != null && prefs.value?.longitude != null
    notice.value = ''
    let here = null
    if (!saved || forceGeo) {
      try {
        here = await position()
        origin.value = 'geo'
        placeName.value = ''
      } catch (e) {
        // Position refusée ou indisponible : si la ville du profil existe, on s'en sert plutôt que de ne rien afficher
        if (!saved) throw e
        notice.value = e?.code === 1 ? 'Votre navigateur a refusé la position (autorisez-la pour ce site, puis réessayez).' : 'Votre position n’a pas pu être déterminée.'
      }
    }
    if (!here) {
      origin.value = 'prefs'
      placeName.value = prefs.value?.city || ''
      here = { lat: prefs.value.latitude, lng: prefs.value.longitude }
    }
    const all = await $fetch('/api/backend/specialites').catch(() => [])
    const wanted = props.slugs.slice(0, 2).map(slug => (Array.isArray(all) ? all : []).find(x => x.slug === slug)).filter(Boolean)
    // Une médecine : deux praticiens ; plusieurs : un par médecine
    const perMedicine = wanted.length === 1 ? 2 : 1
    const lists = await Promise.all(wanted.map(s => $fetch('/api/backend/praticiens', { query: { specialityId: s.id, ...here, radiusKm: 30, limit: perMedicine } }).catch(() => [])))
    cards.value = lists.flatMap((list, i) => (Array.isArray(list) ? list : []).slice(0, perMedicine).map(p => ({
      id: p.id, slug: p.slug, name: `${p.firstName} ${p.lastName}`, initials: initialsOf(p), photo: photoOf(p),
      speciality: wanted[i].name, distance: distanceOf(p), slot: slotOf(p),
    })))
    state.value = 'done'
  } catch (e) {
    state.value = 'error'
    errorText.value = e?.code === 1
      ? 'Position refusée : autorisez la localisation pour ce site dans votre navigateur (rechargez la page si besoin), puis réessayez. Vous pouvez aussi renseigner votre ville dans votre profil.'
      : 'Impossible de déterminer votre position (la localisation du système est peut-être désactivée). Vous pouvez chercher par ville dans « Trouver un praticien ».'
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
