<template>
  <div class="font-sans">
    <p v-if="!types.length" class="text-sm text-gray-600 bg-[#e0ecf2]/60 rounded-xl p-4">
      Ce praticien n'a pas encore ouvert la réservation en ligne.
      <template v-if="praticien.phoneNumber">Vous pouvez le contacter au <a :href="`tel:${praticien.phoneNumber}`" class="underline">{{ praticien.phoneNumber }}</a>.</template>
    </p>

    <template v-else>
      <!-- Confirmation finale -->
      <div v-if="booked" class="rounded-xl bg-[#e6f4ef] p-5" role="status">
        <p class="font-bold text-[#156F71]">
          {{ booked.status === 'confirmed' ? 'Rendez-vous confirmé' : 'Demande envoyée' }}
        </p>
        <p class="text-sm mt-2">
          {{ selectedType?.name }} le {{ formatLongDate(booked.startAt || selectedSlot) }}.
          <template v-if="booked.status !== 'confirmed'">Le praticien doit encore l'accepter ; suivez sa réponse dans « Mes rendez-vous ».</template>
        </p>
        <NuxtLink to="/mes-rendez-vous" class="inline-block mt-3 text-sm underline text-[#156F71]">Voir mes rendez-vous</NuxtLink>
      </div>

      <!-- Étape 2 : récapitulatif et confirmation -->
      <template v-else-if="selectedSlot">
        <button type="button" class="inline-flex items-center gap-1 text-sm text-[#156F71] hover:underline mb-4" @click="clearSlot">
          <ChevronLeft :size="16" aria-hidden="true" /> Modifier le créneau
        </button>

        <div class="rounded-xl bg-[#e0ecf2]/60 px-4 py-3 mb-5">
          <p class="font-bold first-letter:uppercase">{{ formatLongDate(selectedSlot) }}</p>
          <p class="text-sm mt-1">{{ selectedType?.name }}</p>
          <p class="text-xs text-gray-600">
            {{ selectedType?.durationMin }} min · {{ selectedType?.mode === 'visio' ? 'En visio' : 'Au cabinet' }}<template v-if="selectedType?.price != null"> · {{ selectedType.price }} €</template>
          </p>
          <p v-if="selectedType?.mode !== 'visio' && praticien.address" class="text-xs text-gray-600 mt-1">{{ praticien.address }}, {{ praticien.city }}</p>
        </div>

        <form @submit.prevent="submit">
          <template v-if="isLoggedIn">
            <label for="user-note" class="block text-sm font-semibold mb-1">Motif du rendez-vous <span class="font-normal text-gray-500">(facultatif)</span></label>
            <textarea
              id="user-note"
              v-model="note"
              rows="3"
              maxlength="500"
              class="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#156F71]"
              placeholder="Ex. : première consultation, tensions dans le dos…"
            />
            <label v-if="note.trim()" class="flex items-start gap-3 text-xs text-gray-600 mt-3 cursor-pointer">
              <input v-model="consent" type="checkbox" class="mt-0.5 shrink-0" />
              <span>
                J'accepte que ces informations, qui peuvent concerner ma santé, soient transmises à ce praticien pour la préparation du rendez-vous
                (voir la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>).
              </span>
            </label>

            <p v-if="submitError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mt-4" role="alert">{{ submitError }}</p>

            <button
              type="submit"
              class="mt-5 w-full bg-[#012828] text-white font-bold text-sm px-7 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50"
              :disabled="submitting || (note.trim() && !consent)"
            >
              {{ submitting ? 'Envoi…' : 'Confirmer la demande' }}
            </button>
          </template>

          <template v-else>
            <p class="text-sm text-gray-600 mb-4">Connectez-vous pour réserver ce créneau. Votre sélection sera conservée.</p>
            <NuxtLink
              :to="{ path: '/login', query: { redirect: route.fullPath } }"
              class="block text-center bg-[#012828] text-white font-bold text-sm px-7 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors"
            >
              Se connecter
            </NuxtLink>
            <p class="text-xs text-gray-500 text-center mt-3">
              Pas encore de compte ?
              <NuxtLink :to="{ path: '/register', query: { redirect: route.fullPath } }" class="underline">Créer un compte</NuxtLink>
            </p>
          </template>
        </form>
      </template>

      <!-- Étape 1 : choix du créneau -->
      <template v-else>
        <div v-if="selectedType" class="mb-4 rounded-xl bg-[#e0ecf2]/60 px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-[#012828]/50">Prestation</p>
          <p class="text-sm font-semibold mt-0.5">{{ selectedType.name }}</p>
          <p class="text-xs text-gray-600">
            {{ selectedType.durationMin }} min · {{ selectedType.mode === 'visio' ? 'En visio' : 'Au cabinet' }}<template v-if="selectedType.price != null"> · {{ selectedType.price }} €</template>
          </p>
          <a v-if="types.length > 1" href="#prestations" class="lg:hidden text-xs underline text-[#156F71] mt-1 inline-block">Changer de prestation</a>
        </div>

        <p v-if="slotGone" class="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3" role="status">Ce créneau n'est plus disponible. Choisissez-en un autre.</p>

        <!-- Navigation -->
        <div class="flex items-center justify-between mb-3">
          <button type="button" class="nav-btn" :disabled="!canGoPrev" aria-label="Jours précédents" @click="goBy(-cols)">
            <ChevronLeft :size="18" />
          </button>
          <p class="text-xs font-semibold text-gray-600 first-letter:uppercase" aria-live="polite">{{ rangeLabel }}</p>
          <button type="button" class="nav-btn" aria-label="Jours suivants" @click="goBy(cols)">
            <ChevronRight :size="18" />
          </button>
        </div>

        <p v-if="status === 'error'" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">
          {{ loadError }}
          <button type="button" class="underline font-semibold ml-1" @click="refreshWindow()">Réessayer</button>
        </p>

        <template v-else>
          <!-- Chargement : mêmes colonnes en gris pour éviter tout saut de mise en page -->
          <div v-if="status === 'loading'" class="grid gap-2" :style="gridStyle" aria-busy="true" aria-label="Chargement des créneaux">
            <div v-for="i in cols" :key="i" class="grid gap-2">
              <div class="h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div v-for="j in 4" :key="j" class="h-9 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          </div>

          <template v-else>
            <div class="grid gap-2" :style="gridStyle">
              <div v-for="d in columns" :key="d.key" class="min-w-0" role="group" :aria-label="d.long">
                <div class="text-center mb-2 leading-tight">
                  <p class="text-[11px] uppercase text-gray-500">{{ d.weekday }}</p>
                  <p class="text-base font-bold" :class="d.slots.length ? '' : 'text-gray-300'">{{ d.day }}</p>
                  <p class="text-[10px] text-gray-400">{{ d.month }}</p>
                </div>
                <div v-if="d.slots.length" class="grid gap-1.5">
                  <button
                    v-for="slot in d.visible"
                    :key="slot"
                    type="button"
                    class="slot"
                    :aria-label="`${formatLongDate(slot)}`"
                    @click="choose(slot)"
                  >
                    {{ formatTime(slot) }}
                  </button>
                </div>
                <p v-else class="text-center text-gray-300 py-2" aria-label="Aucun créneau ce jour">–</p>
              </div>
            </div>

            <button v-if="hasMore" type="button" class="mt-3 w-full text-sm font-semibold text-[#156F71] hover:underline inline-flex items-center justify-center gap-1" :aria-expanded="showAll" @click="showAll = !showAll">
              {{ showAll ? 'Voir moins' : 'Voir plus de créneaux' }}
              <ChevronDown :size="16" class="transition-transform" :class="showAll ? 'rotate-180' : ''" aria-hidden="true" />
            </button>

            <!-- Fenêtre vide : on indique où se trouve la prochaine disponibilité -->
            <div v-if="!windowHasSlots" class="mt-3 rounded-xl bg-[#e0ecf2]/60 px-4 py-3 text-sm">
              <template v-if="searchingNext">Recherche du prochain créneau…</template>
              <template v-else-if="nextSlot">
                Aucun créneau sur ces jours.
                <button type="button" class="font-semibold underline text-[#156F71]" @click="jumpTo(nextSlot)">
                  Prochain créneau : {{ formatLongDate(nextSlot) }}
                </button>
              </template>
              <template v-else>Aucun créneau disponible dans les {{ Math.round(HORIZON_DAYS / 30) }} prochains mois. Contactez le cabinet pour plus d'informations.</template>
            </div>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  praticien: { type: Object, required: true },
  types: { type: Array, default: () => [] },
})

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useSession()

const HORIZON_DAYS = 120   // on ne cherche pas de créneau au-delà de ~4 mois
const PER_DAY = 5          // créneaux visibles par colonne avant « Voir plus »
const minDay = todayKey()

const typeFromQuery = (v) => props.types.find(t => t.id === Number(v))?.id ?? null
const slotFromQuery = (v) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : null)
const dayStartFor = (iso) => { const d = dayKey(iso); return d < minDay ? minDay : d }

const typeId = ref(typeFromQuery(route.query.type) ?? props.types[0]?.id ?? null)
const selectedType = computed(() => props.types.find(t => t.id === typeId.value))

// Créneau demandé par l'adresse (retour après connexion, lien du profil) : restauré une fois les créneaux chargés.
const wantedSlot = ref(slotFromQuery(route.query.slot))
const slotGone = ref(false)
const selectedSlot = ref(null)

const note = ref('')
const consent = ref(false)
const submitting = ref(false)
const submitError = ref('')
const booked = ref(null)

// ---------- Affichage : N colonnes de jours selon la largeur disponible
const cols = ref(4)
function updateCols() {
  const w = window.innerWidth
  cols.value = w >= 1024 ? 4 : w >= 640 ? 5 : 3
}
const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))` }))

const windowStart = ref(wantedSlot.value ? dayStartFor(wantedSlot.value) : minDay)
const canGoPrev = computed(() => windowStart.value > minDay)
const showAll = ref(false)

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

const dayParts = {
  weekday: new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'short' }),
  month: new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', month: 'short' }),
}
const columns = computed(() =>
  Array.from({ length: cols.value }, (_, i) => {
    const key = addDays(windowStart.value, i)
    const at = new Date(`${key}T12:00:00Z`)
    const slots = byDay.value[key] ?? []
    return {
      key,
      weekday: dayParts.weekday.format(at),
      day: Number(key.slice(8)),
      month: dayParts.month.format(at),
      long: formatDayLabel(key),
      slots,
      visible: showAll.value ? slots : slots.slice(0, PER_DAY),
    }
  }),
)
const windowHasSlots = computed(() => columns.value.some(c => c.slots.length))
const hasMore = computed(() => columns.value.some(c => c.slots.length > PER_DAY))
const rangeLabel = computed(() => `${formatDayLabel(windowStart.value)} → ${formatDayLabel(addDays(windowStart.value, cols.value - 1))}`)

async function findNextSlot() {
  const tid = typeId.value
  const start = addDays(windowStart.value, cols.value)
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
  const fast = covered(typeId.value, addDays(windowStart.value, cols.value))
  if (!fast) status.value = 'loading'
  try {
    await ensure(typeId.value, addDays(windowStart.value, cols.value))
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
        await ensure(typeId.value, addDays(windowStart.value, cols.value))
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
  refreshWindow()
}
function jumpTo(slot) {
  windowStart.value = dayStartFor(slot)
  showAll.value = false
  refreshWindow()
}

// ---------- Adresse (type / créneau) : partageable, conservée après connexion
function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const k of Object.keys(query)) if (query[k] == null) delete query[k]
  router.replace({ query })
}
function choose(slot) {
  selectedSlot.value = slot
  slotGone.value = false
  submitError.value = ''
  setQuery({ type: String(typeId.value), slot })
}
function clearSlot() {
  selectedSlot.value = null
  setQuery({ slot: null })
}

watch(typeId, (id, old) => {
  selectedSlot.value = null
  showAll.value = false
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

onMounted(() => {
  updateCols()
  window.addEventListener('resize', updateCols)
  refreshWindow({ autoJump: !wantedSlot.value })
})
onBeforeUnmount(() => window.removeEventListener('resize', updateCols))
watch(cols, () => { if (status.value === 'ready') refreshWindow() })

// ---------- Réservation
async function submit() {
  if (submitting.value || !selectedSlot.value) return
  submitting.value = true
  submitError.value = ''
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
  } catch (e) {
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
.nav-btn { width: 2.25rem; height: 2.25rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; transition: background-color .15s; }
.nav-btn:hover:not(:disabled) { background: #f3f4f6; }
.nav-btn:disabled { opacity: .3; cursor: not-allowed; }
.slot { width: 100%; padding: 0.5rem 0; border-radius: 0.5rem; background: rgb(224 236 242 / 0.7); font-size: 0.875rem; font-weight: 600; color: #012828; transition: background-color .15s, color .15s; }
.slot:hover, .slot:focus-visible { background: #156F71; color: #fff; outline: none; }
</style>
