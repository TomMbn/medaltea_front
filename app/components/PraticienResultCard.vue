<template>
  <li class="min-w-0">
    <NuxtLink
      :to="`/praticiens/${praticien.slug || praticien.id}`"
      class="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-[28px] p-4 sm:pr-7 hover:shadow-douce transition-shadow"
    >
      <!-- Photo (initiales si absente ou illisible) -->
      <div class="relative w-[120px] h-[140px] sm:w-[150px] sm:h-[176px] shrink-0 rounded-[20px] overflow-hidden" :style="photo && !photoFailed ? undefined : { backgroundColor: colors[praticien.id % colors.length] }">
        <img
          v-if="photo && !photoFailed"
          :src="photo"
          alt=""
          width="150"
          height="176"
          loading="lazy"
          referrerpolicy="no-referrer"
          class="w-full h-full object-cover bg-bleu-50"
          @error="photoFailed = true"
        />
        <span v-else class="absolute inset-0 flex items-center justify-center text-white font-unbounded text-[32px]" aria-hidden="true">{{ initials }}</span>
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-[10px] leading-[normal]">
        <h3 class="text-[18px] sm:text-[20px] font-semibold text-vert-900 leading-[normal] break-words">{{ praticien.firstName }} {{ praticien.lastName }}</h3>

        <ul v-if="praticien.specialities?.length" class="flex flex-wrap gap-2" aria-label="Spécialités">
          <li v-for="s in praticien.specialities" :key="s.id" class="inline-flex items-center gap-2 bg-bleu-50 text-vert-600 text-[16px] font-medium rounded-full pl-3 pr-4 py-[9px]">
            <Leaf :size="14" aria-hidden="true" /> {{ s.name }}
          </li>
        </ul>

        <p class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[16px] text-neutre-600">
          <span class="inline-flex items-center gap-1.5 min-w-0"><MapPin :size="14" class="shrink-0" aria-hidden="true" /> <span class="truncate">{{ place }}</span></span>
          <span v-if="rating" class="inline-flex items-center gap-1.5"><Star :size="14" aria-hidden="true" /> {{ rating }}<template v-if="praticien.reviewCount"> ({{ praticien.reviewCount }})</template></span>
          <span v-if="praticien.isVerified" class="inline-flex items-center gap-1.5"><Check :size="14" aria-hidden="true" /> Profil vérifié</span>
        </p>

        <p v-if="nextSlot" class="flex flex-wrap items-center gap-2" aria-label="Prochain créneau">
          <span class="bg-bleu-50 text-vert-900 text-[16px] font-medium rounded-full px-4 py-[9px]">{{ nextSlot }}</span>
        </p>
      </div>

      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:self-stretch gap-3 shrink-0 leading-[normal]">
        <span v-if="bookable && price" class="text-[18px] font-semibold text-vert-600 whitespace-nowrap">dès {{ price }} €</span>
        <span v-else-if="!bookable" class="text-[16px] text-neutre-600">Réservation indisponible</span>
        <span v-else></span>
        <span class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 whitespace-nowrap group-hover:bg-vert-600 transition-colors">
          {{ bookable ? 'Prendre RDV' : 'Voir la fiche' }}
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </span>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MapPin, ArrowUpRight, Leaf, Star, Check } from 'lucide-vue-next'

const props = defineProps({ praticien: { type: Object, required: true } })

// Photo 640 px fournie par l'API (https uniquement), sinon la vignette ; initiales si absente ou illisible.
const photoFailed = ref(false)
const photo = computed(() => {
  const url = props.praticien.photoUrl || props.praticien.photoThumbUrl
  try { return new URL(url).protocol === 'https:' ? url : '' } catch { return '' }
})
const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const initials = computed(() => `${(props.praticien.firstName || '?')[0]}${(props.praticien.lastName || '')[0] || ''}`.toUpperCase())

const bookable = computed(() => props.praticien.bookable !== false)
// Uniquement ce que l'API fournit : rien n'est affiché sinon.
const price = computed(() => props.praticien.priceFrom ?? props.praticien.price ?? null)
const rating = computed(() => (props.praticien.averageRating && props.praticien.reviewCount > 0
  ? String(Number(props.praticien.averageRating).toFixed(1)).replace('.', ',')
  : ''))
const distance = computed(() => {
  const km = Number(props.praticien.distanceKm)
  if (!Number.isFinite(km) || props.praticien.distanceKm == null) return ''
  return km < 1 ? 'moins de 1 km' : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`
})
const place = computed(() => {
  const p = props.praticien
  const city = [p.city, p.postalCode ? `(${formatPostalCode(p.postalCode)})` : ''].filter(Boolean).join(' ')
  return [city, distance.value].filter(Boolean).join(' · ')
})

// « Auj. 17:30 », « Dem. 10:30 », « Lun 14:00 », puis « 21 oct. 10:30 » au-delà d'une semaine
const dayKey = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: PARIS_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
const nextSlot = computed(() => {
  const iso = props.praticien.nextAvailabilityAt
  if (!iso || !bookable.value || Number.isNaN(Date.parse(iso))) return ''
  const d = new Date(iso)
  const now = new Date()
  const time = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(d)
  const days = Math.round((Date.parse(dayKey(d)) - Date.parse(dayKey(now))) / 86400000)
  let label
  if (days <= 0) label = 'Auj.'
  else if (days === 1) label = 'Dem.'
  else if (days < 7) label = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'short' }).format(d).replace('.', '').replace(/^./, c => c.toUpperCase())
  else label = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, day: 'numeric', month: 'short' }).format(d)
  return `${label} ${time}`
})
</script>
