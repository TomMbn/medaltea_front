<template>
  <li class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
    <div class="flex items-center gap-3">
      <img
        v-if="thumb && !thumbFailed"
        :src="thumb"
        alt=""
        width="56"
        height="56"
        loading="lazy"
        referrerpolicy="no-referrer"
        class="w-14 h-14 shrink-0 rounded-full object-cover bg-[#e0ecf2]"
        @error="thumbFailed = true"
      />
      <div
        v-else
        class="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-base"
        :style="{ backgroundColor: colors[praticien.id % colors.length] }"
        aria-hidden="true"
      >
        {{ initials }}
      </div>
      <div class="min-w-0">
        <div class="font-unbounded font-bold text-[#012828] text-sm leading-tight line-clamp-2 break-words">
          {{ praticien.firstName }} {{ praticien.lastName }}
        </div>
        <div class="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin :size="12" aria-hidden="true" />
          <span class="truncate">{{ praticien.city }}<template v-if="praticien.postalCode"> ({{ formatPostalCode(praticien.postalCode) }})</template></span>
          <span v-if="distance" class="shrink-0">· {{ distance }}</span>
        </div>
      </div>
    </div>

    <ul v-if="praticien.specialities?.length" class="flex flex-wrap gap-1.5" aria-label="Spécialités">
      <li v-for="s in praticien.specialities" :key="s.id" class="text-xs font-medium text-[#156F71] bg-[#e0ecf2] rounded-full px-2.5 py-1">
        {{ s.name }}
      </li>
    </ul>

    <p v-if="praticien.isVerified || rating" class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#012828]/80">
      <span v-if="praticien.isVerified" class="inline-flex items-center gap-1 font-semibold text-[#156F71]"><BadgeCheck :size="14" aria-hidden="true" /> Profil vérifié</span>
      <span v-if="rating" class="inline-flex items-center gap-1"><Star :size="13" aria-hidden="true" /> {{ rating }}<span v-if="praticien.reviewCount"> ({{ praticien.reviewCount }} avis)</span></span>
    </p>

    <p v-if="nextSlot" class="text-sm text-[#012828]">
      <span class="text-xs font-semibold uppercase tracking-wide text-[#012828]/60 block">Prochain créneau</span>
      <span class="font-semibold first-letter:uppercase">{{ nextSlot }}</span>
    </p>

    <div class="flex flex-wrap items-center justify-between gap-2 mt-auto">
      <span v-if="praticien.bookable === false" class="text-[#012828]/60 text-xs">Réservation indisponible</span>
      <span v-else-if="price" class="text-[#E8755A] text-sm font-semibold">À partir de {{ price }} €</span>
      <span v-else />
      <NuxtLink
        :to="`/praticiens/${praticien.slug || praticien.id}`"
        class="flex items-center gap-1 bg-[#012828] text-white text-sm font-medium px-4 py-3 rounded-full hover:bg-[#156F71] transition-colors whitespace-nowrap"
      >
        {{ praticien.bookable === false ? 'Voir la fiche' : 'Prendre rendez-vous' }} <ArrowUpRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </div>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MapPin, ArrowUpRight, BadgeCheck, Star } from 'lucide-vue-next'

const props = defineProps({ praticien: { type: Object, required: true } })

// Vignette 128 × 128 fournie par l'API (https uniquement) ; initiales si absente ou illisible.
const thumbFailed = ref(false)
const thumb = computed(() => {
  const url = props.praticien.photoThumbUrl || props.praticien.photoUrl
  try { return new URL(url).protocol === 'https:' ? url : '' } catch { return '' }
})

const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const initials = computed(() => `${(props.praticien.firstName || '?')[0]}${(props.praticien.lastName || '')[0] || ''}`.toUpperCase())

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
const nextSlot = computed(() => {
  const iso = props.praticien.nextAvailabilityAt
  if (!iso || props.praticien.bookable === false || Number.isNaN(Date.parse(iso))) return ''
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  const time = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(d).replace(':', ' h ').replace(/ h 00$/, ' h')
  return `${day} à ${time}`
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
