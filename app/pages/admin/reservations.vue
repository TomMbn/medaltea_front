<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Réservations</h1>
        <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Rendez-vous pris sur Léya et offre disponible dans l’annuaire.</p>
      </div>
      <AdminPeriodPicker v-model="days" />
    </div>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">Impossible de charger les indicateurs pour le moment.</p>
    <p v-else-if="!stats" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <template v-else>
      <ul class="mt-6 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AdminStatTile v-for="t in tiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" :hint="t.hint" />
      </ul>
      <p class="mt-4 text-[14px] text-neutre-600">Du {{ formatStatsDay(stats.period.from) }} au {{ formatStatsDay(stats.period.to) }}.</p>
      <AdminWeeklyBars class="mt-6" title="RDV pris par semaine" :rows="weekly" :series="SERIES" />
      <AdminDataTable class="mt-6" title="Taux de remplissage par semaine" note="Heures de RDV non annulés rapportées aux heures d’ouverture des fiches gérées par un praticien. Approximation : horaires actuels." :columns="FILL_COLUMNS" :rows="fillRate" />

      <h2 class="mt-10 font-unbounded font-normal text-[22px] leading-[normal]">Offre de l’annuaire</h2>
      <ul class="mt-4 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-3 gap-5">
        <AdminStatTile v-for="t in supplyTiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" hint="État actuel" />
      </ul>
      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminDataTable title="Offre par spécialité" :columns="SPECIALITY_COLUMNS" :rows="bySpeciality" />
        <AdminDataTable title="Offre par ville" :columns="CITY_COLUMNS" :rows="byCity" />
      </div>
    </template>

    <AdminAnalysisLinks />
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Réservations — Administration Léya', robots: 'noindex, nofollow' })

const { days, stats, error } = useAdminStats('bookings')

// Quatre séries au plus par graphique : les six statuts de l'API sont regroupés
const SERIES = [
  { key: 'honoured', label: 'Honorés', color: ADMIN_SERIES_COLORS[0] },
  { key: 'upcoming', label: 'À venir', color: ADMIN_SERIES_COLORS[1] },
  { key: 'noShow', label: 'Absences', color: ADMIN_SERIES_COLORS[2] },
  { key: 'cancelled', label: 'Annulés', color: ADMIN_SERIES_COLORS[3] },
]
const FILL_COLUMNS = [{ key: 'week', label: 'Semaine du' }, { key: 'rate', label: 'Taux de remplissage' }]
const SUPPLY_COLUMNS = [{ key: 'visible', label: 'Fiches visibles' }, { key: 'bookable', label: 'Réservables' }]
const SPECIALITY_COLUMNS = [{ key: 'name', label: 'Spécialité' }, ...SUPPLY_COLUMNS]
const CITY_COLUMNS = [{ key: 'city', label: 'Ville' }, ...SUPPLY_COLUMNS]

const tiles = computed(() => {
  const s = stats.value
  if (!s) return []
  const delay = s.confirmationDelay
  return [
    { id: 'booked', label: 'RDV pris', value: formatCount(s.booked), hint: 'Date de réservation' },
    { id: 'honoured', label: 'RDV honorés', value: formatCount(s.honoured), hint: 'Date du rendez-vous' },
    { id: 'praticiensWithBooking', label: 'Praticiens ayant reçu un RDV', value: formatCount(s.praticiensWithBooking), hint: '' },
    { id: 'cancellationRate', label: 'Taux d’annulation', value: formatRate(s.cancellationRate), hint: 'Par le patient ou le praticien' },
    { id: 'noShowRate', label: 'Taux d’absence', value: formatRate(s.noShowRate), hint: 'Parmi les RDV clôturés' },
    { id: 'leadTime', label: 'Délai entre réservation et RDV', value: formatDays(s.leadTime.medianDays), hint: s.leadTime.under48hRate == null ? 'Médiane' : `Médiane · ${formatRate(s.leadTime.under48hRate)} réservés moins de 48 h avant` },
    { id: 'confirmationDelay', label: 'Délai de confirmation', value: formatHours(delay?.medianHours), hint: delay ? `Médiane sur ${formatCount(delay.confirmations)} confirmations` : 'Suivi des comptes indisponible' },
  ]
})
const weekly = computed(() => (stats.value?.weekly ?? []).map(w => ({ week: w.week, honoured: w.completed, upcoming: w.confirmed + w.pending, noShow: w.noShow, cancelled: w.cancelledByUser + w.cancelledByPraticien })))
const fillRate = computed(() => (stats.value?.fillRateWeekly ?? []).map(w => ({ week: formatStatsDay(w.week), rate: formatRate(w.rate) })))
const supplyTiles = computed(() => {
  const supply = stats.value?.supply
  if (!supply) return []
  return [
    { id: 'managed', label: 'Fiches gérées par un praticien', value: formatCount(supply.managed) },
    { id: 'bookable', label: 'Fiches réservables', value: formatCount(supply.bookable) },
    { id: 'unclaimed', label: 'Fiches répertoriées sans compte', value: formatCount(supply.unclaimed) },
  ]
})
const supplyRows = (rows, key) => (rows ?? []).map(r => ({ [key]: r[key], visible: formatCount(r.visible), bookable: formatCount(r.bookable) }))
const bySpeciality = computed(() => supplyRows(stats.value?.supply.bySpeciality, 'name'))
const byCity = computed(() => supplyRows(stats.value?.supply.byCity, 'city'))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
