<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Économie</h1>
        <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Indicateurs économiques estimés à partir de l’activité : Léya n’enregistre encore ni abonnement ni dépense marketing.</p>
      </div>
    </div>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">Impossible de charger les indicateurs pour le moment.</p>
    <p v-else-if="!stats" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <template v-else>
      <p class="mt-6 rounded-[16px] bg-amber-50 px-4 py-3 text-[16px] text-amber-900" data-testid="assumptions"><strong class="font-semibold">Estimations</strong> sur les {{ stats.windowWeeks }} dernières semaines. Hypothèses : abonnement praticien à {{ formatEuros(stats.assumptions.subscriptionPrice) }} par mois ; budget marketing {{ stats.assumptions.monthlyMarketingBudget == null ? 'non renseigné' : `de ${formatEuros(stats.assumptions.monthlyMarketingBudget)} par mois` }}.</p>
      <ul class="mt-6 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AdminStatTile v-for="t in tiles" :key="t.id" :testid="`tile-${t.id}`" :label="t.label" :value="t.value" :hint="t.hint" />
      </ul>
      <AdminDataTable class="mt-6" title="Churn des praticiens par mois" note="Praticiens ayant reçu une réservation le mois précédent et aucune ce mois-ci. Approximation par l’activité, faute de données d’abonnement." :columns="CHURN_COLUMNS" :rows="churnByMonth" />
    </template>

    <AdminAnalysisLinks />
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Économie — Administration Léya', robots: 'noindex, nofollow' })

const { stats, error } = useAdminStats('economy', false)

const CHURN_COLUMNS = [{ key: 'month', label: 'Mois' }, { key: 'rate', label: 'Churn' }]

const tiles = computed(() => {
  const s = stats.value
  if (!s) return []
  const noBudget = s.assumptions.monthlyMarketingBudget == null ? 'Budget marketing non renseigné' : ''
  return [
    { id: 'revenue', label: 'Revenu mensuel théorique', value: formatEuros(s.theoreticalMonthlyRevenue), hint: `${formatCount(s.managedListings)} fiches gérées × ${formatEuros(s.assumptions.subscriptionPrice)}` },
    { id: 'newClients', label: 'Nouveaux praticiens clients', value: formatCount(s.newClients), hint: 'Inscription ou revendication' },
    { id: 'churn', label: 'Churn mensuel', value: formatRate(s.monthlyChurn), hint: s.monthlyChurn == null ? 'Aucun mois terminé à évaluer' : 'Estimé par l’activité' },
    { id: 'cac', label: 'Coût d’acquisition (CAC)', value: formatEuros(s.cac), hint: noBudget || (s.cac == null ? 'Aucun nouveau client' : 'Budget de la période par nouveau client') },
    { id: 'ltv', label: 'Valeur d’un client (LTV)', value: formatEuros(s.ltv), hint: s.ltv == null ? 'Aucun départ observé' : 'Prix mensuel divisé par le churn' },
    { id: 'roas', label: 'Retour sur dépense (ROAS)', value: formatRatio(s.roas), hint: noBudget || 'Revenu des nouveaux clients par euro dépensé' },
  ]
})
const churnByMonth = computed(() => (stats.value?.churnByMonth ?? []).map(m => ({ month: formatStatsMonth(m.month), rate: formatRate(m.rate) })))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
