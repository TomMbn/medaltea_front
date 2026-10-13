<template>
  <div class="text-[#012828]">
    <p class="text-sm leading-relaxed text-[#012828]/80">
      Cette fiche a été créée à partir d'informations publiques<template v-if="praticien.sourceLabel"> ({{ praticien.sourceLabel }})</template>.
      Ce praticien n'a pas encore ouvert la réservation en ligne sur Léya.
    </p>

    <!-- Fiche déjà liée à ce compte -->
    <p v-if="isOwner" class="mt-4 text-sm font-semibold text-[#156F71]">C'est votre fiche.</p>

    <!-- Revendication (fiche non revendiquée uniquement) -->
    <div v-else-if="!praticien.claimed" class="mt-5">
      <h3 class="font-unbounded font-bold text-sm mb-2">Vous êtes ce praticien ?</h3>

      <p v-if="done" class="text-sm rounded-xl bg-[#e0ecf2] px-4 py-3" role="status">
        Votre demande a bien été envoyée. Nous la vérifions manuellement avant de vous donner accès à cette fiche.
      </p>

      <template v-else-if="!isPro">
        <p class="text-sm text-[#012828]/70 mb-3">
          Connectez-vous avec votre compte praticien pour demander l'accès à cette fiche et ouvrir vos réservations.
        </p>
        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: route.fullPath } }" class="bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors">Revendiquer cette fiche</NuxtLink>
          <NuxtLink to="/inscription-pro" class="border border-gray-300 text-sm font-semibold px-5 py-2.5 rounded-[12px] hover:border-[#156F71] transition-colors">Créer un compte praticien</NuxtLink>
        </div>
      </template>

      <form v-else class="grid gap-3" @submit.prevent="submit">
        <p class="text-sm text-[#012828]/70">Un administrateur vérifie chaque demande. Les identifiants facilitent la vérification.</p>
        <label class="grid gap-1 text-sm font-semibold" for="claim-message">
          Message
          <textarea id="claim-message" v-model="message" rows="3" maxlength="500" class="field font-normal" placeholder="Je suis ce praticien, mon cabinet est situé…"></textarea>
        </label>
        <label class="grid gap-1 text-sm font-semibold" for="claim-rpps">
          RPPS (11 chiffres, facultatif)
          <input id="claim-rpps" v-model="rpps" inputmode="numeric" maxlength="11" pattern="\d{11}" class="field font-normal" />
        </label>
        <label class="grid gap-1 text-sm font-semibold" for="claim-siret">
          SIRET (14 chiffres, facultatif)
          <input id="claim-siret" v-model="siret" inputmode="numeric" maxlength="14" pattern="\d{14}" class="field font-normal" />
        </label>
        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
        <button type="submit" :disabled="sending" class="bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-60">
          {{ sending ? 'Envoi…' : 'Envoyer ma demande' }}
        </button>
      </form>
    </div>

    <p v-else class="mt-4 text-sm text-[#012828]/70">Cette fiche est gérée par son praticien.</p>

    <!-- Retrait -->
    <p class="mt-5 text-xs text-[#012828]/60 leading-relaxed">
      Vous souhaitez que cette fiche soit retirée ou corrigée ?
      <a :href="removalLink" class="underline text-[#156F71]">Écrivez-nous</a>, nous traitons la demande dans les meilleurs délais.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ praticien: { type: Object, required: true } })

const route = useRoute()
const { isPro, praticienId } = useSession()
const isOwner = computed(() => praticienId.value === props.praticien.id)

const message = ref('')
const rpps = ref('')
const siret = ref('')
const sending = ref(false)
const done = ref(false)
const errorMessage = ref('')

const removalLink = computed(() => {
  const subject = `Demande de retrait ou de correction — fiche ${props.praticien.firstName} ${props.praticien.lastName} (n° ${props.praticien.id})`
  return `mailto:contact@leya-sante.fr?subject=${encodeURIComponent(subject)}`
})

async function submit() {
  errorMessage.value = ''
  if (rpps.value && !/^\d{11}$/.test(rpps.value)) { errorMessage.value = 'Le RPPS doit comporter 11 chiffres.'; return }
  if (siret.value && !/^\d{14}$/.test(siret.value)) { errorMessage.value = 'Le SIRET doit comporter 14 chiffres.'; return }
  sending.value = true
  try {
    await $fetch(`/api/backend/praticiens/${props.praticien.id}/claim-requests`, {
      method: 'POST',
      body: { message: message.value.trim(), rpps: rpps.value, siret: siret.value },
    })
    done.value = true
  } catch (e) {
    const status = e?.statusCode ?? e?.response?.status
    errorMessage.value = status === 409 ? 'Cette fiche est déjà revendiquée, ou une demande est déjà en attente.'
      : status === 401 ? 'Votre session a expiré, reconnectez-vous.'
      : status === 403 ? 'Seul un compte praticien peut revendiquer une fiche.'
      : 'La demande n\'a pas pu être envoyée. Réessayez dans un instant.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.field { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 0.5rem 0.75rem; font-size: 0.875rem; background: #fff; }
</style>
