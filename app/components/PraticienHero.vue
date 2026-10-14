<template>
  <section class="hs relative pt-32 xl:pt-0 pb-10 xl:pb-0" aria-labelledby="praticien-hero-title">
    <!-- Décor : rond corail et halos -->
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <div class="hidden xl:block absolute left-1/2 hs-halo-1 rounded-full bg-corail-500/20 blur-[90px] pointer-events-none" aria-hidden="true"></div>
    <div class="hidden xl:block absolute left-1/2 hs-halo-2 rounded-full bg-bleu-300/30 blur-[90px] pointer-events-none" aria-hidden="true"></div>
    <div class="hidden xl:block absolute left-1/2 hs-halo-3 rounded-full bg-bleu-300/30 blur-[90px] pointer-events-none" aria-hidden="true"></div>

    <!-- Bulles de spécialités : portraits d'illustration, chacune mène à la spécialité -->
    <ul class="hidden xl:block" aria-label="Spécialités">
      <li v-for="b in bubbles" :key="b.slug" class="absolute z-10" :style="{ left: `calc(50% + var(--u) * ${b.x})`, top: `calc(var(--u) * ${b.y})`, width: `calc(var(--u) * ${b.w})`, height: `calc(var(--u) * ${b.h})` }">
        <NuxtLink :to="{ path: '/trouver-un-praticien', query: { specialite: b.slug }, hash: '#resultats' }" class="group block relative w-full h-full" :aria-label="`Voir les praticiens : ${b.label}`">
          <span class="absolute left-0 top-0 w-[63.89%] h-[90.4%] rounded-leya-m overflow-hidden">
            <NuxtImg :src="b.photo" alt="" class="w-full h-full object-cover" :width="b.pw" :height="b.ph" format="webp" quality="80" loading="eager" style="animation: none;" />
          </span>
          <span class="hs-label absolute left-[38.89%] top-[80.79%] right-0 bottom-0 flex items-center justify-center rounded-leya-xl text-white whitespace-nowrap transition-transform group-hover:-translate-y-0.5" :class="b.bg">{{ b.label }}</span>
        </NuxtLink>
      </li>
    </ul>

    <div class="hs-content relative z-20 mx-auto w-[calc(100%-2rem)] max-w-[1328px] flex flex-col items-center text-center">
      <h1 id="praticien-hero-title" class="hs-h1 font-unbounded font-normal text-vert-900 text-[30px] sm:text-[40px] xl:text-[56px] leading-[1.23] max-w-[824px]">
        Rechercher parmi des milliers de <span class="text-corail-500">praticiens</span>
      </h1>

      <!-- Barre de recherche -->
      <form class="hs-bar mt-10 w-full max-w-[771px] bg-white shadow-[2px_2px_20px_rgba(144,186,209,0.31)] rounded-[28px] sm:rounded-full p-3 sm:p-0 sm:pl-[39px] sm:pr-[7px] sm:h-[78px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 focus-ring-within" role="search" @submit.prevent="search">
        <label for="hero-q" class="flex items-center gap-4 sm:gap-[23px] flex-1 min-w-0 cursor-text px-3 sm:px-0">
          <MapPin :size="20" class="text-vert-600 shrink-0" aria-hidden="true" />
          <input
            id="hero-q"
            v-model="query"
            type="text"
            aria-label="Ville, code postal ou nom du praticien"
            placeholder="Ville, code postal, nom"
            class="hs-txt focus-in-parent bg-transparent text-[18px] text-black placeholder-black focus:outline-none min-w-0 w-full"
          />
        </label>
        <span class="hidden sm:block w-px h-[52px] bg-neutre-200 mx-5 shrink-0" aria-hidden="true"></span>
        <label class="hs-sel relative flex items-center justify-between sm:w-[176px] shrink-0 cursor-pointer px-3 sm:px-0 sm:mr-5">
          <select v-model="speciality" aria-label="Spécialité" class="hs-txt focus-in-parent appearance-none bg-transparent text-[18px] text-black focus:outline-none w-full pr-6 cursor-pointer">
            <option value="">Spécialité</option>
            <option v-for="sp in specialities" :key="sp.id" :value="sp.slug">{{ sp.name }}</option>
          </select>
          <ChevronDown :size="16" class="absolute right-3 sm:right-0 text-neutre-500 pointer-events-none" aria-hidden="true" />
        </label>
        <button type="submit" class="hs-btn shrink-0 inline-flex items-center justify-center gap-[17px] bg-vert-900 text-white text-[18px] h-14 sm:h-16 px-[30px] rounded-leya-xl hover:bg-vert-600 transition-colors whitespace-nowrap">
          Rechercher <Search :size="16" aria-hidden="true" />
        </button>
      </form>

      <!-- Autour de moi + recherches fréquentes -->
      <div class="hs-chips mt-6 flex flex-wrap items-center justify-center gap-x-[10px] gap-y-3 text-[16px] font-medium">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-[9px] leading-[normal] transition-colors"
          :class="geo ? 'bg-vert-600 text-white' : 'bg-white text-vert-900 hover:bg-white/70'"
          :aria-pressed="geo ? 'true' : 'false'"
          @click="emit(geo ? 'unlocate' : 'locate')"
        >
          <MapPin :size="14" aria-hidden="true" /> Autour de moi
        </button>
        <template v-if="frequent.length">
          <span class="text-neutre-600 leading-[normal]">Recherches fréquentes :</span>
          <NuxtLink v-for="f in frequent" :key="f.label" :to="f.to" class="bg-white text-vert-900 rounded-full px-4 py-[9px] leading-[normal] hover:bg-white/70 transition-colors">{{ f.label }}</NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MapPin, Search, ChevronDown } from 'lucide-vue-next'

const props = defineProps({ geo: { type: Object, default: null } })
const emit = defineEmits(['locate', 'unlocate'])

const route = useRoute()
const router = useRouter()
const query = ref(String(route.query.q ?? ''))
const speciality = ref(String(route.query.specialite ?? ''))
const { specialities, findBySlug } = await useSpecialities()

// Bulles de la maquette (portraits d'illustration) rattachées à des spécialités réelles du site.
// Positions : décalage par rapport au centre de la page, sur la base de la maquette à 1728 px.
const bubbleDefs = [
  { slug: 'sophrologie', label: 'Sophrologue', photo: '/images/praticiens/bulle-1.webp', bg: 'bg-corail-500', x: -183, y: 158, w: 214, h: 179, pw: 274, ph: 324 },
  { slug: 'osteopathie', label: 'Ostéopathe', photo: '/images/praticiens/bulle-2.webp', bg: 'bg-vert-600', x: 494, y: 303, w: 245, h: 265, pw: 312, ph: 480 },
  { slug: 'naturopathie', label: 'Naturopathe', photo: '/images/praticiens/bulle-3.webp', bg: 'bg-bleu-300', x: -762, y: 516, w: 324, h: 229, pw: 414, ph: 414 },
]
const bubbles = computed(() => bubbleDefs.filter(b => findBySlug(b.slug)))

// Recherches fréquentes : uniquement des recherches que l'annuaire sait traiter
const frequentDefs = [
  { label: 'Ostéopathe Nantes', slug: 'osteopathie', q: 'Nantes' },
  { label: 'Sophrologue Nantes', slug: 'sophrologie', q: 'Nantes' },
  { label: 'Naturopathe', slug: 'naturopathie' },
]
const frequent = computed(() => frequentDefs
  .filter(f => findBySlug(f.slug))
  .map(f => ({ label: f.label, to: { path: '/trouver-un-praticien', query: { ...(f.q ? { q: f.q } : {}), specialite: f.slug }, hash: '#resultats' } })))

function search() {
  const q = query.value.trim()
  // Sans critère, on affiche tous les praticiens
  const params = { ...(q ? { q } : {}), ...(speciality.value ? { specialite: speciality.value } : {}) }
  if (!Object.keys(params).length) params.tous = '1'
  // Mesure d'audience (anonyme) : spécialité choisie dans la liste, jamais le texte saisi
  trackEvent('praticien-search', {
    specialite: speciality.value || 'aucune',
    texte: q ? 'oui' : 'non',
    autour_de_moi: props.geo ? 'oui' : 'non',
  })
  router.push({ path: '/trouver-un-praticien', query: params })
}
</script>

<style scoped>
/* Unité de la maquette (1728 px) : le hero est une réplique proportionnelle jusqu'à 1728 px, puis reste centré */
.hs { --u: calc(min(100vw, 1728px) / 1728); }
@media (min-width: 1280px) {
  .hs { padding-bottom: calc(var(--u) * 108); }
  .hs-content { padding-top: calc(var(--u) * 364); }
  .hs-h1 { font-size: calc(var(--u) * 56); max-width: calc(var(--u) * 824); }
  .hs-bar { margin-top: calc(var(--u) * 34); width: calc(var(--u) * 771); max-width: none; height: calc(var(--u) * 78); padding-left: calc(var(--u) * 39); padding-right: calc(var(--u) * 7); }
  .hs-txt { font-size: max(15px, calc(var(--u) * 20)); }
  .hs-sel { width: calc(var(--u) * 176); }
  .hs-btn { height: calc(var(--u) * 64); padding: 0 calc(var(--u) * 30); font-size: max(15px, calc(var(--u) * 20)); }
  .hs-chips { margin-top: calc(var(--u) * 24); }
  .hs-label { font-size: max(14px, calc(var(--u) * 20)); }
  .hs-halo-1 { top: calc(var(--u) * 76); width: calc(var(--u) * 705); height: calc(var(--u) * 405); margin-left: calc(var(--u) * -442); }
  .hs-halo-2 { top: calc(var(--u) * 353); width: calc(var(--u) * 673); height: calc(var(--u) * 386); margin-left: calc(var(--u) * 270); }
  .hs-halo-3 { top: calc(var(--u) * 445); width: calc(var(--u) * 563); height: calc(var(--u) * 323); margin-left: calc(var(--u) * -898); }
}
</style>
