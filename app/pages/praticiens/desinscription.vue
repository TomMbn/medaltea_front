<template>
  <div class="relative overflow-x-clip bg-gradient-to-b from-bleu-50 to-[#e0ecf2] min-h-screen">
    <div class="relative mx-auto w-[calc(100%-2rem)] max-w-[760px] pt-32 lg:pt-[170px] pb-20 lg:pb-[120px]">
      <h1 class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] text-vert-900">Ne plus recevoir nos e-mails</h1>

      <div v-if="done" class="mt-6 rounded-[20px] bg-white p-5 lg:p-6 shadow-douce" role="status">
        <p class="text-[18px] font-semibold leading-snug">C’est fait : vous ne recevrez plus ces e-mails.</p>
        <p class="mt-2 text-[16px] leading-snug text-neutre-600">Votre fiche reste visible dans l’annuaire. Les patients peuvent toujours vous envoyer une demande, mais nous ne vous écrirons plus pour vous la signaler.</p>
      </div>

      <p v-else-if="!link" class="mt-6 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">
        Ce lien de désinscription est incomplet. Utilisez le lien complet reçu par e-mail, ou écrivez-nous à
        <a :href="`mailto:${legal.contactEmail}`" class="underline">{{ legal.contactEmail }}</a>.
      </p>

      <template v-else>
        <p class="mt-4 text-[18px] leading-snug text-neutre-600">Vous avez reçu cet e-mail parce qu’un patient souhaite prendre rendez-vous avec vous depuis votre fiche de l’annuaire {{ legal.brandName }}. Confirmez pour ne plus recevoir ces e-mails : votre fiche reste dans l’annuaire.</p>
        <p v-if="error" class="mt-5 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ error }}</p>
        <button type="button" class="mt-8 rounded-full bg-vert-900 px-6 min-h-[48px] text-[18px] font-semibold text-white hover:bg-vert-600 transition-colors disabled:opacity-50" :disabled="sending" @click="confirm">
          {{ sending ? 'Un instant…' : 'Confirmer : ne plus recevoir ces e-mails' }}
        </button>
      </template>

      <p class="mt-10 text-[16px] leading-snug text-neutre-600">
        Vous souhaitez aussi que votre fiche ne soit plus publiée ?
        <a :href="removalLink" class="underline text-vert-900 hover:text-vert-600">Demander le retrait de la fiche</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { legal } from '~/data/legal'

useSeoMeta({ title: 'Ne plus recevoir nos e-mails — Léya', robots: 'noindex, nofollow' })

// Mêmes formats que la passerelle : identifiant de fiche et jeton HMAC en base64url
const PRATICIEN_ID = /^\d{1,10}$/
const TOKEN = /^[A-Za-z0-9_-]{1,64}$/

const route = useRoute()
const link = computed(() => {
  const { f, t } = route.query
  return typeof f === 'string' && PRATICIEN_ID.test(f) && typeof t === 'string' && TOKEN.test(t) ? { praticienId: Number(f), token: t } : null
})
const removalLink = computed(() => {
  const subject = link.value ? `Demande de retrait de la fiche n° ${link.value.praticienId}` : 'Demande de retrait de ma fiche'
  return `mailto:${legal.contactEmail}?subject=${encodeURIComponent(subject)}`
})

const sending = ref(false)
const done = ref(false)
const error = ref('')

// Appel seulement au clic : le chargement de la page (ou son préchargement par un antivirus) ne désinscrit pas
async function confirm() {
  sending.value = true
  error.value = ''
  try {
    await $fetch('/api/backend/listing-outreach/unsubscribe', { method: 'POST', body: link.value })
    done.value = true
  } catch {
    error.value = `La désinscription n’a pas pu être enregistrée. Réessayez dans un instant ou écrivez-nous à ${legal.contactEmail}.`
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
