<template>
  <div>
    <ProPageHead title="Statistiques" subtitle="30 derniers jours" />

    <!-- Indicateurs -->
    <ul class="mt-[22px] grid grid-cols-[minmax(0,1fr)] sm:grid-cols-3 gap-5">
      <li v-for="(k, i) in kpis" :key="k.label" class="rounded-[24px] px-6 py-[22px] flex flex-col gap-[10px]" :class="i === 0 ? 'bg-vert-600 text-white' : 'bg-white text-vert-900'">
        <span class="text-[16px] font-medium leading-[normal]" :class="i === 0 ? 'text-bleu-100' : 'text-neutre-600'">{{ k.label }}</span>
        <span class="font-unbounded font-normal text-[32px] xl:text-[40px] leading-[normal]">{{ k.value }}</span>
        <span class="self-start rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="i === 0 ? 'bg-white text-vert-900' : 'bg-corail-100 text-corail-700'">{{ k.trend }}</span>
      </li>
    </ul>

    <!-- Courbe -->
    <section class="mt-6 rounded-[28px] bg-white p-6 sm:p-7 flex flex-col gap-4" aria-labelledby="curve-title">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 id="curve-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Vues et demandes</h2>
        <ul class="flex gap-4 text-[16px] text-neutre-600">
          <li class="inline-flex items-center gap-[6px]"><span class="w-3 h-3 rounded-[6px] bg-vert-600"></span>Vues</li>
          <li class="inline-flex items-center gap-[6px]"><span class="w-3 h-3 rounded-[6px] bg-corail-500"></span>Demandes</li>
        </ul>
      </div>

      <p v-if="loadError" class="rounded-[16px] bg-red-50 p-3 text-[16px] text-red-700" role="alert">Impossible de charger les statistiques pour le moment.</p>
      <p v-else-if="status === 'pending' || !ready" class="text-[16px] text-neutre-600">Chargement…</p>
      <template v-else>
        <!-- Détail au survol (souris, doigt ou flèches du clavier) -->
        <div
          ref="chartEl"
          class="relative w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-vert-600 rounded-[12px]"
          tabindex="0"
          role="group"
          :aria-label="`Vues et demandes par jour sur ${series.length} jours : ${totalViews} vues, ${totalRequests} demandes. Utilisez les flèches pour parcourir les jours.`"
          @pointermove="onMove"
          @pointerdown="onMove"
          @pointerleave="hover = null"
          @focus="hover = hover ?? series.length - 1"
          @blur="hover = null"
          @keydown.left.prevent="step(-1)"
          @keydown.right.prevent="step(1)"
        >
          <svg :viewBox="`0 0 ${W} ${H}`" class="block w-full h-[220px] sm:h-[300px]" preserveAspectRatio="none" aria-hidden="true" style="animation: none;">
            <line v-for="g in 4" :key="g" x1="0" :x2="W" :y1="(H / 4) * g - 1" :y2="(H / 4) * g - 1" stroke="#d7e7f0" stroke-width="1" vector-effect="non-scaling-stroke" />
            <path :d="viewsPath" fill="none" stroke="#156f71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            <path :d="requestsPath" fill="none" stroke="#ec7f7a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
          </svg>

          <template v-if="point">
            <span class="absolute top-0 bottom-0 w-px bg-vert-900/20 pointer-events-none" :style="{ left: `${point.x}%` }"></span>
            <span class="absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full bg-vert-600 ring-2 ring-white pointer-events-none" :style="{ left: `${point.x}%`, top: `${point.yViews}%` }"></span>
            <span class="absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full bg-corail-500 ring-2 ring-white pointer-events-none" :style="{ left: `${point.x}%`, top: `${point.yRequests}%` }"></span>
            <div class="absolute top-2 z-10 min-w-[150px] rounded-[16px] bg-vert-900 px-4 py-3 text-white shadow-douce pointer-events-none leading-[normal]" :style="tooltipStyle" role="status">
              <p class="text-[14px] text-bleu-100">{{ point.label }}</p>
              <p class="mt-1 flex items-center gap-2 text-[16px]"><span class="w-2.5 h-2.5 rounded-full bg-[#4fb3b5]"></span>{{ point.views }} vue{{ point.views > 1 ? 's' : '' }}</p>
              <p class="flex items-center gap-2 text-[16px]"><span class="w-2.5 h-2.5 rounded-full bg-corail-500"></span>{{ point.requests }} demande{{ point.requests > 1 ? 's' : '' }}</p>
            </div>
          </template>
        </div>
        <ul class="flex justify-between text-[16px] text-neutre-600" aria-hidden="true">
          <li v-for="l in xLabels" :key="l">{{ l }}</li>
        </ul>
        <p class="text-[14px] text-neutre-600 leading-[normal]">Les vues comptent les visites de votre fiche publique. Les demandes sont les rendez-vous reçus, quel que soit leur statut. Chaque courbe est tracée à sa propre échelle.</p>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Statistiques — Espace praticien Léya', robots: 'noindex, nofollow' })

const DAYS = 30
// Les dates dépendent du navigateur : calculées après l'affichage (pas de décalage à l'hydratation)
const today = ref(null)
onMounted(() => { today.value = new Date() })
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

const range = computed(() => {
  if (!today.value) return null
  const end = today.value
  return { cur: { from: addDays(end, -(DAYS - 1)), to: end }, prev: { from: addDays(end, -(2 * DAYS - 1)), to: addDays(end, -DAYS) } }
})

// Vues de la fiche : période courante et précédente (l'API accepte 90 jours au plus par appel)
const { data: curStats, status, error: loadError } = useAsyncData('pro-stats-cur', () => $fetch('/api/backend/praticiens/me/stats', { query: { from: ymd(range.value.cur.from), to: ymd(range.value.cur.to) } }), { server: false, lazy: true, watch: [range], immediate: false, default: () => null })
const { data: prevStats } = useAsyncData('pro-stats-prev', () => $fetch('/api/backend/praticiens/me/stats', { query: { from: ymd(range.value.prev.from), to: ymd(range.value.prev.to) } }).catch(() => null), { server: false, lazy: true, watch: [range], immediate: false, default: () => null })
const { data: rawAppts } = useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, lazy: true, default: () => [] })

const ready = computed(() => !!range.value && !!curStats.value)
const appts = computed(() => normalizeAppointments(rawAppts.value).filter(a => a.createdAt))

// Une valeur par jour (les jours sans visite valent zéro)
const series = computed(() => {
  if (!range.value) return []
  const views = new Map((curStats.value?.daily ?? []).map(d => [String(d.date).slice(0, 10), Number(d.views) || 0]))
  const reqs = new Map()
  for (const a of appts.value) { const k = ymd(new Date(a.createdAt)); reqs.set(k, (reqs.get(k) ?? 0) + 1) }
  return Array.from({ length: DAYS }, (_, i) => { const d = addDays(range.value.cur.from, i); const k = ymd(d); return { date: d, views: views.get(k) ?? 0, requests: reqs.get(k) ?? 0 } })
})
const countRequests = (from, to) => appts.value.filter(a => { const d = new Date(a.createdAt); return d >= from && d < addDays(to, 1) && ymd(d) >= ymd(from) && ymd(d) <= ymd(to) }).length
const totalViews = computed(() => series.value.reduce((n, d) => n + d.views, 0))
const totalRequests = computed(() => series.value.reduce((n, d) => n + d.requests, 0))
const prevViews = computed(() => (prevStats.value ? (prevStats.value.total ?? (prevStats.value.daily ?? []).reduce((n, d) => n + (Number(d.views) || 0), 0)) : null))
const prevRequests = computed(() => (range.value ? countRequests(range.value.prev.from, range.value.prev.to) : 0))

const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n)
const pct = (cur, prev) => {
  if (prev == null) return 'Pas de comparaison'
  if (!prev) return cur ? 'Nouveau ce mois-ci' : 'Aucune donnée'
  const v = Math.round(((cur - prev) / prev) * 100)
  return `${v > 0 ? '+' : ''}${v} %`
}
const rate = (r, v) => (v ? (r / v) * 100 : null)
const kpis = computed(() => {
  const conv = rate(totalRequests.value, totalViews.value)
  const prevConv = prevViews.value ? rate(prevRequests.value, prevViews.value) : null
  const diff = conv != null && prevConv != null ? conv - prevConv : null
  return [
    { label: 'Vues de la fiche', value: fmt(totalViews.value), trend: pct(totalViews.value, prevViews.value) },
    { label: 'Demandes de RDV', value: fmt(totalRequests.value), trend: pct(totalRequests.value, prevViews.value == null ? null : prevRequests.value) },
    { label: 'Taux de conversion', value: conv == null ? '–' : `${conv.toFixed(1).replace('.', ',')} %`, trend: diff == null ? 'Pas de comparaison' : `${diff >= 0 ? '+' : ''}${diff.toFixed(1).replace('.', ',')} pt` },
  ]
})

// Courbe : chaque série est normalisée sur son maximum
const W = 820, H = 300, PAD = 12
// Courbe lissée qui passe exactement par chaque point (interpolation monotone : pas de dépassement entre deux jours)
function path(values) {
  const max = Math.max(...values, 1)
  const n = values.length
  if (n < 2) return ''
  const dx = W / (n - 1)
  const y = values.map(v => H - PAD - (v / max) * (H - 2 * PAD))
  const delta = Array.from({ length: n - 1 }, (_, i) => (y[i + 1] - y[i]) / dx)
  const m = Array.from({ length: n }, (_, i) => (i === 0 ? delta[0] : i === n - 1 ? delta[n - 2] : delta[i - 1] * delta[i] <= 0 ? 0 : (delta[i - 1] + delta[i]) / 2))
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) { m[i] = 0; m[i + 1] = 0; continue }
    const a = m[i] / delta[i], b = m[i + 1] / delta[i], sq = a * a + b * b
    if (sq > 9) { const t = 3 / Math.sqrt(sq); m[i] = t * a * delta[i]; m[i + 1] = t * b * delta[i] }
  }
  let d = `M 0 ${y[0].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const x0 = i * dx, x1 = (i + 1) * dx
    d += ` C ${(x0 + dx / 3).toFixed(1)} ${(y[i] + (m[i] * dx) / 3).toFixed(1)} ${(x1 - dx / 3).toFixed(1)} ${(y[i + 1] - (m[i + 1] * dx) / 3).toFixed(1)} ${x1.toFixed(1)} ${y[i + 1].toFixed(1)}`
  }
  return d
}
const viewsPath = computed(() => path(series.value.map(d => d.views)))
const requestsPath = computed(() => path(series.value.map(d => d.requests)))
// Détail d'un jour
const chartEl = ref(null)
const hover = ref(null)
function onMove(e) {
  const el = chartEl.value
  if (!el || series.value.length < 2) return
  const r = el.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  hover.value = Math.round(ratio * (series.value.length - 1))
}
function step(dir) { hover.value = Math.min(series.value.length - 1, Math.max(0, (hover.value ?? series.value.length - 1) + dir)) }
const maxViews = computed(() => Math.max(...series.value.map(d => d.views), 1))
const maxRequests = computed(() => Math.max(...series.value.map(d => d.requests), 1))
const point = computed(() => {
  const d = series.value[hover.value]
  if (!d) return null
  const x = (hover.value / (series.value.length - 1 || 1)) * 100
  const y = (v, max) => ((H - PAD - (v / max) * (H - 2 * PAD)) / H) * 100
  return { x, views: d.views, requests: d.requests, yViews: y(d.views, maxViews.value), yRequests: y(d.requests, maxRequests.value), label: d.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, c => c.toUpperCase()) }
})
// L'infobulle passe de l'autre côté du trait près du bord droit
const tooltipStyle = computed(() => (point.value.x > 70 ? { right: `calc(${100 - point.value.x}% + 12px)` } : { left: `calc(${point.value.x}% + 12px)` }))

const xLabels = computed(() => (series.value.length ? [0, 7, 14, 21, 28].map(i => series.value[i].date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) : []))
</script>
