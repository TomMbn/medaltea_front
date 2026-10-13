<template>
  <div class="font-sans">
    <p v-if="!types.length" class="text-sm text-gray-600 bg-[#e0ecf2]/60 rounded-xl p-4">
      Ce praticien n'a pas encore ouvert la réservation en ligne.
      <template v-if="praticien.phoneNumber">Vous pouvez le contacter au <a :href="`tel:${praticien.phoneNumber}`" class="underline">{{ praticien.phoneNumber }}</a>.</template>
    </p>

    <template v-else>
      <!-- Confirmation -->
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

      <template v-else>
        <!-- Rappel de la prestation choisie (le choix se fait dans « Prestations et tarifs ») -->
        <div v-if="selectedType" class="mb-5 rounded-xl bg-[#e0ecf2]/60 px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-[#012828]/50">Prestation</p>
          <p class="text-sm font-semibold mt-0.5">{{ selectedType.name }}</p>
          <p class="text-xs text-gray-600">
            {{ selectedType.durationMin }} min · {{ selectedType.mode === 'visio' ? 'En visio' : 'Au cabinet' }}<template v-if="selectedType.price != null"> · {{ selectedType.price }} €</template>
          </p>
          <a v-if="types.length > 1" href="#prestations" class="lg:hidden text-xs underline text-[#156F71] mt-1 inline-block">Changer de prestation</a>
        </div>

        <!-- Navigation par semaine -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold">Choisissez un créneau</h3>
          <div class="flex items-center gap-1">
            <button type="button" class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30" :disabled="!canGoPrev" aria-label="Semaine précédente" @click="shiftWeek(-7)">
              <ChevronLeft :size="18" />
            </button>
            <button type="button" class="p-2 rounded-full hover:bg-gray-100" aria-label="Semaine suivante" @click="shiftWeek(7)">
              <ChevronRight :size="18" />
            </button>
          </div>
        </div>

        <p v-if="slotGone" class="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3" role="status">Le créneau choisi n'est plus disponible. Choisissez-en un autre.</p>
        <p v-if="loadError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">{{ loadError }}</p>
        <p v-else-if="loading" class="text-sm text-gray-500">Chargement des créneaux…</p>
        <p v-else-if="!days.length" class="text-sm text-gray-500 bg-[#e0ecf2]/60 rounded-xl p-4">
          Aucun créneau libre du {{ formatDayLabel(weekStart) }} au {{ formatDayLabel(addDays(weekStart, 6)) }}. Essayez la semaine suivante.
        </p>
        <div v-else class="grid gap-3 sm:grid-cols-2">
          <div v-for="day in days" :key="day" class="rounded-xl border border-gray-200 p-3">
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{{ formatDayLabel(day) }}</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="slot in slotsByDay[day]"
                :key="slot"
                type="button"
                class="px-3 py-1.5 rounded-full text-sm border transition-colors"
                :class="selectedSlot === slot ? 'bg-[#156F71] text-white border-[#156F71]' : 'border-gray-300 hover:border-[#156F71]'"
                :aria-pressed="selectedSlot === slot"
                @click="choose(slot)"
              >
                {{ formatTime(slot) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Validation -->
        <form v-if="selectedSlot" class="mt-6 border-t border-gray-100 pt-6" @submit.prevent="submit">
          <p class="text-sm mb-4">
            <strong>{{ selectedType?.name }}</strong> — {{ formatLongDate(selectedSlot) }}
          </p>

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
              class="mt-5 w-full sm:w-auto bg-[#012828] text-white font-bold text-sm px-7 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50"
              :disabled="submitting || (note.trim() && !consent)"
            >
              {{ submitting ? 'Envoi…' : 'Confirmer la demande' }}
            </button>
          </template>

          <template v-else>
            <p class="text-sm text-gray-600 mb-4">Connectez-vous pour réserver ce créneau.</p>
            <NuxtLink
              :to="{ path: '/login', query: { redirect: route.fullPath } }"
              class="inline-block bg-[#012828] text-white font-bold text-sm px-7 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors"
            >
              Se connecter
            </NuxtLink>
          </template>
        </form>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  praticien: { type: Object, required: true },
  types: { type: Array, default: () => [] },
})

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useSession()

const minWeek = todayKey()
const typeFromQuery = (v) => props.types.find(t => t.id === Number(v))?.id ?? null
const slotFromQuery = (v) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : null)

const typeId = ref(typeFromQuery(route.query.type) ?? props.types[0]?.id ?? null)
const selectedType = computed(() => props.types.find(t => t.id === typeId.value))

// Créneau demandé par l'adresse (retour après connexion, lien « Réserver » de la page) : restauré une fois les créneaux chargés.
const wantedSlot = ref(slotFromQuery(route.query.slot))
const slotGone = ref(false)
const weekFor = (iso) => { const d = dayKey(iso); return d < minWeek ? minWeek : d }
const weekStart = ref(wantedSlot.value ? weekFor(wantedSlot.value) : minWeek)
const canGoPrev = computed(() => weekStart.value > minWeek)

const slots = ref([])
const loading = ref(false)
const loadError = ref('')
const selectedSlot = ref(null)
const note = ref('')
const consent = ref(false)
const submitting = ref(false)
const submitError = ref('')
const booked = ref(null)

const slotsByDay = computed(() => groupByDay(slots.value))
const days = computed(() => Object.keys(slotsByDay.value))

let requestId = 0
async function loadSlots() {
  if (!typeId.value) return
  const current = ++requestId
  loading.value = true
  loadError.value = ''
  selectedSlot.value = null
  try {
    const raw = await $fetch(`/api/backend/praticiens/${props.praticien.id}/slots`, {
      query: { from: weekStart.value, to: addDays(weekStart.value, 6), consultationTypeId: typeId.value },
    })
    if (current === requestId) {
      slots.value = normalizeSlots(raw)
      if (wantedSlot.value) {
        if (slots.value.includes(wantedSlot.value)) selectedSlot.value = wantedSlot.value
        else slotGone.value = true
        wantedSlot.value = null
      }
    }
  } catch (e) {
    if (current === requestId) {
      slots.value = []
      loadError.value = e?.data?.statusMessage || e?.data?.message || 'Impossible de charger les créneaux. Réessayez dans un instant.'
    }
  } finally {
    if (current === requestId) loading.value = false
  }
}

function shiftWeek(n) {
  const next = addDays(weekStart.value, n)
  weekStart.value = next < minWeek ? minWeek : next
}

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const k of Object.keys(query)) if (query[k] == null) delete query[k]
  router.replace({ query })
}

function choose(slot) {
  selectedSlot.value = slot
  slotGone.value = false
  setQuery({ type: String(typeId.value), slot })
}

watch([typeId, weekStart], loadSlots)
// Un changement venu de l'adresse est déjà synchronisé : on n'efface le créneau que pour un choix fait dans le module.
watch(typeId, (id, old) => { if (old != null && String(route.query.type) !== String(id)) setQuery({ type: String(id), slot: null }) })
onMounted(loadSlots)

// Liens externes (« Réserver » sur une prestation, prochain créneau) : synchronisent le module via l'adresse.
watch(() => [route.query.type, route.query.slot], ([t, s]) => {
  const nextType = typeFromQuery(t)
  const nextSlot = slotFromQuery(s)
  if (nextType && nextType !== typeId.value) typeId.value = nextType
  if (nextSlot && nextSlot !== selectedSlot.value) {
    wantedSlot.value = nextSlot
    const w = weekFor(nextSlot)
    if (w !== weekStart.value) weekStart.value = w
    else loadSlots()
  }
})

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
    if (e?.statusCode === 401 || e?.status === 401) {
      await useSession().logout()
      await navigateTo({ path: '/login', query: { redirect: route.fullPath } })
      return
    }
    if (e?.statusCode === 409 || e?.status === 409) {
      submitError.value = 'Ce créneau vient d\'être réservé. Choisissez-en un autre.'
      await loadSlots()
    } else {
      submitError.value = e?.data?.statusMessage || e?.data?.message || 'La réservation a échoué. Réessayez dans un instant.'
    }
  } finally {
    submitting.value = false
  }
}
</script>
