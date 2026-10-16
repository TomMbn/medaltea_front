<template>
  <div>
    <h2 class="font-unbounded font-normal text-[20px] mb-2">Mon agenda dans Google, Apple ou Outlook</h2>
    <p class="text-[16px] text-neutre-600 mb-4">Ajoutez vos rendez-vous confirmés à votre agenda habituel grâce à un lien d’abonnement : il se met à jour tout seul, en lecture seule. Les événements indiquent la prestation et le prénom du patient, jamais le motif, le téléphone ni l’e-mail.</p>

    <div v-if="url" class="rounded-[20px] bg-bleu-50 p-4 sm:p-5">
      <label for="cal-url" class="block text-[16px] font-medium mb-2">Votre lien d’abonnement</label>
      <div class="flex flex-col sm:flex-row gap-3">
        <input id="cal-url" ref="field" :value="url" readonly class="flex-1 min-w-0 rounded-[12px] border border-neutre-300 bg-white px-4 py-3 text-[16px] text-vert-900" @focus="$event.target.select()" />
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-full bg-vert-900 px-6 min-h-[48px] text-[16px] font-semibold text-white hover:bg-vert-600 transition-colors" @click="copy">
          <Check v-if="copied" :size="18" aria-hidden="true" /><Copy v-else :size="18" aria-hidden="true" />
          {{ copied ? 'Lien copié' : 'Copier le lien' }}
        </button>
      </div>
      <p class="mt-3 text-[16px] leading-[normal]"><strong class="font-semibold">Copiez-le maintenant :</strong> il ne sera plus affiché ensuite. Quiconque possède ce lien voit vos rendez-vous : ne le partagez pas.</p>
      <ul class="mt-3 flex flex-col gap-1 text-[16px] leading-[normal] text-neutre-600">
        <li><strong class="font-medium text-vert-900">Google Agenda :</strong> Autres agendas, « À partir de l’URL », collez le lien.</li>
        <li><strong class="font-medium text-vert-900">Apple Calendrier ou Outlook :</strong> <a :href="webcal" class="underline text-vert-900 hover:text-vert-600">ouvrir directement dans mon application</a>, ou ajoutez un abonnement avec le lien.</li>
      </ul>
    </div>

    <p v-if="active && !url" class="mt-4 rounded-[16px] bg-bleu-50 px-4 py-3 text-[16px] leading-[normal]" role="status">Votre lien d’abonnement est <strong class="font-semibold">actif</strong>. Pour des raisons de sécurité il n’est plus affiché : générez-en un nouveau si vous l’avez perdu (l’ancien cessera de fonctionner).</p>

    <div class="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" class="inline-flex items-center border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-900 hover:text-white transition-colors disabled:opacity-50" :disabled="busy" @click="generate">
        {{ busy ? 'Un instant…' : url || active ? 'Générer un nouveau lien' : 'Générer mon lien d’agenda' }}
      </button>
      <template v-if="!active && !url" />
      <template v-else-if="!confirmRevoke">
        <button type="button" class="inline-flex items-center border border-red-700 text-red-800 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-red-50 transition-colors disabled:opacity-50" :disabled="busy" @click="confirmRevoke = true">Désactiver le lien</button>
      </template>
      <template v-else>
        <button type="button" class="inline-flex items-center bg-red-700 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-red-800 transition-colors disabled:opacity-50" :disabled="busy" @click="revoke">Oui, désactiver</button>
        <button type="button" class="text-[16px] font-medium underline" @click="confirmRevoke = false">Annuler</button>
      </template>
    </div>
    <p class="mt-3 text-[14px] leading-[normal] text-neutre-600">Un nouveau lien remplace l’ancien, qui cesse aussitôt de fonctionner. Les agendas peuvent mettre quelques heures à se synchroniser.</p>

    <p v-if="message" class="text-[16px] text-emerald-700 mt-3" role="status">{{ message }}</p>
    <p v-if="error" class="text-[16px] text-red-700 mt-3" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const url = ref('')
const busy = ref(false)
const copied = ref(false)
const confirmRevoke = ref(false)
const message = ref('')
const error = ref('')
const field = ref(null)
// État du lien (l'adresse n'est jamais renvoyée après sa génération)
const active = ref(false)
onMounted(async () => {
  try {
    const st = await $fetch('/api/backend/praticiens/me/calendar-token')
    active.value = st?.subscriptionActive === true
  } catch { /* état inconnu : on propose simplement de générer le lien */ }
})

const webcal = computed(() => url.value.replace(/^https?:\/\//, 'webcal://'))

function fail(e, fallback) {
  const code = e?.statusCode ?? e?.response?.status
  error.value = code === 429 ? 'Trop de tentatives : réessayez dans quelques instants.' : (e?.data?.message && code === 403 ? e.data.message : fallback)
}

async function generate() {
  busy.value = true
  message.value = ''
  error.value = ''
  confirmRevoke.value = false
  copied.value = false
  try {
    const res = await $fetch('/api/backend/praticiens/me/calendar-token', { method: 'POST' })
    // Le lien est secret : on n'accepte que l'adresse https renvoyée par notre backend
    if (typeof res?.url !== 'string' || !/^https:\/\/[^\s]+\.ics$/.test(res.url)) throw new Error('lien invalide')
    url.value = res.url
    active.value = true
  } catch (e) {
    fail(e, 'Impossible de générer le lien pour le moment. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(url.value)
  } catch {
    // Presse-papiers indisponible : on sélectionne le lien pour un copier-coller manuel
    field.value?.select()
    document.execCommand?.('copy')
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2500)
}

async function revoke() {
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/backend/praticiens/me/calendar-token', { method: 'DELETE' })
    url.value = ''
    active.value = false
    confirmRevoke.value = false
    message.value = 'Le lien est désactivé : vos agendas ne reçoivent plus vos rendez-vous.'
  } catch (e) {
    fail(e, 'Impossible de désactiver le lien pour le moment. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
