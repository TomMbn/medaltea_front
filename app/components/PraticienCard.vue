<template>
  <li class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <div
        class="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-base"
        :style="{ backgroundColor: colors[praticien.id % colors.length] }"
        aria-hidden="true"
      >
        {{ initials }}
      </div>
      <div class="min-w-0">
        <div class="font-unbounded font-bold text-[#012828] text-sm leading-tight truncate">
          {{ praticien.firstName }} {{ praticien.lastName }}
        </div>
        <div class="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin :size="12" aria-hidden="true" />
          <span class="truncate">{{ praticien.city }}<template v-if="praticien.postalCode"> ({{ formatPostalCode(praticien.postalCode) }})</template></span>
        </div>
      </div>
    </div>

    <ul v-if="praticien.specialities?.length" class="flex flex-wrap gap-1.5" aria-label="Spécialités">
      <li v-for="s in praticien.specialities" :key="s.id" class="text-xs font-medium text-[#156F71] bg-[#e0ecf2] rounded-full px-2.5 py-1">
        {{ s.name }}
      </li>
    </ul>

    <div class="flex items-center justify-between gap-2 mt-auto">
      <span v-if="praticien.bookable === false" class="text-[#012828]/60 text-xs">Réservation indisponible</span>
      <span v-else-if="praticien.price" class="text-[#E8755A] text-sm font-semibold">{{ praticien.price }} € par séance</span>
      <span v-else />
      <NuxtLink
        :to="`/praticiens/${praticien.id}`"
        class="flex items-center gap-1 bg-[#012828] text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-[#156F71] transition-colors whitespace-nowrap"
      >
        {{ praticien.bookable === false ? 'Voir la fiche' : 'Prendre rendez-vous' }} <ArrowUpRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({ praticien: { type: Object, required: true } })

const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const initials = computed(() => `${(props.praticien.firstName || '?')[0]}${(props.praticien.lastName || '')[0] || ''}`.toUpperCase())
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
