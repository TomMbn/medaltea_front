<template>
  <div class="relative overflow-x-hidden bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">
    <!-- Décors -->
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden xl:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/landing/med-hypnotherapie.svg" alt="" aria-hidden="true" class="hidden xl:block absolute right-[-3%] top-[420px] w-[37%] max-w-[650px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <!-- Chargement -->
    <div v-if="status === 'pending' || status === 'idle'" class="relative pt-40 pb-40 text-center text-[18px] text-neutre-600" role="status">Chargement de votre rendez-vous…</div>

    <!-- Rendez-vous introuvable -->
    <div v-else-if="!appointment" class="relative mx-auto w-[calc(100%-2rem)] max-w-[640px] pt-40 pb-40 text-center">
      <h1 class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] text-vert-900">Rendez-vous introuvable</h1>
      <p class="mt-5 text-[18px] text-neutre-600 leading-snug">Nous ne retrouvons pas ce rendez-vous. Il est peut-être déjà dans votre liste.</p>
      <NuxtLink to="/mes-rendez-vous" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
        Voir mes rendez-vous
        <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
      </NuxtLink>
    </div>

    <template v-else>
      <section class="relative pt-32 lg:pt-[170px] pb-14 lg:pb-[88px]" aria-labelledby="confirm-title">
        <div class="mx-auto w-[calc(100%-2rem)] max-w-[1328px] flex flex-col items-center text-center">
          <span class="w-20 h-20 lg:w-[104px] lg:h-[104px] rounded-full bg-vert-600 text-white flex items-center justify-center" aria-hidden="true"><Check class="w-9 h-9 lg:w-10 lg:h-10" :stroke-width="1.5" /></span>
          <h1 id="confirm-title" class="mt-6 lg:mt-[26px] font-unbounded font-normal text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.23] text-vert-900">{{ confirmed ? 'C’est confirmé !' : 'Demande envoyée !' }}</h1>
          <p class="mt-4 lg:mt-[17px] text-[18px] lg:text-[24px] leading-snug lg:leading-none text-neutre-600 max-w-[828px]">
            <template v-if="confirmed">Votre rendez-vous est enregistré. Retrouvez-le dans « Mes rendez-vous ».</template>
            <template v-else>Le praticien doit encore accepter votre demande : suivez sa réponse dans « Mes rendez-vous ».</template>
          </p>

          <!-- Récapitulatif -->
          <div class="mt-10 lg:mt-[60px] w-full max-w-[591px] bg-white rounded-[20px] shadow-douce p-5 lg:p-6 flex items-center gap-4 lg:gap-6 text-left">
            <img v-if="photo && !photoFailed" :src="photo" alt="" width="64" height="64" referrerpolicy="no-referrer" class="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover shrink-0 bg-bleu-50" style="animation: none;" @error="photoFailed = true" />
            <span v-else class="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-vert-600 text-white flex items-center justify-center font-unbounded text-[20px] shrink-0" aria-hidden="true">{{ initials }}</span>
            <div class="min-w-0 leading-[normal]">
              <p class="text-[17px] lg:text-[18px] font-semibold text-vert-900">{{ appointment.praticienName }}<template v-if="specialityName"> · {{ specialityName }}</template></p>
              <p class="mt-0.5 text-[15px] lg:text-[16px] text-neutre-600">{{ whenLabel }}<template v-if="where"> · {{ where }}</template></p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3 lg:gap-3">
            <a v-if="confirmed" :href="`/api/backend/appointments/${appointment.id}/ics`" download class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
              Ajouter à mon agenda
              <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </a>
            <a v-if="where && appointment.mode !== 'visio'" :href="directionsUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-[14px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-white/60 transition-colors">
              Itinéraire Google Maps
              <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </a>
            <NuxtLink to="/mes-rendez-vous" class="inline-flex items-center gap-2 min-h-[48px] px-3 text-vert-900 font-semibold text-[18px] hover:underline">
              Modifier ou annuler <ArrowUpRight :size="18" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>

        <!-- Mascotte -->
        <img src="/images/chatbot-mascotte-accueil.webp" alt="" aria-hidden="true" width="254" height="300" class="hidden xl:block absolute right-[14%] bottom-[-140px] w-[254px] h-auto z-10 pointer-events-none select-none" style="animation: none;" />
      </section>

      <!-- Préparer sa séance -->
      <section class="relative bg-vert-600 overflow-hidden py-14 lg:py-[90px]" aria-labelledby="prepare-title">
        <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[3.5%] top-[60px] w-[11%] opacity-50" style="animation: none;" />
        <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[1%] top-[180px] w-[13.5%] opacity-50" style="animation: none;" />
        <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px]">
          <h2 id="prepare-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] leading-[normal] text-white">Préparez votre séance</h2>
          <ul class="mt-8 lg:mt-[40px] flex flex-wrap gap-x-[60px] gap-y-4">
            <li v-for="tip in tips" :key="tip" class="flex items-center gap-[10px] text-[18px] lg:text-[20px] text-white leading-[normal]">
              <span class="w-7 h-7 rounded-full bg-white text-vert-600 flex items-center justify-center shrink-0"><Check :size="14" aria-hidden="true" /></span>
              {{ tip }}
            </li>
          </ul>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check, ArrowUpRight } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Rendez-vous confirmé — Léya', robots: 'noindex, nofollow' })

const route = useRoute()
const id = Number(route.query.id)

// Données privées : chargées côté navigateur uniquement (jamais dans le HTML rendu côté serveur).
const { data, status } = await useAsyncData(
  `appointment-confirmation-${id}`,
  () => $fetch('/api/backend/appointments/me'),
  { server: false, default: () => [] },
)
const appointment = computed(() => normalizeAppointments(data.value).find(a => a.id === id) ?? null)
const confirmed = computed(() => appointment.value?.status === 'confirmed')

// Fiche publique du praticien : photo et spécialité
const { data: praticien } = await useAsyncData(
  `appointment-confirmation-praticien-${id}`,
  async () => {
    const pid = appointment.value?.praticienId
    return pid ? await $fetch(`/api/backend/praticiens/${pid}`).catch(() => null) : null
  },
  { server: false, watch: [appointment] },
)
const specialityName = computed(() => praticien.value?.specialities?.[0]?.name ?? '')
const photoFailed = ref(false)
const photo = computed(() => { try { return new URL(praticien.value?.photoThumbUrl || praticien.value?.photoUrl).protocol === 'https:' ? (praticien.value.photoThumbUrl || praticien.value.photoUrl) : '' } catch { return '' } })
const initials = computed(() => (appointment.value?.praticienName || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase())

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const whenLabel = computed(() => {
  if (!appointment.value) return ''
  const d = new Date(appointment.value.startAt)
  const day = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  const time = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(d)
  return `${capitalize(day)} · ${time}`
})
const where = computed(() => {
  const a = appointment.value
  if (!a) return ''
  if (a.mode === 'visio') return 'En visio'
  return [a.praticienAddress, a.praticienCity].filter(Boolean).join(', ')
})
const directionsUrl = computed(() => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(where.value)}`)

const tips = ['Une tenue confortable', 'Vos examens récents', 'Vos questions notées']
</script>
