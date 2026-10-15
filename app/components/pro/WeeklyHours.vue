<template>
  <div>
    <!-- Modèles rapides -->
    <div class="mb-6">
      <p class="text-[16px] font-semibold mb-2">Modèles rapides</p>
      <div class="flex flex-wrap gap-2">
        <button v-for="p in PRESETS" :key="p.id" type="button" class="chip" @click="applyPreset(p)">{{ p.label }}</button>
        <button type="button" class="chip chip-ghost" @click="closeAll">Tout fermer</button>
      </div>
      <p class="text-[14px] text-neutre-600 mt-2">Un modèle remplace la semaine saisie ; vous pouvez ensuite ajuster chaque jour avant d'enregistrer.</p>
    </div>

    <p v-if="status === 'pending' && !initialized" class="text-[16px] text-neutre-600">Chargement…</p>

    <ul v-else class="grid gap-2">
      <li v-for="d in DAYS" :key="d.n" class="rounded-[16px] border px-4 py-3 transition-colors" :class="errors[d.n] ? 'border-red-300 bg-red-50/40' : 'border-bleu-100'">
        <div class="flex flex-wrap items-start gap-x-4 gap-y-2">
          <div class="flex items-center gap-3 w-40 shrink-0 pt-1">
            <button
              type="button"
              role="switch"
              :aria-checked="isOpen(d.n)"
              :aria-label="`${d.label} : ${isOpen(d.n) ? 'ouvert' : 'fermé'}`"
              class="relative w-10 h-6 rounded-full transition-colors shrink-0"
              :class="isOpen(d.n) ? 'bg-vert-600' : 'bg-neutre-200'"
              @click="toggleDay(d.n)"
            >
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" :class="isOpen(d.n) ? 'translate-x-4' : ''" />
            </button>
            <span class="text-[16px] font-semibold">{{ d.label }}</span>
          </div>

          <div class="flex-1 min-w-[230px]">
            <p v-if="!isOpen(d.n)" class="text-[16px] text-neutre-500 pt-1.5">Fermé</p>
            <template v-else>
              <ul class="grid gap-2">
                <li v-for="(r, i) in week[d.n]" :key="i" class="flex items-center gap-2">
                  <input v-model="r.start" type="time" step="300" class="time" :aria-label="`${d.label}, plage ${i + 1} : début`" />
                  <span aria-hidden="true">–</span>
                  <input v-model="r.end" type="time" step="300" class="time" :aria-label="`${d.label}, plage ${i + 1} : fin`" />
                  <button type="button" class="w-8 h-8 rounded-full hover:bg-bleu-50 text-neutre-600" :aria-label="`Supprimer la plage ${i + 1} du ${d.label}`" @click="removeRange(d.n, i)">×</button>
                </li>
              </ul>
              <div class="flex flex-wrap gap-4 mt-2 text-[14px]">
                <button type="button" class="underline" @click="addRange(d.n)">+ Ajouter une plage</button>
                <button type="button" class="underline" :aria-expanded="copyFrom === d.n" @click="openCopy(d.n)">Copier sur d'autres jours</button>
              </div>
            </template>
          </div>
        </div>

        <!-- Copier ce jour sur d'autres -->
        <div v-if="copyFrom === d.n" class="mt-3 rounded-[16px] bg-bleu-50 p-3">
          <p class="text-[14px] font-semibold mb-2">Copier les horaires du {{ d.label.toLowerCase() }} sur :</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <label v-for="o in DAYS.filter(x => x.n !== d.n)" :key="o.n" class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[14px] cursor-pointer" :class="copyTargets.includes(o.n) ? 'border-vert-600 bg-white' : 'border-neutre-300 bg-white/60'">
              <input v-model="copyTargets" type="checkbox" :value="o.n" class="accent-vert-600" />
              {{ o.short }}
            </label>
          </div>
          <div class="flex flex-wrap gap-2 text-[14px]">
            <button type="button" class="underline" @click="copyTargets = [1, 2, 3, 4, 5].filter(n => n !== d.n)">Jours ouvrés (lun–ven)</button>
            <button type="button" class="underline" @click="copyTargets = DAYS.map(x => x.n).filter(n => n !== d.n)">Tous les jours</button>
            <span class="flex-1" />
            <button type="button" class="font-bold bg-vert-900 text-white px-3 py-1.5 rounded-[8px] disabled:opacity-40" :disabled="!copyTargets.length" @click="applyCopy(d.n)">Appliquer</button>
            <button type="button" class="px-3 py-1.5 rounded-[8px] border border-neutre-300 bg-white" @click="copyFrom = null">Annuler</button>
          </div>
        </div>

        <p v-if="errors[d.n]" class="text-[14px] text-red-700 mt-2" role="alert">{{ errors[d.n] }}</p>
      </li>
    </ul>

    <p class="text-[16px] text-neutre-600 mt-4">
      Temps d'ouverture : <strong>{{ totalLabel }}</strong> par semaine
    </p>

    <!-- Barre d'enregistrement -->
    <div v-if="dirty || saved || saveError" class="sticky bottom-4 mt-6 z-10">
      <div class="rounded-2xl shadow-xl border px-4 py-3 flex flex-wrap items-center gap-3 bg-white" :class="saveError ? 'border-red-300' : 'border-bleu-100'" role="status">
        <p class="flex-1 min-w-[200px] text-[16px]" :class="saveError ? 'text-red-700' : saved && !dirty ? 'text-emerald-700' : ''">
          <template v-if="saveError">{{ saveError }}</template>
          <template v-else-if="dirty">Modifications non enregistrées</template>
          <template v-else>Horaires enregistrés.</template>
        </p>
        <template v-if="dirty">
          <button type="button" class="text-[16px] px-5 min-h-[44px] rounded-full border border-neutre-300 hover:bg-bleu-50 disabled:opacity-50" :disabled="saving" @click="reset">Annuler</button>
          <button type="button" class="text-[16px] font-semibold px-6 min-h-[44px] rounded-full bg-vert-900 text-white hover:bg-vert-600 disabled:opacity-50" :disabled="saving || hasErrors" @click="save">
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { data, status, refresh } = await useAsyncData('pro-hours', () => $fetch('/api/backend/praticiens/me/availabilities'), { server: false, default: () => [] })

const week = ref(emptyWeek())
const baseline = ref(JSON.stringify(week.value))
const initialized = ref(false)
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')
const copyFrom = ref(null)
const copyTargets = ref([])

const snapshot = () => JSON.stringify(week.value)
const dirty = computed(() => snapshot() !== baseline.value)
const errors = computed(() => validateWeek(week.value))
const hasErrors = computed(() => Object.keys(errors.value).length > 0)
const totalLabel = computed(() => formatDuration(weekTotalMinutes(week.value)))
const isOpen = (n) => week.value[n].length > 0

// Première mise à jour des horaires depuis le serveur ; ensuite le brouillon n'est écrasé qu'à la demande.
watch(
  () => status.value,
  (s) => {
    if (s === 'success' && !initialized.value) {
      week.value = weekFromServer(data.value)
      baseline.value = snapshot()
      initialized.value = true
    }
  },
  { immediate: true },
)

function touch() { saved.value = false; saveError.value = '' }

function toggleDay(n) {
  touch()
  week.value[n] = isOpen(n) ? [] : [{ start: '09:00', end: '17:00' }]
}
function addRange(n) {
  touch()
  const last = week.value[n][week.value[n].length - 1]
  // Propose une plage après la précédente (ex. après-midi après le matin).
  week.value[n].push(last ? { start: last.end, end: '' } : { start: '09:00', end: '12:00' })
}
function removeRange(n, i) { touch(); week.value[n].splice(i, 1) }
function applyPreset(p) { touch(); week.value = p.build(); copyFrom.value = null }
function closeAll() { touch(); week.value = emptyWeek(); copyFrom.value = null }

function openCopy(n) {
  copyFrom.value = copyFrom.value === n ? null : n
  copyTargets.value = []
}
function applyCopy(n) {
  touch()
  for (const t of copyTargets.value) week.value[t] = week.value[n].map(r => ({ ...r }))
  copyFrom.value = null
}

function reset() {
  week.value = weekFromServer(data.value)
  baseline.value = snapshot()
  touch()
}

async function save() {
  if (saving.value || hasErrors.value) return
  saving.value = true
  saved.value = false
  saveError.value = ''
  const failures = []
  try {
    // On compare à l'état actuel du serveur : seules les vraies différences sont envoyées,
    // et une nouvelle tentative après erreur reprend là où la précédente s'est arrêtée.
    const fresh = await $fetch('/api/backend/praticiens/me/availabilities')
    const { toDelete, toAdd } = diffWeek(fresh, week.value)

    for (const s of toDelete) {
      try { await $fetch(`/api/backend/praticiens/me/availabilities/${s.id}`, { method: 'DELETE' }) }
      catch (e) { failures.push(apiErrorMessage(e, 'Suppression impossible.')) }
    }
    for (const a of toAdd) {
      try { await $fetch('/api/backend/praticiens/me/availabilities', { method: 'POST', body: a }) }
      catch (e) { failures.push(apiErrorMessage(e, 'Ajout impossible.')) }
    }
  } catch (e) {
    failures.push(apiErrorMessage(e, 'Impossible de joindre le serveur.'))
  }

  await refresh()
  if (failures.length) {
    saveError.value = `${failures.length} modification${failures.length > 1 ? 's' : ''} non enregistrée${failures.length > 1 ? 's' : ''} : ${failures[0]} Corrigez puis réessayez.`
  } else {
    baseline.value = snapshot()
    saved.value = true
  }
  saving.value = false
}

// Avertit avant de quitter la page avec des modifications en cours.
onBeforeRouteLeave(() => {
  if (dirty.value && !window.confirm('Vous avez des modifications non enregistrées. Quitter quand même ?')) return false
})
</script>

<style scoped>
.chip { font-size: 0.8rem; font-weight: 600; border: 1px solid #d1d5db; border-radius: 9999px; padding: 0.4rem 0.9rem; transition: border-color .15s, background-color .15s; }
.chip:hover { border-color: #156F71; background: #eef5f8; }
.chip-ghost { color: #6b7280; }
.time { border: 1px solid #d1d5db; border-radius: 0.65rem; padding: 0.45rem 0.6rem; font-size: 0.875rem; }
.time:focus { outline: none; border-color: #156F71; }
</style>
