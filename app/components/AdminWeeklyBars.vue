<template>
  <figure class="rounded-[24px] bg-white p-5 sm:p-6" :aria-label="title">
    <figcaption class="flex flex-wrap items-center justify-between gap-3">
      <span class="font-unbounded font-normal text-[20px] leading-[normal]">{{ title }}</span>
      <ul v-if="series.length > 1" class="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-neutre-600">
        <li v-for="s in series" :key="s.key" class="inline-flex items-center gap-[6px]"><span class="w-3 h-3 rounded-[3px]" :style="{ backgroundColor: s.color }"></span>{{ s.label }}</li>
      </ul>
    </figcaption>

    <p v-if="!rows.length" class="mt-4 text-[16px] text-neutre-600">Aucune donnée sur la période.</p>
    <template v-else>
      <!-- Dessin décoratif pour les lecteurs d'écran : les mêmes valeurs sont dans le tableau ci-dessous -->
      <div class="mt-5 flex items-stretch gap-2 h-[220px]" aria-hidden="true">
        <div v-for="(bar, i) in bars" :key="weeks[i].week" class="flex-1 min-w-0 flex flex-col items-center gap-1" :title="tooltip(i)">
          <span class="text-[14px] leading-[normal] text-vert-900">{{ formatCount(totals[i]) }}</span>
          <div class="flex-1 w-full max-w-[56px] flex flex-col-reverse">
            <span v-for="segment in bar.filter(s => s.height > 0)" :key="segment.key" class="block w-full rounded-[4px] border-t-2 border-white" :style="{ height: `${segment.height}%`, backgroundColor: colorOf(segment.key) }"></span>
          </div>
          <span class="text-[14px] leading-[normal] text-neutre-600 whitespace-nowrap">{{ formatStatsShortDay(weeks[i].week) }}</span>
        </div>
      </div>

      <details class="mt-4 text-[16px]">
        <summary class="cursor-pointer font-medium underline-offset-2 hover:underline">Voir les données</summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full min-w-[420px] text-left">
            <caption class="sr-only">{{ title }}</caption>
            <thead>
              <tr class="text-neutre-600">
                <th scope="col" class="py-2 pr-4 font-medium">Semaine du</th>
                <th v-for="s in series" :key="s.key" scope="col" class="py-2 pr-4 font-medium">{{ s.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in weeks" :key="row.week" class="border-t border-bleu-100">
                <th scope="row" class="py-2 pr-4 font-normal">{{ formatStatsDay(row.week) }}</th>
                <td v-for="s in series" :key="s.key" class="py-2 pr-4">{{ formatCount(row[s.key] ?? 0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </template>
  </figure>
</template>

<script setup>
import { computed } from 'vue'

// Barres empilées par semaine du cockpit d'administration. `rows` : une ligne par semaine ({ week: 'YYYY-MM-DD', … }) ;
// `series` : les clés à empiler, de bas en haut, avec leur libellé et leur couleur.
const props = defineProps({
  title: { type: String, required: true },
  rows: { type: Array, required: true },
  series: { type: Array, required: true },
})

// Hauteur de référence : les segments sont exprimés en pourcentage de la zone de tracé
const FULL_HEIGHT = 100
const keys = computed(() => props.series.map(s => s.key))
// Les semaines sans rien entre la première et la dernière sont tracées à zéro (l'API ne les renvoie pas)
const weeks = computed(() => fillWeeks(props.rows, keys.value))
const bars = computed(() => stackBars(weeks.value, keys.value, FULL_HEIGHT))
const totals = computed(() => weeks.value.map(row => keys.value.reduce((total, key) => total + (Number(row[key]) || 0), 0)))
const colorOf = (key) => props.series.find(s => s.key === key)?.color
const tooltip = (i) => `Semaine du ${formatStatsDay(weeks.value[i].week)} : ${props.series.map(s => `${s.label} ${formatCount(weeks.value[i][s.key] ?? 0)}`).join(', ')}`
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
