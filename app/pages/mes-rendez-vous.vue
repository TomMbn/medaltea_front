<template>
  <div class="relative overflow-x-clip bg-bleu-50 min-h-screen text-vert-900">
    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pt-28 lg:pt-[160px] pb-20 lg:pb-[96px]">
      <h1 class="font-unbounded font-normal text-[28px] sm:text-[32px] leading-[normal]">Mes rendez-vous</h1>
      <p class="mt-2 text-[18px] leading-[normal] text-neutre-600">Vos séances à venir, passées et annulées.</p>

      <div class="mt-8 flex flex-col xl:flex-row gap-8">
        <PatientSidebar active="rdv" :me="me" />

        <div class="flex-1 min-w-0 flex flex-col gap-5">
          <!-- Onglets -->
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrer les rendez-vous">
            <button v-for="t in TABS" :key="t.key" type="button" class="chip" :class="tab === t.key ? 'chip-on' : 'chip-off'" :aria-pressed="tab === t.key" @click="tab = t.key">{{ t.label }}</button>
          </div>

          <p v-if="status === 'pending' || status === 'idle'" class="text-[18px] text-neutre-600" role="status">Chargement de vos rendez-vous…</p>
          <p v-else-if="loadError" class="rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ loadError }}</p>

          <template v-else>
            <p v-if="!appointments.length" class="rounded-[30px] bg-white p-8 text-[18px] text-neutre-600 shadow-[0_12px_16px_rgba(1,40,40,0.08)]">
              Vous n'avez pas encore de rendez-vous.
              <NuxtLink to="/trouver-un-praticien" class="underline font-semibold text-vert-600">Trouver un praticien</NuxtLink>
            </p>

            <section v-for="g in visibleGroups" :key="g.key" class="flex flex-col gap-4" :aria-labelledby="`grp-${g.key}`">
              <h2 :id="`grp-${g.key}`" class="font-unbounded font-normal text-[20px] leading-[normal]">{{ g.title }}</h2>
              <ul class="flex flex-col gap-4">
                <li v-for="a in g.items" :key="a.id" class="rounded-[30px] bg-white p-5 sm:p-7 shadow-[0_12px_16px_rgba(1,40,40,0.08)] flex flex-col gap-5">
                  <div class="flex flex-wrap sm:flex-nowrap items-start gap-4 sm:gap-6">
                    <!-- Date -->
                    <div class="w-[88px] shrink-0 rounded-[20px] py-[14px] flex flex-col items-center gap-[2px] leading-[normal]" :class="g.key === 'upcoming' ? 'bg-bleu-100' : 'bg-bleu-50'" aria-hidden="true">
                      <span class="text-[14px] font-medium tracking-[0.08em] uppercase">{{ monthOf(a.startAt) }}</span>
                      <span class="font-unbounded text-[32px]">{{ dayOf(a.startAt) }}</span>
                    </div>

                    <!-- Informations -->
                    <div class="flex-1 min-w-0 flex flex-col gap-2 leading-[normal]">
                      <p class="text-[20px] font-semibold">
                        <NuxtLink v-if="a.praticienId" :to="`/praticiens/${a.praticienId}`" class="hover:underline">{{ a.praticienName || 'Praticien' }}</NuxtLink>
                        <template v-else>{{ a.praticienName || 'Praticien' }}</template>
                      </p>
                      <p v-if="a.typeName" class="text-[16px] text-neutre-600">{{ a.typeName }}<template v-if="a.price != null"> · {{ a.price }} €</template></p>
                      <p class="flex items-center gap-[10px] text-[16px]"><Clock :size="18" class="shrink-0" aria-hidden="true" /> {{ timeOf(a.startAt) }}<template v-if="a.durationMin"> · {{ durationLabel(a.durationMin) }}</template></p>
                      <p v-if="placeOf(a)" class="flex items-center gap-[10px] text-[16px]"><MapPin :size="18" class="shrink-0" aria-hidden="true" /> <span class="min-w-0">{{ placeOf(a) }}</span></p>
                    </div>

                    <!-- Statut (au-dessus sur mobile) -->
                    <div class="max-sm:basis-full max-sm:order-first sm:order-last">
                      <span class="inline-flex items-center gap-2 rounded-full px-[14px] py-[6px] text-[16px] font-medium leading-[normal] whitespace-nowrap" :class="pillClass(a)">
                        <span class="w-2 h-2 rounded-full" :class="dotClass(a)" aria-hidden="true" />
                        {{ statusLabel(a) }}
                      </span>
                    </div>
                  </div>

                  <!-- Autre créneau proposé par le praticien -->
                  <div v-if="a.proposal && g.key === 'upcoming'" class="rounded-[20px] bg-bleu-50 p-4 sm:p-5 flex flex-col gap-3">
                    <p class="text-[18px] font-semibold leading-[normal]">Le praticien vous propose un autre créneau</p>
                    <p class="text-[16px] leading-snug">{{ longWhen(a.proposal.startAt) }}<template v-if="a.proposal.expiresAt"> · répondez avant le {{ shortWhen(a.proposal.expiresAt) }}, sinon la demande expire</template>.</p>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button type="button" :disabled="busy === a.id" class="rounded-full bg-vert-900 px-5 py-[10px] text-[16px] font-semibold text-white hover:shadow-douce transition-shadow disabled:opacity-60" @click="answerProposal(a, 'accept')">Accepter ce créneau</button>
                      <button type="button" :disabled="busy === a.id" class="text-[16px] font-medium text-vert-600 hover:underline disabled:opacity-60" @click="answerProposal(a, 'decline')">Refuser (le rendez-vous sera annulé)</button>
                    </div>
                  </div>

                  <p v-if="errorFor === a.id" class="rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-3 text-[14px] font-semibold text-[#c53030]" role="alert">{{ actionError }}</p>

                  <!-- Annulation (plus de 24 h avant la séance) -->
                  <div v-if="cancelling === a.id" class="rounded-[20px] bg-bleu-50 p-4 sm:p-5 flex flex-col gap-3">
                    <label :for="`reason-${a.id}`" class="text-[16px] font-medium leading-[normal]">Motif <span class="font-normal text-neutre-600">(facultatif, transmis au praticien)</span></label>
                    <input :id="`reason-${a.id}`" v-model="reason" maxlength="200" class="h-[52px] w-full rounded-[12px] border border-[#c8c8c8] bg-white px-4 text-[16px] focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df]" />
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button type="button" :disabled="busy === a.id" class="rounded-full bg-corail-500 px-5 py-[10px] text-[16px] font-semibold text-vert-900 disabled:opacity-60" @click="cancel(a)">{{ busy === a.id ? 'Annulation…' : 'Confirmer l\'annulation' }}</button>
                      <button type="button" class="text-[16px] font-medium text-vert-600 hover:underline" @click="cancelling = null">Retour</button>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div v-else class="flex flex-wrap items-center gap-x-3 gap-y-3">
                    <template v-if="g.key === 'upcoming'">
                      <a v-if="a.mode !== 'visio' && placeOf(a)" :href="directionsUrl(a)" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                        Itinéraire <span class="btn-secondary-dot"><ArrowUpRight :size="20" aria-hidden="true" /></span>
                      </a>
                      <a :href="`/api/backend/appointments/${a.id}/ics`" download class="btn-secondary">
                        Ajouter à mon agenda <span class="btn-secondary-dot"><ArrowUpRight :size="20" aria-hidden="true" /></span>
                      </a>
                      <button v-if="canCancel(a)" type="button" class="inline-flex items-center gap-2 px-2 py-1 text-[18px] font-semibold hover:underline" @click="startCancel(a)">Annuler le rendez-vous <ArrowUpRight :size="18" aria-hidden="true" /></button>
                      <p v-else class="text-[16px] text-neutre-600 leading-snug max-w-[420px]">Moins de 24 h avant la séance : pour annuler, contactez directement le praticien.</p>
                    </template>
                    <NuxtLink v-else-if="a.praticienId" :to="`/praticiens/${a.praticienId}`" class="btn-secondary">
                      Reprendre rendez-vous <span class="btn-secondary-dot"><ArrowUpRight :size="20" aria-hidden="true" /></span>
                    </NuxtLink>
                  </div>
                </li>
              </ul>
            </section>

            <p v-if="appointments.length && !visibleGroups.length" class="rounded-[30px] bg-white p-8 text-[18px] text-neutre-600 shadow-[0_12px_16px_rgba(1,40,40,0.08)]">Aucun rendez-vous dans cette catégorie.</p>

            <!-- Rappel annulation -->
            <div v-if="appointments.length" class="rounded-[20px] bg-bleu-100 p-5 flex items-start gap-[14px]">
              <Info :size="24" class="shrink-0" aria-hidden="true" />
              <div class="leading-[normal]">
                <p class="text-[18px] font-semibold">Annulation</p>
                <p class="mt-1 text-[16px] text-neutre-600 leading-snug">Vous pouvez annuler depuis cette page plus de 24 h avant la séance : le créneau est libéré et le praticien est prévenu. Passé ce délai, contactez directement le praticien.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight, Clock, Info, MapPin } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Mes rendez-vous — Léya', robots: 'noindex, nofollow' })

// Données privées : chargées côté navigateur uniquement (jamais dans le HTML rendu côté serveur).
// lazy : la page s'affiche tout de suite (état « Chargement… ») au lieu de bloquer la navigation
const { data, status, error, refresh } = useAsyncData(
  'my-appointments',
  () => $fetch('/api/backend/appointments/me'),
  { server: false, lazy: true, default: () => [] },
)
const { data: me } = useAsyncData('account-me-sidebar', () => $fetch('/api/backend/users/me').catch(() => null), { server: false, lazy: true })

const appointments = computed(() => normalizeAppointments(data.value).sort((a, b) => a.startAt.localeCompare(b.startAt)))
const isCancelled = (a) => a.status.startsWith('cancelled')
const isUpcoming = (a) => isActiveStatus(a.status) && !isPast(a)
const groups = computed(() => [
  { key: 'upcoming', title: 'À venir', items: appointments.value.filter(isUpcoming) },
  { key: 'past', title: 'Passés', items: appointments.value.filter(a => !isUpcoming(a) && !isCancelled(a)).reverse() },
  { key: 'cancelled', title: 'Annulés', items: appointments.value.filter(isCancelled).reverse() },
])
const TABS = [{ key: 'all', label: 'Tous' }, { key: 'upcoming', label: 'À venir' }, { key: 'past', label: 'Passés' }, { key: 'cancelled', label: 'Annulés' }]
const tab = ref('all')
const visibleGroups = computed(() => groups.value.filter(g => g.items.length && (tab.value === 'all' || tab.value === g.key)))

const loadError = computed(() => {
  if (!error.value) return ''
  if (apiStatus(error.value) === 401) {
    useSession().logout().then(() => navigateTo({ path: '/login', query: { redirect: '/mes-rendez-vous' } }))
    return ''
  }
  return apiErrorMessage(error.value, 'Impossible de charger vos rendez-vous.')
})

// ---------- Affichage (fuseau de Paris)
const fmt = (opts, iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, ...opts }).format(new Date(iso))
const monthOf = (iso) => fmt({ month: 'short' }, iso).toUpperCase()
const dayOf = (iso) => fmt({ day: 'numeric' }, iso)
const timeOf = (iso) => formatTime(iso)
const longWhen = (iso) => { const d = fmt({ weekday: 'long', day: 'numeric', month: 'long' }, iso); return `${d.charAt(0).toUpperCase()}${d.slice(1)} · ${formatTime(iso)}` }
const shortWhen = (iso) => `${fmt({ day: 'numeric', month: 'long' }, iso)} à ${formatTime(iso)}`
const durationLabel = (m) => (m >= 60 && m % 60 === 0 ? `${m / 60} h` : `${m} min`)
const placeOf = (a) => (a.mode === 'visio' ? 'En visio' : [a.praticienAddress, a.praticienCity].filter(Boolean).join(', '))
const directionsUrl = (a) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeOf(a))}`

const statusLabel = (a) => ({ pending: 'En attente', confirmed: 'Confirmé', completed: 'Terminé', no_show: 'Absent', cancelled_by_user: 'Annulé', cancelled_by_praticien: 'Annulé par le praticien' }[a.status] ?? a.status)
const pillClass = (a) => (isCancelled(a) ? 'bg-corail-100' : a.status === 'confirmed' ? 'bg-[#e7f2f0]' : a.status === 'pending' ? 'bg-white border border-bleu-300' : 'bg-bleu-100')
const dotClass = (a) => (isCancelled(a) ? 'bg-corail-500' : a.status === 'confirmed' ? 'bg-vert-600' : a.status === 'pending' ? 'bg-bleu-300' : 'bg-neutre-500')

// ---------- Actions
const cancelling = ref(null)
const reason = ref('')
const busy = ref(null)
const actionError = ref('')
const errorFor = ref(null)

// Le backend n'autorise l'annulation par le patient que plus de 24 h avant la séance
const canCancel = (a) => new Date(a.startAt).getTime() - Date.now() > 24 * 3600 * 1000

function startCancel(a) {
  cancelling.value = a.id
  reason.value = ''
  actionError.value = ''
  errorFor.value = null
}

async function cancel(a) {
  busy.value = a.id
  actionError.value = ''
  errorFor.value = null
  try {
    await $fetch(`/api/backend/appointments/${a.id}/status`, {
      method: 'PATCH',
      body: { status: 'cancelled_by_user', reason: reason.value.trim() || undefined },
    })
    cancelling.value = null
    await refresh()
  } catch (e) {
    errorFor.value = a.id
    actionError.value = apiStatus(e) === 409
      ? 'Ce rendez-vous ne peut plus être annulé ici (moins de 24 h avant la séance, ou déjà annulé). Contactez directement le praticien.'
      : apiErrorMessage(e, "L'annulation a échoué. Réessayez dans un instant.")
  } finally {
    busy.value = null
  }
}

async function answerProposal(a, answer) {
  busy.value = a.id
  actionError.value = ''
  errorFor.value = null
  try {
    await $fetch(`/api/backend/appointments/${a.id}/proposal/${answer}`, { method: 'POST' })
    await refresh()
  } catch (e) {
    errorFor.value = a.id
    actionError.value = apiStatus(e) === 409
      ? 'Cette proposition n\'est plus valable (créneau pris ou délai dépassé).'
      : apiErrorMessage(e, 'Votre réponse n\'a pas pu être enregistrée. Réessayez dans un instant.')
    await refresh()
  } finally {
    busy.value = null
  }
}
</script>

<style scoped>
.chip { border-radius: 9999px; padding: 10px 18px; font-size: 16px; font-weight: 500; line-height: normal; transition: background-color 0.15s, color 0.15s; }
.chip:focus-visible { outline: none; box-shadow: 0 0 0 4px #cde4df; }
.chip-on { background: #156f71; color: #fff; }
.chip-off { background: #fff; color: #012828; border: 1px solid #d9d9d9; }
.chip-off:hover { background: rgb(255 255 255 / 0.7); }
.btn-secondary { display: inline-flex; align-items: center; gap: 14px; min-height: 48px; border: 1.5px solid #012828; border-radius: 9999px; padding: 2.5px 2.5px 2.5px 24px; font-size: 18px; font-weight: 600; line-height: normal; color: #012828; transition: background-color 0.15s; }
.btn-secondary:hover { background: #eef5f8; }
.btn-secondary-dot { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1.5px solid #012828; border-radius: 9999px; }
</style>
