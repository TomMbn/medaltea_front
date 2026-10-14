<template>
  <section class="relative bg-[#EEF2F5] overflow-hidden flex items-center justify-center min-h-[600px] pt-[140px] pb-28 px-4">

    <!-- Glow rose derrière l'avatar top-center -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />

    <!-- Décor : trois spécialités réelles du site (aucune image externe) -->
    <div
      v-for="(sp, i) in decor"
      :key="sp.id"
      class="absolute hidden md:flex flex-col items-center gap-2 z-10"
      :class="decorPositions[i]"
      aria-hidden="true"
    >
      <div
        class="flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white"
        :class="decorShapes[i]"
        :style="{ backgroundColor: decorColors[i] }"
      >
        {{ sp.name[0] }}
      </div>
      <span class="bg-[#E8755A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">{{ sp.name }}</span>
    </div>

    <!-- Contenu centré -->
    <div class="relative z-10 text-center w-full max-w-xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-10">
        Trouvez un <span class="text-[#E8755A]">praticien</span> près de chez vous
      </h1>

      <!-- Barre de recherche -->
      <form class="focus-ring-within bg-white rounded-full shadow-md flex items-center h-14 sm:-mx-12 lg:-mx-20" role="search" @submit.prevent="search">
        <label for="hero-q" class="flex items-center gap-2 px-5 max-[419px]:px-3 flex-1 min-w-0 self-stretch cursor-text">
          <MapPin :size="15" class="text-gray-400 shrink-0" aria-hidden="true" />
          <input
            id="hero-q"
            v-model="query"
            type="text"
            aria-label="Ville, code postal ou nom du praticien"
            placeholder="Ville, code postal ou nom"
            class="focus-in-parent bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0 w-full"
          />
        </label>
        <button
          type="button"
          class="shrink-0 mr-2 inline-flex items-center gap-1.5 rounded-full px-3 h-11 min-w-[44px] justify-center text-xs font-semibold transition-colors"
          :class="geo ? 'bg-[#156F71] text-white' : 'text-[#156F71] hover:bg-[#e0ecf2]'"
          :aria-pressed="geo ? 'true' : 'false'"
          aria-label="Autour de moi"
          @click="emit(geo ? 'unlocate' : 'locate')"
        >
          <LocateFixed :size="15" aria-hidden="true" />
          <span class="hidden lg:inline">Autour de moi</span>
        </button>
        <div class="hidden sm:flex items-center px-4 border-l border-gray-100 max-w-[200px]">
          <select v-model="speciality" aria-label="Spécialité" class="focus-in-parent bg-transparent text-sm text-gray-600 focus:outline-none w-full appearance-none cursor-pointer">
            <option value="">Toutes les spécialités</option>
            <option v-for="sp in specialities" :key="sp.id" :value="sp.slug">{{ sp.name }}</option>
          </select>
        </div>
        <div class="shrink-0 pr-1.5">
          <button type="submit" aria-label="Rechercher" class="bg-[#156F71] text-white text-sm font-semibold h-11 px-5 max-[419px]:px-3.5 rounded-full flex items-center gap-2 hover:bg-[#0f5557] transition-colors whitespace-nowrap">
            <span class="max-[419px]:hidden">Rechercher</span> <Search :size="14" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MapPin, Search, LocateFixed } from 'lucide-vue-next'

const props = defineProps({ geo: { type: Object, default: null } })
const emit = defineEmits(['locate', 'unlocate'])

const route = useRoute()
const router = useRouter()
const query = ref(String(route.query.q ?? ''))
const speciality = ref(String(route.query.specialite ?? ''))
const { specialities } = await useSpecialities()

// Trois spécialités affichées en décor : on privilégie les plus connues, puis on complète avec la liste.
const PREFERRED = ['Ostéopathie', 'Naturopathie', 'Sophrologie']
const decor = computed(() => {
  const list = specialities.value
  const picked = PREFERRED.map(n => list.find(s => s.name === n)).filter(Boolean)
  for (const s of list) if (picked.length < 3 && !picked.includes(s)) picked.push(s)
  return picked.slice(0, 3)
})
const decorPositions = [
  'top-[92px] left-1/2 -translate-x-1/2',
  'left-[7%] top-1/2 -translate-y-1/3',
  'right-[7%] top-[92px]',
]
const decorShapes = ['w-[72px] h-[72px] rounded-full text-2xl', 'w-[88px] h-[88px] rounded-full text-3xl', 'w-[120px] h-[120px] rounded-[20px] text-4xl']
const decorColors = ['#c4a882', '#a8c0b0', '#8a9bb5']

function search() {
  const q = query.value.trim()
  const params = {}
  if (q) params.q = q
  if (speciality.value) params.specialite = speciality.value
  // Mesure d'audience (anonyme) : spécialité choisie dans la liste, jamais le texte saisi
  trackEvent('praticien-search', {
    specialite: speciality.value || 'aucune',
    texte: q ? 'oui' : 'non',
    autour_de_moi: props.geo ? 'oui' : 'non',
  })
  router.push({ path: '/trouver-un-praticien', query: params, hash: '#resultats' })
}
</script>
