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
        <img v-if="photo && !photoFailed" ref="photoEl" :src="photo" :alt="`Photo de ${fullName}`" width="80" height="80" referrerpolicy="no-referrer" class="w-20 h-20 shrink-0 rounded-full object-cover bg-[#e0ecf2]" @error="photoFailed = true" />
        <div v-else class="w-20 h-20 shrink-0 rounded-full bg-[#156F71] text-white flex items-center justify-center font-bold text-2xl" aria-hidden="true">{{ initials }}</div>
        <div class="flex-1 min-w-0">
          <h1 class="font-unbounded font-bold text-2xl lg:text-3xl leading-tight">{{ fullName }}</h1>
          <p v-if="praticien.isVerified || rating || experience" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2 text-[#012828]/80">
            <span v-if="praticien.isVerified" class="inline-flex items-center gap-1 font-semibold text-[#156F71]"><BadgeCheck :size="16" aria-hidden="true" /> Profil vérifié</span>
            <span v-if="rating" class="inline-flex items-center gap-1"><Star :size="14" aria-hidden="true" /> {{ rating }} ({{ praticien.reviewCount }} avis)</span>
            <span v-if="experience">{{ experience }}</span>
          </p>
          <ul v-if="praticien.specialities?.length" class="flex flex-wrap gap-1.5 mt-3" aria-label="Spécialités">
            <li v-for="s in praticien.specialities" :key="s.id" class="text-xs font-semibold text-[#156F71] bg-[#e0ecf2] rounded-full px-3 py-1">{{ s.name }}</li>
          </ul>
          <p class="flex items-center gap-1.5 text-sm text-[#012828]/70 mt-3">
            <MapPin :size="15" aria-hidden="true" /> {{ praticien.city }}<template v-if="praticien.postalCode"> ({{ formatPostalCode(praticien.postalCode) }})</template>
          </p>
          <!-- Note Google en direct (distincte des avis Léya) : seulement si la fiche est liée à un lieu Google -->
          <GoogleRating v-if="praticien.hasGoogleRating" :praticien-id="id" class="mt-2" />
        </div>
        <div v-if="bookable && nextSlot" class="sm:text-right sm:max-w-[240px]">
          <p class="text-xs font-semibold uppercase tracking-wide text-[#012828]/50">Prochaine disponibilité</p>
          <p class="font-bold mt-1 first-letter:uppercase">{{ formatLongDate(nextSlot) }}</p>
          <button type="button" class="mt-3 bg-[#EC7F7A] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:brightness-105 transition" @click="bookSlot(nextSlot)">Réserver ce créneau</button>
        </div>
        <a v-else-if="bookable && types.length" href="#reservation" class="shrink-0 bg-[#012828] text-white text-sm font-bold px-6 py-3 rounded-[12px] text-center hover:bg-[#156F71] transition-colors">Prendre rendez-vous</a>
      </header>

      <div class="grid gap-6 lg:grid-cols-5 items-start">
        <section v-if="about" class="card lg:col-span-3 lg:col-start-1" aria-labelledby="about-title">
          <h2 id="about-title" class="card-title">Présentation</h2>
          <p class="text-sm leading-relaxed whitespace-pre-line text-[#012828]/80">{{ about }}</p>
        </section>

        <!-- Fiche sans réservation en ligne : information, revendication et retrait -->
        <section v-if="!bookable" class="lg:col-span-2 lg:col-start-4 lg:row-start-1 lg:row-span-3 bg-white rounded-[20px] shadow-sm p-6 sm:p-8" aria-labelledby="unclaimed-title">
          <h2 id="unclaimed-title" class="font-unbounded font-bold text-lg mb-4">Réservation indisponible</h2>
          <ClaimListing :praticien="praticien" />
        </section>

        <!-- 1. Prestations : c'est ici que se choisit la prestation -->
        <section v-if="bookable" id="prestations" class="card lg:col-span-3 lg:col-start-1 scroll-mt-28" aria-labelledby="services-title">
          <h2 id="services-title" class="card-title">Prestations et tarifs</h2>
          <fieldset v-if="types.length > 1">
            <legend class="text-xs text-gray-500 mb-3">Choisissez une prestation, puis un créneau.</legend>
            <ul class="grid gap-2">
              <li v-for="t in types" :key="t.id">
                <label
                  class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors"
                  :class="t.id === selectedTypeId ? 'border-[#156F71] bg-[#e0ecf2]/50' : 'border-gray-200 hover:border-gray-300'"
                >
                  <span class="flex items-center gap-3">
                    <input type="radio" name="prestation" :value="t.id" :checked="t.id === selectedTypeId" class="accent-[#156F71]" @change="selectType(t.id)" />
                    <span>
                      <span class="block text-sm font-semibold">{{ t.name }}</span>
                      <span class="block text-xs text-gray-500">{{ t.durationMin }} min · {{ t.mode === 'visio' ? 'En visio' : 'Au cabinet' }}</span>
                    </span>
                  </span>
                  <span v-if="t.price != null" class="text-sm font-bold text-[#E8755A]">{{ t.price }} €</span>
                </label>
              </li>
            </ul>
          </fieldset>
          <ul v-else-if="types.length" class="grid gap-2">
            <li v-for="t in types" :key="t.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#156F71] bg-[#e0ecf2]/50 px-4 py-3">
              <span>
                <span class="block text-sm font-semibold">{{ t.name }}</span>
                <span class="block text-xs text-gray-500">{{ t.durationMin }} min · {{ t.mode === 'visio' ? 'En visio' : 'Au cabinet' }}</span>
              </span>
              <span v-if="t.price != null" class="text-sm font-bold text-[#E8755A]">{{ t.price }} €</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500">
            Ce praticien n'a pas encore détaillé ses prestations<template v-if="praticien.price"> (à partir de {{ praticien.price }} € la séance)</template>.
          </p>
        </section>

        <!-- 2. Réservation : choix du créneau (colonne latérale fixe sur ordinateur) -->
        <section v-if="bookable" id="reservation" class="lg:col-span-2 lg:col-start-4 lg:row-start-1 lg:row-span-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto bg-white rounded-[20px] shadow-sm p-6 sm:p-8 scroll-mt-28" aria-labelledby="booking-title">
          <h2 id="booking-title" class="font-unbounded font-bold text-lg mb-5">Prendre rendez-vous</h2>
          <AppointmentBooking :praticien="praticien" :types="types" />
        </section>

        <section v-if="bookable" class="card lg:col-span-3 lg:col-start-1" aria-labelledby="hours-title">
          <h2 id="hours-title" class="card-title">Horaires d'ouverture</h2>
          <ul v-if="hasHours" class="grid gap-1 text-sm">
            <li v-for="d in DAYS" :key="d.n" class="flex gap-4 rounded-lg px-3 py-2" :class="d.n === todayN ? 'bg-[#e0ecf2]/70 font-semibold' : ''">
              <span class="w-24 shrink-0">{{ d.label }}</span>
              <span v-if="!week[d.n].length" class="text-gray-400">Fermé</span>
              <span v-else class="flex flex-wrap gap-x-3"><span v-for="r in week[d.n]" :key="r.start" class="whitespace-nowrap">{{ r.start }} – {{ r.end }}</span></span>
            </li>
          </ul>
          <p v-else-if="praticien.schedules" class="text-sm">{{ praticien.schedules }}</p>
          <p v-else class="text-sm text-gray-500">Horaires non renseignés.</p>
        </section>


        <section v-if="practicalInfo.length" class="card lg:col-span-3 lg:col-start-1" aria-labelledby="info-title">
          <h2 id="info-title" class="card-title">Informations pratiques</h2>
          <dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2 text-sm">
            <div v-for="item in practicalInfo" :key="item.label" :class="item.wide ? 'sm:col-span-2' : ''">
              <dt class="text-xs font-semibold uppercase tracking-wide text-[#012828]/50">{{ item.label }}</dt>
              <dd class="mt-1 whitespace-pre-line text-[#012828]/80">{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="diplomas.length" class="card lg:col-span-3 lg:col-start-1" aria-labelledby="diplomas-title">
          <h2 id="diplomas-title" class="card-title">Formation et diplômes</h2>
          <ul class="grid gap-3 text-sm">
            <li v-for="d in diplomas" :key="d.id ?? d.title" class="flex flex-wrap items-baseline justify-between gap-x-4">
              <span><span class="font-semibold">{{ d.title }}</span><template v-if="d.organization"> — {{ d.organization }}</template></span>
              <span v-if="d.year" class="text-[#012828]/60">{{ d.year }}</span>
            </li>
          </ul>
        </section>

        <section class="card lg:col-span-3 lg:col-start-1" aria-labelledby="where-title">
          <h2 id="where-title" class="card-title">Adresse et contact</h2>
          <address class="not-italic text-sm leading-relaxed">
            {{ praticien.address }}<br />{{ formatPostalCode(praticien.postalCode) }} {{ praticien.city }}
          </address>
          <div class="flex flex-wrap gap-3 mt-4">
            <a :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-3 hover:border-[#156F71] transition-colors">
              <Navigation :size="15" aria-hidden="true" /> Itinéraire
            </a>
            <a v-if="safeWebsite" :href="safeWebsite" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-3 hover:border-[#156F71] transition-colors">
              <Globe :size="15" aria-hidden="true" /> Site web
            </a>
            <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-3 hover:border-[#156F71] transition-colors">
              <Globe :size="15" aria-hidden="true" /> {{ link.label }}
            </a>
            <a v-if="praticien.phoneNumber" :href="`tel:${praticien.phoneNumber}`" class="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 rounded-[10px] px-4 py-3 hover:border-[#156F71] transition-colors">
              <Phone :size="15" aria-hidden="true" /> {{ praticien.phoneNumber }}
            </a>
          </div>
        </section>


        <p class="text-xs text-[#012828]/50 leading-relaxed px-2 lg:col-span-3 lg:col-start-1">
          Fiche professionnelle. Ce praticien exerce sous sa propre responsabilité ; Léya n'est pas partie à la relation de soin et ne remplace pas un avis médical.
          <NuxtLink to="/cgu" class="underline">En savoir plus</NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { MapPin, Phone, Navigation, Globe, BadgeCheck, Star } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
// L'adresse publique est le slug. Les anciennes adresses numériques (/praticiens/12) redirigent vers elle.
const param = String(route.params.slug)
const legacyId = /^\d+$/.test(param)
if (!legacyId && !/^[a-z0-9-]{1,120}$/.test(param)) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: praticien, error } = await useAsyncData(`praticien-${param}`, () =>
  $fetch(legacyId ? `/api/backend/praticiens/${param}` : `/api/backend/praticiens/slug/${param}`),
)
if (error.value || !praticien.value) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}
if (legacyId && praticien.value.slug) {
  await navigateTo({ path: `/praticiens/${praticien.value.slug}`, query: route.query }, { redirectCode: 301, replace: true })
}
const id = praticien.value.id

// Les fiches non revendiquées n'ont ni prestations ni créneaux : on ne les interroge pas.
const bookable = computed(() => praticien.value.bookable !== false)

const { data: rawTypes } = await useAsyncData(`praticien-${id}-types`, () =>
  bookable.value ? $fetch(`/api/backend/praticiens/${id}/consultation-types`).catch(() => []) : [],
)
const types = computed(() => normalizeTypes(rawTypes.value))
// Prestation active dans le module de réservation (synchronisée par l'adresse).
const selectedTypeId = computed(() => types.value.find(t => t.id === Number(route.query.type))?.id ?? types.value[0]?.id ?? null)

const { data: rawHours } = await useAsyncData(`praticien-${id}-hours`, () =>
  bookable.value ? $fetch(`/api/backend/praticiens/${id}/availabilities`).catch(() => []) : [],
)
const week = computed(() => weekFromServer(rawHours.value))
const hasHours = computed(() => Array.isArray(rawHours.value) && rawHours.value.length > 0)
const todayN = computed(() => { const d = new Date(`${todayKey()}T12:00:00Z`).getUTCDay(); return d === 0 ? 7 : d })

const fullName = computed(() => `${praticien.value.firstName} ${praticien.value.lastName}`)
const initials = computed(() => `${(praticien.value.firstName || '?')[0]}${(praticien.value.lastName || '')[0] || ''}`.toUpperCase())
// Texte de présentation : affiché dès que l'API le fournira.
const about = computed(() => praticien.value.bio ?? praticien.value.description ?? praticien.value.about ?? praticien.value.presentation ?? '')
// Site web : uniquement http(s), sinon on ne l'affiche pas
const safeWebsite = computed(() => { try { const u = new URL(praticien.value.website); return ['http:', 'https:'].includes(u.protocol) ? u.href : '' } catch { return '' } })
const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${praticien.value.address}, ${formatPostalCode(praticien.value.postalCode)} ${praticien.value.city}`)}`)

// --- Informations facultatives de la fiche : on n'affiche que ce que l'API fournit
const isHttps = (value) => { try { return new URL(value).protocol === 'https:' } catch { return false } }
const photo = computed(() => (isHttps(praticien.value.photoUrl) ? praticien.value.photoUrl : ''))
const photoFailed = ref(false)
const photoEl = ref(null)
// L'erreur de chargement peut survenir avant l'hydratation (rendu serveur) : on la revérifie au montage.
onMounted(() => { const el = photoEl.value; if (el?.complete && el.naturalWidth === 0) photoFailed.value = true })
const rating = computed(() => (praticien.value.averageRating && praticien.value.reviewCount > 0
  ? String(Number(praticien.value.averageRating).toFixed(1)).replace('.', ',')
  : ''))
const experience = computed(() => {
  const year = Number(praticien.value.practicingSince)
  return Number.isInteger(year) && year >= 1950 && year <= new Date().getFullYear() ? `Exerce depuis ${year}` : ''
})
const diplomas = computed(() => (Array.isArray(praticien.value.diplomas) ? praticien.value.diplomas.filter(d => d?.title) : []))

const PAYMENTS = PAYMENT_LABELS
const PUBLICS = PUBLIC_LABELS
const languageName = (code) => {
  try { const name = new Intl.DisplayNames(['fr'], { type: 'language' }).of(code); return name ? name.charAt(0).toUpperCase() + name.slice(1) : code } catch { return code }
}
const practicalInfo = computed(() => {
  const p = praticien.value
  const items = []
  const list = (values, map) => (Array.isArray(values) ? values.map(v => map(v)).filter(Boolean).join(', ') : '')
  const publics = list(p.publicTypes, v => PUBLICS[v])
  if (publics) items.push({ label: 'Public accueilli', value: publics })
  const languages = list(p.languages, v => languageName(v))
  if (languages) items.push({ label: 'Langues parlées', value: languages })
  const payments = list(p.paymentMethods, v => PAYMENTS[v])
  if (payments) items.push({ label: 'Moyens de paiement', value: payments })
  if (typeof p.wheelchairAccessible === 'boolean') items.push({ label: 'Accessibilité', value: p.wheelchairAccessible ? 'Accessible aux personnes à mobilité réduite' : 'Non accessible aux personnes à mobilité réduite' })
  if (typeof p.reimbursementInfo === 'string' && p.reimbursementInfo.trim()) items.push({ label: 'Remboursement', value: p.reimbursementInfo.trim(), wide: true })
  return items
})
const SOCIAL = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok' }
const socialLinks = computed(() => Object.entries(SOCIAL)
  .map(([key, label]) => ({ label, href: praticien.value.socialLinks?.[key] }))
  .filter(l => isHttps(l.href)))

// --- Prochaine disponibilité (première prestation, 30 jours)
const nextSlot = ref(null)
onMounted(async () => {
  const first = types.value[0]
  if (!first || !bookable.value) return
  try {
    const raw = await $fetch(`/api/backend/praticiens/${id}/slots`, {
      query: { from: todayKey(), to: addDays(todayKey(), 30), consultationTypeId: first.id },
    })
    const slots = normalizeSlots(raw).sort()
    nextSlot.value = slots.find(s => Date.parse(s) > Date.now()) ?? null
  } catch { /* la prochaine disponibilité est un confort : on l'ignore en cas d'erreur */ }
})

// Choix de la prestation : l'adresse fait foi, le module de réservation s'y synchronise.
function selectType(typeId) {
  router.replace({ query: { ...route.query, type: String(typeId), slot: undefined } })
}

function scrollToBooking() {
  document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function bookSlot(slot) {
  router.replace({ query: { ...route.query, type: String(types.value[0].id), slot } })
  scrollToBooking()
}

// Indexation : uniquement les fiches revendiquées et suffisamment renseignées (voir shared/utils/praticien.ts).
// Les autres restent en noindex : fiches nominatives non revendiquées ou pages trop pauvres.
const indexable = computed(() => isIndexablePraticien(praticien.value))
const canonicalUrl = computed(() => `https://leya-sante.fr/praticiens/${praticien.value.slug ?? id}`)

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: indexable.value ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd()) }] : [],
}))

function jsonLd() {
  const p = praticien.value
  const business = {
    '@type': 'MedicalBusiness',
    '@id': `${canonicalUrl.value}#praticien`,
    name: fullName.value,
    url: canonicalUrl.value,
    address: { '@type': 'PostalAddress', streetAddress: p.address, postalCode: formatPostalCode(p.postalCode), addressLocality: p.city, addressCountry: 'FR' },
    ...(p.phoneNumber ? { telephone: p.phoneNumber } : {}),
    ...(([safeWebsite.value, ...socialLinks.value.map(l => l.href)].filter(Boolean)).length ? { sameAs: [safeWebsite.value, ...socialLinks.value.map(l => l.href)].filter(Boolean) } : {}),
    ...(Array.isArray(p.paymentMethods) && p.paymentMethods.length ? { paymentAccepted: p.paymentMethods.map(m => PAYMENTS[m]).filter(Boolean).join(', ') } : {}),
    ...(p.photoUrl ? { image: p.photoUrl } : {}),
    ...(p.bio ? { description: p.bio } : {}),
    ...(p.specialities?.length ? { knowsAbout: p.specialities.map(s => s.name) } : {}),
    ...(p.latitude != null && p.longitude != null ? { geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude } } : {}),
    ...(p.averageRating && p.reviewCount > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.averageRating, reviewCount: p.reviewCount } } : {}),
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://leya-sante.fr' },
          { '@type': 'ListItem', position: 2, name: 'Trouver un praticien', item: 'https://leya-sante.fr/trouver-un-praticien' },
          { '@type': 'ListItem', position: 3, name: fullName.value, item: canonicalUrl.value },
        ],
      },
    ],
  }
}

useSeoMeta({
  title: () => bookable.value ? `${fullName.value} — Prendre rendez-vous | Léya` : `${fullName.value} — ${praticien.value.city} | Léya`,
  description: () => bookable.value
    ? `Prenez rendez-vous en ligne avec ${fullName.value} à ${praticien.value.city}.`
    : `Fiche de ${fullName.value}, ${praticien.value.city}.`,
  robots: () => indexable.value ? 'index, follow' : 'noindex, nofollow',
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
@media (min-width: 640px) { .card { padding: 2rem; } }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
</style>
