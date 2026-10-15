<template>
  <div class="flex flex-col gap-[18px] text-vert-900">
    <div class="flex items-center justify-between gap-3 leading-[normal]">
      <h2 id="booking-title" class="font-unbounded font-normal text-[20px] text-vert-900">Prendre rendez-vous</h2>
      <p v-if="fromPrice != null" class="text-[18px] font-semibold text-vert-600 whitespace-nowrap">dès {{ fromPrice }} €</p>
    </div>

    <p v-if="!types.length" class="text-[16px] leading-snug bg-bleu-50 rounded-2xl p-4">
      Ce praticien n'a pas encore ouvert la réservation en ligne.
      <template v-if="praticien.phoneNumber">Vous pouvez le contacter au <a :href="`tel:${praticien.phoneNumber}`" class="underline">{{ praticien.phoneNumber }}</a>.</template>
    </p>

    <template v-else>
      <!-- Confirmation finale -->
      <div v-if="booked" class="rounded-2xl bg-bleu-50 p-5" role="status">
        <p class="font-semibold text-[18px] text-vert-600">
          {{ booked.status === 'confirmed' ? 'Rendez-vous confirmé' : 'Demande envoyée' }}
        </p>
        <p class="text-[16px] mt-2 leading-snug">
          {{ selectedType?.name }} le {{ formatLongDate(booked.startAt || selectedSlot) }}.
          <template v-if="booked.status !== 'confirmed'">Le praticien doit encore l'accepter ; suivez sa réponse dans « Mes rendez-vous ».</template>
        </p>
        <NuxtLink to="/mes-rendez-vous" class="inline-block mt-3 text-[16px] font-medium underline text-vert-600">Voir mes rendez-vous</NuxtLink>
      </div>

      <template v-else>
        <!-- Type de séance -->
        <label class="relative flex items-center gap-3 bg-bleu-50 rounded-2xl pl-4 pr-[14px] py-3 cursor-pointer focus-ring-within">
          <span class="flex-1 min-w-0 flex flex-col gap-0.5 leading-[normal]">
            <span class="text-[16px] text-neutre-600">Type de séance</span>
            <span class="text-[18px] font-semibold text-vert-900 truncate">{{ typeLabel(selectedType) }}</span>
          </span>
          <ChevronDown :size="18" class="shrink-0" aria-hidden="true" />
          <select v-model.number="typeId" aria-label="Type de séance" class="absolute inset-0 w-full opacity-0 cursor-pointer" :disabled="typesOfMode.length < 2">
            <option v-for="t in typesOfMode" :key="t.id" :value="t.id">{{ typeLabel(t) }}</option>
          </select>
        </label>

        <!-- Cabinet / Visio -->
        <div v-if="modes.length > 1" class="flex gap-1 bg-bleu-50 rounded-full p-1" role="group" aria-label="Mode de consultation">
          <button
            v-for="m in modes"
            :key="m"
            type="button"
            class="flex-1 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] transition-colors"
            :class="m === mode ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-white/60'"
            :aria-pressed="m === mode ? 'true' : 'false'"
            @click="setMode(m)"
          >{{ m === 'visio' ? 'Visio' : 'Cabinet' }}</button>
        </div>

        <!-- Prochaine disponibilité -->
        <button v-if="firstSlot && status === 'ready'" type="button" class="self-start inline-flex items-center gap-2 bg-corail-100 text-corail-700 rounded-full pl-3 pr-4 py-[9px] text-[16px] font-medium leading-[normal] text-left" @click="jumpTo(firstSlot)">
          <Clock :size="14" class="shrink-0" aria-hidden="true" />
          Prochaine disponibilité : {{ relativeSlot(firstSlot) }}
        </button>

        <p v-if="slotGone" class="text-[16px] leading-snug text-amber-900 bg-amber-50 border border-amber-200 rounded-2xl p-3" role="status">Ce créneau n'est plus disponible. Choisissez-en un autre.</p>

        <!-- Semaine -->
        <div class="flex items-center justify-between gap-3">
          <p class="text-[16px] font-medium leading-[normal]" aria-live="polite">{{ rangeLabel }}</p>
          <div class="flex gap-2">
            <button type="button" class="nav-btn text-neutre-600" :disabled="!canGoPrev" aria-label="Jours précédents" @click="goBy(-COLS)"><ChevronLeft :size="16" /></button>
            <button type="button" class="nav-btn text-vert-900" aria-label="Jours suivants" @click="goBy(COLS)"><ChevronRight :size="16" /></button>
          </div>
        </div>

        <p v-if="status === 'error'" class="text-[16px] text-red-700 bg-red-50 rounded-2xl p-3" role="alert">
          {{ loadError }}
          <button type="button" class="underline font-semibold ml-1" @click="refreshWindow()">Réessayer</button>
        </p>

        <template v-else>
          <div v-if="status === 'loading'" class="flex flex-col gap-3" aria-busy="true" aria-label="Chargement des créneaux">
            <div class="grid grid-cols-5 gap-2"><div v-for="i in COLS" :key="i" class="h-[78px] rounded-2xl bg-bleu-50 animate-pulse" /></div>
            <div class="grid grid-cols-4 gap-2"><div v-for="j in 4" :key="j" class="h-10 rounded-full bg-bleu-50 animate-pulse" /></div>
          </div>

          <template v-else>
            <!-- Jours -->
            <div class="grid grid-cols-5 gap-2" role="group" aria-label="Jours">
              <button
                v-for="d in columns"
                :key="d.key"
                type="button"
                class="day min-w-0 flex flex-col items-center gap-0.5 rounded-2xl px-1 py-[10px] leading-[normal] transition-colors"
                :class="[d.key === selectedDay && d.slots.length ? 'bg-vert-600' : 'bg-bleu-50', d.slots.length ? 'hover:brightness-95' : 'opacity-50 cursor-not-allowed']"
                :disabled="!d.slots.length"
                :aria-pressed="d.key === selectedDay ? 'true' : 'false'"
                :aria-label="`${d.long}, ${d.slots.length} créneau${d.slots.length > 1 ? 'x' : ''}`"
                @click="selectedDay = d.key; showAll = false"
              >
                <span class="text-[16px]" :class="d.key === selectedDay && d.slots.length ? 'text-bleu-100' : 'text-neutre-600'">{{ d.weekday }}</span>
                <span class="text-[18px] font-semibold" :class="d.key === selectedDay && d.slots.length ? 'text-white' : 'text-vert-900'">{{ d.day }}</span>
                <span class="text-[14px] sm:text-[16px] whitespace-nowrap" :class="d.key === selectedDay && d.slots.length ? 'text-bleu-100' : d.slots.length ? 'text-vert-600' : 'text-neutre-600'">{{ d.slots.length ? `${d.slots.length} dispo` : '—' }}</span>
              </button>
            </div>

            <!-- Créneaux du jour choisi -->
            <template v-if="dayHasSlots">
              <div v-for="part in dayParts" :key="part.label" class="flex flex-col gap-2">
                <p class="text-[16px] font-medium text-neutre-600 leading-[normal]">{{ part.label }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="slot in part.slots"
                    :key="slot"
                    type="button"
                    class="slot w-[calc((100%-24px)/4)] min-w-[64px] rounded-full py-[10px] text-[16px] font-medium leading-[normal] transition-colors"
                    :class="slot === selectedSlot ? 'bg-vert-600 text-white' : 'bg-bleu-50 text-vert-900 hover:bg-bleu-100'"
                    :aria-pressed="slot === selectedSlot ? 'true' : 'false'"
                    :aria-label="formatLongDate(slot)"
                    @click="choose(slot)"
                  >{{ formatTime(slot) }}</button>
                </div>
              </div>
              <button v-if="hiddenCount > 0 || showAll" type="button" class="text-[16px] font-medium text-vert-600 hover:underline leading-[normal]" :aria-expanded="showAll" @click="showAll = !showAll">
                {{ showAll ? 'Voir moins' : `Voir les ${hiddenCount} autre${hiddenCount > 1 ? 's' : ''} créneau${hiddenCount > 1 ? 'x' : ''}` }}
              </button>
            </template>

            <!-- Fenêtre vide : on indique où se trouve la prochaine disponibilité -->
            <div v-else-if="!windowHasSlots" class="rounded-2xl bg-bleu-50 px-4 py-3 text-[16px] leading-snug">
              <template v-if="searchingNext">Recherche du prochain créneau…</template>
              <template v-else-if="nextSlot">
                Aucun créneau sur ces jours.
                <button type="button" class="font-semibold underline text-vert-600" @click="jumpTo(nextSlot)">
                  Prochain créneau : {{ formatLongDate(nextSlot) }}
                </button>
              </template>
              <template v-else>Aucun créneau disponible dans les {{ Math.round(HORIZON_DAYS / 30) }} prochains mois. Contactez le cabinet pour plus d'informations.</template>
            </div>
          </template>
        </template>

        <!-- Confirmation -->
        <div class="h-px bg-bleu-100" aria-hidden="true"></div>

        <template v-if="selectedSlot">
          <template v-if="isLoggedIn">
            <button v-if="!showNote" type="button" class="self-start text-[16px] font-medium text-vert-600 hover:underline leading-[normal]" @click="showNote = true">Ajouter un motif (facultatif)</button>
            <div v-else>
              <label for="user-note" class="block text-[16px] font-medium mb-1.5 leading-[normal]">Motif du rendez-vous <span class="font-normal text-neutre-600">(facultatif)</span></label>
              <textarea
                id="user-note"
                v-model="note"
                rows="3"
                maxlength="500"
                class="w-full rounded-2xl bg-bleu-50 p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-vert-600"
                placeholder="Ex. : première consultation, tensions dans le dos…"
              />
              <label v-if="note.trim()" class="flex items-start gap-3 text-[14px] leading-snug text-neutre-600 mt-3 cursor-pointer">
                <input v-model="consent" type="checkbox" class="mt-0.5 shrink-0 accent-[#156F71]" />
                <span>
                  J'accepte que ces informations, qui peuvent concerner ma santé, soient transmises à ce praticien pour la préparation du rendez-vous
                  (voir la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>).
                </span>
              </label>
            </div>

            <p v-if="submitError" class="text-[16px] text-red-700 bg-red-50 rounded-2xl p-3" role="alert">{{ submitError }}</p>

            <button
              type="button"
              class="w-full flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-vert-600 transition-colors disabled:opacity-50 text-left"
              :disabled="submitting || (note.trim() && !consent)"
              @click="submit"
            >
              <span class="flex-1 min-w-0 truncate leading-[normal]">{{ submitting ? 'Envoi…' : `Confirmer ${confirmLabel}` }}</span>
              <span class="w-10 h-10 shrink-0 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </button>
          </template>

          <!-- Sans compte (lot 2 du backend) : page « Vos informations » -->
          <template v-else-if="guestBooking">
            <NuxtLink
              :to="{ path: '/rendez-vous/informations', query: { praticien: praticien.slug, type: String(typeId), slot: selectedSlot } }"
              class="w-full flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-vert-600 transition-colors"
            >
              <span class="flex-1 min-w-0 truncate leading-[normal]">Continuer sans compte</span>
              <span class="w-10 h-10 shrink-0 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
            <p class="text-[14px] text-neutre-600 text-center leading-[normal]">
              Vous avez un compte ?
              <NuxtLink :to="{ path: '/login', query: { redirect: route.fullPath } }" class="underline">Se connecter</NuxtLink>
            </p>
          </template>

          <template v-else>
            <p class="text-[16px] leading-snug text-neutre-600">Connectez-vous pour réserver ce créneau. Votre sélection sera conservée.</p>
            <NuxtLink
              :to="{ path: '/login', query: { redirect: route.fullPath } }"
              class="w-full flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-vert-600 transition-colors"
            >
              <span class="flex-1 min-w-0 truncate leading-[normal]">Se connecter pour confirmer {{ confirmLabel }}</span>
              <span class="w-10 h-10 shrink-0 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
            <p class="text-[14px] text-neutre-600 text-center leading-[normal]">
              Pas encore de compte ?
              <NuxtLink :to="{ path: '/register', query: { redirect: route.fullPath } }" class="underline">Créer un compte</NuxtLink>
            </p>
          </template>
        </template>
        <p v-else class="text-[16px] text-neutre-600 text-center leading-snug">Choisissez un créneau pour confirmer votre rendez-vous.</p>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, ChevronDown, Clock, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  praticien: { type: Object, required: true },
  types: { type: Array, default: () => [] },
  fromPrice: { type: Number, default: null },
})

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useSession()
const guestBooking = useRuntimeConfig().public.guestBooking

const HORIZON_DAYS = 120   // on ne cherche pas de créneau au-delà de ~4 mois
const COLS = 5             // jours affichés
const PER_PART = 4         // créneaux visibles par demi-journée avant « Voir les autres »
const minDay = todayKey()

const typeFromQuery = (v) => props.types.find(t => t.id === Number(v))?.id ?? null
const slotFromQuery = (v) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : null)
const dayStartFor = (iso) => { const d = dayKey(iso); return d < minDay ? minDay : d }

const typeId = ref(typeFromQuery(route.query.type) ?? props.types[0]?.id ?? null)
const selectedType = computed(() => props.types.find(t => t.id === typeId.value))

// Mode de consultation (cabinet / visio) : filtre les prestations proposées
const modeOf = (t) => (t?.mode === 'visio' ? 'visio' : 'cabinet')
const modes = computed(() => ['cabinet', 'visio'].filter(m => props.types.some(t => modeOf(t) === m)))
const mode = ref(modeOf(selectedType.value))
const typesOfMode = computed(() => props.types.filter(t => modeOf(t) === mode.value))
function setMode(m) {
  if (m === mode.value) return
  mode.value = m
  typeId.value = props.types.find(t => modeOf(t) === m)?.id ?? typeId.value
}
const typeLabel = (t) => {
  if (!t) return ''
  const d = t.durationMin ? ` · ${t.durationMin >= 60 && t.durationMin % 60 === 0 ? `${t.durationMin / 60} h` : `${t.durationMin} min`}` : ''
  return `${t.name}${d}${t.price != null ? ` · ${t.price} €` : ''}`
}

// Créneau demandé par l'adresse (retour après connexion, lien du profil) : restauré une fois les créneaux chargés.
const wantedSlot = ref(slotFromQuery(route.query.slot))
const slotGone = ref(false)
const selectedSlot = ref(null)

const note = ref('')
const showNote = ref(false)
const consent = ref(false)
const submitting = ref(false)
const submitError = ref('')
const booked = ref(null)

const windowStart = ref(wantedSlot.value ? dayStartFor(wantedSlot.value) : minDay)
const canGoPrev = computed(() => windowStart.value > minDay)
const showAll = ref(false)
const selectedDay = ref(null)

// ---------- Données : blocs de 31 jours chargés une fois, puis navigation locale
const cache = ref({})          // { [typeId]: { slots: string[], until: 'YYYY-MM-DD' } }
const inflight = {}
const status = ref('loading') // 'loading' | 'ready' | 'error'
const loadError = ref('')
const nextSlot = ref(null)
const searchingNext = ref(false)
let token = 0

async function fetchBlock(tid) {
  const entry = cache.value[tid] ?? { slots: [], until: addDays(minDay, -1) }
  const from = addDays(entry.until, 1)
  const to = addDays(from, 30)
  const raw = await $fetch(`/api/backend/praticiens/${props.praticien.id}/slots`, { query: { from, to, consultationTypeId: tid } })
  const merged = [...new Set([...entry.slots, ...normalizeSlots(raw)])].sort()
  cache.value = { ...cache.value, [tid]: { slots: merged, until: to } }
}

const limitDay = addDays(minDay, HORIZON_DAYS)
const covered = (tid, untilKey) => (cache.value[tid]?.until ?? '') >= (untilKey > limitDay ? limitDay : untilKey)

async function ensure(tid, untilKey) {
  while (!covered(tid, untilKey)) {
    inflight[tid] ??= fetchBlock(tid).finally(() => { delete inflight[tid] })
    await inflight[tid]
  }
}

const futureSlots = computed(() => (cache.value[typeId.value]?.slots ?? []).filter(s => Date.parse(s) > Date.now()))
const byDay = computed(() => groupByDay(futureSlots.value))
const firstSlot = computed(() => futureSlots.value[0] ?? null)

const weekdayFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'short' })
const dayMonthFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', day: 'numeric', month: 'long' })
const columns = computed(() =>
  Array.from({ length: COLS }, (_, i) => {
    const key = addDays(windowStart.value, i)
    const at = new Date(`${key}T12:00:00Z`)
    const slots = byDay.value[key] ?? []
    const weekday = weekdayFmt.format(at).replace('.', '')
    return { key, weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1), day: Number(key.slice(8)), long: formatDayLabel(key), slots }
  }),
)
const windowHasSlots = computed(() => columns.value.some(c => c.slots.length))
const rangeLabel = computed(() => {
  const from = windowStart.value
  const to = addDays(from, COLS - 1)
  const [a, b] = [dayMonthFmt.format(new Date(`${from}T12:00:00Z`)), dayMonthFmt.format(new Date(`${to}T12:00:00Z`))]
  const sameMonth = from.slice(0, 7) === to.slice(0, 7)
  return sameMonth ? `Du ${Number(from.slice(8))} au ${b}` : `Du ${a} au ${b}`
})

// Jour choisi : celui du créneau sélectionné, sinon le premier jour avec des créneaux
const dayColumn = computed(() => columns.value.find(c => c.key === selectedDay.value) ?? null)
const dayHasSlots = computed(() => !!dayColumn.value?.slots.length)
const isMorning = (iso) => Number(formatTime(iso).slice(0, 2)) < 12
const daySlots = computed(() => dayColumn.value?.slots ?? [])
const dayParts = computed(() => {
  const morning = daySlots.value.filter(isMorning)
  const afternoon = daySlots.value.filter(s => !isMorning(s))
  const cut = (list) => (showAll.value ? list : list.slice(0, PER_PART))
  return [
    ...(morning.length ? [{ label: 'Matin', slots: cut(morning) }] : []),
    ...(afternoon.length ? [{ label: 'Après-midi', slots: cut(afternoon) }] : []),
  ]
})
const hiddenCount = computed(() => {
  const morning = daySlots.value.filter(isMorning).length
  const afternoon = daySlots.value.length - morning
  return Math.max(0, morning - PER_PART) + Math.max(0, afternoon - PER_PART)
})
watch(columns, (cols) => {
  if (selectedSlot.value) {
    const k = dayKey(selectedSlot.value)
    if (cols.some(c => c.key === k)) { selectedDay.value = k; return }
  }
  const current = cols.find(c => c.key === selectedDay.value)
  if (current?.slots.length) return
  selectedDay.value = cols.find(c => c.slots.length)?.key ?? null
}, { immediate: true })

const weekdayLongFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric' })
const confirmLabel = computed(() => (selectedSlot.value ? `${weekdayLongFmt.format(new Date(selectedSlot.value))} · ${formatTime(selectedSlot.value)}` : ''))
function relativeSlot(iso) {
  const diff = dayDiff(todayKey(), dayKey(iso))
  const time = formatTime(iso)
  if (diff <= 0) return `aujourd’hui à ${time}`
  if (diff === 1) return `demain à ${time}`
  return `${new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))} à ${time}`
}

async function findNextSlot() {
  const tid = typeId.value
  const start = addDays(windowStart.value, COLS)
  for (;;) {
    const entry = cache.value[tid]
    const found = entry?.slots.find(s => dayKey(s) >= start && Date.parse(s) > Date.now())
    if (found) return found
    if (entry && entry.until >= limitDay) return null
    await ensure(tid, addDays(entry?.until ?? minDay, 1)) // charge le bloc suivant
  }
}

async function refreshWindow({ autoJump = false } = {}) {
  if (!typeId.value) return
  const current = ++token
  loadError.value = ''
  nextSlot.value = null
  const fast = covered(typeId.value, addDays(windowStart.value, COLS))
  if (!fast) status.value = 'loading'
  try {
    await ensure(typeId.value, addDays(windowStart.value, COLS))
    if (current !== token) return

    if (wantedSlot.value) {
      if (futureSlots.value.includes(wantedSlot.value)) selectedSlot.value = wantedSlot.value
      else slotGone.value = true
      wantedSlot.value = null
    }

    status.value = 'ready'

    if (!windowHasSlots.value && !selectedSlot.value) {
      searchingNext.value = true
      const next = await findNextSlot()
      if (current !== token) return
      searchingNext.value = false
      nextSlot.value = next
      // À l'ouverture, on se place directement sur le premier créneau libre (comme Doctolib).
      if (autoJump && next) {
        windowStart.value = dayStartFor(next)
        await ensure(typeId.value, addDays(windowStart.value, COLS))
        if (current !== token) return
        nextSlot.value = null
      }
    }
  } catch (e) {
    if (current !== token) return
    searchingNext.value = false
    status.value = 'error'
    loadError.value = apiErrorMessage(e, 'Impossible de charger les créneaux.')
  }
}

function goBy(n) {
  const next = addDays(windowStart.value, n)
  windowStart.value = next < minDay ? minDay : next
  showAll.value = false
  selectedDay.value = null
  refreshWindow()
}
function jumpTo(slot) {
  windowStart.value = dayStartFor(slot)
  showAll.value = false
  selectedDay.value = dayKey(slot)
  refreshWindow()
}

// ---------- Adresse (type / créneau) : partageable, conservée après connexion
function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const k of Object.keys(query)) if (query[k] == null) delete query[k]
  router.replace({ query })
}
// Mesure d'audience (anonyme) : étapes de la réservation, avec le mode de consultation seulement
const bookingMode = () => (selectedType.value?.mode === 'visio' ? 'visio' : 'cabinet')

function choose(slot) {
  if (slot !== selectedSlot.value) trackEvent('booking-slot-selected', { mode: bookingMode() })
  selectedSlot.value = slot
  slotGone.value = false
  submitError.value = ''
  setQuery({ type: String(typeId.value), slot })
}

watch(typeId, (id, old) => {
  selectedSlot.value = null
  showAll.value = false
  selectedDay.value = null
  mode.value = modeOf(props.types.find(t => t.id === id))
  // Un changement venu de l'adresse est déjà synchronisé : on n'efface le créneau que pour un choix fait dans le module.
  if (old != null && String(route.query.type) !== String(id)) setQuery({ type: String(id), slot: null })
  refreshWindow({ autoJump: true })
})

// Liens externes (choix de prestation, « Réserver ce créneau » du profil) : synchronisent le module via l'adresse.
watch(() => [route.query.type, route.query.slot], ([t, s]) => {
  const nextType = typeFromQuery(t)
  const slot = slotFromQuery(s)
  if (nextType && nextType !== typeId.value) typeId.value = nextType
  if (slot && slot !== selectedSlot.value) {
    wantedSlot.value = slot
    windowStart.value = dayStartFor(slot)
    refreshWindow()
  } else if (!slot && selectedSlot.value) {
    selectedSlot.value = null
  }
})

onMounted(() => { refreshWindow({ autoJump: !wantedSlot.value }) })

// ---------- Réservation
async function submit() {
  if (submitting.value || !selectedSlot.value) return
  submitting.value = true
  submitError.value = ''
  trackEvent('booking-submitted', { mode: bookingMode() })
  try {
    booked.value = await $fetch('/api/backend/appointments', {
      method: 'POST',
      body: {
        praticienId: props.praticien.id,
        consultationTypeId: typeId.value,
        startAt: selectedSlot.value,
        userNote: note.value.trim() || undefined,
      },
    })
    booked.value = { ...booked.value, startAt: booked.value?.startAt ?? selectedSlot.value }
    trackEvent('booking-success', { mode: bookingMode() })
    // Page de confirmation (si le backend renvoie bien l'identifiant du rendez-vous)
    if (booked.value?.id) {
      await navigateTo({ path: '/rendez-vous/confirmation', query: { id: String(booked.value.id) } })
      return
    }
  } catch (e) {
    trackEvent('booking-error', { status: apiStatus(e) ?? 0 })
    if (apiStatus(e) === 401) {
      await useSession().logout()
      await navigateTo({ path: '/login', query: { redirect: route.fullPath } })
      return
    }
    if (apiStatus(e) === 409) {
      // Créneau pris entre-temps : retour à la grille avec des données fraîches.
      const { [typeId.value]: _stale, ...rest } = cache.value
      cache.value = rest
      selectedSlot.value = null
      setQuery({ slot: null })
      slotGone.value = true
      await refreshWindow()
    } else {
      submitError.value = apiErrorMessage(e, 'La réservation a échoué. Réessayez dans un instant.')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.nav-btn { width: 2rem; height: 2rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; border: 1.5px solid #d7e7f0; transition: background-color .15s; }
.nav-btn:hover:not(:disabled) { background: #eef5f8; }
.nav-btn:disabled { opacity: .4; cursor: not-allowed; }
</style>
