<template>
  <section class="relative pt-8 lg:pt-8 pb-16 lg:pb-24" aria-labelledby="praticien-results-title">
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[216px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[-4%] top-[811px] w-[37%] max-w-[650px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px]">
      <!-- Filtres et tri -->
      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[16px] font-medium leading-[normal]">
        <div class="flex flex-wrap items-center gap-2">
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

      <h1 id="praticien-results-title" class="mt-8 lg:mt-10 font-unbounded font-normal text-[22px] lg:text-[24px] leading-tight text-black" role="status" aria-live="polite">
        {{ total }} praticien{{ total > 1 ? 's' : '' }}<template v-if="specialityName"> en {{ specialityName.toLowerCase() }}</template><template v-if="q"> pour « {{ q }} »</template>
      </h1>

      <p v-if="error" class="mt-8 bg-white text-vert-900 rounded-[28px] p-6 text-[18px]">
        La liste des praticiens est momentanément indisponible. Merci de réessayer dans un instant.
      </p>

      <p v-else-if="!praticiens.length && !loading" class="mt-8 bg-white text-vert-900 rounded-[28px] p-6 text-[18px]">
        <template v-if="geo">Aucun praticien dans un rayon de {{ radius }} km autour de vous. Élargissez le rayon, ou retirez « Autour de moi » pour voir tous les praticiens.</template>
        <template v-else-if="q || specialityName || onlyBookable">Aucun praticien ne correspond à cette recherche. Essayez une autre ville, un autre code postal ou une autre spécialité.</template>
        <template v-else>Les premiers praticiens arrivent bientôt.</template>
      </p>

      <template v-else>
        <ul class="mt-6 lg:mt-8 flex flex-col gap-4" :aria-busy="loading ? 'true' : 'false'">
          <PraticienResultCard v-for="p in praticiens" :key="p.id" :praticien="p" />
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
import { MapPin, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  praticiens: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  q: { type: String, default: '' },
  specialityName: { type: String, default: '' },
  error: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  sort: { type: String, default: 'pertinence' },
  onlyBookable: { type: Boolean, default: false },
  geo: { type: Object, default: null },
  geoError: { type: String, default: '' },
  radius: { type: Number, default: 30 },
})
const emit = defineEmits(['update:sort', 'update:onlyBookable', 'update:radius', 'locate', 'unlocate'])

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
