<template>
  <article class="rounded-[24px] bg-white p-5 sm:p-6" :aria-labelledby="titleId">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 :id="titleId" class="text-[20px] font-semibold leading-[normal]">
          {{ name }}<span v-if="p.praticien.city" class="font-normal text-neutre-600"> · {{ p.praticien.city }}</span>
        </h2>
        <p class="mt-1 text-[16px] text-neutre-600">{{ requestsText }}<template v-if="p.emailsSent"> · {{ countLabel(p.emailsSent, 'e-mail d’invitation envoyé', 'e-mails d’invitation envoyés') }}</template></p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="p.alert" class="rounded-full bg-amber-100 px-3 py-1 text-[14px] font-semibold text-amber-900">À traiter</span>
        <div class="flex flex-col gap-1">
          <label :for="`status-${p.praticien.id}`" class="text-[14px] font-medium text-neutre-600">Statut</label>
          <select :id="`status-${p.praticien.id}`" :value="p.status" :disabled="p.optedOut || busy" class="min-h-[40px] rounded-full border border-neutre-300 bg-white px-4 text-[16px] disabled:opacity-60" @change="changeStatus($event.target.value)">
            <option v-for="s in PROSPECT_STATUS_ORDER" :key="s" :value="s">{{ PROSPECT_STATUS_LABELS[s] }}</option>
          </select>
        </div>
      </div>
    </div>

    <p v-if="p.optedOut" class="mt-4 rounded-[16px] bg-bleu-50 px-4 py-3 text-[16px]">S’est désinscrit des e-mails de Léya : ne plus le solliciter.</p>

    <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[16px]">
      <li v-if="p.praticien.phoneNumber"><a :href="`tel:${p.praticien.phoneNumber}`" class="underline hover:text-vert-600">{{ phone }}</a></li>
      <li v-if="p.praticien.mail"><a :href="`mailto:${p.praticien.mail}`" class="underline hover:text-vert-600">{{ p.praticien.mail }}</a></li>
      <li><NuxtLink :to="`/praticiens/${p.praticien.slug}`" target="_blank" class="underline hover:text-vert-600">Voir la fiche</NuxtLink></li>
      <li v-if="p.lastContactAt" class="text-neutre-600">Dernier contact le {{ formatDate(p.lastContactAt) }}</li>
    </ul>

    <div v-if="!p.optedOut" class="mt-5 flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1">
        <label :for="`next-${p.praticien.id}`" class="text-[14px] font-medium text-neutre-600">Prochaine relance</label>
        <input :id="`next-${p.praticien.id}`" v-model="nextDay" type="date" class="min-h-[40px] rounded-full border border-neutre-300 bg-white px-4 text-[16px]" />
      </div>
      <button type="button" class="min-h-[40px] rounded-full border border-vert-900 px-4 text-[16px] font-medium hover:bg-bleu-50 disabled:opacity-50" :disabled="busy || !nextDay" @click="saveNextAction(nextDay)">Enregistrer la relance</button>
      <button v-if="p.nextActionAt" type="button" class="min-h-[40px] px-2 text-[16px] font-medium underline disabled:opacity-50" :disabled="busy" @click="saveNextAction(null)">Effacer la relance</button>
    </div>

    <div class="mt-5 flex flex-col gap-2">
      <label :for="`note-${p.praticien.id}`" class="text-[14px] font-medium text-neutre-600">Note</label>
      <textarea :id="`note-${p.praticien.id}`" v-model="note" rows="2" maxlength="1000" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 py-3 text-[16px]" placeholder="Par exemple : messagerie, rappeler jeudi"></textarea>
      <div class="flex flex-wrap gap-2">
        <button v-for="a in actions" :key="a.kind" type="button" class="min-h-[40px] rounded-full px-4 text-[16px] font-medium disabled:opacity-50" :class="a.kind === 'note' ? 'border border-neutre-300 hover:bg-bleu-50' : 'bg-vert-900 text-white hover:bg-vert-600'" :disabled="busy" @click="addEvent(a)">{{ a.label }}</button>
      </div>
    </div>

    <p v-if="message" class="mt-3 text-[16px] text-emerald-800" role="status">{{ message }}</p>
    <p v-if="error" class="mt-3 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ error }}</p>

    <details class="mt-5" @toggle="onToggle">
      <summary class="cursor-pointer text-[16px] font-medium">Historique</summary>
      <p v-if="historyError" class="mt-3 text-[16px] text-red-800" role="alert">{{ historyError }}</p>
      <p v-else-if="history === null" class="mt-3 text-[16px] text-neutre-600">Chargement…</p>
      <ul v-else class="mt-3 grid gap-2 text-[16px]" aria-label="Historique">
        <li v-for="e in history" :key="e.id" class="border-t border-bleu-100 pt-2">
          <span class="text-neutre-600">{{ formatDate(e.createdAt) }}<template v-if="e.adminName"> · {{ e.adminName }}</template></span> — {{ prospectEventLabel(e) }}<span v-if="e.note" class="block whitespace-pre-line">{{ e.note }}</span>
        </li>
      </ul>
    </details>
  </article>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Carte d'un suivi de prospection : statut, relance, actions de l'équipe et journal. Aucune donnée patient.
const props = defineProps({ prospect: { type: Object, required: true } })
const emit = defineEmits(['updated'])

const p = computed(() => props.prospect)
const titleId = computed(() => `prospect-${p.value.praticien.id}`)
const name = computed(() => [p.value.praticien.firstName, p.value.praticien.lastName].filter(Boolean).join(' ') || 'Fiche sans nom')
// « 0241000000 » → « 02 41 00 00 00 »
const phone = computed(() => String(p.value.praticien.phoneNumber).replace(/(\d{2})(?=\d)/g, '$1 '))

const formatDate = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
const requestsText = computed(() => {
  const { pending, total, nextExpiresAt } = p.value.requests
  if (pending > 0) return `${countLabel(pending, 'demande de patient en attente', 'demandes de patients en attente')}${nextExpiresAt ? ` · la plus proche expire le ${formatDate(nextExpiresAt)}` : ''}`
  return total > 0 ? `${countLabel(total, 'demande de patient', 'demandes de patients')}, aucune en attente` : 'Aucune demande de patient'
})

const ACTIONS = [
  { kind: 'call', label: 'Noter un appel', done: 'Appel noté' },
  { kind: 'email', label: 'Noter un e-mail', done: 'E-mail noté' },
  { kind: 'meeting', label: 'Noter un rendez-vous', done: 'Rendez-vous noté' },
  { kind: 'note', label: 'Ajouter une note', done: 'Note ajoutée' },
]
// Praticien désinscrit : seule une note interne reste possible (le backend refuse le reste)
const actions = computed(() => (p.value.optedOut ? ACTIONS.filter(a => a.kind === 'note') : ACTIONS))

const busy = ref(false)
const message = ref('')
const error = ref('')
const note = ref('')
const nextDay = ref(nextActionDay(p.value.nextActionAt))
watch(() => p.value.nextActionAt, (iso) => { nextDay.value = nextActionDay(iso) })

const history = ref(null)
const historyError = ref('')
const historyOpen = ref(false)

const failure = (e) => ((e?.statusCode ?? e?.response?.status) === 409 ? 'Ce praticien s’est désinscrit : il ne doit plus être sollicité.' : 'L’action n’a pas pu être enregistrée. Réessayez dans un instant.')

async function run(task, done) {
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    await task()
    message.value = done
    if (historyOpen.value) await loadHistory()
  } catch (e) {
    error.value = failure(e)
  } finally {
    busy.value = false
  }
}

const patch = (body) => $fetch(`/api/backend/admin/prospects/${p.value.praticien.id}`, { method: 'PATCH', body })

function changeStatus(status) {
  run(async () => emit('updated', await patch({ status })), 'Statut enregistré')
}

function saveNextAction(day) {
  run(async () => emit('updated', await patch({ nextActionAt: day ? nextActionIso(day) : null })), day ? 'Relance enregistrée' : 'Relance effacée')
}

function addEvent(action) {
  const text = note.value.trim()
  run(async () => {
    await $fetch(`/api/backend/admin/prospects/${p.value.praticien.id}/events`, { method: 'POST', body: { kind: action.kind, ...(text ? { note: text } : {}) } })
    note.value = ''
  }, action.done)
}

async function loadHistory() {
  historyError.value = ''
  try {
    history.value = await $fetch(`/api/backend/admin/prospects/${p.value.praticien.id}/events`)
  } catch {
    historyError.value = 'Impossible de charger l’historique.'
  }
}

function onToggle(event) {
  historyOpen.value = event.target.open
  if (historyOpen.value && history.value === null) loadHistory()
}
</script>
