<template>
  <div>
    <!-- Éléments de l'agenda non créés pendant l'inscription -->
    <p v-if="warnings.length" class="bg-amber-50 border border-amber-300 text-amber-900 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
      Votre compte est bien créé, mais {{ warningLabel }} n'a pas pu être configuré{{ warnings.length > 1 ? 's' : '' }}. Vous pouvez le faire en un instant ci-dessous.
    </p>

    <!-- En-tête -->
    <section class="bg-[#156F71] text-white rounded-[20px] p-6 sm:p-8 mb-6" aria-labelledby="welcome-title">
      <h1 id="welcome-title" class="font-unbounded font-bold text-2xl lg:text-3xl mb-2">
        Bienvenue{{ firstName ? `, ${firstName}` : '' }}
      </h1>
      <p class="text-white/85 max-w-[560px]">
        <template v-if="bookable">Votre fiche est en ligne : vos patients peuvent déjà réserver un créneau.</template>
        <template v-else>Votre compte est prêt. Terminez la configuration pour recevoir vos premiers rendez-vous.</template>
      </p>

      <div class="mt-6">
        <div class="flex items-center justify-between text-sm font-semibold mb-2">
          <span>Profil complété</span>
          <span>{{ percent }} %</span>
        </div>
        <div class="h-2.5 rounded-full bg-white/20 overflow-hidden" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Complétion du profil">
          <div class="h-full rounded-full bg-[#EC7F7A] transition-all duration-700" :style="{ width: `${percent}%` }" />
        </div>
        <p v-if="fiche && !bioOk" class="text-sm text-white/85 mt-3">Une présentation d'au moins 50 caractères permet à votre fiche d'apparaître sur Google.</p>
        <ul class="grid gap-1.5 mt-4 text-sm sm:grid-cols-2">
          <li v-for="c in checklist" :key="c.label" class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0" :class="c.done ? 'bg-white text-[#156F71]' : 'bg-white/20'" aria-hidden="true">{{ c.done ? '✓' : '' }}</span>
            <span :class="c.done ? '' : 'text-white/70'">{{ c.label }}</span>
            <NuxtLink v-if="!c.done && c.to" :to="c.to" class="underline text-white ml-1">{{ c.cta }}</NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Actions -->
    <div class="grid gap-4 md:grid-cols-2">
      <section v-if="praticienId" class="card" aria-labelledby="share-title">
        <h2 id="share-title" class="card-title">Partager mon lien de réservation</h2>
        <p class="text-sm text-[#012828]/70 mb-3">Envoyez-le à vos patients, ajoutez-le à votre site ou à votre signature d'email.</p>
        <div class="flex gap-2">
          <input :value="shareUrl" readonly class="flex-1 min-w-0 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm" aria-label="Lien de réservation" @focus="$event.target.select()" />
          <button type="button" class="shrink-0 bg-[#012828] text-white text-sm font-bold px-4 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors" @click="copyLink">
            {{ copied ? 'Copié ✓' : 'Copier' }}
          </button>
        </div>
        <p class="sr-only" role="status">{{ copied ? 'Lien copié dans le presse-papiers' : '' }}</p>
      </section>

      <section v-if="praticienId" class="card" aria-labelledby="public-title">
        <h2 id="public-title" class="card-title">Voir ma fiche publique</h2>
        <p class="text-sm text-[#012828]/70 mb-3">C'est ce que vos patients voient : vos spécialités, vos prestations, vos horaires et votre calendrier.</p>
        <NuxtLink :to="`/praticiens/${fiche?.slug || praticienId}`" target="_blank" class="inline-block border border-[#012828] text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#012828] hover:text-white transition-colors">
          Ouvrir ma fiche ↗
        </NuxtLink>
      </section>

      <section v-if="!hasTypes" class="card" aria-labelledby="svc-title">
        <h2 id="svc-title" class="card-title">Ajouter une prestation</h2>
        <p class="text-sm text-[#012828]/70 mb-3">Sans prestation, vos patients ne peuvent pas réserver. Par exemple « Première séance », 60 min.</p>
        <NuxtLink to="/pro/prestations" class="inline-block bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors">Ajouter</NuxtLink>
      </section>

      <section v-if="!hasHours" class="card" aria-labelledby="hours-title">
        <h2 id="hours-title" class="card-title">Définir mes horaires</h2>
        <p class="text-sm text-[#012828]/70 mb-3">Choisissez un modèle en un clic, puis ajustez jour par jour.</p>
        <NuxtLink to="/pro/horaires" class="inline-block bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors">Définir</NuxtLink>
      </section>

      <section class="card" aria-labelledby="confirm-title">
        <h2 id="confirm-title" class="card-title">Mode de confirmation</h2>
        <p class="text-sm text-[#012828]/70 mb-3">Confirmez chaque demande vous-même, ou laissez les rendez-vous se confirmer automatiquement.</p>
        <NuxtLink to="/pro/parametres" class="inline-block border border-[#012828] text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#012828] hover:text-white transition-colors">Choisir</NuxtLink>
      </section>
    </div>

    <div class="mt-8 flex justify-center">
      <NuxtLink to="/pro/rendez-vous" class="bg-[#EC7F7A] text-white font-bold px-8 py-3.5 rounded-[14px] hover:brightness-105 transition">
        Accéder à mon tableau de bord
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Bienvenue — Espace praticien Léya', robots: 'noindex, nofollow' })

const { praticienId } = useSession()
const welcome = useState('pro-welcome', () => null)
const firstName = computed(() => welcome.value?.firstName ?? '')
const warnings = computed(() => welcome.value?.warnings ?? [])
const warningLabel = computed(() => warnings.value.map(w => (w === 'prestation' ? 'votre prestation' : 'vos horaires')).join(' et '))

// Clés partagées avec les pages Prestations et Horaires : les données ne sont chargées qu'une fois.
const { data: types } = await useAsyncData('pro-types', () => $fetch('/api/backend/praticiens/me/consultation-types'), { server: false, default: () => [] })
const { data: hours } = await useAsyncData('pro-hours', () => $fetch('/api/backend/praticiens/me/availabilities'), { server: false, default: () => [] })

const hasTypes = computed(() => (Array.isArray(types.value) ? types.value : []).some(t => t.isActive !== false))
const hasHours = computed(() => Array.isArray(hours.value) && hours.value.length > 0)
const bookable = computed(() => hasTypes.value && hasHours.value)

// Fiche du praticien (champs privés compris) : sert aux jalons de complétude et au lien public
const { data: fiche } = await useAsyncData('pro-fiche-slug', () => $fetch('/api/backend/praticiens/me'), { server: false, default: () => null })
const bioOk = computed(() => (fiche.value?.bio ?? '').trim().length >= 50)
const infosOk = computed(() => !!(fiche.value && (fiche.value.languages?.length || fiche.value.publicTypes?.length || fiche.value.paymentMethods?.length)))

const checklist = computed(() => [
  { label: 'Compte créé', done: true },
  { label: 'Fiche et spécialités renseignées', done: true },
  { label: 'Présentation rédigée', done: bioOk.value, to: '/pro/fiche#presentation', cta: 'Rédiger' },
  { label: 'Informations pratiques', done: infosOk.value, to: '/pro/fiche#pratique', cta: 'Compléter' },
  { label: 'Prestation ajoutée', done: hasTypes.value, to: '/pro/prestations', cta: 'Ajouter' },
  { label: 'Horaires définis', done: hasHours.value, to: '/pro/horaires', cta: 'Définir' },
])
const percent = computed(() => {
  // Six jalons : compte et fiche (créés à l'inscription), présentation, informations pratiques, prestation, horaires.
  const done = 2 + (bioOk.value ? 1 : 0) + (infosOk.value ? 1 : 0) + (hasTypes.value ? 1 : 0) + (hasHours.value ? 1 : 0)
  return Math.round((done / 6) * 100)
})

const origin = useRequestURL().origin
// Lien public : le slug de la fiche (l'ancienne adresse numérique redirige, elle sert de repli)
const shareUrl = computed(() => `${origin}/praticiens/${fiche.value?.slug || praticienId.value}`)
const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    const input = document.querySelector('input[aria-label="Lien de réservation"]')
    input?.select()
    document.execCommand?.('copy')
  }
  copied.value = true
  trackEvent('pro-share-link-copied')
  setTimeout(() => { copied.value = false }, 2500)
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
</style>
