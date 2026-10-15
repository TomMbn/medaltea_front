<template>
  <section class="relative pt-8 lg:pt-8 pb-16 lg:pb-24" aria-labelledby="praticien-results-title">
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[216px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[-4%] top-[811px] w-[37%] max-w-[650px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px]">
      <!-- Filtres et tri -->
      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[16px] font-medium leading-[normal]">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtres de la maquette : disponibilité, type de séance (une pastille par type), note, accès -->
          <button
            v-for="f in chips"
            :key="f.key"
            type="button"
            class="rounded-full px-4 py-[9px] transition-colors"
            :class="f.on ? 'bg-vert-600 text-white' : 'bg-white text-vert-900 hover:bg-white/70'"
            :aria-pressed="f.on ? 'true' : 'false'"
            @click="f.toggle()"
          >
            {{ f.label }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-[9px] transition-colors"
            :class="geo ? 'bg-vert-600 text-white' : 'bg-white text-vert-900 hover:bg-white/70'"
            :aria-pressed="geo ? 'true' : 'false'"
            @click="emit(geo ? 'unlocate' : 'locate')"
          >
            <MapPin :size="14" aria-hidden="true" /> Autour de moi
          </button>
          <label v-if="geo" class="relative inline-flex items-center gap-2 bg-white text-vert-900 rounded-full pl-4 pr-3 py-[9px] cursor-pointer focus-ring-within">
            <span>Rayon : {{ radius }} km</span>
            <ChevronDown :size="14" aria-hidden="true" />
            <select :value="radius" aria-label="Rayon de recherche" class="absolute inset-0 w-full opacity-0 cursor-pointer" @change="emit('update:radius', Number($event.target.value))">
              <option v-for="km in [10, 20, 30, 50, 100]" :key="km" :value="km">{{ km }} km</option>
            </select>
          </label>
          <button
            type="button"
            class="rounded-full px-4 py-[9px] transition-colors"
            :class="onlyBookable ? 'bg-vert-600 text-white' : 'bg-white text-vert-900 hover:bg-white/70'"
            :aria-pressed="onlyBookable ? 'true' : 'false'"
            @click="emit('update:onlyBookable', !onlyBookable)"
          >
            Réservable en ligne
          </button>
          <button
            v-if="prefsAvailable"
            type="button"
            class="rounded-full px-4 py-[9px] transition-colors"
            :class="usePrefs ? 'bg-vert-600 text-white' : 'bg-white text-vert-900 hover:bg-white/70'"
            :aria-pressed="usePrefs ? 'true' : 'false'"
            @click="emit('update:usePrefs', !usePrefs)"
          >
            Selon mes préférences
          </button>
        </div>

        <label class="relative inline-flex items-center gap-2 bg-white text-vert-900 rounded-full pl-3 pr-4 py-[9px] cursor-pointer focus-ring-within">
          <ChevronDown :size="14" aria-hidden="true" />
          <span>Trier : {{ sortLabel }}</span>
          <select :value="sort" aria-label="Trier les résultats" class="absolute inset-0 w-full opacity-0 cursor-pointer" @change="emit('update:sort', $event.target.value)">
            <option value="pertinence">Pertinence</option>
            <option value="disponibilite">Prochaine disponibilité</option>
            <option value="prix">Prix croissant</option>
            <option v-if="geo" value="distance">Distance</option>
          </select>
        </label>
      </div>
      <p v-if="geoError" class="mt-4 bg-white text-vert-900 rounded-2xl p-3 text-[16px]" role="alert">{{ geoError }}</p>

      <div class="mt-8 lg:mt-10 flex flex-wrap items-center justify-between gap-4">
      <h1 id="praticien-results-title" class="font-unbounded font-normal text-[22px] lg:text-[24px] leading-tight text-black" role="status" aria-live="polite">
        {{ total }} praticien{{ total > 1 ? 's' : '' }}<template v-if="specialityName"> en {{ specialityName.toLowerCase() }}</template><template v-if="place"> à moins de {{ placeRadius }} km de {{ place }}</template><template v-else-if="q"> pour « {{ q }} »</template>
      </h1>
      <p v-if="place || (byName && q)" class="basis-full -mt-2 text-[16px] leading-[normal] text-neutre-600">
        <template v-if="place">Recherche autour de {{ place }}, triée par distance. <button type="button" class="underline font-medium text-vert-900 hover:text-vert-600" @click="emit('search-by-name')">Chercher plutôt un praticien nommé « {{ q }} »</button></template>
        <template v-else>Recherche par nom uniquement. <button type="button" class="underline font-medium text-vert-900 hover:text-vert-600" @click="emit('search-by-place')">Chercher plutôt autour de « {{ q }} »</button></template>
      </p>

        <div class="inline-flex gap-1 rounded-full bg-white p-[5px] text-[16px] font-medium leading-[normal]" role="group" aria-label="Affichage des résultats">
          <button type="button" class="inline-flex items-center gap-2 rounded-full px-[30px] py-[9px] min-h-[48px] transition-colors" :class="view !== 'carte' ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="view !== 'carte' ? 'true' : 'false'" @click="emit('update:view', 'liste')">
            <List :size="16" aria-hidden="true" /> Liste ({{ total }})
          </button>
          <button type="button" class="inline-flex items-center gap-2 rounded-full px-[30px] py-[9px] min-h-[48px] transition-colors" :class="view === 'carte' ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="view === 'carte' ? 'true' : 'false'" @click="emit('update:view', 'carte')">
            <MapPin :size="16" aria-hidden="true" /> Carte
          </button>
        </div>
      </div>

      <PraticienMapView
        v-if="view === 'carte'"
        class="mt-6 lg:mt-8"
        :items="mapItems"
        :total="mapTotal"
        :loading="mapLoading"
        :searching="mapSearching"
        @search-zone="emit('map-search', $event)"
        @reset="emit('map-reset')"
      />

      <p v-else-if="error" class="mt-8 bg-white text-vert-900 rounded-[28px] p-6 text-[18px]">
        La liste des praticiens est momentanément indisponible. Merci de réessayer dans un instant.
      </p>

      <p v-else-if="!praticiens.length && !loading" class="mt-8 bg-white text-vert-900 rounded-[28px] p-6 text-[18px]">
        <template v-if="geo">Aucun praticien dans un rayon de {{ radius }} km autour de vous. Élargissez le rayon, ou retirez « Autour de moi » pour voir tous les praticiens.</template>
        <template v-else-if="place">Aucun praticien à moins de {{ placeRadius }} km de {{ place }} pour le moment. Essayez une autre ville ou une autre spécialité.</template>
        <template v-else-if="usePrefs">Aucun praticien ne correspond à vos préférences (ville et distance). Retirez « Selon mes préférences » ou élargissez-les dans <NuxtLink to="/mon-compte" class="underline font-semibold">Mon profil</NuxtLink>.</template>
        <template v-else-if="q || specialityName || onlyBookable || mode || soon || rated || accessible || usePrefs">Aucun praticien ne correspond à cette recherche. Essayez une autre ville, un autre code postal ou une autre spécialité.</template>
        <template v-else>Les premiers praticiens arrivent bientôt.</template>
      </p>

      <template v-else>
        <ul class="mt-6 lg:mt-8 flex flex-col gap-4" :aria-busy="loading ? 'true' : 'false'">
          <PraticienResultCard v-for="p in praticiens" :key="p.id" :praticien="p" :budget="budget" />
        </ul>

        <!-- Pagination -->
        <nav v-if="pageCount > 1" class="mt-8 lg:mt-10" aria-label="Pagination des résultats">
          <ul class="flex flex-wrap items-center gap-2 text-[16px] font-medium leading-[normal]">
            <li v-for="(n, i) in pages" :key="`${n}-${i}`">
              <span v-if="n === '…'" class="px-2 text-neutre-600" aria-hidden="true">…</span>
              <span v-else-if="n === page" class="inline-flex bg-vert-600 text-white rounded-full px-4 py-[9px]" aria-current="page">{{ n }}</span>
              <NuxtLink v-else :to="pageLink(n)" class="inline-flex bg-white text-vert-900 rounded-full px-4 py-[9px] hover:bg-white/70 transition-colors" :aria-label="`Page ${n}`">{{ n }}</NuxtLink>
            </li>
            <li v-if="page < pageCount">
              <NuxtLink :to="pageLink(page + 1)" class="inline-flex bg-white text-vert-900 rounded-full px-4 py-[9px] hover:bg-white/70 transition-colors">Suivant</NuxtLink>
            </li>
          </ul>
        </nav>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, ChevronDown, List } from 'lucide-vue-next'

const props = defineProps({
  praticiens: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  q: { type: String, default: '' },
  // Ville reconnue dans la recherche : résultats autour d'elle (sinon `q` est un nom ou une adresse)
  place: { type: String, default: '' },
  placeRadius: { type: Number, default: 15 },
  byName: { type: Boolean, default: false },
  specialityName: { type: String, default: '' },
  error: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  sort: { type: String, default: 'pertinence' },
  onlyBookable: { type: Boolean, default: false },
  mode: { type: String, default: '' },
  prefsAvailable: { type: Boolean, default: false },
  usePrefs: { type: Boolean, default: false },
  budget: { type: String, default: null },
  soon: { type: Boolean, default: false },
  rated: { type: Boolean, default: false },
  accessible: { type: Boolean, default: false },
  geo: { type: Object, default: null },
  geoError: { type: String, default: '' },
  radius: { type: Number, default: 30 },
  view: { type: String, default: 'liste' },
  mapItems: { type: Array, default: () => [] },
  mapTotal: { type: Number, default: 0 },
  mapLoading: { type: Boolean, default: false },
  mapSearching: { type: Boolean, default: false },
})
const emit = defineEmits(['update:sort', 'update:onlyBookable', 'update:mode', 'update:soon', 'update:rated', 'update:accessible', 'update:usePrefs', 'update:radius', 'update:view', 'map-search', 'map-reset', 'locate', 'unlocate', 'search-by-name', 'search-by-place'])

const modeLabels = { cabinet: 'Au cabinet', visio: 'En visio', domicile: 'À domicile' }
// Ordre de la maquette : Disponible cette semaine · Cabinet · Visio · À domicile · Note 4+ · Accès PMR
const chips = computed(() => [
  { key: 'soon', label: 'Disponible cette semaine', on: props.soon, toggle: () => emit('update:soon', !props.soon) },
  ...Object.entries(modeLabels).map(([key, label]) => ({ key, label: { cabinet: 'Cabinet', visio: 'Visio', domicile: 'À domicile' }[key] ?? label, on: props.mode === key, toggle: () => emit('update:mode', props.mode === key ? '' : key) })),
  { key: 'rated', label: 'Note 4+', on: props.rated, toggle: () => emit('update:rated', !props.rated) },
  { key: 'pmr', label: 'Accès PMR', on: props.accessible, toggle: () => emit('update:accessible', !props.accessible) },
])

const route = useRoute()

const sortLabels = { pertinence: 'pertinence', disponibilite: 'prochaine disponibilité', prix: 'prix croissant', distance: 'distance' }
const sortLabel = computed(() => sortLabels[props.sort] ?? sortLabels.pertinence)

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
// 1 … précédente, courante, suivante … dernière
const pages = computed(() => {
  const last = pageCount.value
  const wanted = new Set([1, 2, 3, last, props.page - 1, props.page, props.page + 1])
  const list = [...wanted].filter(n => n >= 1 && n <= last).sort((a, b) => a - b)
  const out = []
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
})
const pageLink = (n) => ({ path: route.path, query: { ...route.query, page: n > 1 ? String(n) : undefined }, hash: '#resultats' })
</script>
