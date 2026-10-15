<template>
  <div class="relative overflow-x-clip bg-gradient-to-b from-bleu-50 to-[#e0ecf2] min-h-screen">
    <div class="relative mx-auto w-[calc(100%-2rem)] max-w-[760px] pt-32 lg:pt-[170px] pb-20 lg:pb-[120px]">
      <!-- Chargement -->
      <p v-if="status === 'pending' || status === 'idle'" class="text-center text-[18px] text-neutre-600" role="status">Chargement de votre rendez-vous…</p>

      <!-- Données effacées -->
      <div v-else-if="erased" role="status">
        <h1 class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] text-vert-900">Vos données sont effacées</h1>
        <p class="mt-4 text-[18px] leading-snug text-neutre-600">Votre prénom, nom, e-mail, téléphone et motif ont été supprimés, et ce lien ne fonctionne plus. Si le rendez-vous était à venir, il est annulé et le créneau est libéré.</p>
        <NuxtLink to="/trouver-un-praticien" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
          Trouver un praticien
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
      </div>

      <!-- Lien invalide -->
      <div v-else-if="!appointment" role="alert">
        <h1 class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] text-vert-900">Lien invalide ou expiré</h1>
        <p class="mt-4 text-[18px] leading-snug text-neutre-600">Ce lien de gestion n’est pas reconnu : il est peut-être incomplet, expiré (7 jours après le rendez-vous) ou ses données ont été effacées. Il n’est pas possible de le retrouver sans le lien d’origine.</p>
        <NuxtLink to="/trouver-un-praticien" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
          Trouver un praticien
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
      </div>

      <template v-else>
        <h1 class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] text-vert-900">{{ headline }}</h1>
        <p class="mt-4 text-[18px] leading-snug text-neutre-600">{{ explanation }}</p>

        <div class="mt-8 rounded-[20px] bg-white p-5 lg:p-6 shadow-douce flex flex-col gap-3">
          <p class="flex flex-wrap items-center gap-2 text-[18px] font-semibold leading-[normal]">
            {{ appointment.praticienName }}
            <span class="rounded-full px-3 py-1 text-[14px] font-medium" :class="STATUS_STYLES[appointment.status] ?? 'bg-bleu-50 text-vert-600'">{{ STATUS_LABELS[appointment.status] ?? appointment.status }}</span>
          </p>
          <p class="text-[18px] leading-[normal]">{{ whenLabel }}</p>
          <p v-if="where" class="text-[16px] text-neutre-600 leading-[normal]">{{ where }}</p>
          <p v-if="typeLabel" class="text-[16px] text-neutre-600 leading-[normal]">{{ typeLabel }}</p>
        </div>

        <p v-if="actionError" class="mt-6 rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ actionError }}</p>

        <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
          <a v-if="active" :href="`${base}/ics`" download class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
            Ajouter à mon agenda
            <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </a>
          <button v-if="active && !confirmCancel" type="button" class="text-[16px] font-medium text-vert-600 hover:underline" @click="confirmCancel = true">Annuler ce rendez-vous</button>
        </div>

        <!-- Confirmation d'annulation -->
        <div v-if="active && confirmCancel" class="mt-6 rounded-[20px] bg-white p-5 shadow-douce" role="alertdialog" aria-label="Confirmer l'annulation">
          <p class="text-[18px] font-semibold leading-[normal]">Annuler ce rendez-vous ?</p>
          <p class="mt-2 text-[16px] text-neutre-600 leading-snug">Le créneau sera libéré et le praticien prévenu, sans votre nom ni votre motif.</p>
          <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" :disabled="busy" class="rounded-full bg-corail-500 px-5 py-[10px] text-[16px] font-semibold text-vert-900 disabled:opacity-60" @click="cancel">{{ busy ? 'Annulation…' : 'Oui, annuler' }}</button>
            <button type="button" :disabled="busy" class="text-[16px] font-medium text-vert-600 hover:underline" @click="confirmCancel = false">Non, le garder</button>
          </div>
        </div>

        <!-- Effacement des données -->
        <div class="mt-12 border-t border-bleu-100 pt-8">
          <h2 class="font-unbounded font-normal text-[20px] leading-[normal] text-vert-900">Vos données</h2>
          <p class="mt-3 text-[16px] leading-snug text-neutre-600">Nous conservons vos informations 90 jours après le rendez-vous, puis elles sont anonymisées. Vous pouvez les effacer dès maintenant : le rendez-vous à venir est alors annulé.</p>
          <button v-if="!confirmErase" type="button" class="mt-4 text-[16px] font-medium text-vert-600 hover:underline" @click="confirmErase = true">Effacer mes données</button>
          <div v-else class="mt-4 rounded-[20px] bg-white p-5 shadow-douce" role="alertdialog" aria-label="Confirmer l'effacement">
            <p class="text-[16px] leading-snug">Cette action est définitive : ce lien cessera de fonctionner.</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="button" :disabled="busy" class="rounded-full bg-corail-500 px-5 py-[10px] text-[16px] font-semibold text-vert-900 disabled:opacity-60" @click="erase">{{ busy ? 'Effacement…' : 'Oui, effacer' }}</button>
              <button type="button" :disabled="busy" class="text-[16px] font-medium text-vert-600 hover:underline" @click="confirmErase = false">Non</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'

// Page privée accessible par lien secret : ni indexée, ni transmise en en-tête « Referer » à un autre site.
useSeoMeta({ title: 'Mon rendez-vous — Léya', robots: 'noindex, nofollow' })
useHead({ meta: [{ name: 'referrer', content: 'no-referrer' }] })

const route = useRoute()
const token = String(route.params.token ?? '')
const base = `/api/backend/appointments/guest/${token}`

// Données personnelles : chargées côté navigateur uniquement, jamais dans le HTML rendu côté serveur.
const { data, status, refresh } = await useAsyncData(`guest-appointment-${token.slice(0, 8)}`, () => $fetch(base), { server: false, default: () => null })
const appointment = computed(() => (data.value?.id != null ? normalizeAppointment(data.value) : null))
const active = computed(() => !!appointment.value && isActiveStatus(appointment.value.status) && !isPast(appointment.value))

const erased = ref(false)
const busy = ref(false)
const actionError = ref('')
const confirmCancel = ref(false)
const confirmErase = ref(false)

const headline = computed(() => ({
  pending: 'Demande en attente',
  confirmed: 'Rendez-vous confirmé',
  cancelled_by_user: 'Rendez-vous annulé',
  cancelled_by_praticien: 'Rendez-vous refusé ou annulé',
}[appointment.value?.status] ?? 'Votre rendez-vous'))
const explanation = computed(() => ({
  pending: 'Le praticien doit encore confirmer. Revenez sur cette page pour connaître sa réponse : sans réponse, la demande expire et le créneau est libéré.',
  confirmed: 'Le praticien a confirmé votre rendez-vous.',
  cancelled_by_user: 'Vous avez annulé ce rendez-vous. Le créneau a été libéré.',
  cancelled_by_praticien: appointment.value?.cancelReason ?? 'Le praticien n’a pas pu donner suite à cette demande.',
}[appointment.value?.status] ?? ''))

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const whenLabel = computed(() => {
  if (!appointment.value) return ''
  const d = new Date(appointment.value.startAt)
  const day = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  return `${capitalize(day)} · ${formatTime(appointment.value.startAt)}`
})
const where = computed(() => {
  const a = appointment.value
  if (!a) return ''
  if (a.mode === 'visio') return 'En visio'
  return [a.praticienAddress, a.praticienCity].filter(Boolean).join(', ')
})
const typeLabel = computed(() => {
  const a = appointment.value
  if (!a?.typeName) return ''
  return [a.typeName, a.durationMin ? `${a.durationMin} min` : '', a.price != null ? `${a.price} €` : ''].filter(Boolean).join(' · ')
})

async function cancel() {
  if (busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await $fetch(`${base}/cancel`, { method: 'POST' })
    confirmCancel.value = false
    await refresh()
  } catch (e) {
    actionError.value = apiStatus(e) === 409 ? 'Ce rendez-vous est déjà passé ou annulé.' : apiErrorMessage(e, 'L’annulation a échoué. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}

async function erase() {
  if (busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await $fetch(`${base}/data`, { method: 'DELETE' })
    erased.value = true
  } catch (e) {
    actionError.value = apiErrorMessage(e, 'L’effacement a échoué. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}
</script>
