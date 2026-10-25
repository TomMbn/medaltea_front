<template>
  <div>
    <ProPageHead :title="greeting" :subtitle="dateLine" />

    <ProDuplicates />

    <ProOnboarding class="mb-5" />

    <!-- Bandeau d'accueil -->
    <section class="relative rounded-[32px] bg-vert-600 text-white px-6 sm:px-10 pt-8 sm:pt-10 pb-8 xl:pb-0 xl:h-[358px] xl:mb-[50px] mt-1 xl:mt-[22px]" aria-labelledby="dash-title">
      <div class="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none" aria-hidden="true">
        <img src="/images/footer/feuille-1.svg" alt="" class="absolute left-0 top-[90px] w-[150px] opacity-20 rotate-[15deg]" style="animation: none;" />
        <img src="/images/footer/feuille-3.svg" alt="" class="hidden lg:block absolute left-[45%] -top-[60px] w-[140px] opacity-20 -rotate-[25deg]" style="animation: none;" />
        <img src="/images/footer/feuille-5.svg" alt="" class="hidden lg:block absolute left-[67%] top-[120px] w-[160px] opacity-20 rotate-[20deg]" style="animation: none;" />
      </div>
      <img src="/images/pro/mascotte-pro.webp" alt="" aria-hidden="true" width="195" height="230" class="hidden lg:block absolute right-6 -top-10 w-[195px] h-auto rotate-[4deg] pointer-events-none select-none" style="animation: none;" />

      <div class="relative">
        <h2 id="dash-title" class="font-unbounded font-normal text-[24px] sm:text-[28px] xl:text-[32px] leading-[normal]">{{ todayTitle }}</h2>
        <p class="mt-4 text-[18px] xl:text-[20px] leading-[normal] text-bleu-100">{{ todaySub }}</p>
        <div class="mt-6 flex flex-wrap gap-[10px]">
          <NuxtLink to="/pro/agenda" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-white text-vert-900 text-[18px] font-semibold hover:shadow-douce transition-shadow">
            Voir l’agenda
            <span class="w-10 h-10 rounded-full bg-vert-900 text-white flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
          <NuxtLink to="/pro/absences" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-corail-500 text-vert-900 text-[18px] font-semibold hover:shadow-douce transition-shadow">
            Bloquer un créneau
            <span class="w-10 h-10 rounded-full bg-white text-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
        </div>

        <ul class="mt-8 xl:mt-4 flex flex-wrap gap-4 xl:gap-5">
          <li v-for="k in kpis" :key="k.label" class="w-full sm:w-[calc(50%-8px)] xl:w-[220px] rounded-[24px] bg-white text-vert-900 px-6 py-[22px] flex flex-col gap-[10px] shadow-[0_12px_16px_rgba(1,40,40,0.08)]">
            <span class="text-[16px] font-medium leading-[normal] text-neutre-600">{{ k.label }}</span>
            <span class="font-unbounded font-normal text-[32px] xl:text-[40px] leading-[normal]">{{ k.value }}</span>
            <span class="self-start rounded-full bg-corail-100 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-corail-700">{{ k.tag }}</span>
          </li>
        </ul>
      </div>

      <!-- Prochain rendez-vous -->
      <NuxtLink v-if="next" to="/pro/rendez-vous" class="hidden xl:flex absolute right-[10px] bottom-9 w-[480px] max-w-[40%] items-center gap-[14px] rounded-[24px] bg-white text-vert-900 pl-[14px] pr-[22px] py-[14px] rotate-2 shadow-[0_12px_32px_rgba(1,40,40,0.08)]">
        <span class="w-[52px] h-[52px] shrink-0 rounded-full bg-bleu-100 flex items-center justify-center font-medium">{{ initialsOf(next.patientName) }}</span>
        <span class="min-w-0 flex flex-col gap-[2px] leading-[normal]">
          <span class="text-[16px] font-medium text-vert-600">{{ nextWhen }}</span>
          <span class="text-[18px] font-semibold truncate">{{ next.patientName || 'Patient' }}<template v-if="next.typeName"> · {{ next.typeName }}</template></span>
        </span>
      </NuxtLink>
    </section>

    <!-- Ligne principale -->
    <div class="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,560fr)_minmax(0,420fr)_minmax(0,348fr)]">
      <section class="rounded-[28px] bg-white p-7 min-h-[420px] flex flex-col" aria-labelledby="week-title">
        <h2 id="week-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Activité de la semaine</h2>
        <p class="mt-3 self-start rounded-full bg-corail-100 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-corail-700">{{ weekChip }}</p>
        <div class="relative mt-6 flex-1 flex items-end justify-between gap-2 min-h-[220px]" role="img" :aria-label="weekAria">
          <div v-for="d in week" :key="d.key" class="flex flex-col items-center gap-3 flex-1">
            <div class="w-full max-w-[48px] rounded-[14px] transition-all" :class="d.today ? 'bg-corail-500' : d.max ? 'bg-vert-600' : 'bg-bleu-100'" :style="{ height: `${d.height}px` }"></div>
            <span class="text-[16px] font-medium text-neutre-600">{{ d.label }}</span>
          </div>
          <div v-if="busiest" class="hidden sm:block absolute right-0 top-0 -rotate-[4deg] rounded-[20px] bg-vert-600 text-white px-[18px] py-[14px] shadow-[0_12px_32px_rgba(1,40,40,0.08)]">
            <span class="block text-[16px] font-medium text-bleu-100">{{ busiest.long }}</span>
            <span class="block font-unbounded text-[20px]">{{ busiest.count }} séance{{ busiest.count > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </section>

      <NuxtLink to="/pro/rendez-vous" class="block rounded-[28px] bg-white p-7 min-h-[420px]" aria-labelledby="today-title">
        <h2 id="today-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Aujourd’hui</h2>
        <p v-if="!today.length" class="mt-6 text-[18px] text-neutre-600">Aucun rendez-vous aujourd’hui.</p>
        <ol v-else class="relative mt-6 flex flex-col gap-4 before:absolute before:left-[68px] before:top-3 before:bottom-3 before:w-[2px] before:bg-bleu-100">
          <li v-for="a in today" :key="a.id" class="relative flex items-center gap-4">
            <span class="w-[40px] shrink-0 text-[16px] font-medium text-neutre-600">{{ hhmm(a.startAt) }}</span>
            <span class="relative z-10 w-[14px] h-[14px] shrink-0 rounded-full" :class="a.status === 'pending' ? 'bg-corail-500' : 'bg-vert-600'"></span>
            <span class="flex-1 min-w-0 rounded-[16px] px-4 py-3 leading-[normal] text-[16px]" :class="a.status === 'pending' ? 'bg-corail-100' : 'bg-bleu-50'">
              <span class="block font-medium truncate" :class="a.status === 'pending' ? 'text-corail-700' : 'text-vert-900'">{{ a.patientName || 'Patient' }}</span>
              <span class="block text-neutre-600 truncate">{{ a.typeName || 'Rendez-vous' }}<template v-if="a.status === 'pending'"> · à confirmer</template></span>
            </span>
          </li>
        </ol>
      </NuxtLink>

      <div class="flex flex-col gap-5">
        <section class="rounded-[28px] bg-vert-600 text-white p-6 flex flex-col gap-3" aria-labelledby="req-title">
          <h2 id="req-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Demandes à confirmer</h2>
          <p v-if="!requests.length" class="text-[16px] text-bleu-100">Aucune demande en attente.</p>
          <ul v-else class="flex flex-col gap-3">
            <li v-for="a in requests" :key="a.id" class="flex items-center gap-3 rounded-[18px] bg-white text-vert-900 p-3">
              <span class="w-11 h-11 shrink-0 rounded-full bg-bleu-100 flex items-center justify-center font-medium" aria-hidden="true">{{ initialsOf(a.patientName) }}</span>
              <span class="flex-1 min-w-0 leading-[normal] text-[16px]">
                <span class="block font-medium truncate">{{ a.patientName || 'Patient' }}</span>
                <span class="block text-neutre-600 truncate">{{ shortWhen(a.startAt) }}<template v-if="a.typeName"> · {{ a.typeName }}</template></span>
              </span>
              <button type="button" class="w-[34px] h-[34px] shrink-0 rounded-full bg-vert-600 text-white flex items-center justify-center disabled:opacity-50" :disabled="busyId === a.id" :aria-label="`Confirmer le rendez-vous de ${a.patientName || 'ce patient'}`" @click="confirm(a)"><Check :size="14" aria-hidden="true" /></button>
            </li>
          </ul>
          <NuxtLink v-if="pendingAll.length > requests.length" to="/pro/rendez-vous" class="text-[16px] underline">Voir les {{ pendingAll.length }} demandes</NuxtLink>
          <p v-if="actionError" class="text-[14px] text-corail-100" role="alert">{{ actionError }}</p>
        </section>

        <section v-if="praticienId" class="rounded-[24px] bg-white p-5 shadow-[0_12px_32px_rgba(1,40,40,0.08)]" aria-labelledby="share-title">
          <h2 id="share-title" class="text-[18px] font-semibold leading-[normal]">Partager mon lien de réservation</h2>
          <p class="mt-1 text-[16px] text-neutre-600 leading-[normal]">À envoyer à vos patients ou à ajouter à votre signature.</p>
          <button type="button" class="mt-3 inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-vert-900" @click="copyLink">
            {{ copied ? 'Lien copié' : 'Copier le lien' }} <component :is="copied ? Check : Copy" :size="16" aria-hidden="true" />
          </button>
          <span class="sr-only" role="status">{{ copied ? 'Lien copié dans le presse-papiers' : '' }}</span>
        </section>
      </div>
    </div>

    <!-- Compléter la fiche -->
    <section v-if="ready && percent < 100" class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[24px] bg-corail-100 px-6 py-4">
      <span class="font-unbounded font-normal text-[26px] leading-[normal] text-corail-700">{{ percent }} %</span>
      <div class="flex-1 min-w-[220px] leading-[normal]">
        <p class="text-[18px] font-semibold text-corail-700">{{ percent >= 67 ? 'Votre fiche est presque complète' : 'Complétez votre fiche pour recevoir des rendez-vous' }}</p>
        <p class="text-[16px] text-vert-900">Il reste : {{ missing.map(m => m.label.toLowerCase()).join(', ') }}.</p>
      </div>
      <NuxtLink :to="missing[0]?.to || '/pro/fiche'" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors">
        Compléter ma fiche
        <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
      </NuxtLink>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowUpRight, Check, Copy } from 'lucide-vue-next'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Tableau de bord — Espace praticien Léya', robots: 'noindex, nofollow' })

const { praticienId } = useSession()
const { fiche, percent, missing, types, hours } = useProCompletion()
const { data: me } = useAsyncData('pro-me', () => $fetch('/api/backend/users/me'), { server: false, lazy: true, default: () => null })
const { data: raw, refresh } = useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, lazy: true, default: () => [] })
const { data: stats } = useAsyncData('pro-stats', () => $fetch('/api/backend/praticiens/me/stats').catch(() => null), { server: false, lazy: true, default: () => null })

// La date dépend du fuseau du navigateur : elle n'est calculée qu'une fois la page affichée (pas de décalage à l'hydratation)
const now = ref(null)
onMounted(() => { now.value = new Date() })
const ready = computed(() => !!now.value && Array.isArray(types.value) && Array.isArray(hours.value))

const all = computed(() => normalizeAppointments(raw.value).sort((a, b) => a.startAt.localeCompare(b.startAt)))
const live = computed(() => all.value.filter(a => a.status === 'pending' || a.status === 'confirmed'))

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const isToday = (a) => !!now.value && dayKey(new Date(a.startAt)) === dayKey(now.value)
const upcoming = (a) => new Date(a.endAt ?? a.startAt).getTime() >= (now.value?.getTime() ?? 0)

const today = computed(() => live.value.filter(isToday))
const pendingAll = computed(() => live.value.filter(a => a.status === 'pending' && upcoming(a)))
const requests = computed(() => pendingAll.value.slice(0, 3))
const next = computed(() => live.value.find(a => a.status === 'confirmed' && new Date(a.startAt).getTime() >= (now.value?.getTime() ?? Infinity)) ?? null)

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const greeting = computed(() => (me.value?.firstName ? `Bonjour ${me.value.firstName}` : 'Bonjour'))
const dateLine = computed(() => {
  if (!now.value) return ''
  const d = capital(now.value.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))
  return `${d} · ${plural(today.value.length)} aujourd’hui`
})
// « rendez-vous » est invariable
function plural(n) { return `${n === 0 ? 'Aucun' : n} rendez-vous` }
const todayTitle = computed(() => (now.value ? `${plural(today.value.length)} aujourd’hui` : 'Aujourd’hui'))
const todaySub = computed(() => {
  if (!now.value) return ''
  const n = pendingAll.value.length
  return n ? `${n} demande${n > 1 ? 's' : ''} à confirmer.` : 'Votre agenda est à jour.'
})

// Indicateurs : uniquement des chiffres réels (demandes, rendez-vous à venir, vues de la fiche)
const in7days = computed(() => live.value.filter(a => a.status === 'confirmed' && upcoming(a) && new Date(a.startAt).getTime() <= (now.value?.getTime() ?? 0) + 7 * 86400000))
const kpis = computed(() => [
  { label: 'Nouvelles demandes', value: pendingAll.value.length, tag: pendingAll.value.length ? 'À confirmer' : 'Rien à traiter' },
  { label: 'Rendez-vous à venir', value: in7days.value.length, tag: '7 prochains jours' },
  { label: 'Vues de la fiche', value: stats.value?.total ?? '–', tag: '30 derniers jours' },
])

const initialsOf = (name) => (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
const hhmm = (iso) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
const shortWhen = (iso) => `${capital(new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }))} · ${hhmm(iso)}`
const nextWhen = computed(() => {
  if (!next.value) return ''
  const d = new Date(next.value.startAt)
  return `Prochain · ${isToday(next.value) ? '' : `${capital(d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }))} · `}${hhmm(next.value.startAt)}`
})

// Activité de la semaine (lundi → dimanche), rendez-vous actifs ou terminés
const weekStart = computed(() => {
  const d = new Date(now.value ?? 0)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
})
const counted = (a) => !['cancelled_by_user', 'cancelled_by_praticien'].includes(a.status)
const countInRange = (from, to) => all.value.filter(a => counted(a) && new Date(a.startAt) >= from && new Date(a.startAt) < to).length
const week = computed(() => {
  if (!now.value) return []
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value); d.setDate(d.getDate() + i)
    const after = new Date(d); after.setDate(after.getDate() + 1)
    return { key: dayKey(d), date: d, count: countInRange(d, after), today: dayKey(d) === dayKey(now.value), label: d.toLocaleDateString('fr-FR', { weekday: 'narrow' }).toUpperCase(), long: capital(d.toLocaleDateString('fr-FR', { weekday: 'long' })) }
  })
  const max = Math.max(...days.map(d => d.count), 0)
  return days.map(d => ({ ...d, max: max > 0 && d.count === max, height: max ? Math.max(24, Math.round((d.count / max) * 200)) : 24 }))
})
const busiest = computed(() => week.value.find(d => d.max) ?? null)
const weekTotal = computed(() => week.value.reduce((n, d) => n + d.count, 0))
const weekChip = computed(() => {
  const start = weekStart.value
  const prev = new Date(start); prev.setDate(prev.getDate() - 7)
  const last = countInRange(prev, start)
  if (last > 0) {
    const pct = Math.round(((weekTotal.value - last) / last) * 100)
    return `${pct > 0 ? '+' : ''}${pct} % vs semaine dernière`
  }
  return `${plural(weekTotal.value)} cette semaine`
})
const weekAria = computed(() => week.value.map(d => `${d.long} : ${d.count}`).join(', '))

// Confirmation d'une demande
const busyId = ref(null)
const actionError = ref('')
async function confirm(a) {
  busyId.value = a.id
  actionError.value = ''
  try {
    await $fetch(`/api/backend/appointments/${a.id}/status`, { method: 'PATCH', body: { status: 'confirmed' } })
    await refresh()
  } catch (e) {
    actionError.value = apiErrorMessage(e, 'Impossible de confirmer ce rendez-vous.')
  } finally {
    busyId.value = null
  }
}

// Lien de réservation
const origin = useRequestURL().origin
const shareUrl = computed(() => `${origin}/praticiens/${fiche.value?.slug || praticienId.value}`)
const copied = ref(false)
async function copyLink() {
  try { await navigator.clipboard.writeText(shareUrl.value) } catch { /* copie impossible : rien à signaler de plus */ }
  copied.value = true
  trackEvent('pro-share-link-copied')
  setTimeout(() => { copied.value = false }, 2500)
}
</script>
