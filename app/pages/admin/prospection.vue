<template>
  <div>
    <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Prospection</h1>
    <p class="mt-2 text-[16px] text-neutre-600 max-w-[760px]">Praticiens pas encore inscrits sur Léya qu’un patient a voulu réserver. Contactez-les pour leur proposer de travailler avec nous et suivez chaque échange jusqu’à la collaboration signée.</p>

    <div class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div class="inline-flex flex-wrap gap-1 rounded-full bg-white p-1" role="group" aria-label="Filtre">
        <button v-for="f in filters" :key="f.id" type="button" class="rounded-full px-5 py-[9px] min-h-[40px] text-[16px] font-medium transition-colors" :class="filter === f.id ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="filter === f.id" @click="filter = f.id">{{ f.label }}</button>
      </div>
      <form class="flex items-end gap-2" role="search" @submit.prevent="search = q.trim()">
        <div class="flex flex-col gap-1">
          <label for="prospect-q" class="text-[14px] font-medium text-neutre-600">Recherche</label>
          <input id="prospect-q" v-model="q" type="search" maxlength="100" placeholder="Nom ou ville" class="min-h-[40px] w-[220px] max-w-full rounded-full border border-neutre-300 bg-white px-4 text-[16px]" />
        </div>
        <button type="submit" class="min-h-[40px] rounded-full bg-vert-900 px-5 text-[16px] font-semibold text-white hover:bg-vert-600">Rechercher</button>
      </form>
    </div>

    <ul v-if="summary" class="mt-5 flex flex-wrap gap-2 text-[14px]" data-testid="status-counts" aria-label="Suivis par statut">
      <li v-for="s in PROSPECT_STATUS_ORDER" :key="s">
        <button type="button" class="rounded-full border px-3 py-1 transition-colors" :class="filter === s ? 'border-vert-600 bg-vert-600 text-white' : 'border-neutre-300 bg-white hover:bg-bleu-50'" :aria-pressed="filter === s" @click="filter = s">{{ PROSPECT_STATUS_LABELS[s] }} {{ summary.byStatus[s] ?? 0 }}</button>
      </li>
    </ul>

    <p v-if="error" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">Impossible de charger la prospection pour le moment.</p>
    <p v-else-if="pending && !prospects" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <p v-else-if="!prospects?.length" class="mt-6 rounded-[24px] bg-white p-6 text-[16px] text-neutre-600">Aucun praticien à suivre avec ce filtre.</p>
    <div v-else class="mt-6 grid gap-4" :aria-busy="pending">
      <AdminProspectCard v-for="p in prospects" :key="p.praticien.id" :prospect="p" @updated="onUpdated" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Prospection — Administration Léya', robots: 'noindex, nofollow' })

const filter = ref('open')
const q = ref('')
const search = ref('')

// Chargés dans le navigateur : la passerelle ajoute le jeton, le backend vérifie le rôle admin
const { data: summary, refresh: refreshSummary } = useAsyncData('admin-prospects-summary', () => $fetch('/api/backend/admin/prospects/summary'), { server: false, lazy: true, default: () => null })
const { data: prospects, error, status } = useAsyncData(
  'admin-prospects',
  () => $fetch('/api/backend/admin/prospects', { query: { status: filter.value, ...(search.value ? { q: search.value } : {}) } }),
  { server: false, lazy: true, watch: [filter, search], default: () => null },
)
const pending = computed(() => status.value === 'pending')

const filters = computed(() => {
  const s = summary.value
  const open = s ? ['to_contact', 'contacted', 'interested', 'meeting_planned', 'registered'].reduce((n, k) => n + (s.byStatus[k] ?? 0), 0) : null
  const closed = s ? ['signed', 'not_interested', 'unreachable', 'do_not_contact'].reduce((n, k) => n + (s.byStatus[k] ?? 0), 0) : null
  const withCount = (label, count) => (count == null ? label : `${label} (${count})`)
  return [
    { id: 'alerts', label: withCount('Alertes', s?.alerts) },
    { id: 'open', label: withCount('En cours', open) },
    { id: 'closed', label: withCount('Clos', closed) },
    { id: 'all', label: 'Tout' },
  ]
})

// La carte renvoie le suivi mis à jour : la liste reste à jour sans tout recharger, les compteurs sont relus
function onUpdated(updated) {
  prospects.value = (prospects.value ?? []).map(p => (p.praticien.id === updated.praticien.id ? updated : p))
  refreshSummary()
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
