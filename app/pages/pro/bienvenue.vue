<template>
  <div>
    <!-- Éléments de l'agenda non créés pendant l'inscription -->
    <p v-if="warnings.length" class="bg-amber-50 border border-amber-300 text-amber-900 text-[16px] rounded-[16px] px-4 py-3 mb-6" role="alert">
      Votre compte est bien créé, mais {{ warningLabel }} n'a pas pu être configuré{{ warnings.length > 1 ? 's' : '' }}. Vous pouvez le faire en un instant ci-dessous.
    </p>

    <ProDuplicates />

    <!-- En-tête -->
    <section class="bg-vert-600 text-white rounded-[32px] p-6 sm:p-10 mb-5 mt-1" aria-labelledby="welcome-title">
      <h1 id="welcome-title" class="font-unbounded font-normal text-[26px] mb-2">
        Bienvenue{{ firstName ? `, ${firstName}` : '' }}
      </h1>
      <p class="text-white/85 max-w-[560px]">
        <template v-if="bookable">Votre fiche est en ligne : vos patients peuvent déjà réserver un créneau.</template>
        <template v-else>Votre compte est prêt. Terminez la configuration pour recevoir vos premiers rendez-vous.</template>
      </p>

      <div class="mt-6">
        <div class="flex items-center justify-between text-[16px] font-semibold mb-2">
          <span>Profil complété</span>
          <span>{{ percent }} %</span>
        </div>
        <div class="h-2.5 rounded-full bg-white/20 overflow-hidden" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Complétion du profil">
          <div class="h-full rounded-full bg-corail-500 transition-all duration-700" :style="{ width: `${percent}%` }" />
        </div>
        <p v-if="fiche && !bioOk" class="text-[16px] text-white/85 mt-3">Une présentation d'au moins 50 caractères permet à votre fiche d'apparaître sur Google.</p>
        <ul class="grid gap-1.5 mt-4 text-[16px] sm:grid-cols-2">
          <li v-for="c in checklist" :key="c.label" class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[14px] shrink-0" :class="c.done ? 'bg-white text-vert-600' : 'bg-white/20'" aria-hidden="true">{{ c.done ? '✓' : '' }}</span>
            <span :class="c.done ? '' : 'text-white/70'">{{ c.label }}</span>
            <NuxtLink v-if="!c.done && c.to" :to="c.to" class="underline text-white ml-1 inline-block py-2">{{ c.cta }}</NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Actions -->
    <div class="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
      <section v-if="praticienId" class="card" aria-labelledby="share-title">
        <h2 id="share-title" class="card-title">Partager mon lien de réservation</h2>
        <p class="text-[16px] text-neutre-600 mb-3">Envoyez-le à vos patients, ajoutez-le à votre site ou à votre signature d'email.</p>
        <div class="flex gap-2">
          <input :value="shareUrl" readonly class="flex-1 min-w-0 rounded-[16px] border border-neutre-300 bg-gray-50 px-3 py-2.5 text-[16px]" aria-label="Lien de réservation" @focus="$event.target.select()" />
          <button type="button" class="shrink-0 bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 transition-colors" @click="copyLink">
            {{ copied ? 'Copié ✓' : 'Copier' }}
          </button>
        </div>
        <p class="sr-only" role="status">{{ copied ? 'Lien copié dans le presse-papiers' : '' }}</p>
      </section>

      <section v-if="praticienId" class="card" aria-labelledby="public-title">
        <h2 id="public-title" class="card-title">Voir ma fiche publique</h2>
        <p class="text-[16px] text-neutre-600 mb-3">C'est ce que vos patients voient : vos spécialités, vos prestations, vos horaires et votre calendrier.</p>
        <NuxtLink :to="`/praticiens/${fiche?.slug || praticienId}`" target="_blank" class="inline-flex items-center border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-900 hover:text-white transition-colors">
          Ouvrir ma fiche ↗
        </NuxtLink>
      </section>

      <section v-if="!hasTypes" class="card" aria-labelledby="svc-title">
        <h2 id="svc-title" class="card-title">Ajouter une prestation</h2>
        <p class="text-[16px] text-neutre-600 mb-3">Sans prestation, vos patients ne peuvent pas réserver. Par exemple « Première séance », 60 min.</p>
        <NuxtLink to="/pro/prestations" class="inline-flex items-center bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 transition-colors">Ajouter</NuxtLink>
      </section>

      <section v-if="!hasHours" class="card" aria-labelledby="hours-title">
        <h2 id="hours-title" class="card-title">Définir mes horaires</h2>
        <p class="text-[16px] text-neutre-600 mb-3">Choisissez un modèle en un clic, puis ajustez jour par jour.</p>
        <NuxtLink to="/pro/horaires" class="inline-flex items-center bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 transition-colors">Définir</NuxtLink>
      </section>

      <section class="card" aria-labelledby="confirm-title">
        <h2 id="confirm-title" class="card-title">Mode de confirmation</h2>
        <p class="text-[16px] text-neutre-600 mb-3">Confirmez chaque demande vous-même, ou laissez les rendez-vous se confirmer automatiquement.</p>
        <NuxtLink to="/pro/parametres" class="inline-flex items-center border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-900 hover:text-white transition-colors">Choisir</NuxtLink>
      </section>
    </div>

    <div class="mt-8 flex justify-center">
      <NuxtLink to="/pro" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors">
        Accéder à mon tableau de bord
        <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center" aria-hidden="true">↗</span>
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

const { hasTypes, hasHours, bookable, fiche, bioOk, checklist, percent } = useProCompletion()

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
.card { background: #fff; border-radius: 28px; padding: 1.75rem; }
.card-title { font-family: 'Unbounded', cursive; font-weight: 400; font-size: 1.25rem; margin-bottom: 0.5rem; }
</style>
