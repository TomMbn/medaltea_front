<template>
  <section v-if="visible" class="bg-white rounded-[28px] p-5 sm:p-8 mb-5" aria-labelledby="duplicates-title">
    <h2 id="duplicates-title" class="font-unbounded font-normal text-[20px] mb-1">Une fiche existe peut-être déjà à votre nom</h2>
    <p class="text-[16px] text-neutre-600 mb-5">
      Léya répertorie des praticiens à partir d'informations publiques. Pour éviter un doublon, votre fiche reste masquée de l'annuaire tant que vous n'avez pas choisi. Un administrateur vérifie chaque demande.
    </p>

    <ul class="grid gap-3">
      <li v-for="c in candidates" :key="c.id" class="rounded-[16px] border border-bleu-100 px-4 py-4">
        <p class="text-[16px] font-semibold">
          {{ c.firstName }} {{ c.lastName }}
          <NuxtLink :to="`/praticiens/${c.slug}`" target="_blank" class="ml-2 text-[14px] font-normal underline text-vert-600">Voir la fiche</NuxtLink>
        </p>
        <p class="text-[14px] text-neutre-600">{{ [c.address, [c.postalCode, c.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') }}</p>

        <p v-if="pendingFor(c.id)" class="mt-3 text-[16px] rounded-2xl bg-bleu-50 px-4 py-3" role="status">
          Demande envoyée : {{ pendingFor(c.id).mode === 'replace' ? 'votre fiche remplacera celle-ci' : 'vous reprendrez cette fiche' }} après vérification.
        </p>
        <div v-else class="mt-3 flex flex-wrap gap-2">
          <button type="button" :disabled="busy" class="min-h-[44px] bg-vert-900 text-white text-[16px] font-semibold px-6 rounded-full hover:bg-vert-600 transition-colors disabled:opacity-60" @click="claim(c, 'takeover')">
            Reprendre et modifier cette fiche
          </button>
          <button type="button" :disabled="busy" class="min-h-[44px] border-[1.5px] border-vert-900 text-vert-900 text-[16px] font-semibold px-6 rounded-full hover:bg-bleu-50 transition-colors disabled:opacity-60" @click="claim(c, 'replace')">
            Repartir de ma nouvelle fiche
          </button>
        </div>
      </li>
    </ul>
    <p class="mt-3 text-[14px] text-neutre-600">
      Reprendre : vous gardez la fiche existante et la modifiez ; votre nouvelle fiche est supprimée. Repartir de votre nouvelle fiche : elle remplace la fiche existante, qui est supprimée ; sa note Google et ses informations manquantes sont reprises.
    </p>

    <p v-if="message" class="mt-4 text-[16px]" :class="error ? 'text-red-700' : 'text-vert-600'" :role="error ? 'alert' : 'status'">{{ message }}</p>

    <button v-if="!hasPending" type="button" :disabled="busy" class="mt-4 text-[14px] underline text-neutre-600 disabled:opacity-60" @click="dismiss">
      Aucune de ces fiches n'est la mienne
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

// Clés partagées avec la page Ma fiche et la liste des revendications : chargées une seule fois
const { data: fiche, refresh: refreshFiche } = await useAsyncData('pro-fiche', () => $fetch('/api/backend/praticiens/me'), { server: false })
const { data: found } = await useAsyncData('pro-duplicates', () => $fetch('/api/backend/praticiens/me/duplicates').catch(() => []), { server: false, default: () => [] })
const { data: claims, refresh: refreshClaims } = await useAsyncData('pro-claims', () => $fetch('/api/backend/praticiens/me/claim-requests').catch(() => []), { server: false, default: () => [] })

const candidates = computed(() => (Array.isArray(found.value) ? found.value : []))
const pendingClaims = computed(() => (Array.isArray(claims.value) ? claims.value : []).filter(r => r.status === 'pending'))
const pendingFor = (id) => pendingClaims.value.find(r => r.praticien?.id === id)
const hasPending = computed(() => candidates.value.some(c => pendingFor(c.id)))
// Affiché seulement tant que la fiche est masquée pour doublon possible
const visible = computed(() => fiche.value?.listingStatus === 'pending' && candidates.value.length > 0)

const busy = ref(false)
const message = ref('')
const error = ref(false)

async function run(action, success) {
  busy.value = true
  message.value = ''
  error.value = false
  try {
    await action()
    message.value = success
  } catch (e) {
    error.value = true
    message.value = apiErrorMessage(e, 'La demande n’a pas pu être envoyée. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}

const claim = (c, mode) => run(async () => {
  await $fetch(`/api/backend/praticiens/${c.id}/claim-requests`, { method: 'POST', body: { mode } })
  await refreshClaims()
}, 'Demande envoyée. Nous la vérifions avant de rendre votre fiche visible.')

const dismiss = () => run(async () => {
  await $fetch('/api/backend/praticiens/me/duplicates/dismiss', { method: 'POST' })
  await refreshFiche()
}, 'Votre fiche est maintenant visible dans l’annuaire.')
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
