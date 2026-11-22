<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Inscriptions</h1>
        <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Comptes créés, activation et fidélité. Ces chiffres viennent du suivi pseudonymisé des comptes : aucun compte n’est listé.</p>
      </div>
      <AdminPeriodPicker v-model="days" />
    </div>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ unavailable ? 'Les statistiques d’inscription sont indisponibles : la base de suivi ne répond pas.' : 'Impossible de charger les indicateurs pour le moment.' }}</p>
    <p v-else-if="!stats" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <template v-else>
      <ul class="mt-6 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AdminStatTile v-for="t in tiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" :hint="t.hint" />
      </ul>
      <p class="mt-4 text-[14px] text-neutre-600">Du {{ formatStatsDay(stats.period.from) }} au {{ formatStatsDay(stats.period.to) }}.</p>
      <AdminWeeklyBars class="mt-6" title="Comptes créés par semaine" :rows="stats.weekly" :series="SERIES" />
      <AdminDataTable class="mt-6" title="Rétention par semaine d’inscription" note="Part des comptes revenus (au moins une action) 1, 2 et 4 semaines après leur semaine d’inscription. Une semaine pas encore écoulée vaut 0 %." :columns="RETENTION_COLUMNS" :rows="retention" />
    </template>

    <AdminAnalysisLinks />
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Inscriptions — Administration Léya', robots: 'noindex, nofollow' })

const { days, stats, error } = useAdminStats('signups')
// 503 : la base de suivi (pg_tracking) est désactivée ou injoignable, aucune autre source ne donne ces chiffres
const unavailable = computed(() => (error.value?.statusCode ?? error.value?.response?.status) === 503)

const SERIES = [
  { key: 'patients', label: 'Patients', color: ADMIN_SERIES_COLORS[0] },
  { key: 'pros', label: 'Praticiens', color: ADMIN_SERIES_COLORS[1] },
]
const RETENTION_COLUMNS = [
  { key: 'week', label: 'Semaine d’inscription' },
  { key: 'accounts', label: 'Comptes' },
  { key: 'week1', label: 'Semaine +1' },
  { key: 'week2', label: 'Semaine +2' },
  { key: 'week4', label: 'Semaine +4' },
]

const tiles = computed(() => {
  const s = stats.value
  if (!s) return []
  const median = (days) => (days == null ? '' : ` · délai médian ${formatDays(days)}`)
  return [
    { id: 'newPatients', label: 'Nouveaux patients', value: formatCount(s.newAccounts.patients), hint: '' },
    { id: 'newPros', label: 'Nouveaux praticiens', value: formatCount(s.newAccounts.pros), hint: '' },
    { id: 'activeUsers', label: 'Utilisateurs actifs', value: formatCount(s.activeUsers.all), hint: `${formatCount(s.activeUsers.patients)} patients, ${formatCount(s.activeUsers.pros)} praticiens` },
    { id: 'patientActivation', label: 'Patients inscrits ayant réservé', value: formatRate(s.patientActivation.bookedRate), hint: `Sur ${formatCount(s.patientActivation.signedUp)} inscrits${median(s.patientActivation.medianDays)}` },
    { id: 'proActivation', label: 'Praticiens inscrits devenus réservables', value: formatRate(s.proActivation.completeRate), hint: `Sur ${formatCount(s.proActivation.signedUp)} inscrits${median(s.proActivation.medianDays)}` },
    { id: 'accountsDeleted', label: 'Comptes supprimés', value: formatCount(s.accountsDeleted), hint: '' },
  ]
})
const retention = computed(() => (stats.value?.retention ?? []).map(c => ({ week: formatStatsDay(c.week), accounts: formatCount(c.accounts), week1: formatRate(c.week1), week2: formatRate(c.week2), week4: formatRate(c.week4) })))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
