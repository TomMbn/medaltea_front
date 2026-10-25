<template>
  <div>
    <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Demandes de revendication</h1>
    <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Un praticien demande à gérer une fiche répertoriée. Vérifiez son identité (RPPS, SIRET, appel au cabinet…) avant d’approuver : la fiche est alors rattachée à son compte.</p>

    <div class="mt-6 inline-flex gap-1 rounded-full bg-white p-1" role="group" aria-label="Statut des demandes">
      <button v-for="s in STATUSES" :key="s.id" type="button" class="rounded-full px-5 py-[9px] min-h-[40px] text-[16px] font-medium transition-colors" :class="status === s.id ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="status === s.id" @click="status = s.id">{{ s.label }}</button>
    </div>

    <p v-if="message" class="mt-5 rounded-[16px] bg-emerald-50 px-4 py-3 text-[16px] text-emerald-800" role="status">{{ message }}</p>
    <p v-if="error" class="mt-5 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <p v-else-if="!requests.length && !error" class="mt-6 rounded-[24px] bg-white p-6 text-[16px] text-neutre-600">Aucune demande {{ STATUSES.find(s => s.id === status).empty }}.</p>

    <ul class="mt-6 grid gap-4">
      <li v-for="r in requests" :key="r.id" class="rounded-[24px] bg-white p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[20px] font-semibold leading-[normal]">{{ r.praticien?.firstName }} {{ r.praticien?.lastName }}<span v-if="r.praticien?.city" class="font-normal text-neutre-600"> · {{ r.praticien.city }}</span></p>
            <NuxtLink v-if="r.praticien?.slug" :to="`/praticiens/${r.praticien.slug}`" target="_blank" class="text-[16px] underline hover:text-vert-600">Voir la fiche publique</NuxtLink>
          </div>
          <span class="rounded-full px-3 py-1 text-[14px] font-semibold" :class="BADGE[r.status]?.class">{{ BADGE[r.status]?.label ?? r.status }}</span>
        </div>

        <dl class="mt-4 grid gap-x-8 gap-y-2 text-[16px] leading-[normal] sm:grid-cols-2">
          <div><dt class="text-neutre-600">Demandeur</dt><dd>{{ [r.requester?.firstName, r.requester?.lastName].filter(Boolean).join(' ') || '—' }} · <a v-if="r.requester?.mail" :href="`mailto:${r.requester.mail}`" class="underline">{{ r.requester.mail }}</a></dd></div>
          <div><dt class="text-neutre-600">Reçue le</dt><dd>{{ formatDate(r.createdAt) }}</dd></div>
          <div><dt class="text-neutre-600">RPPS</dt><dd>{{ r.rpps || '—' }}</dd></div>
          <div><dt class="text-neutre-600">SIRET</dt><dd>{{ r.siret || '—' }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-neutre-600">À l’approbation</dt><dd>{{ r.mode === 'replace' ? 'la fiche du demandeur remplace cette fiche (supprimée, son adresse redirige)' : 'le demandeur reprend cette fiche (sa fiche actuelle y est fusionnée)' }}</dd></div>
          <div v-if="r.message" class="sm:col-span-2"><dt class="text-neutre-600">Message</dt><dd class="whitespace-pre-line">{{ r.message }}</dd></div>
          <div v-if="r.status !== 'pending' && r.decisionReason" class="sm:col-span-2"><dt class="text-neutre-600">Motif de la décision</dt><dd>{{ r.decisionReason }}</dd></div>
        </dl>

        <div v-if="r.status === 'pending'" class="mt-5">
          <div v-if="open[r.id]" class="flex flex-col gap-3">
            <label :for="`reason-${r.id}`" class="text-[16px] font-medium">{{ open[r.id] === 'approved' ? 'Note de vérification (facultative)' : 'Motif du refus (facultatif, transmis au demandeur)' }}</label>
            <textarea :id="`reason-${r.id}`" v-model="reasons[r.id]" rows="2" maxlength="300" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 py-3 text-[16px]" placeholder="Par exemple : identité vérifiée par téléphone au cabinet"></textarea>
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" class="rounded-full px-6 min-h-[44px] text-[16px] font-semibold text-white disabled:opacity-50" :class="open[r.id] === 'approved' ? 'bg-vert-900 hover:bg-vert-600' : 'bg-red-700 hover:bg-red-800'" :disabled="busy === r.id" @click="decide(r, open[r.id])">{{ busy === r.id ? 'Un instant…' : open[r.id] === 'approved' ? 'Confirmer l’approbation' : 'Confirmer le refus' }}</button>
              <button type="button" class="text-[16px] font-medium underline" @click="open[r.id] = null">Annuler</button>
            </div>
          </div>
          <div v-else class="flex flex-wrap gap-3">
            <button type="button" class="rounded-full bg-vert-900 px-6 min-h-[44px] text-[16px] font-semibold text-white hover:bg-vert-600 transition-colors" @click="open[r.id] = 'approved'">Approuver</button>
            <button type="button" class="rounded-full border border-red-700 px-6 min-h-[44px] text-[16px] font-semibold text-red-800 hover:bg-red-50 transition-colors" @click="open[r.id] = 'rejected'">Refuser</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Revendications — Administration Léya', robots: 'noindex, nofollow' })

const STATUSES = [
  { id: 'pending', label: 'En attente', empty: 'en attente' },
  { id: 'approved', label: 'Acceptées', empty: 'acceptée' },
  { id: 'rejected', label: 'Refusées', empty: 'refusée' },
]
const BADGE = {
  pending: { label: 'En attente', class: 'bg-amber-100 text-amber-900' },
  approved: { label: 'Acceptée', class: 'bg-emerald-100 text-emerald-900' },
  rejected: { label: 'Refusée', class: 'bg-red-100 text-red-900' },
}
const status = ref('pending')
const requests = ref([])
const loading = ref(true)
const message = ref('')
const error = ref('')
const busy = ref(null)
const open = reactive({})
const reasons = reactive({})

const formatDate = (iso) => (iso ? new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const list = await $fetch('/api/backend/admin/claim-requests', { query: { status: status.value } })
    requests.value = Array.isArray(list) ? list : []
  } catch (e) {
    requests.value = []
    error.value = (e?.statusCode ?? e?.response?.status) === 403 ? 'Cette page est réservée aux administrateurs.' : 'Impossible de charger les demandes pour le moment.'
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(status, () => { message.value = ''; load() })

async function decide(r, decision) {
  busy.value = r.id
  message.value = ''
  error.value = ''
  try {
    const reason = (reasons[r.id] ?? '').trim()
    await $fetch(`/api/backend/admin/claim-requests/${r.id}`, { method: 'PATCH', body: { decision, ...(reason ? { reason } : {}) } })
    requests.value = requests.value.filter(x => x.id !== r.id)
    message.value = decision === 'approved' ? 'Demande approuvée : la fiche est rattachée au compte du praticien.' : 'Demande refusée.'
  } catch (e) {
    const code = e?.statusCode ?? e?.response?.status
    error.value = code === 409 ? (e?.data?.message || 'Décision impossible : la fiche créée par ce praticien à l’inscription a déjà des rendez-vous.') : 'La décision n’a pas pu être enregistrée. Réessayez dans un instant.'
  } finally {
    busy.value = null
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
