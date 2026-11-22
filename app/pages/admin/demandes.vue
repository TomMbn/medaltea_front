<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Demandes des praticiens</h1>
        <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Suivi des demandes de revendication de fiche. Le traitement se fait dans les pages Revendications et Fiches.</p>
      </div>
      <AdminPeriodPicker v-model="days" />
    </div>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">Impossible de charger les indicateurs pour le moment.</p>
    <p v-else-if="!stats" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <template v-else>
      <ul class="mt-6 flex flex-wrap gap-3">
        <li v-for="l in ACTIONS" :key="l.to"><NuxtLink :to="l.to" class="inline-flex items-center rounded-full bg-vert-900 px-6 min-h-[44px] text-[16px] font-semibold text-white hover:bg-vert-600 transition-colors">{{ l.label }}</NuxtLink></li>
      </ul>
      <ul class="mt-6 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AdminStatTile v-for="t in tiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" :hint="t.hint" />
      </ul>
      <p class="mt-4 text-[14px] text-neutre-600">Du {{ formatStatsDay(stats.period.from) }} au {{ formatStatsDay(stats.period.to) }}.</p>
      <AdminWeeklyBars class="mt-6" title="Demandes de revendication par semaine" :rows="stats.weekly" :series="SERIES" />
    </template>

    <AdminAnalysisLinks />
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Demandes — Administration Léya', robots: 'noindex, nofollow' })

const { days, stats, error } = useAdminStats('requests')

const ACTIONS = [
  { to: '/admin/revendications', label: 'Traiter les revendications' },
  { to: '/admin/fiches', label: 'Vérifier les fiches' },
]
const SERIES = [
  { key: 'approved', label: 'Approuvées', color: ADMIN_SERIES_COLORS[0] },
  { key: 'pending', label: 'En attente', color: ADMIN_SERIES_COLORS[1] },
  { key: 'rejected', label: 'Refusées', color: ADMIN_SERIES_COLORS[2] },
]

const tiles = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { id: 'pending', label: 'Demandes en attente', value: formatCount(s.pending), hint: 'État actuel' },
    { id: 'received', label: 'Demandes reçues', value: formatCount(s.received), hint: '' },
    { id: 'approvalRate', label: 'Taux d’approbation', value: formatRate(s.approvalRate), hint: 'Demandes décidées sur la période' },
    { id: 'avgProcessingDays', label: 'Délai moyen de traitement', value: formatDays(s.avgProcessingDays), hint: 'Entre la demande et la décision' },
  ]
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
