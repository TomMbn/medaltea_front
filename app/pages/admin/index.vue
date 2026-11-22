<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Vue d’ensemble</h1>
        <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">L’activité de Léya sur la période, comparée à la période précédente de même durée.</p>
      </div>
      <AdminPeriodPicker v-model="days" />
    </div>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">Impossible de charger les indicateurs pour le moment.</p>
    <p v-else-if="!stats" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <template v-else>
      <section class="mt-6 rounded-[24px] bg-white p-5 sm:p-6" aria-labelledby="to-handle-title" data-testid="to-handle">
        <h2 id="to-handle-title" class="font-unbounded font-normal text-[20px] leading-[normal]">À traiter</h2>
        <p v-if="!todo.length" class="mt-3 text-[16px] text-neutre-600">Rien à traiter pour le moment.</p>
        <ul v-else class="mt-3 grid gap-2 text-[16px]">
          <li v-for="t in todo" :key="t.text">{{ t.text }}<template v-if="t.to"> · <NuxtLink :to="t.to" class="font-medium underline hover:text-vert-600">{{ t.action }}</NuxtLink></template></li>
        </ul>
      </section>

      <p v-if="!stats.trackingAvailable" class="mt-5 rounded-[16px] bg-amber-50 px-4 py-3 text-[16px] text-amber-900" role="status">Suivi des comptes indisponible : les inscriptions et l’usage de l’assistant ne sont pas affichés.</p>

      <ul class="mt-6 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="tiles">
        <AdminStatTile v-for="t in tiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" :trend="t.trend" :hint="t.hint" />
      </ul>
      <p class="mt-4 text-[14px] text-neutre-600">Du {{ formatStatsDay(stats.period.from) }} au {{ formatStatsDay(stats.period.to) }}. Évolution par rapport aux {{ stats.period.days }} jours précédents.</p>
    </template>

    <AdminAnalysisLinks />
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Vue d’ensemble — Administration Léya', robots: 'noindex, nofollow' })

const { days, stats, error } = useAdminStats('overview')

const TILES = [
  { id: 'newPatients', label: 'Nouveaux patients' },
  { id: 'newPros', label: 'Nouveaux praticiens' },
  { id: 'appointmentsBooked', label: 'RDV pris' },
  { id: 'praticiensWithBooking', label: 'Praticiens ayant reçu un RDV' },
  { id: 'chatMessages', label: 'Messages à l’assistant' },
]
const tiles = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    ...TILES.map(({ id, label }) => ({ id, label, value: formatCount(s.tiles[id]?.value), trend: trendLabel(s.tiles[id]?.value, s.tiles[id]?.previous), hint: '' })),
    { id: 'pendingClaims', label: 'Demandes en attente', value: formatCount(s.toHandle.pendingClaims), trend: '', hint: 'État actuel' },
  ]
})

const todo = computed(() => {
  const h = stats.value?.toHandle
  if (!h) return []
  const items = []
  if (h.pendingClaims > 0) {
    const oldest = h.oldestPendingClaimDays == null ? '' : `, la plus ancienne depuis ${formatDays(h.oldestPendingClaimDays)}`
    items.push({ text: `${formatCount(h.pendingClaims)} demande${h.pendingClaims > 1 ? 's' : ''} de revendication en attente${oldest}`, to: '/admin/revendications', action: 'Traiter les demandes' })
  }
  if (h.chatQuotaReached > 0) items.push({ text: `Quota de l’assistant atteint ${formatCount(h.chatQuotaReached)} fois sur la période` })
  return items
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
