<template>
  <div>
    <!-- Onglets -->
    <div class="mt-[22px] inline-flex gap-1 rounded-full bg-white p-1" role="tablist" aria-label="Rendez-vous">
      <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" class="rounded-full px-4 py-[9px] min-h-[40px] text-[16px] font-medium leading-[normal] whitespace-nowrap transition-colors" :class="tab === t.id ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" @click="tab = t.id">
        {{ t.label }}<template v-if="t.count != null"> ({{ t.count }})</template>
      </button>
    </div>

    <p v-if="status === 'pending' || !ready" class="mt-6 text-[16px] text-neutre-600">Chargement…</p>
    <p v-else-if="error" class="mt-6 rounded-[20px] bg-white p-4 text-[16px] text-red-700" role="alert">{{ apiErrorMessage(error, 'Impossible de charger les rendez-vous.') }}</p>
    <p v-else-if="!list.length" class="mt-6 rounded-[20px] bg-white p-6 text-[18px] text-neutre-600">{{ emptyText }}</p>

    <div v-else class="mt-6 flex flex-col xl:flex-row gap-5 items-start">
      <!-- Liste -->
      <ul class="w-full xl:w-[560px] xl:shrink-0 flex flex-col gap-[10px]" aria-label="Liste des rendez-vous">
        <li v-for="a in list" :key="a.id">
          <button type="button" class="w-full flex items-center gap-5 rounded-[20px] bg-white px-5 py-[14px] text-left border-2 transition-colors" :class="selected?.id === a.id ? 'border-vert-600' : 'border-transparent hover:border-bleu-100'" :aria-pressed="selected?.id === a.id" @click="select(a)">
            <span class="font-unbounded text-[20px] leading-[normal] text-vert-600 whitespace-nowrap min-w-[64px]">{{ whenLabel(a) }}</span>
            <span class="w-11 h-11 shrink-0 rounded-full bg-bleu-100 flex items-center justify-center text-[15px] font-medium text-vert-900" aria-hidden="true">{{ initialsOf(a.patientName) }}</span>
            <span class="flex-1 min-w-0 leading-[normal]">
              <span class="block text-[18px] font-semibold text-vert-900 truncate">{{ a.patientName || 'Patient' }}</span>
              <span class="block text-[16px] text-neutre-600 truncate">{{ rowSub(a) }}</span>
            </span>
            <span class="shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="pillClass(a)">{{ STATUS_LABELS[a.status] || a.status }}</span>
            <span class="hidden sm:flex shrink-0 w-9 h-9 rounded-full bg-bleu-50 items-center justify-center" aria-hidden="true"><ChevronDown :size="16" class="transition-transform" :class="selected?.id === a.id ? '-rotate-90' : ''" /></span>
          </button>
        </li>
      </ul>

      <!-- Détail -->
      <section v-if="selected" ref="detailRef" class="w-full xl:flex-1 min-w-0 rounded-[28px] bg-white p-6 sm:p-8 flex flex-col gap-5" aria-label="Détail du rendez-vous">
        <div class="flex flex-wrap items-center gap-4">
          <span class="w-16 h-16 shrink-0 rounded-full bg-bleu-100 flex items-center justify-center text-[20px] font-medium text-vert-900" aria-hidden="true">{{ initialsOf(selected.patientName) }}</span>
          <div class="flex-1 min-w-[200px] leading-[normal]">
            <h2 class="font-unbounded font-normal text-[22px] sm:text-[26px] text-vert-900 break-words">{{ selected.patientName || 'Patient' }}</h2>
            <p class="mt-[2px] text-[16px] sm:text-[18px] text-neutre-600">{{ detailLine(selected) }}</p>
          </div>
          <span class="shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="pillClass(selected)">{{ STATUS_LABELS[selected.status] || selected.status }}</span>
        </div>

        <div v-if="selected.userNote" class="rounded-[28px] bg-bleu-50 p-6 flex flex-col gap-2">
          <h3 class="font-unbounded font-normal text-[20px] leading-[normal] text-vert-900">Motif indiqué par le patient</h3>
          <p class="text-[18px] text-vert-900 whitespace-pre-line break-words">{{ selected.userNote }}</p>
        </div>

        <div class="flex flex-col gap-1 leading-[normal]">
          <p class="text-[16px] font-medium text-vert-900">Coordonnées</p>
          <p class="text-[18px] text-vert-900 break-words">
            <template v-if="selected.patientContact">{{ selected.patientContact }}</template>
            <span v-else class="text-neutre-600">Non communiquées</span>
            <span v-if="selected.isGuest" class="ml-2 align-middle rounded-full bg-bleu-50 px-3 py-1 text-[14px] font-medium text-vert-600">Sans compte</span>
          </p>
          <p v-if="selected.isGuest" class="text-[16px] text-neutre-600">Identité non vérifiée : réservation faite sans compte.</p>
        </div>

        <p v-if="selected.proposal" class="rounded-[20px] bg-corail-100 px-5 py-4 text-[16px] text-corail-700 leading-[normal]">
          Autre créneau proposé : <strong>{{ formatLongDate(selected.proposal.startAt) }}</strong><template v-if="selected.proposal.expiresAt">, en attente de réponse jusqu’au {{ formatLongDate(selected.proposal.expiresAt) }}</template>.
        </p>

        <!-- Proposer un autre créneau -->
        <form v-if="proposing === selected.id" class="rounded-[20px] bg-bleu-50 p-5 flex flex-col gap-3" @submit.prevent="sendProposal(selected)">
          <label :for="`prop-${selected.id}`" class="text-[16px] font-medium text-vert-900">Créneau proposé <span class="font-normal text-neutre-600">(réservé 48 h pour ce patient)</span></label>
          <p v-if="slotsLoading" class="text-[16px] text-neutre-600">Chargement des créneaux libres…</p>
          <p v-else-if="!slotOptions.length" class="text-[16px] text-neutre-600">Aucun créneau libre sur les 14 prochains jours. Vérifiez vos horaires.</p>
          <select v-else :id="`prop-${selected.id}`" v-model="chosenSlot" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px]" required>
            <option value="" disabled>Choisir un créneau</option>
            <option v-for="o in slotOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-full bg-vert-900 text-white px-6 min-h-[44px] text-[16px] font-semibold disabled:opacity-50" :disabled="!chosenSlot || busyId === selected.id">Envoyer la proposition</button>
            <button type="button" class="rounded-full border border-neutre-300 px-6 min-h-[44px] text-[16px]" @click="proposing = null">Retour</button>
          </div>
        </form>

        <!-- Motif d'annulation -->
        <div v-if="pendingAction?.id === selected.id" class="rounded-[20px] bg-bleu-50 p-5 flex flex-col gap-3">
          <label :for="`reason-${selected.id}`" class="text-[16px] font-medium text-vert-900">Motif <span class="font-normal text-neutre-600">(facultatif, transmis au patient)</span></label>
          <input :id="`reason-${selected.id}`" v-model="reason" maxlength="200" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px] focus:outline-none focus:border-vert-600" />
          <div class="flex flex-wrap gap-2">
            <button class="rounded-full bg-red-700 text-white px-6 min-h-[44px] text-[16px] font-semibold disabled:opacity-50" :disabled="busyId === selected.id" @click="apply(selected, pendingAction.status, reason)">{{ pendingAction.confirmLabel }}</button>
            <button class="rounded-full border border-neutre-300 px-6 min-h-[44px] text-[16px]" @click="pendingAction = null">Retour</button>
          </div>
        </div>

        <p v-if="errors[selected.id]" class="text-[16px] text-red-700" role="alert">{{ errors[selected.id] }}</p>

        <!-- Actions -->
        <div v-if="actions.length" class="flex flex-wrap items-center gap-3">
          <template v-for="act in actions" :key="act.key">
            <button v-if="act.style === 'primary'" type="button" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors disabled:opacity-50" :disabled="busyId === selected.id" @click="act.run()">
              {{ act.label }}
              <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </button>
            <button v-else-if="act.style === 'secondary'" type="button" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full border-[1.5px] border-vert-900 text-vert-900 text-[18px] font-semibold hover:bg-bleu-50 transition-colors disabled:opacity-50" :disabled="busyId === selected.id" @click="act.run()">
              {{ act.label }}
              <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </button>
            <button v-else type="button" class="inline-flex items-center gap-2 min-h-[44px] py-1 text-[18px] font-semibold text-vert-900 hover:underline disabled:opacity-50" :disabled="busyId === selected.id" @click="act.run()">
              {{ act.label }} <ArrowUpRight :size="18" aria-hidden="true" />
            </button>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ChevronDown, ArrowUpRight } from 'lucide-vue-next'

const { praticienId } = useSession()
const { data: raw, status, error, refresh } = useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, lazy: true, default: () => [] })

// Les dates dépendent du navigateur : calculées après l'affichage (pas de décalage à l'hydratation)
const now = ref(null)
onMounted(() => { now.value = new Date() })
const ready = computed(() => !!now.value)

const all = computed(() => normalizeAppointments(raw.value))
const upcoming = (a) => new Date(a.endAt ?? a.startAt).getTime() >= (now.value?.getTime() ?? 0)
const buckets = computed(() => {
  const asc = [...all.value].sort((a, b) => a.startAt.localeCompare(b.startAt))
  const coming = asc.filter(a => (a.status === 'confirmed' || a.status === 'pending') && upcoming(a))
  return {
    upcoming: coming,
    requests: coming.filter(a => a.status === 'pending'),
    past: asc.filter(a => !coming.includes(a)).reverse(),
  }
})

const tab = ref('upcoming')
const tabs = computed(() => [
  { id: 'upcoming', label: 'À venir', count: buckets.value.upcoming.length },
  { id: 'requests', label: 'Demandes', count: buckets.value.requests.length },
  { id: 'past', label: 'Passés', count: null },
])
const list = computed(() => buckets.value[tab.value])
const emptyText = computed(() => ({
  upcoming: 'Aucun rendez-vous à venir.',
  requests: 'Aucune demande en attente.',
  past: 'Aucun rendez-vous passé.',
}[tab.value]))

// Sélection : premier élément de l'onglet par défaut
const selectedId = ref(null)
const selected = computed(() => list.value.find(a => a.id === selectedId.value) ?? list.value[0] ?? null)
const detailRef = ref(null)
watch(tab, () => { selectedId.value = null; pendingAction.value = null; proposing.value = null })
async function select(a) {
  selectedId.value = a.id
  pendingAction.value = null
  proposing.value = null
  // Sur téléphone, le détail s'affiche sous la liste : on y amène l'écran
  if (window.matchMedia('(max-width: 1279px)').matches) { await nextTick(); detailRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const hhmm = (iso) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
const initialsOf = (name) => (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
function whenLabel(a) {
  const d = new Date(a.startAt)
  if (now.value && sameDay(d, now.value)) return hhmm(a.startAt)
  const diff = (d - now.value) / 86400000
  if (diff >= 0 && diff < 7) return `${capital(d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''))} ${hhmm(a.startAt)}`
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} ${hhmm(a.startAt)}`
}
const rowSub = (a) => [a.typeName, a.userNote && a.userNote.replace(/\s+/g, ' ').slice(0, 40)].filter(Boolean).join(' · ') || 'Rendez-vous'
const MODES = { cabinet: 'Cabinet', visio: 'Visio', domicile: 'Domicile' }
const detailLine = (a) => [capital(new Date(a.startAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })), hhmm(a.startAt), a.typeName, MODES[a.mode]].filter(Boolean).join(' · ')
const pillClass = (a) => (a.status === 'pending' ? 'bg-corail-100 text-corail-700' : a.status === 'confirmed' || a.status === 'completed' ? 'bg-bleu-50 text-vert-600' : 'bg-bleu-50 text-neutre-600')

// Actions possibles selon le statut (mêmes règles qu'avant : le backend refuse toute autre transition)
const busyId = ref(null)
const errors = ref({})
const pendingAction = ref(null)
const reason = ref('')
const actions = computed(() => {
  const a = selected.value
  if (!a) return []
  const askReason = (st, confirmLabel) => () => { pendingAction.value = { id: a.id, status: st, confirmLabel }; reason.value = ''; proposing.value = null }
  if (a.status === 'pending') {
    return [
      ...(upcoming(a) ? [{ key: 'ok', style: 'primary', label: 'Confirmer', run: () => apply(a, 'confirmed') }] : []),
      ...(upcoming(a) && !a.proposal ? [{ key: 'prop', style: 'secondary', label: 'Proposer un autre créneau', run: () => openProposal(a) }] : []),
      { key: 'no', style: 'tertiary', label: 'Refuser la demande', run: askReason('cancelled_by_praticien', 'Refuser la demande') },
    ]
  }
  if (a.status === 'confirmed') {
    return upcoming(a)
      ? [{ key: 'cancel', style: 'tertiary', label: 'Annuler le rendez-vous', run: askReason('cancelled_by_praticien', 'Annuler le rendez-vous') }]
      : [
          { key: 'done', style: 'primary', label: 'Marquer comme terminé', run: () => apply(a, 'completed') },
          { key: 'absent', style: 'secondary', label: 'Patient absent', run: () => apply(a, 'no_show') },
        ]
  }
  return []
})

async function apply(a, newStatus, motif) {
  busyId.value = a.id
  errors.value = { ...errors.value, [a.id]: '' }
  try {
    await $fetch(`/api/backend/appointments/${a.id}/status`, { method: 'PATCH', body: { status: newStatus, reason: (motif || '').trim() || undefined } })
    pendingAction.value = null
    await refresh()
  } catch (e) {
    errors.value = { ...errors.value, [a.id]: apiErrorMessage(e, 'Le changement de statut a échoué.') }
  } finally {
    busyId.value = null
  }
}

// Proposition d'un autre créneau : parmi les créneaux libres des 14 prochains jours, pour la même prestation
const proposing = ref(null)
const slotsLoading = ref(false)
const slotOptions = ref([])
const chosenSlot = ref('')
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
async function openProposal(a) {
  proposing.value = a.id
  pendingAction.value = null
  chosenSlot.value = ''
  slotOptions.value = []
  slotsLoading.value = true
  errors.value = { ...errors.value, [a.id]: '' }
  try {
    const to = new Date(); to.setDate(to.getDate() + 14)
    const rawSlots = await $fetch(`/api/backend/praticiens/${praticienId.value}/slots`, { query: { from: ymd(new Date()), to: ymd(to), consultationTypeId: a.typeId ?? undefined } })
    slotOptions.value = normalizeSlots(rawSlots).sort().slice(0, 80).map(s => ({ value: s, label: `${capital(formatDayLabel(dayKey(s)))} · ${formatTime(s)}` }))
  } catch (e) {
    errors.value = { ...errors.value, [a.id]: apiErrorMessage(e, 'Impossible de charger les créneaux libres.') }
  } finally {
    slotsLoading.value = false
  }
}
async function sendProposal(a) {
  busyId.value = a.id
  errors.value = { ...errors.value, [a.id]: '' }
  try {
    await $fetch(`/api/backend/appointments/${a.id}/proposal`, { method: 'POST', body: { startAt: chosenSlot.value } })
    proposing.value = null
    await refresh()
  } catch (e) {
    errors.value = { ...errors.value, [a.id]: apiStatus(e) === 409 ? 'Ce créneau n’est plus disponible, ou une proposition est déjà en cours.' : apiErrorMessage(e, 'La proposition n’a pas pu être envoyée.') }
  } finally {
    busyId.value = null
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
