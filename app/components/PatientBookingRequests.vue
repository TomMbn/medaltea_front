<template>
  <p v-if="loadError" class="rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ loadError }}</p>

  <section v-else-if="requests.length" class="flex flex-col gap-4" aria-labelledby="grp-requests">
    <h2 id="grp-requests" class="font-unbounded font-normal text-[20px] leading-[normal]">Mes demandes</h2>
    <ul class="flex flex-col gap-4">
      <li v-for="r in requests" :key="r.id" class="rounded-[30px] bg-white p-5 sm:p-7 shadow-[0_12px_16px_rgba(1,40,40,0.08)] flex flex-col gap-4">
        <div class="flex flex-wrap sm:flex-nowrap items-start gap-4 sm:gap-6">
          <div class="flex-1 min-w-0 flex flex-col gap-2 leading-[normal]">
            <p class="text-[20px] font-semibold">
              <NuxtLink v-if="r.praticien?.slug" :to="`/praticiens/${r.praticien.slug}`" class="hover:underline">{{ nameOf(r) }}</NuxtLink>
              <template v-else>{{ nameOf(r) }}</template>
            </p>
            <p class="text-[16px] text-neutre-600">Vos disponibilités :</p>
            <ul class="flex flex-col gap-1 text-[16px]">
              <li v-for="(s, i) in r.preferredSlots" :key="i" class="flex items-center gap-[10px]"><CalendarDays :size="18" class="shrink-0" aria-hidden="true" /> {{ capitalize(slotLabel(s)) }}</li>
            </ul>
            <p v-if="r.status === 'pending' && r.expiresAt" class="text-[16px] text-neutre-600">Sans réponse avant le {{ deadlineOf(r.expiresAt) }}, la demande expire.</p>
            <p v-if="r.declineReason" class="text-[16px]"><span class="font-semibold">Motif du refus :</span> {{ r.declineReason }}</p>
          </div>

          <!-- Statut (au-dessus sur mobile) -->
          <div class="max-sm:basis-full max-sm:order-first sm:order-last">
            <span class="inline-flex items-center gap-2 rounded-full px-[14px] py-[6px] text-[16px] font-medium leading-[normal]" :class="STATUS_STYLES[r.status]?.pill ?? 'bg-bleu-100'">
              <span class="w-2 h-2 rounded-full" :class="STATUS_STYLES[r.status]?.dot ?? 'bg-neutre-500'" aria-hidden="true" />
              {{ requestStatusLabel(r.status) }}
            </span>
          </div>
        </div>

        <p v-if="errorFor === r.id" class="rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-3 text-[14px] font-semibold text-[#c53030]" role="alert">{{ actionError }}</p>

        <!-- Annulation en deux temps, comme pour un rendez-vous -->
        <div v-if="r.status === 'pending' && cancelling === r.id" class="rounded-[20px] bg-bleu-50 p-4 sm:p-5 flex flex-col gap-3">
          <p class="text-[16px] font-medium leading-[normal]">Annuler cette demande ? Le praticien ne pourra plus l'accepter.</p>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" :disabled="busy === r.id" class="rounded-full bg-corail-500 px-5 py-[10px] text-[16px] font-semibold text-vert-900 disabled:opacity-60" @click="cancel(r)">{{ busy === r.id ? 'Annulation…' : 'Confirmer l\'annulation' }}</button>
            <button type="button" class="text-[16px] font-medium text-vert-600 hover:underline" @click="cancelling = null">Retour</button>
          </div>
        </div>
        <div v-else-if="r.status === 'pending'">
          <button type="button" class="inline-flex items-center gap-2 px-2 py-1 text-[18px] font-semibold hover:underline" @click="startCancel(r)">Annuler la demande <ArrowUpRight :size="18" aria-hidden="true" /></button>
        </div>
        <!-- Le rendez-vous créé à l'acceptation figure dans les groupes de la page -->
        <a v-else-if="r.status === 'accepted' && r.appointmentId" href="#grp-upcoming" class="self-start inline-flex items-center gap-2 px-2 py-1 text-[18px] font-semibold hover:underline">Voir le rendez-vous <ArrowUpRight :size="18" aria-hidden="true" /></a>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight, CalendarDays } from 'lucide-vue-next'

const STATUS_STYLES = {
  pending: { pill: 'bg-white border border-bleu-300', dot: 'bg-bleu-300' },
  accepted: { pill: 'bg-[#e7f2f0]', dot: 'bg-vert-600' },
  declined: { pill: 'bg-corail-100', dot: 'bg-corail-500' },
  cancelled: { pill: 'bg-corail-100', dot: 'bg-corail-500' },
  expired: { pill: 'bg-bleu-100', dot: 'bg-neutre-500' },
}

// Données privées : chargées côté navigateur uniquement, comme les rendez-vous de la page
const { data, error, refresh } = useAsyncData(
  'my-booking-requests',
  () => $fetch('/api/backend/booking-requests/me'),
  { server: false, lazy: true, default: () => [] },
)
const requests = computed(() => sortRequests(Array.isArray(data.value) ? data.value : []))

// Session expirée (401) : la page gère déjà la déconnexion
const loadError = computed(() => {
  if (!error.value || apiStatus(error.value) === 401) return ''
  return apiErrorMessage(error.value, 'Impossible de charger vos demandes de rendez-vous.')
})

const nameOf = (r) => [r.praticien?.firstName, r.praticien?.lastName].filter(Boolean).join(' ') || 'Praticien'
const capitalize = (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
const deadlineOf = (iso) => `${new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, day: 'numeric', month: 'long' }).format(new Date(iso))} à ${formatTime(iso)}`

// ---------- Annulation
const cancelling = ref(null)
const busy = ref(null)
const actionError = ref('')
const errorFor = ref(null)

function startCancel(r) {
  cancelling.value = r.id
  actionError.value = ''
  errorFor.value = null
}

async function cancel(r) {
  busy.value = r.id
  actionError.value = ''
  errorFor.value = null
  try {
    await $fetch(`/api/backend/booking-requests/${r.id}/cancel`, { method: 'POST' })
    cancelling.value = null
    await refresh()
  } catch (e) {
    errorFor.value = r.id
    actionError.value = apiStatus(e) === 409
      ? 'Cette demande ne peut plus être annulée : le praticien y a déjà répondu, ou elle a expiré.'
      : apiErrorMessage(e, "L'annulation a échoué. Réessayez dans un instant.")
    cancelling.value = null
    await refresh()
  } finally {
    busy.value = null
  }
}
</script>
