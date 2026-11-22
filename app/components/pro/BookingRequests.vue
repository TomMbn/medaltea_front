<template>
  <section class="flex flex-col gap-4" aria-labelledby="pre-signup-title">
    <div class="flex flex-col gap-1 leading-[normal]">
      <h2 id="pre-signup-title" class="font-unbounded font-normal text-[20px] text-vert-900">Demandes reçues avant votre inscription</h2>
      <p class="text-[16px] text-neutre-600">Ces patients vous ont indiqué leurs disponibilités. Pour accepter, choisissez l’horaire : le rendez-vous est confirmé et le patient prévenu.</p>
    </div>

    <div class="flex flex-col xl:flex-row gap-5 items-start">
      <!-- Liste -->
      <ul class="w-full xl:w-[560px] xl:shrink-0 flex flex-col gap-[10px]" aria-label="Demandes reçues avant votre inscription">
        <li v-for="r in requests" :key="r.id">
          <button type="button" class="w-full flex items-center gap-5 rounded-[20px] bg-white px-5 py-[14px] text-left border-2 transition-colors" :class="selected?.id === r.id ? 'border-vert-600' : 'border-transparent hover:border-bleu-100'" :aria-pressed="selected?.id === r.id" @click="select(r)">
            <span class="w-11 h-11 shrink-0 rounded-full bg-bleu-100 flex items-center justify-center text-[15px] font-medium text-vert-900" aria-hidden="true">{{ initialsOf(nameOf(r)) }}</span>
            <span class="flex-1 min-w-0 leading-[normal]">
              <span class="block text-[18px] font-semibold text-vert-900 truncate">{{ nameOf(r) }}</span>
              <span class="block text-[16px] text-neutre-600 truncate">{{ slotsSummary(r) }}</span>
            </span>
            <span class="shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] bg-corail-100 text-corail-700">À planifier</span>
          </button>
        </li>
      </ul>

      <!-- Détail -->
      <section v-if="selected" ref="detailRef" class="w-full xl:flex-1 min-w-0 rounded-[28px] bg-white p-6 sm:p-8 flex flex-col gap-5" aria-label="Détail de la demande">
        <div class="flex flex-wrap items-center gap-4">
          <span class="w-16 h-16 shrink-0 rounded-full bg-bleu-100 flex items-center justify-center text-[20px] font-medium text-vert-900" aria-hidden="true">{{ initialsOf(nameOf(selected)) }}</span>
          <div class="flex-1 min-w-[200px] leading-[normal]">
            <h3 class="font-unbounded font-normal text-[22px] sm:text-[26px] text-vert-900 break-words">{{ nameOf(selected) }}</h3>
            <p v-if="selected.expiresAt" class="mt-[2px] text-[16px] sm:text-[18px] text-neutre-600">Sans réponse avant le {{ formatLongDate(selected.expiresAt) }}, la demande expire.</p>
          </div>
        </div>

        <div class="flex flex-col gap-2 leading-[normal]">
          <p class="text-[16px] font-medium text-vert-900">Disponibilités du patient</p>
          <ul class="flex flex-col gap-1 text-[18px] text-vert-900">
            <li v-for="(s, i) in selected.preferredSlots" :key="i" class="flex items-center gap-[10px]"><CalendarDays :size="18" class="shrink-0" aria-hidden="true" /> {{ capital(slotLabel(s)) }}</li>
          </ul>
        </div>

        <div v-if="selected.userNote" class="rounded-[28px] bg-bleu-50 p-6 flex flex-col gap-2">
          <h4 class="font-unbounded font-normal text-[20px] leading-[normal] text-vert-900">Motif indiqué par le patient</h4>
          <p class="text-[18px] text-vert-900 whitespace-pre-line break-words">{{ selected.userNote }}</p>
        </div>

        <!-- Acceptation : le praticien fixe l'horaire -->
        <form v-if="mode === 'accept'" class="rounded-[20px] bg-bleu-50 p-5 flex flex-col gap-4" @submit.prevent="accept(selected)">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label :for="`req-date-${selected.id}`" class="text-[16px] font-medium text-vert-900">Date</label>
              <input :id="`req-date-${selected.id}`" v-model="form.date" type="date" :min="todayYmd" required class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px] focus:outline-none focus:border-vert-600" />
            </div>
            <div class="flex flex-col gap-2">
              <label :for="`req-time-${selected.id}`" class="text-[16px] font-medium text-vert-900">Heure</label>
              <input :id="`req-time-${selected.id}`" v-model="form.time" type="time" required class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px] focus:outline-none focus:border-vert-600" />
            </div>
            <div class="flex flex-col gap-2">
              <label :for="`req-type-${selected.id}`" class="text-[16px] font-medium text-vert-900">Prestation <span class="font-normal text-neutre-600">(facultatif)</span></label>
              <select :id="`req-type-${selected.id}`" v-model="form.typeId" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px]" @change="applyTypeDuration">
                <option value="">Aucune</option>
                <option v-for="t in activeTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label :for="`req-duration-${selected.id}`" class="text-[16px] font-medium text-vert-900">Durée <span class="font-normal text-neutre-600">(minutes)</span></label>
              <input :id="`req-duration-${selected.id}`" v-model.number="form.durationMin" type="number" :min="ACCEPT_DURATION_MIN" :max="ACCEPT_DURATION_MAX" required class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px] focus:outline-none focus:border-vert-600" />
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-full bg-vert-900 text-white px-6 min-h-[44px] text-[16px] font-semibold disabled:opacity-50" :disabled="busyId === selected.id">Confirmer le rendez-vous</button>
            <button type="button" class="rounded-full border border-neutre-300 px-6 min-h-[44px] text-[16px]" @click="mode = null">Retour</button>
          </div>
        </form>

        <!-- Refus : motif facultatif, transmis au patient -->
        <div v-if="mode === 'decline'" class="rounded-[20px] bg-bleu-50 p-5 flex flex-col gap-3">
          <label :for="`req-reason-${selected.id}`" class="text-[16px] font-medium text-vert-900">Motif <span class="font-normal text-neutre-600">(facultatif, transmis au patient)</span></label>
          <input :id="`req-reason-${selected.id}`" v-model="reason" :maxlength="DECLINE_REASON_MAX" class="w-full rounded-[12px] border border-neutre-300 bg-white px-4 min-h-[52px] text-[16px] focus:outline-none focus:border-vert-600" />
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-full bg-red-700 text-white px-6 min-h-[44px] text-[16px] font-semibold disabled:opacity-50" :disabled="busyId === selected.id" @click="decline(selected)">Refuser la demande</button>
            <button type="button" class="rounded-full border border-neutre-300 px-6 min-h-[44px] text-[16px]" @click="mode = null">Retour</button>
          </div>
        </div>

        <p v-if="errors[selected.id]" class="text-[16px] text-red-700" role="alert">{{ errors[selected.id] }}</p>

        <!-- Actions -->
        <div v-if="!mode" class="flex flex-wrap items-center gap-3">
          <button type="button" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors" @click="openAccept(selected)">
            Accepter
            <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </button>
          <button type="button" class="inline-flex items-center gap-2 min-h-[44px] py-1 text-[18px] font-semibold text-vert-900 hover:underline" @click="openDecline(selected)">
            Refuser la demande <ArrowUpRight :size="18" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ArrowUpRight, CalendarDays } from 'lucide-vue-next'

// Demandes en attente (forme ProBookingRequestDto) ; le parent recharge les listes après « decided »
const props = defineProps({ requests: { type: Array, required: true } })
const emit = defineEmits(['decided'])

/** Longueur maximale du motif de refus (même limite que le backend). */
const DECLINE_REASON_MAX = 255

const { types } = useProCompletion()
const activeTypes = computed(() => normalizeTypes(types.value))

const selectedId = ref(null)
const selected = computed(() => props.requests.find(r => r.id === selectedId.value) ?? props.requests[0] ?? null)
const detailRef = ref(null)
const mode = ref(null) // null | 'accept' | 'decline'
async function select(r) {
  selectedId.value = r.id
  mode.value = null
  // Sur téléphone, le détail s'affiche sous la liste : on y amène l'écran
  if (window.matchMedia('(max-width: 1279px)').matches) { await nextTick(); detailRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const nameOf = (r) => [r.patient?.firstName, r.patient?.lastName].filter(Boolean).join(' ') || 'Patient'
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
const slotsSummary = (r) => (r.preferredSlots ?? []).map(s => capital(slotLabel(s))).join(' · ') || 'Demande de rendez-vous'
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const todayYmd = ymd(new Date())

const busyId = ref(null)
const errors = ref({})
const setError = (id, msg) => { errors.value = { ...errors.value, [id]: msg } }

// ---------- Acceptation
const form = ref({ date: '', time: '', durationMin: ACCEPT_DURATION_DEFAULT, typeId: '' })
function openAccept(r) {
  // Date proposée : la première disponibilité du patient encore à venir
  const firstDay = (r.preferredSlots ?? []).map(s => s.date).find(d => d >= todayYmd) ?? ''
  form.value = { date: firstDay, time: '', durationMin: ACCEPT_DURATION_DEFAULT, typeId: '' }
  mode.value = 'accept'
  setError(r.id, '')
}
function applyTypeDuration() {
  const type = activeTypes.value.find(t => t.id === form.value.typeId)
  if (type?.durationMin) form.value.durationMin = type.durationMin
}
async function accept(r) {
  const { date, time, durationMin, typeId } = form.value
  // Heure saisie lue dans le fuseau du navigateur, comme l'affichage des rendez-vous
  const start = new Date(`${date}T${time}`)
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) return setError(r.id, 'Choisissez une date et une heure à venir.')
  if (!Number.isInteger(durationMin) || durationMin < ACCEPT_DURATION_MIN || durationMin > ACCEPT_DURATION_MAX) {
    return setError(r.id, `La durée doit être comprise entre ${ACCEPT_DURATION_MIN} et ${ACCEPT_DURATION_MAX} minutes.`)
  }
  busyId.value = r.id
  setError(r.id, '')
  try {
    await $fetch(`/api/backend/praticiens/me/booking-requests/${r.id}/accept`, { method: 'POST', body: { startAt: start.toISOString(), durationMin, consultationTypeId: typeId || undefined } })
    mode.value = null
    emit('decided', `Rendez-vous confirmé avec ${nameOf(r)} : il figure dans « À venir ».`)
  } catch (e) {
    setError(r.id, apiErrorMessage(e, 'L’acceptation a échoué. Réessayez dans un instant.'))
  } finally {
    busyId.value = null
  }
}

// ---------- Refus
const reason = ref('')
function openDecline(r) {
  reason.value = ''
  mode.value = 'decline'
  setError(r.id, '')
}
async function decline(r) {
  busyId.value = r.id
  setError(r.id, '')
  try {
    await $fetch(`/api/backend/praticiens/me/booking-requests/${r.id}/decline`, { method: 'POST', body: { reason: reason.value.trim() || undefined } })
    mode.value = null
    emit('decided', `Demande de ${nameOf(r)} refusée : le patient est prévenu.`)
  } catch (e) {
    setError(r.id, apiErrorMessage(e, 'Le refus a échoué. Réessayez dans un instant.'))
  } finally {
    busyId.value = null
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
