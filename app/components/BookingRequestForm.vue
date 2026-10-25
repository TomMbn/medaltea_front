<template>
  <div class="text-vert-900">
    <!-- Toujours visible : le patient ne doit jamais croire son rendez-vous confirmé -->
    <p class="text-[16px] leading-snug rounded-2xl bg-bleu-50 px-4 py-3">
      <template v-if="!praticien.claimed">Ce praticien n'est pas encore inscrit sur Léya. </template>
      Votre demande sera transmise au praticien, mais <strong>elle n'est pas confirmée</strong> : il doit l'accepter.
      Sans réponse sous 7 jours, nous vous prévenons.
    </p>

    <div v-if="sent" class="mt-4 rounded-2xl bg-bleu-50 p-5 text-[16px]" role="status">
      <p class="font-semibold">Demande envoyée, en attente de réponse du praticien.</p>
      <NuxtLink to="/mes-rendez-vous" class="mt-2 inline-block underline text-vert-600">Mes rendez-vous</NuxtLink>
    </div>

    <div v-else-if="!isLoggedIn" class="mt-4 grid gap-3">
      <NuxtLink
        :to="{ path: '/login', query: { redirect: route.fullPath } }"
        rel="nofollow"
        class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[16px] rounded-full pl-6 pr-1 py-1 hover:bg-vert-600 transition-colors"
      >
        <span class="flex-1 min-w-0 leading-[normal]">Se connecter pour envoyer une demande</span>
        <span class="w-10 h-10 shrink-0 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
      </NuxtLink>
      <p class="text-[14px] text-neutre-600 leading-[normal]">
        Pas encore de compte ?
        <NuxtLink :to="{ path: '/register', query: { redirect: route.fullPath } }" rel="nofollow" class="underline">Créer un compte</NuxtLink>
      </p>
    </div>

    <p v-else-if="!isPatient" class="mt-4 text-[16px] leading-snug text-neutre-600">Connectez-vous avec un compte patient pour envoyer une demande.</p>

    <form v-else class="mt-4 grid gap-4" @submit.prevent="submit">
      <fieldset v-for="(slot, i) in slots" :key="slot.key" class="grid gap-2">
        <legend class="text-[16px] font-medium mb-2">Disponibilité {{ i + 1 }}</legend>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label class="grid gap-1 text-[14px] text-neutre-600" :for="`request-date-${slot.key}`">
            Date
            <input :id="`request-date-${slot.key}`" v-model="slot.date" type="date" required :min="bounds.min" :max="bounds.max" :disabled="sending" class="field text-vert-900" />
          </label>
          <label class="grid gap-1 text-[14px] text-neutre-600" :for="`request-period-${slot.key}`">
            Moment
            <select :id="`request-period-${slot.key}`" v-model="slot.period" required :disabled="sending" class="field text-vert-900">
              <option value="" disabled>Choisir</option>
              <option v-for="p in PERIODS" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </label>
        </div>
        <button v-if="slots.length > 1" type="button" :disabled="sending" class="justify-self-start text-[14px] text-vert-600 hover:underline" :aria-label="`Retirer la disponibilité ${i + 1}`" @click="removeSlot(i)">Retirer</button>
      </fieldset>

      <button v-if="slots.length < MAX_PREFERRED_SLOTS" type="button" :disabled="sending" class="justify-self-start text-[16px] font-medium text-vert-600 hover:underline" @click="addSlot">Ajouter une disponibilité</button>

      <label class="grid gap-1 text-[16px] font-medium" for="request-note">
        <span>Motif <span class="font-normal text-neutre-600">(facultatif)</span></span>
        <textarea id="request-note" v-model="note" rows="3" maxlength="500" :disabled="sending" class="field font-normal" placeholder="Ex. : première consultation, tensions dans le dos…"></textarea>
      </label>
      <label v-if="note.trim()" class="flex items-start gap-3 text-[14px] leading-snug text-neutre-600 cursor-pointer">
        <input v-model="consent" type="checkbox" :disabled="sending" class="mt-0.5 shrink-0 accent-[#156F71]" />
        <span>
          J'accepte que ces informations, qui peuvent concerner ma santé, soient transmises à ce praticien pour la préparation du rendez-vous
          (voir la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>).
        </span>
      </label>

      <p v-if="errorMessage" class="text-[16px] text-red-700 bg-red-50 rounded-2xl p-3" role="alert">
        {{ errorMessage }}
        <NuxtLink v-if="needsProfile" to="/mon-compte" class="block mt-1 font-semibold underline">Compléter mon profil</NuxtLink>
      </p>

      <button
        type="submit"
        :disabled="sending || (!!note.trim() && !consent)"
        class="w-full flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[16px] rounded-full pl-6 pr-1 py-1 hover:bg-vert-600 transition-colors disabled:opacity-60 text-left"
      >
        <span class="flex-1 min-w-0 leading-[normal]">{{ sending ? 'Envoi…' : 'Envoyer ma demande' }}</span>
        <span class="w-10 h-10 shrink-0 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({ praticien: { type: Object, required: true } })

const route = useRoute()
const { isLoggedIn, isPro, isAdmin } = useSession()
// Rôle inconnu (session antérieure aux rôles) : traité comme patient, le backend tranche
const isPatient = computed(() => isLoggedIn.value && !isPro.value && !isAdmin.value)

const bounds = dateBounds()
let nextKey = 0
const newSlot = () => ({ key: nextKey++, date: '', period: '' })
const slots = ref([newSlot()])
const addSlot = () => { if (slots.value.length < MAX_PREFERRED_SLOTS) slots.value.push(newSlot()) }
const removeSlot = (i) => { slots.value.splice(i, 1) }

const note = ref('')
const consent = ref(false)
const sending = ref(false)
const sent = ref(false)
const errorMessage = ref('')
const needsProfile = ref(false)

async function submit() {
  if (sending.value) return
  errorMessage.value = ''
  needsProfile.value = false
  const userNote = note.value.trim()
  sending.value = true
  try {
    await $fetch('/api/backend/booking-requests', {
      method: 'POST',
      body: {
        praticienId: props.praticien.id,
        preferredSlots: slots.value.map(({ date, period }) => ({ date, period })),
        ...(userNote ? { userNote, consentHealthData: consent.value } : {}),
      },
    })
    sent.value = true
  } catch (e) {
    // Prénom et nom manquants (même règle que la réservation) : le lien mène au profil
    needsProfile.value = apiStatus(e) === 422
    errorMessage.value = apiErrorMessage(e, 'La demande n\'a pas pu être envoyée. Réessayez dans un instant.')
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.field { width: 100%; border: 0; border-radius: 16px; padding: 0.75rem 1rem; font-size: 1rem; background: #eef5f8; }
.field:focus { outline: 2px solid #156F71; }
</style>
