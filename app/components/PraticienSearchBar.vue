<template>
  <form class="mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] bg-white rounded-[28px] sm:rounded-full shadow-douce p-3 sm:py-2 sm:pl-7 sm:pr-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 focus-ring-within" role="search" @submit.prevent="search">
    <label for="results-q" class="flex-1 min-w-0 flex items-center gap-2.5 cursor-text px-2 sm:px-0">
      <MapPin :size="18" class="text-vert-600 shrink-0" aria-hidden="true" />
      <input id="results-q" v-model="query" type="text" aria-label="Ville, code postal ou nom du praticien" placeholder="Ville, code postal, nom" class="focus-in-parent bg-transparent text-[18px] text-vert-900 placeholder-neutre-600 focus:outline-none min-w-0 w-full" />
    </label>
    <span class="hidden sm:block w-px h-7 bg-bleu-100 shrink-0" aria-hidden="true"></span>
    <label class="relative flex-1 min-w-0 flex items-center gap-2.5 cursor-pointer px-2 sm:px-0">
      <Search :size="18" class="text-vert-600 shrink-0" aria-hidden="true" />
      <select v-model="speciality" aria-label="Spécialité" class="focus-in-parent appearance-none bg-transparent text-[18px] text-vert-900 focus:outline-none w-full pr-6 cursor-pointer">
        <option value="">Toutes les spécialités</option>
        <option v-for="sp in specialities" :key="sp.id" :value="sp.slug">{{ sp.name }}</option>
      </select>
      <ChevronDown :size="16" class="absolute right-2 sm:right-0 text-neutre-500 pointer-events-none" aria-hidden="true" />
    </label>
    <span class="hidden sm:block w-px h-7 bg-bleu-100 shrink-0" aria-hidden="true"></span>
    <label class="relative flex-1 min-w-0 flex items-center gap-2.5 cursor-pointer px-2 sm:px-0">
      <CalendarDays :size="18" class="text-vert-600 shrink-0" aria-hidden="true" />
      <select v-model="availability" aria-label="Disponibilité" class="focus-in-parent appearance-none bg-transparent text-[18px] text-vert-900 focus:outline-none w-full pr-6 cursor-pointer">
        <option value="">Toutes disponibilités</option>
        <option value="7">Cette semaine</option>
      </select>
      <ChevronDown :size="16" class="absolute right-2 sm:right-0 text-neutre-500 pointer-events-none" aria-hidden="true" />
    </label>
    <button type="submit" class="shrink-0 inline-flex items-center justify-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
      Rechercher
      <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Search, ChevronDown, ArrowUpRight, CalendarDays } from 'lucide-vue-next'

const props = defineProps({ geo: { type: Object, default: null } })

const route = useRoute()
const router = useRouter()
const query = ref(String(route.query.q ?? ''))
const speciality = ref(String(route.query.specialite ?? ''))
// « Cette semaine » : même filtre que la pastille « Disponible cette semaine » (disponibilité sous 7 jours)
const availability = ref(route.query.dispo === '7' ? '7' : '')
const { specialities } = await useSpecialities()

function search() {
  const q = query.value.trim()
  const params = { ...(q ? { q } : {}), ...(speciality.value ? { specialite: speciality.value } : {}), ...(availability.value ? { dispo: availability.value } : {}) }
  if (!Object.keys(params).length) params.tous = '1'
  // Mesure d'audience (anonyme) : spécialité choisie dans la liste, jamais le texte saisi
  trackEvent('praticien-search', {
    specialite: speciality.value || 'aucune',
    texte: q ? 'oui' : 'non',
    disponibilite: availability.value ? 'semaine' : 'toutes',
    autour_de_moi: props.geo ? 'oui' : 'non',
  })
  router.push({ path: '/trouver-un-praticien', query: params })
}
</script>
