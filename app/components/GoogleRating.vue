<template>
  <p v-if="rating" class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-[#012828]/80">
    <Star :size="15" class="text-[#E8A33D] fill-[#E8A33D]" aria-hidden="true" />
    <span class="font-semibold">{{ formattedRating }}</span>
    <span class="text-[#012828]/60">({{ rating.userRatingCount }} avis)</span>
    <!-- Attribution exigée par Google : le texte « Google Maps », sans traduction ni changement de casse -->
    <span class="text-[#012828]/60">· Google Maps</span>
    <a
      v-if="rating.googleMapsUri"
      :href="rating.googleMapsUri"
      target="_blank"
      rel="noopener noreferrer"
      class="underline text-[#156F71] hover:text-[#012828]"
    >Voir les avis</a>
  </p>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({ praticienId: { type: Number, required: true } })

// Lue côté navigateur à chaque affichage (jamais stockée ni mise en cache) ; chaque lecture est facturée par Google.
// En cas d'erreur (404 sans fiche liée, 502 Google injoignable, 503 clé absente), rien n'est affiché.
const rating = ref(null)
onMounted(async () => {
  try {
    const result = await $fetch(`/api/backend/praticiens/${props.praticienId}/google-rating`)
    if (typeof result?.rating === 'number' && result.userRatingCount > 0) rating.value = result
  } catch { /* rien à afficher */ }
})

const formattedRating = computed(() =>
  rating.value?.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }))
</script>
