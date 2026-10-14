<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[900px] mx-auto pt-32 pb-8">
      <h1 class="font-unbounded font-bold text-2xl lg:text-3xl text-[#012828] mb-8">Mes rendez-vous</h1>

      <p v-if="status === 'pending'" class="text-sm text-gray-600">Chargement…</p>
      <p v-else-if="loadError" class="text-sm text-red-700 bg-red-50 rounded-xl p-4" role="alert">{{ loadError }}</p>

      <template v-else>
        <p v-if="!appointments.length" class="bg-white rounded-[20px] p-8 text-[#012828]/70 font-sans">
          Vous n'avez pas encore de rendez-vous.
          <NuxtLink to="/trouver-un-praticien" class="underline text-[#156F71]">Trouver un praticien</NuxtLink>
        </p>

        <section v-if="upcoming.length" class="mb-10" aria-labelledby="upcoming-title">
          <h2 id="upcoming-title" class="font-unbounded font-bold text-lg text-[#012828] mb-4">À venir</h2>
          <ul class="grid gap-4">
            <li v-for="a in upcoming" :key="a.id" class="bg-white rounded-[20px] shadow-sm p-5 sm:p-6 text-[#012828] font-sans">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-bold">{{ formatLongDate(a.startAt) }}</p>
                  <p class="text-sm mt-1">
                    <NuxtLink v-if="a.praticienId" :to="`/praticiens/${a.praticienId}`" class="underline">{{ a.praticienName || 'Praticien' }}</NuxtLink>
                    <template v-else>{{ a.praticienName || 'Praticien' }}</template>
                    <template v-if="a.praticienCity"> · {{ a.praticienCity }}</template>
                  </p>
                  <p v-if="a.typeName" class="text-sm text-gray-500 mt-1">
                    {{ a.typeName }}<template v-if="a.durationMin"> · {{ a.durationMin }} min</template><template v-if="a.mode"> · {{ a.mode === 'visio' ? 'Visio' : 'Au cabinet' }}</template><template v-if="a.price != null"> · {{ a.price }} €</template>
                  </p>
                  <p v-if="a.praticienAddress && a.mode !== 'visio'" class="text-sm text-gray-500">{{ a.praticienAddress }}</p>
                </div>
                <span class="text-xs font-semibold rounded-full px-3 py-1" :class="STATUS_STYLES[a.status]">{{ STATUS_LABELS[a.status] || a.status }}</span>
              </div>

              <div v-if="cancelling === a.id" class="mt-4 border-t border-gray-100 pt-4">
                <label :for="`reason-${a.id}`" class="block text-sm font-semibold mb-1">Motif <span class="font-normal text-gray-500">(facultatif)</span></label>
                <input :id="`reason-${a.id}`" v-model="reason" maxlength="200" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#156F71]" />
                <p v-if="actionError" class="text-sm text-red-700 mt-2" role="alert">{{ actionError }}</p>
                <div class="flex gap-2 mt-3">
                  <button class="bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-[10px] disabled:opacity-50" :disabled="busy" @click="cancel(a)">Confirmer l'annulation</button>
                  <button class="text-sm px-4 py-2 rounded-[10px] border border-gray-300" @click="cancelling = null">Retour</button>
                </div>
              </div>
              <button v-else class="mt-4 text-sm underline text-red-700" @click="startCancel(a)">Annuler ce rendez-vous</button>
            </li>
          </ul>
        </section>

        <section v-if="history.length" aria-labelledby="history-title">
          <h2 id="history-title" class="font-unbounded font-bold text-lg text-[#012828] mb-4">Passés et annulés</h2>
          <ul class="grid gap-3">
            <li v-for="a in history" :key="a.id" class="bg-white/70 rounded-[16px] p-4 sm:p-5 text-[#012828] font-sans flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-semibold text-sm">{{ formatLongDate(a.startAt) }}</p>
                <p class="text-sm text-gray-600">{{ a.praticienName || 'Praticien' }}<template v-if="a.typeName"> · {{ a.typeName }}</template></p>
              </div>
              <span class="text-xs font-semibold rounded-full px-3 py-1" :class="STATUS_STYLES[a.status]">{{ STATUS_LABELS[a.status] || a.status }}</span>
            </li>
          </ul>
        </section>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Mes rendez-vous — Léya', robots: 'noindex, nofollow' })

// Données privées : chargées côté navigateur uniquement (jamais dans le HTML rendu côté serveur).
const { data, status, error, refresh } = await useAsyncData(
  'my-appointments',
  () => $fetch('/api/backend/appointments/me'),
  { server: false, default: () => [] },
)

const appointments = computed(() => normalizeAppointments(data.value).sort((a, b) => a.startAt.localeCompare(b.startAt)))
const upcoming = computed(() => appointments.value.filter(a => isActiveStatus(a.status) && !isPast(a)))
const history = computed(() => appointments.value.filter(a => !(isActiveStatus(a.status) && !isPast(a))).reverse())

const loadError = computed(() => {
  if (!error.value) return ''
  if (apiStatus(error.value) === 401) {
    useSession().logout().then(() => navigateTo({ path: '/login', query: { redirect: '/mes-rendez-vous' } }))
    return ''
  }
  return apiErrorMessage(error.value, 'Impossible de charger vos rendez-vous.')
})

const cancelling = ref(null)
const reason = ref('')
const busy = ref(false)
const actionError = ref('')

function startCancel(a) {
  cancelling.value = a.id
  reason.value = ''
  actionError.value = ''
}

async function cancel(a) {
  busy.value = true
  actionError.value = ''
  try {
    await $fetch(`/api/backend/appointments/${a.id}/status`, {
      method: 'PATCH',
      body: { status: 'cancelled_by_user', reason: reason.value.trim() || undefined },
    })
    cancelling.value = null
    await refresh()
  } catch (e) {
    actionError.value = apiErrorMessage(e, "L'annulation a échoué. Réessayez dans un instant.")
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
