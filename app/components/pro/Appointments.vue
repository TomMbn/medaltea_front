<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filtrer les rendez-vous">
      <button
        v-for="f in filters"
        :key="f.id"
        class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
        :class="filter === f.id ? 'bg-[#156F71] text-white border-[#156F71]' : 'border-gray-300 hover:border-[#156F71]'"
        @click="filter = f.id"
      >
        {{ f.label }}<template v-if="counts[f.id]"> ({{ counts[f.id] }})</template>
      </button>
    </div>

    <p v-if="status === 'pending'" class="text-sm text-gray-500">Chargement…</p>
    <p v-else-if="error" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">{{ apiErrorMessage(error, 'Impossible de charger les rendez-vous.') }}</p>
    <p v-else-if="!shown.length" class="text-sm text-gray-500 bg-[#e0ecf2]/60 rounded-xl p-4">Aucun rendez-vous dans cette catégorie.</p>

    <ul v-else class="grid gap-3">
      <li v-for="a in shown" :key="a.id" class="rounded-xl border border-gray-200 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-bold">{{ formatLongDate(a.startAt) }}</p>
            <p class="text-sm mt-1">
              {{ a.patientName || 'Patient' }}<span v-if="a.isGuest" class="ml-2 rounded-full bg-[#e0ecf2] px-2 py-0.5 text-xs font-semibold text-[#156F71]">Sans compte</span><template v-if="a.patientContact"> · {{ a.patientContact }}</template>
            </p>
            <p v-if="a.typeName" class="text-sm text-gray-500 mt-0.5">
              {{ a.typeName }}<template v-if="a.durationMin"> · {{ a.durationMin }} min</template><template v-if="a.mode"> · {{ a.mode === 'visio' ? 'Visio' : 'Au cabinet' }}</template>
            </p>
            <p v-if="a.userNote" class="text-sm mt-2 bg-[#e0ecf2]/60 rounded-lg px-3 py-2">
              <span class="font-semibold">Motif :</span> {{ a.userNote }}
            </p>
          </div>
          <span class="text-xs font-semibold rounded-full px-3 py-1" :class="STATUS_STYLES[a.status]">{{ STATUS_LABELS[a.status] || a.status }}</span>
        </div>

        <!-- Actions -->
        <div v-if="actionsFor(a).length" class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="act in actionsFor(a)"
            :key="act.status"
            class="text-xs font-bold px-3 py-2 rounded-[10px] transition-colors disabled:opacity-50"
            :class="act.danger ? 'border border-red-300 text-red-700 hover:bg-red-50' : 'bg-[#012828] text-white hover:bg-[#156F71]'"
            :disabled="busyId === a.id"
            @click="act.danger ? ask(a, act) : apply(a, act.status)"
          >
            {{ act.label }}
          </button>
        </div>

        <div v-if="pendingAction?.id === a.id" class="mt-3 border-t border-gray-100 pt-3">
          <label :for="`pro-reason-${a.id}`" class="block text-sm font-semibold mb-1">Motif <span class="font-normal text-gray-500">(facultatif, transmis au patient)</span></label>
          <input :id="`pro-reason-${a.id}`" v-model="reason" maxlength="200" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#156F71]" />
          <div class="flex gap-2 mt-3">
            <button class="bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-[10px] disabled:opacity-50" :disabled="busyId === a.id" @click="apply(a, pendingAction.status, reason)">Confirmer</button>
            <button class="text-xs px-3 py-2 rounded-[10px] border border-gray-300" @click="pendingAction = null">Retour</button>
          </div>
        </div>
        <p v-if="errors[a.id]" class="text-sm text-red-700 mt-2" role="alert">{{ errors[a.id] }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data, status, error, refresh } = await useAsyncData(
  'pro-appointments',
  () => $fetch('/api/backend/praticiens/me/appointments'),
  { server: false, default: () => [] },
)

const all = computed(() => normalizeAppointments(data.value).sort((a, b) => a.startAt.localeCompare(b.startAt)))
const filters = [
  { id: 'todo', label: 'À traiter' },
  { id: 'upcoming', label: 'À venir' },
  { id: 'history', label: 'Historique' },
]
const filter = ref('todo')

const bucket = (a) => {
  if (a.status === 'pending' && !isPast(a)) return 'todo'
  if (a.status === 'confirmed' && !isPast(a)) return 'upcoming'
  // Un rendez-vous confirmé dont la date est passée reste à clôturer (terminé / absent).
  if (a.status === 'confirmed' || a.status === 'pending') return 'todo'
  return 'history'
}
const counts = computed(() => {
  const c = { todo: 0, upcoming: 0, history: 0 }
  for (const a of all.value) c[bucket(a)]++
  return c
})
const shown = computed(() => {
  const list = all.value.filter(a => bucket(a) === filter.value)
  return filter.value === 'history' ? [...list].reverse() : list
})

function actionsFor(a) {
  if (a.status === 'pending') {
    return [
      ...(isPast(a) ? [] : [{ status: 'confirmed', label: 'Confirmer' }]),
      { status: 'cancelled_by_praticien', label: 'Refuser', danger: true },
    ]
  }
  if (a.status === 'confirmed') {
    return isPast(a)
      ? [{ status: 'completed', label: 'Marquer comme terminé' }, { status: 'no_show', label: 'Patient absent', danger: true }]
      : [{ status: 'cancelled_by_praticien', label: 'Annuler', danger: true }]
  }
  return []
}

const busyId = ref(null)
const errors = ref({})
const pendingAction = ref(null)
const reason = ref('')

function ask(a, act) {
  // « Patient absent » n'a pas besoin de motif ; les annulations en proposent un.
  if (act.status === 'no_show') return apply(a, act.status)
  pendingAction.value = { id: a.id, status: act.status }
  reason.value = ''
}

async function apply(a, newStatus, motif) {
  busyId.value = a.id
  errors.value = { ...errors.value, [a.id]: '' }
  try {
    await $fetch(`/api/backend/appointments/${a.id}/status`, {
      method: 'PATCH',
      body: { status: newStatus, reason: (motif || '').trim() || undefined },
    })
    pendingAction.value = null
    await refresh()
  } catch (e) {
    errors.value = { ...errors.value, [a.id]: apiErrorMessage(e, 'Le changement de statut a échoué.') }
  } finally {
    busyId.value = null
  }
}
</script>
