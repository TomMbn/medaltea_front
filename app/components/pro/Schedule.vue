<template>
  <div class="grid gap-10">
    <!-- Horaires hebdomadaires -->
    <section aria-labelledby="hours-title">
      <h2 id="hours-title" class="font-unbounded font-bold text-lg mb-2">Horaires d'ouverture</h2>
      <p class="text-sm text-gray-600 mb-5">Vos créneaux de rendez-vous sont calculés à partir de ces plages, chaque semaine.</p>

      <p v-if="hoursError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mb-3" role="alert">{{ hoursError }}</p>

      <ul class="grid gap-2 mb-5">
        <li v-for="d in DAYS" :key="d.n" class="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-gray-200 px-4 py-3">
          <span class="w-24 text-sm font-semibold">{{ d.label }}</span>
          <span v-if="!rangesFor(d.n).length" class="text-sm text-gray-400">Fermé</span>
          <span v-for="r in rangesFor(d.n)" :key="r.id" class="inline-flex items-center gap-2 text-sm bg-[#e0ecf2] rounded-full pl-3 pr-1 py-1">
            {{ hhmm(r.startTime) }} – {{ hhmm(r.endTime) }}
            <button class="w-6 h-6 rounded-full hover:bg-white text-gray-600" :aria-label="`Supprimer la plage ${hhmm(r.startTime)}–${hhmm(r.endTime)} du ${d.label}`" @click="removeHours(r)">×</button>
          </span>
        </li>
      </ul>

      <form class="flex flex-wrap items-end gap-3" @submit.prevent="addHours">
        <div>
          <label for="h-day" class="block text-xs font-semibold mb-1">Jour</label>
          <select id="h-day" v-model.number="hDay" class="rounded-xl border border-gray-300 p-2.5 text-sm">
            <option v-for="d in DAYS" :key="d.n" :value="d.n">{{ d.label }}</option>
          </select>
        </div>
        <div>
          <label for="h-start" class="block text-xs font-semibold mb-1">De</label>
          <input id="h-start" v-model="hStart" type="time" required class="rounded-xl border border-gray-300 p-2.5 text-sm" />
        </div>
        <div>
          <label for="h-end" class="block text-xs font-semibold mb-1">À</label>
          <input id="h-end" v-model="hEnd" type="time" required class="rounded-xl border border-gray-300 p-2.5 text-sm" />
        </div>
        <button class="bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] disabled:opacity-50" :disabled="hBusy">Ajouter la plage</button>
      </form>
    </section>

    <!-- Absences -->
    <section aria-labelledby="absence-title">
      <h2 id="absence-title" class="font-unbounded font-bold text-lg mb-2">Absences</h2>
      <p class="text-sm text-gray-600 mb-5">Congés, formation… Aucun créneau n'est proposé pendant une absence.</p>

      <p v-if="absError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mb-3" role="alert">{{ absError }}</p>

      <ul v-if="absences.length" class="grid gap-2 mb-5">
        <li v-for="a in absences" :key="a.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm">
          <span>
            <span class="font-semibold">{{ formatShort(a.startAt) }} → {{ formatShort(a.endAt) }}</span>
            <span v-if="a.reason" class="text-gray-500"> · {{ a.reason }}</span>
          </span>
          <button class="text-red-700 underline" @click="removeAbsence(a)">Supprimer</button>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400 mb-5">Aucune absence prévue.</p>

      <form class="flex flex-wrap items-end gap-3" @submit.prevent="addAbsence">
        <div>
          <label for="a-start" class="block text-xs font-semibold mb-1">Du</label>
          <input id="a-start" v-model="aStart" type="datetime-local" required class="rounded-xl border border-gray-300 p-2.5 text-sm" />
        </div>
        <div>
          <label for="a-end" class="block text-xs font-semibold mb-1">Au</label>
          <input id="a-end" v-model="aEnd" type="datetime-local" required class="rounded-xl border border-gray-300 p-2.5 text-sm" />
        </div>
        <div class="flex-1 min-w-[160px]">
          <label for="a-reason" class="block text-xs font-semibold mb-1">Motif <span class="font-normal text-gray-500">(facultatif)</span></label>
          <input id="a-reason" v-model="aReason" maxlength="100" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" placeholder="Congés" />
        </div>
        <button class="bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] disabled:opacity-50" :disabled="aBusy">Ajouter l'absence</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const DAYS = [
  { n: 1, label: 'Lundi' }, { n: 2, label: 'Mardi' }, { n: 3, label: 'Mercredi' }, { n: 4, label: 'Jeudi' },
  { n: 5, label: 'Vendredi' }, { n: 6, label: 'Samedi' }, { n: 7, label: 'Dimanche' },
]
const hhmm = (t) => String(t ?? '').slice(0, 5)
const formatShort = (iso) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

// --- Horaires
const { data: hours, refresh: refreshHours } = await useAsyncData('pro-hours', () => $fetch('/api/backend/praticiens/me/availabilities'), { server: false, default: () => [] })
const rangesFor = (n) => (Array.isArray(hours.value) ? hours.value : []).filter(r => r.dayOfWeek === n).sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))

const hDay = ref(1)
const hStart = ref('09:00')
const hEnd = ref('12:00')
const hBusy = ref(false)
const hoursError = ref('')

async function addHours() {
  hoursError.value = ''
  if (hEnd.value <= hStart.value) { hoursError.value = "L'heure de fin doit être après l'heure de début."; return }
  hBusy.value = true
  try {
    await $fetch('/api/backend/praticiens/me/availabilities', { method: 'POST', body: { dayOfWeek: hDay.value, startTime: hStart.value, endTime: hEnd.value } })
    await refreshHours()
  } catch (e) {
    hoursError.value = apiErrorMessage(e, "Impossible d'ajouter cette plage (elle chevauche peut-être une plage existante).")
  } finally { hBusy.value = false }
}
async function removeHours(r) {
  hoursError.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/availabilities/${r.id}`, { method: 'DELETE' })
    await refreshHours()
  } catch (e) { hoursError.value = apiErrorMessage(e, 'Suppression impossible.') }
}

// --- Absences
const { data: abs, refresh: refreshAbs } = await useAsyncData('pro-absences', () => $fetch('/api/backend/praticiens/me/unavailabilities'), { server: false, default: () => [] })
const absences = computed(() => (Array.isArray(abs.value) ? abs.value : []).slice().sort((a, b) => String(a.startAt).localeCompare(String(b.startAt))))

const aStart = ref('')
const aEnd = ref('')
const aReason = ref('')
const aBusy = ref(false)
const absError = ref('')

async function addAbsence() {
  absError.value = ''
  const start = new Date(aStart.value)
  const end = new Date(aEnd.value)
  if (!(start < end)) { absError.value = 'La fin doit être après le début.'; return }
  aBusy.value = true
  try {
    await $fetch('/api/backend/praticiens/me/unavailabilities', {
      method: 'POST',
      body: { startAt: start.toISOString(), endAt: end.toISOString(), reason: aReason.value.trim() || undefined },
    })
    aStart.value = aEnd.value = aReason.value = ''
    await refreshAbs()
  } catch (e) {
    absError.value = apiErrorMessage(e, "Impossible d'ajouter cette absence.")
  } finally { aBusy.value = false }
}
async function removeAbsence(a) {
  absError.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/unavailabilities/${a.id}`, { method: 'DELETE' })
    await refreshAbs()
  } catch (e) { absError.value = apiErrorMessage(e, 'Suppression impossible.') }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
