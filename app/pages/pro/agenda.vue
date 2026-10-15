<template>
  <div>
    <ProPageHead title="Agenda" :subtitle="subtitle" />

    <!-- Barre d'outils -->
    <div class="mt-[22px] flex flex-wrap items-center gap-3">
      <div class="inline-flex gap-1 rounded-full bg-white p-1" role="group" aria-label="Affichage">
        <button v-for="v in views" :key="v.id" type="button" class="rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] min-h-[40px] transition-colors" :class="view === v.id ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="view === v.id" @click="view = v.id">{{ v.label }}</button>
      </div>
      <div class="inline-flex items-center rounded-full bg-white text-[16px] font-medium text-vert-900">
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bleu-50" aria-label="Période précédente" @click="shift(-1)"><ChevronLeft :size="16" aria-hidden="true" /></button>
        <span class="px-2 leading-[normal] whitespace-nowrap">{{ rangeLabel }}</span>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bleu-50" aria-label="Période suivante" @click="shift(1)"><ChevronRight :size="16" aria-hidden="true" /></button>
      </div>
      <button v-if="!isCurrent" type="button" class="rounded-full bg-white px-4 py-[9px] min-h-[40px] text-[16px] font-medium text-vert-900 hover:bg-bleu-50" @click="goToday">Aujourd’hui</button>
      <div class="flex-1"></div>
      <NuxtLink to="/pro/absences" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors">
        Bloquer un créneau
        <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
      </NuxtLink>
    </div>

    <!-- Vue mensuelle : un clic sur un jour ouvre la vue « Jour » -->
    <section v-if="view === 'month'" class="mt-6 rounded-[28px] bg-white overflow-x-auto" aria-label="Agenda du mois">
      <div class="min-w-[760px] p-3">
        <div class="grid grid-cols-7 text-[16px] font-medium text-neutre-600" aria-hidden="true">
          <span v-for="w in WEEKDAYS" :key="w" class="px-3 py-3">{{ w }}</span>
        </div>
        <div class="grid grid-cols-7 gap-px rounded-[20px] overflow-hidden bg-bleu-100">
          <button
            v-for="c in monthCells"
            :key="c.key"
            type="button"
            class="min-h-[124px] bg-white p-2 text-left align-top flex flex-col gap-1 hover:bg-bleu-50 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vert-600"
            :class="c.inMonth ? '' : 'bg-bleu-50/60'"
            :aria-label="`${c.long}, ${c.count} rendez-vous${c.blocked ? ', créneau bloqué' : ''}`"
            @click="openDay(c.date)"
          >
            <span class="self-start rounded-full px-2 h-7 min-w-[28px] flex items-center justify-center text-[16px] font-medium leading-[normal]" :class="c.today ? 'bg-corail-100 text-corail-700' : c.inMonth ? 'text-vert-900' : 'text-neutre-500'">{{ c.day }}</span>
            <span v-for="e in c.shown" :key="e.key" class="block truncate rounded-[10px] px-2 py-[3px] text-[14px] leading-[normal]" :class="[e.bg, e.nameClass]">{{ e.label }}</span>
            <span v-if="c.more" class="px-2 text-[14px] text-neutre-600">+ {{ c.more }} autre{{ c.more > 1 ? 's' : '' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Grille -->
    <section v-else class="mt-6 rounded-[28px] bg-white overflow-x-auto" aria-label="Agenda de la période">
      <div class="relative" :style="{ minWidth: `${90 + days.length * 130}px`, height: `${64 + bodyHeight}px` }">
        <!-- En-têtes des jours -->
        <div class="absolute left-[90px] right-0 top-0 h-[64px] grid" :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }">
          <div v-for="d in days" :key="d.key" class="flex items-start justify-start pt-[14px] px-2">
            <span class="rounded-full px-2 h-8 flex items-center text-[16px] font-medium leading-[normal]" :class="d.today ? 'bg-corail-100 text-corail-700 w-full' : 'text-vert-900'">{{ d.label }}</span>
          </div>
        </div>

        <!-- Heures -->
        <template v-for="(h, i) in hours" :key="h">
          <span class="absolute left-7 text-[16px] leading-[normal] text-neutre-600" :style="{ top: `${64 + i * 70}px` }">{{ h }}h</span>
          <span class="absolute left-[90px] right-0 h-px bg-bleu-100" :style="{ top: `${64 + i * 70}px` }"></span>
        </template>

        <!-- Colonnes -->
        <div class="absolute left-[90px] right-0 grid" :style="{ top: '64px', height: `${bodyHeight}px`, gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }">
          <div v-for="d in days" :key="d.key" class="relative">
            <component
              :is="e.link ? NuxtLink : 'div'"
              v-for="e in d.events"
              :key="e.key"
              :to="e.link || undefined"
              class="absolute overflow-hidden rounded-[14px] px-3 py-2 text-[16px] leading-[normal] whitespace-nowrap flex flex-col gap-[2px]"
              :class="[e.bg, e.dashed ? 'outline outline-2 -outline-offset-2 outline-dashed outline-corail-500' : '']"
              :style="{ top: `${e.top}px`, height: `${e.height}px`, left: `calc(${e.lane} * (100% - 16px) / ${d.lanes} + 8px)`, width: `calc((100% - 16px) / ${d.lanes} - ${d.lanes > 1 ? 4 : 0}px)` }"
              :title="e.title"
            >
              <span class="font-medium truncate" :class="e.nameClass">{{ e.name }}</span>
              <span v-if="e.height >= 52" class="truncate" :class="e.subClass">{{ e.sub }}</span>
            </component>
            <!-- Heure actuelle -->
            <span v-if="d.nowTop != null" class="absolute inset-x-0 h-[2px] bg-corail-500 pointer-events-none" :style="{ top: `${d.nowTop}px` }" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Légende -->
    <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[16px] text-neutre-600">
      <li v-for="l in legend" :key="l.label" class="inline-flex items-center gap-2"><span class="w-[14px] h-[14px] rounded-[4px]" :class="l.bg"></span>{{ l.label }}</li>
    </ul>
    <p v-if="loaded && !hasAny" class="mt-4 text-[16px] text-neutre-600">Aucun rendez-vous sur cette période.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { NuxtLink } from '#components'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Agenda — Espace praticien Léya', robots: 'noindex, nofollow' })

const HOUR = 70 // hauteur d'une heure, comme la maquette
const views = [{ id: 'day', label: 'Jour' }, { id: 'week', label: 'Semaine' }, { id: 'month', label: 'Mois' }]
const view = ref('week')

const { data: raw, status } = useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, lazy: true, default: () => [] })
const { data: rawBlocks } = useAsyncData('pro-absences', () => $fetch('/api/backend/praticiens/me/unavailabilities'), { server: false, lazy: true, default: () => [] })
const loaded = computed(() => status.value === 'success')

// Les dates dépendent du navigateur : calculées après l'affichage (pas de décalage à l'hydratation)
const anchor = ref(null)
const now = ref(null)
let timer
onMounted(() => {
  anchor.value = new Date()
  now.value = new Date()
  timer = setInterval(() => { now.value = new Date() }, 60000)
})
onBeforeUnmount(() => clearInterval(timer))

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const fr = (d, o) => d.toLocaleDateString('fr-FR', o)

const appointments = computed(() => normalizeAppointments(raw.value).filter(a => !a.status.startsWith('cancelled')))
const blocks = computed(() => (Array.isArray(rawBlocks.value) ? rawBlocks.value : []).map(b => ({ id: b.id, start: new Date(b.startAt), end: new Date(b.endAt), reason: b.reason || '' })).filter(b => !Number.isNaN(b.start) && !Number.isNaN(b.end)))

const monday = computed(() => { const d = startOfDay(anchor.value ?? new Date(0)); return addDays(d, -((d.getDay() + 6) % 7)) })
const dateKeys = computed(() => {
  if (!anchor.value) return []
  if (view.value === 'day') return [startOfDay(anchor.value)]
  const six = Array.from({ length: 6 }, (_, i) => addDays(monday.value, i))
  // Le dimanche n'apparaît que s'il y a quelque chose à y voir
  const sunday = addDays(monday.value, 6)
  const busy = appointments.value.some(a => sameDay(new Date(a.startAt), sunday)) || blocks.value.some(b => b.start < addDays(sunday, 1) && b.end > sunday)
  return busy ? [...six, sunday] : six
})

const colorOf = (a) => {
  if (a.kind === 'first_visit') return { bg: 'bg-vert-600', nameClass: 'text-white', subClass: 'text-bleu-100' }
  if (a.mode === 'visio') return { bg: 'bg-corail-100', nameClass: 'text-corail-700', subClass: 'text-vert-900' }
  return { bg: 'bg-bleu-300', nameClass: 'text-vert-900', subClass: 'text-vert-900' }
}
const shortName = (n) => { const p = (n || '').trim().split(/\s+/); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : (p[0] || 'Patient') }
const hoursOf = (d) => d.getHours() + d.getMinutes() / 60

// Plage horaire affichée : 9 h – 18 h au minimum, élargie si besoin
const range = computed(() => {
  let lo = 9, hi = 18
  for (const day of dateKeys.value) {
    const next = addDays(day, 1)
    for (const a of appointments.value) {
      const s = new Date(a.startAt)
      if (s >= day && s < next) { lo = Math.min(lo, Math.floor(hoursOf(s))); hi = Math.max(hi, Math.ceil(hoursOf(new Date(a.endAt ?? a.startAt)))) }
    }
  }
  return { lo, hi: Math.min(hi, 24) }
})
const hours = computed(() => Array.from({ length: range.value.hi - range.value.lo + 1 }, (_, i) => range.value.lo + i))
const bodyHeight = computed(() => (range.value.hi - range.value.lo) * HOUR + 66)

const days = computed(() => dateKeys.value.map((day) => {
  const next = addDays(day, 1)
  const items = []
  for (const a of appointments.value) {
    const s = new Date(a.startAt)
    if (!(s >= day && s < next)) continue
    const e = new Date(a.endAt ?? s.getTime() + 3600000)
    const c = colorOf(a)
    items.push({
      key: `a${a.id}`, start: s, end: e, name: shortName(a.patientName), sub: a.typeName || 'Rendez-vous',
      ...c, dashed: a.status === 'pending', link: '/pro/rendez-vous',
      title: `${hhmm(s)} · ${a.patientName || 'Patient'} · ${a.typeName || 'Rendez-vous'}${a.status === 'pending' ? ' (à confirmer)' : ''}`,
    })
  }
  for (const b of blocks.value) {
    if (!(b.start < next && b.end > day)) continue
    const s = b.start < day ? day : b.start
    const e = b.end > next ? next : b.end
    items.push({ key: `b${b.id}-${day.getTime()}`, start: s, end: e, name: 'Bloqué', sub: b.reason || 'Absence', bg: 'bg-neutre-200', nameClass: 'text-vert-900', subClass: 'text-vert-900', dashed: false, link: '/pro/absences', title: `Bloqué${b.reason ? ` · ${b.reason}` : ''}` })
  }
  items.sort((x, y) => x.start - y.start)
  // Rendez-vous simultanés : côte à côte
  const lanes = []
  for (const it of items) {
    let i = lanes.findIndex(end => end <= it.start)
    if (i === -1) { i = lanes.length; lanes.push(0) }
    lanes[i] = it.end
    it.lane = i
    it.top = Math.max(0, (hoursOf(it.start) - range.value.lo) * HOUR) + 4
    it.height = Math.max(30, ((it.end - it.start) / 3600000) * HOUR - 8)
  }
  const today = !!now.value && sameDay(day, now.value)
  const nh = now.value ? hoursOf(now.value) : -1
  return {
    key: day.getTime(), today, lanes: Math.max(1, lanes.length), events: items,
    label: view.value === 'day' ? capital(fr(day, { weekday: 'long', day: 'numeric' })) : capital(fr(day, { weekday: 'short', day: 'numeric' }).replace('.', '')),
    nowTop: today && nh >= range.value.lo && nh <= range.value.hi ? (nh - range.value.lo) * HOUR : null,
  }
}))
const hasAny = computed(() => (view.value === 'month' ? monthCells.value.some(c => c.shown.length) : days.value.some(d => d.events.length)))
const hhmm = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

// --- Vue mensuelle
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MAX_PER_CELL = 3
const monthCells = computed(() => {
  if (view.value !== 'month' || !anchor.value) return []
  const y = anchor.value.getFullYear(), m = anchor.value.getMonth()
  const firstDay = new Date(y, m, 1)
  const start = addDays(firstDay, -((firstDay.getDay() + 6) % 7))
  const lastDay = new Date(y, m + 1, 0)
  const total = Math.ceil((((firstDay.getDay() + 6) % 7) + lastDay.getDate()) / 7) * 7
  return Array.from({ length: total }, (_, i) => {
    const date = addDays(start, i)
    const next = addDays(date, 1)
    const items = []
    for (const a of appointments.value) {
      const st = new Date(a.startAt)
      if (st >= date && st < next) items.push({ key: `a${a.id}`, start: st, label: `${hhmm(st)} ${shortName(a.patientName)}`, ...colorOf(a) })
    }
    let blocked = false
    for (const b of blocks.value) {
      if (b.start < next && b.end > date) { blocked = true; items.push({ key: `b${b.id}`, start: b.start < date ? date : b.start, label: `Bloqué${b.reason ? ` · ${b.reason}` : ''}`, bg: 'bg-neutre-200', nameClass: 'text-vert-900' }) }
    }
    items.sort((x, y2) => x.start - y2.start)
    const count = items.filter(it => it.key.startsWith('a')).length
    return {
      key: date.getTime(), date, day: date.getDate(), inMonth: date.getMonth() === m, today: !!now.value && sameDay(date, now.value),
      shown: items.slice(0, MAX_PER_CELL), more: Math.max(0, items.length - MAX_PER_CELL), count, blocked,
      long: capital(fr(date, { weekday: 'long', day: 'numeric', month: 'long' })),
    }
  })
})
function openDay(d) { anchor.value = new Date(d); view.value = 'day' }

const first = computed(() => dateKeys.value[0])
const last = computed(() => dateKeys.value[dateKeys.value.length - 1])
const monthLabel = computed(() => (anchor.value ? capital(fr(anchor.value, { month: 'long', year: 'numeric' })) : ''))
const subtitle = computed(() => {
  if (!first.value) return ''
  if (view.value === 'month') return monthLabel.value
  if (view.value === 'day') return capital(fr(first.value, { weekday: 'long', day: 'numeric', month: 'long' }))
  return `Semaine du ${fr(first.value, { day: 'numeric', ...(first.value.getMonth() !== last.value.getMonth() ? { month: 'long' } : {}) })} au ${fr(last.value, { day: 'numeric', month: 'long' })}`
})
const rangeLabel = computed(() => {
  if (!first.value) return '…'
  if (view.value === 'month') return monthLabel.value
  const short = (d, withMonth = true) => fr(d, { day: 'numeric', ...(withMonth ? { month: 'short' } : {}) })
  if (view.value === 'day') return short(first.value)
  return first.value.getMonth() === last.value.getMonth() ? `${short(first.value, false)} – ${short(last.value)}` : `${short(first.value)} – ${short(last.value)}`
})

function shift(dir) {
  const a = anchor.value
  anchor.value = view.value === 'month' ? new Date(a.getFullYear(), a.getMonth() + dir, 1) : addDays(a, dir * (view.value === 'day' ? 1 : 7))
}
function goToday() { anchor.value = new Date() }
const isCurrent = computed(() => {
  if (!anchor.value || !now.value) return true
  if (view.value === 'month') return anchor.value.getFullYear() === now.value.getFullYear() && anchor.value.getMonth() === now.value.getMonth()
  return view.value === 'day' ? sameDay(anchor.value, now.value) : sameDay(monday.value, startOfDay(addDays(now.value, -((now.value.getDay() + 6) % 7))))
})

const legend = [
  { label: 'Première séance', bg: 'bg-vert-600' },
  { label: 'Suivi', bg: 'bg-bleu-300' },
  { label: 'Visio', bg: 'bg-corail-100' },
  { label: 'Créneau bloqué', bg: 'bg-neutre-200' },
]
</script>
