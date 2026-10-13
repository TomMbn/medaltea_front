<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[1100px] mx-auto pt-32 pb-8 text-[#012828]">
      <!-- Fil d'Ariane -->
      <nav aria-label="Fil d'Ariane" class="text-sm mb-5">
        <ol class="flex flex-wrap items-center gap-1.5 text-[#156F71]">
          <li><NuxtLink to="/trouver-un-praticien" class="hover:underline">Trouver un praticien</NuxtLink></li>
          <li aria-hidden="true">›</li>
          <li><NuxtLink :to="{ path: '/trouver-un-praticien', query: { q: praticien.city }, hash: '#resultats' }" class="hover:underline">{{ praticien.city }}</NuxtLink></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" class="text-[#012828]/70">{{ fullName }}</li>
        </ol>
      </nav>

      <!-- En-tête du profil -->
      <header class="bg-white rounded-[20px] shadow-sm p-6 sm:p-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div class="w-20 h-20 shrink-0 rounded-full bg-[#156F71] text-white flex items-center justify-center font-bold text-2xl" aria-hidden="true">{{ initials }}</div>
        <div class="flex-1 min-w-0">
          <h1 class="font-unbounded font-bold text-2xl lg:text-3xl leading-tight">{{ fullName }}</h1>
          <ul v-if="praticien.specialities?.length" class="flex flex-wrap gap-1.5 mt-3" aria-label="Spécialités">
            <li v-for="s in praticien.specialities" :key="s.id" class="text-xs font-semibold text-[#156F71] bg-[#e0ecf2] rounded-full px-3 py-1">{{ s.name }}</li>
          </ul>
          <p class="flex items-center gap-1.5 text-sm text-[#012828]/70 mt-3">
            <MapPin :size="15" aria-hidden="true" /> {{ praticien.city }}<template v-if="praticien.postalCode"> ({{ formatPostalCode(praticien.postalCode) }})</template>
          </p>
        </div>
        <div v-if="nextSlot" class="sm:text-right sm:max-w-[240px]">
          <p class="text-xs font-semibold uppercase tracking-wide text-[#012828]/50">Prochaine disponibilité</p>
          <p class="font-bold mt-1 first-letter:uppercase">{{ formatLongDate(nextSlot) }}</p>
          <button type="button" class="mt-3 bg-[#EC7F7A] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:brightness-105 transition" @click="bookSlot(nextSlot)">Réserver ce créneau</button>
        </div>
        <a v-else-if="types.length" href="#reservation" class="shrink-0 bg-[#012828] text-white text-sm font-bold px-6 py-3 rounded-[12px] text-center hover:bg-[#156F71] transition-colors">Prendre rendez-vous</a>
      </header>

      <div class="grid gap-6 lg:grid-cols-5 items-start">
        <!-- Réservation : en premier sur mobile, colonne latérale fixe sur ordinateur -->
        <section id="reservation" class="lg:col-span-2 lg:order-2 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto bg-white rounded-[20px] shadow-sm p-6 sm:p-8 scroll-mt-28" aria-labelledby="booking-title">
          <h2 id="booking-title" class="font-unbounded font-bold text-lg mb-5">Prendre rendez-vous</h2>
          <AppointmentBooking :praticien="praticien" :types="types" />
        </section>

        <!-- Profil -->
        <div class="lg:col-span-3 lg:order-1 grid gap-6">
          <section v-if="about" class="card" aria-labelledby="about-title">
            <h2 id="about-title" class="card-title">Présentation</h2>
            <p class="text-sm leading-relaxed whitespace-pre-line text-[#012828]/80">{{ about }}</p>
          </section>

          <section class="card" aria-labelledby="services-title">
            <h2 id="services-title" class="card-title">Prestations et tarifs</h2>
            <ul v-if="types.length" class="grid gap-2">
              <li
                v-for="t in types"
                :key="t.id"
                class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors"
                :class="t.id === selectedTypeId ? 'border-[#156F71] bg-[#e0ecf2]/50' : 'border-gray-200'"
              >
                <div>
                  <p class="text-sm font-semibold">{{ t.name }}</p>
                  <p class="text-xs text-gray-500">{{ t.durationMin }} min · {{ t.mode === 'visio' ? 'En visio' : 'Au cabinet' }}</p>
                </div>
                <span v-if="t.price != null" class="text-sm font-bold text-[#E8755A]">{{ t.price }} €</span>
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">
              Ce praticien n'a pas encore détaillé ses prestations<template v-if="praticien.price"> (à partir de {{ praticien.price }} € la séance)</template>.
            </p>
          </section>

          <section class="card" aria-labelledby="hours-title">
            <h2 id="hours-title" class="card-title">Horaires d'ouverture</h2>
            <ul v-if="hasHours" class="grid gap-1 text-sm">
              <li v-for="d in DAYS" :key="d.n" class="flex gap-4 rounded-lg px-3 py-2" :class="d.n === todayN ? 'bg-[#e0ecf2]/70 font-semibold' : ''">
                <span class="w-24 shrink-0">{{ d.label }}</span>
                <span v-if="!week[d.n].length" class="text-gray-400">Fermé</span>
                <span v-else>{{ week[d.n].map(r => `${r.start} – ${r.end}`).join('  ·  ') }}</span>
              </li>
            </ul>
            <p v-else-if="praticien.schedules" class="text-sm">{{ praticien.schedules }}</p>
            <p v-else class="text-sm text-gray-500">Horaires non renseignés.</p>
          </section>

          <section class="card" aria-labelledby="where-title">
            <h2 id="where-title" class="card-title">Adresse et contact</h2>
            <address class="not-italic text-sm leading-relaxed">
              {{ praticien.address }}<br />{{ formatPostalCode(praticien.postalCode) }} {{ praticien.city }}
            </address>
            <div class="flex flex-wrap gap-3 mt-4">
              <a :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-2 hover:border-[#156F71] transition-colors">
                <Navigation :size="15" aria-hidden="true" /> Itinéraire
              </a>
              <a v-if="praticien.phoneNumber" :href="`tel:${praticien.phoneNumber}`" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-2 hover:border-[#156F71] transition-colors">
                <Phone :size="15" aria-hidden="true" /> {{ praticien.phoneNumber }}
              </a>
            </div>
          </section>

          <p class="text-xs text-[#012828]/50 leading-relaxed px-2">
            Fiche professionnelle. Ce praticien exerce sous sa propre responsabilité ; Léya n'est pas partie à la relation de soin et ne remplace pas un avis médical.
            <NuxtLink to="/cgu" class="underline">En savoir plus</NuxtLink>
          </p>
        </div>
      </div>

      <TheFooter />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { MapPin, Phone, Navigation } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
if (!Number.isInteger(id) || id < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: praticien, error } = await useAsyncData(`praticien-${id}`, () => $fetch(`/api/backend/praticiens/${id}`))
if (error.value || !praticien.value) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: rawTypes } = await useAsyncData(`praticien-${id}-types`, () =>
  $fetch(`/api/backend/praticiens/${id}/consultation-types`).catch(() => []),
)
const types = computed(() => normalizeTypes(rawTypes.value))
// Prestation active dans le module de réservation (synchronisée par l'adresse).
const selectedTypeId = computed(() => types.value.find(t => t.id === Number(route.query.type))?.id ?? types.value[0]?.id ?? null)

const { data: rawHours } = await useAsyncData(`praticien-${id}-hours`, () =>
  $fetch(`/api/backend/praticiens/${id}/availabilities`).catch(() => []),
)
const week = computed(() => weekFromServer(rawHours.value))
const hasHours = computed(() => Array.isArray(rawHours.value) && rawHours.value.length > 0)
const todayN = computed(() => { const d = new Date(`${todayKey()}T12:00:00Z`).getUTCDay(); return d === 0 ? 7 : d })

const fullName = computed(() => `${praticien.value.firstName} ${praticien.value.lastName}`)
const initials = computed(() => `${(praticien.value.firstName || '?')[0]}${(praticien.value.lastName || '')[0] || ''}`.toUpperCase())
// Texte de présentation : affiché dès que l'API le fournira.
const about = computed(() => praticien.value.description ?? praticien.value.about ?? praticien.value.presentation ?? '')
const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${praticien.value.address}, ${formatPostalCode(praticien.value.postalCode)} ${praticien.value.city}`)}`)

// --- Prochaine disponibilité (première prestation, 30 jours)
const nextSlot = ref(null)
onMounted(async () => {
  const first = types.value[0]
  if (!first) return
  try {
    const raw = await $fetch(`/api/backend/praticiens/${id}/slots`, {
      query: { from: todayKey(), to: addDays(todayKey(), 30), consultationTypeId: first.id },
    })
    const slots = normalizeSlots(raw).sort()
    nextSlot.value = slots.find(s => Date.parse(s) > Date.now()) ?? null
  } catch { /* la prochaine disponibilité est un confort : on l'ignore en cas d'erreur */ }
})

function scrollToBooking() {
  document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function bookSlot(slot) {
  router.replace({ query: { ...route.query, type: String(types.value[0].id), slot } })
  scrollToBooking()
}

// Fiches nominatives : non indexées tant que le cadre légal (information, opposition) n'est pas validé.
useSeoMeta({
  title: () => `${fullName.value} — Prendre rendez-vous | Léya`,
  description: () => `Prenez rendez-vous en ligne avec ${fullName.value} à ${praticien.value.city}.`,
  robots: 'noindex, nofollow',
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
@media (min-width: 640px) { .card { padding: 2rem; } }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
</style>
