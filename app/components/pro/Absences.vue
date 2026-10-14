<template>
  <div class="grid gap-10 lg:grid-cols-5">
    <!-- Nouvelle absence -->
    <section class="lg:col-span-3" aria-labelledby="new-absence-title">
      <h2 id="new-absence-title" class="font-unbounded font-bold text-lg mb-4">Déclarer une absence</h2>

      <div class="grid gap-6 sm:grid-cols-2">
        <ProRangeCalendar v-model:start="start" v-model:end="end" :marked="markedDays" :closed-weekdays="closedWeekdays" />

        <form class="grid gap-4 content-start" @submit.prevent="add">
          <div>
            <p class="text-sm font-semibold mb-2">Motif</p>
            <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Motif de l'absence">
              <button v-for="r in ABSENCE_REASONS" :key="r" type="button" role="radio" :aria-checked="reason === r" class="chip" :class="reason === r ? 'chip-on' : ''" @click="reason = r">{{ r }}</button>
            </div>
            <input v-if="reason === 'Autre'" v-model="customReason" maxlength="60" class="field mt-2" placeholder="Précisez (facultatif)" aria-label="Précisez le motif" />
          </div>

          <label class="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
            <input v-model="allDay" type="checkbox" class="accent-[#156F71]" />
            Journée entière
          </label>
          <div v-if="!allDay" class="flex items-center gap-2 text-sm">
            <input v-model="startTime" type="time" class="field" aria-label="Heure de début" /> <span aria-hidden="true">→</span> <input v-model="endTime" type="time" class="field" aria-label="Heure de fin" />
          </div>

          <div class="rounded-xl bg-[#e0ecf2]/60 px-4 py-3 text-sm min-h-[3.25rem]" aria-live="polite">
            <template v-if="!start">Cliquez sur un jour du calendrier pour commencer.</template>
            <template v-else-if="!end">Du <strong>{{ formatDay(start) }}</strong>. Cliquez sur le dernier jour, ou validez pour une seule journée.</template>
            <template v-else><strong>{{ summary }}</strong></template>
          </div>

          <div v-if="conflicts.length" class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm" role="alert">
            <p class="font-semibold text-amber-900">
              {{ conflicts.length }} rendez-vous déjà prévu{{ conflicts.length > 1 ? 's' : '' }} sur cette période
            </p>
            <ul class="mt-1 text-xs text-amber-900/80 list-disc pl-4">
              <li v-for="a in conflicts.slice(0, 3)" :key="a.id">{{ formatLongDate(a.startAt) }} — {{ a.patientName || 'Patient' }}</li>
            </ul>
            <p class="text-xs mt-2 text-amber-900/80">Ils ne sont pas annulés automatiquement : pensez à les <NuxtLink to="/pro/rendez-vous" class="underline">traiter</NuxtLink>.</p>
          </div>

          <p v-if="error" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">{{ error }}</p>

          <button class="bg-[#012828] text-white text-sm font-bold px-6 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50" :disabled="!start || busy">
            {{ busy ? 'Enregistrement…' : 'Ajouter l\'absence' }}
          </button>
        </form>
      </div>
    </section>

    <!-- Absences à venir -->
    <section class="lg:col-span-2" aria-labelledby="upcoming-absences-title">
      <h2 id="upcoming-absences-title" class="font-unbounded font-bold text-lg mb-4">Absences à venir</h2>
      <p v-if="listError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mb-3" role="alert">{{ listError }}</p>
      <p v-if="!absences.length" class="text-sm text-gray-500 bg-[#e0ecf2]/60 rounded-xl p-4">Aucune absence prévue. Vos créneaux sont ouverts selon vos horaires.</p>
      <ul v-else class="grid gap-2">
        <li v-for="a in absences" :key="a.id" class="rounded-xl border border-gray-200 px-4 py-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold">{{ a.label }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ a.duration }}</p>
            </div>
            <span v-if="a.reason" class="text-xs font-semibold rounded-2xl px-2.5 py-1 max-w-[45%] break-words text-center" :class="reasonStyle(a.reason)">{{ a.reason }}</span>
          </div>
          <div class="mt-2 text-xs">
            <template v-if="confirming === a.id">
              <span class="mr-2">Supprimer cette absence ?</span>
              <button class="font-bold text-red-700 underline mr-3" @click="remove(a)">Oui, supprimer</button>
              <button class="underline" @click="confirming = null">Non</button>
            </template>
            <button v-else class="underline text-red-700" @click="confirming = a.id">Supprimer</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data: rawAbs, refresh: refreshAbs, error: absLoadError } = await useAsyncData('pro-absences', () => $fetch('/api/backend/praticiens/me/unavailabilities'), { server: false, default: () => [] })
const { data: hours } = await useAsyncData('pro-hours', () => $fetch('/api/backend/praticiens/me/availabilities'), { server: false, default: () => [] })
const { data: rawAppts } = await useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, default: () => [] })

const start = ref('')
const end = ref('')
const allDay = ref(true)
const startTime = ref('09:00')
const endTime = ref('18:00')
const reason = ref('Congés')
const customReason = ref('')
const busy = ref(false)
const error = ref('')
const confirming = ref(null)
const listError = computed(() => (absLoadError.value ? apiErrorMessage(absLoadError.value, 'Impossible de charger vos absences.') : ''))

const lastDay = computed(() => end.value || start.value)

// --- Jours fermés dans la semaine type (grisés dans le calendrier)
const closedWeekdays = computed(() => {
  const open = new Set((Array.isArray(hours.value) ? hours.value : []).map(h => h.dayOfWeek))
  return open.size ? DAYS.map(d => d.n).filter(n => !open.has(n)) : []
})

// --- Absences existantes
const isMidnight = (iso) => formatTime(iso) === '00:00'
const absences = computed(() =>
  (Array.isArray(rawAbs.value) ? rawAbs.value : [])
    .filter(a => a?.id != null && a.startAt && a.endAt)
    .map((a) => {
      const wholeDays = isMidnight(a.startAt) && isMidnight(a.endAt)
      const first = dayKey(a.startAt)
      const last = wholeDays ? addDays(dayKey(a.endAt), -1) : dayKey(a.endAt)
      const days = dayDiff(first, last) + 1
      const label = wholeDays
        ? (days <= 1 ? formatDay(first, true) : `${formatDay(first)} → ${formatDay(last, true)}`)
        : `${formatDay(first)} ${formatTime(a.startAt)} → ${first === last ? '' : formatDay(last) + ' '}${formatTime(a.endAt)}`
      return { id: a.id, reason: a.reason || '', label, first, last, startAt: a.startAt, endAt: a.endAt, duration: wholeDays ? `${days} jour${days > 1 ? 's' : ''}` : 'Quelques heures' }
    })
    .sort((a, b) => a.startAt.localeCompare(b.startAt)),
)

const markedDays = computed(() => {
  const set = new Set()
  for (const a of absences.value) {
    let d = a.first
    for (let i = 0; i < 400 && d <= a.last; i++) { set.add(d); d = addDays(d, 1) }
  }
  return set
})

const reasonStyle = (r) => ({
  'Congés': 'bg-sky-100 text-sky-800',
  'Formation': 'bg-violet-100 text-violet-800',
  'Maladie': 'bg-rose-100 text-rose-800',
}[r] || 'bg-gray-100 text-gray-700')

// --- Nouvelle absence
const range = computed(() => {
  if (!start.value) return null
  return allDay.value
    ? { startAt: parisISO(start.value, '00:00'), endAt: parisISO(addDays(lastDay.value, 1), '00:00') }
    : { startAt: parisISO(start.value, startTime.value || '00:00'), endAt: parisISO(lastDay.value, endTime.value || '23:59') }
})

const summary = computed(() => {
  if (!start.value) return ''
  const days = dayDiff(start.value, lastDay.value) + 1
  const when = days <= 1 ? `Le ${formatDay(start.value)}` : `Du ${formatDay(start.value)} au ${formatDay(lastDay.value)} (${days} jours)`
  return allDay.value ? when : `${when}, de ${startTime.value} à ${endTime.value}`
})

const conflicts = computed(() => {
  if (!range.value) return []
  const from = Date.parse(range.value.startAt)
  const to = Date.parse(range.value.endAt)
  return normalizeAppointments(rawAppts.value).filter((a) => {
    if (!isActiveStatus(a.status)) return false
    const t = Date.parse(a.startAt)
    return t >= from && t < to
  })
})

async function add() {
  error.value = ''
  if (!range.value) return
  if (!(Date.parse(range.value.startAt) < Date.parse(range.value.endAt))) { error.value = "L'heure de fin doit être après l'heure de début."; return }
  busy.value = true
  try {
    const motif = reason.value === 'Autre' ? (customReason.value.trim() || 'Autre') : reason.value
    await $fetch('/api/backend/praticiens/me/unavailabilities', { method: 'POST', body: { ...range.value, reason: motif } })
    start.value = ''
    end.value = ''
    customReason.value = ''
    await refreshAbs()
  } catch (e) {
    error.value = apiErrorMessage(e, "Impossible d'ajouter cette absence.")
  } finally { busy.value = false }
}

async function remove(a) {
  try {
    await $fetch(`/api/backend/praticiens/me/unavailabilities/${a.id}`, { method: 'DELETE' })
    confirming.value = null
    await refreshAbs()
  } catch (e) {
    confirming.value = null
    error.value = apiErrorMessage(e, 'Suppression impossible.')
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.chip { font-size: 0.8rem; font-weight: 600; border: 1px solid #d1d5db; border-radius: 9999px; padding: 0.4rem 0.9rem; }
.chip:hover { border-color: #156F71; }
.chip-on { background: #156F71; color: #fff; border-color: #156F71; }
.field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.65rem; padding: 0.5rem 0.7rem; font-size: 0.875rem; }
.field:focus { outline: none; border-color: #156F71; }
</style>
