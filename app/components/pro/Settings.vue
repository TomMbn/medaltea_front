<template>
  <div>
    <h2 class="font-unbounded font-normal text-[20px] mb-2">Confirmation des rendez-vous</h2>
    <p class="text-[16px] text-neutre-600 mb-5">Choisissez comment les demandes de vos patients sont traitées.</p>

    <fieldset :disabled="saving">
      <legend class="sr-only">Mode de confirmation</legend>
      <label class="flex items-start gap-3 rounded-[16px] border px-4 py-3 mb-3 cursor-pointer" :class="auto === true ? 'border-vert-600 bg-bleu-50' : 'border-bleu-100'">
        <input type="radio" name="auto" class="mt-1 accent-vert-600" :checked="auto === true" @change="save(true)" />
        <span>
          <span class="block text-[16px] font-semibold">Confirmation automatique</span>
          <span class="block text-[14px] text-neutre-600">Tout créneau réservé est confirmé immédiatement.</span>
        </span>
      </label>
      <label class="flex items-start gap-3 rounded-[16px] border px-4 py-3 cursor-pointer" :class="auto === false ? 'border-vert-600 bg-bleu-50' : 'border-bleu-100'">
        <input type="radio" name="auto" class="mt-1 accent-vert-600" :checked="auto === false" @change="save(false)" />
        <span>
          <span class="block text-[16px] font-semibold">Je valide chaque demande</span>
          <span class="block text-[14px] text-neutre-600">Les demandes restent « en attente » jusqu'à votre réponse.</span>
        </span>
      </label>
    </fieldset>

    <p v-if="auto === null" class="text-[14px] text-neutre-600 mt-3">Réglage actuel non affiché : sélectionnez une option pour l'appliquer.</p>

    <h2 class="font-unbounded font-normal text-[20px] mt-10 mb-2">Réservations sans compte</h2>
    <p class="text-[16px] text-neutre-600 mb-5">Un patient peut demander un rendez-vous sans créer de compte (identité non vérifiée). Choisissez comment ces demandes sont traitées.</p>
    <fieldset :disabled="saving">
      <legend class="sr-only">Réservations sans compte</legend>
      <label v-for="o in guestOptions" :key="o.value" class="flex items-start gap-3 rounded-[16px] border px-4 py-3 mb-3 cursor-pointer" :class="guestMode === o.value ? 'border-vert-600 bg-bleu-50' : 'border-bleu-100'">
        <input type="radio" name="guest" class="mt-1 accent-vert-600" :checked="guestMode === o.value" @change="saveGuest(o.value)" />
        <span>
          <span class="block text-[16px] font-semibold">{{ o.label }}</span>
          <span class="block text-[14px] text-neutre-600">{{ o.hint }}</span>
        </span>
      </label>
    </fieldset>
    <p v-if="guestMode === null" class="text-[14px] text-neutre-600 mt-1">Réglage actuel non affiché : sélectionnez une option pour l'appliquer.</p>
    <p v-if="saved" class="text-[16px] text-emerald-700 mt-3" role="status">Réglage enregistré.</p>
    <p v-if="error" class="text-[16px] text-red-700 mt-3" role="alert">{{ error }}</p>

    <NotificationSettings v-if="!demoActive" class="mt-10" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { active: demoActive } = useDemo()

const auto = ref(null)
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const guestMode = ref(null)
const guestOptions = [
  { value: 'manual', label: 'Je valide chaque demande', hint: 'La demande reste « en attente » jusqu’à votre réponse (48 h maximum).' },
  { value: 'auto', label: 'Confirmation automatique', hint: 'Le rendez-vous est confirmé aussitôt (mêmes règles de créneau, plafond et vérification anti-robot).' },
  { value: 'disabled', label: 'Refuser les réservations sans compte', hint: 'Le bouton « Continuer sans compte » n’apparaît plus sur votre fiche : seuls les patients connectés peuvent réserver.' },
]

// La valeur actuelle est lue dans le profil quand l'API la fournit ; sinon le réglage reste neutre.
onMounted(async () => {
  try {
    const me = await $fetch('/api/backend/users/me')
    const value = me?.praticien?.autoConfirm ?? me?.autoConfirm
    if (typeof value === 'boolean') auto.value = value
  } catch { /* le réglage reste neutre */ }
  try {
    const mine = await $fetch('/api/backend/praticiens/me')
    if (['manual', 'auto', 'disabled'].includes(mine?.guestBookingMode)) guestMode.value = mine.guestBookingMode
  } catch { /* le réglage reste neutre */ }
})

async function saveGuest(value) {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await $fetch('/api/backend/praticiens/me/settings', { method: 'PATCH', body: { guestBookingMode: value } })
    guestMode.value = value
    saved.value = true
  } catch (e) {
    error.value = apiErrorMessage(e, "Impossible d'enregistrer ce réglage.")
  } finally {
    saving.value = false
  }
}

async function save(value) {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await $fetch('/api/backend/praticiens/me/settings', { method: 'PATCH', body: { autoConfirm: value } })
    auto.value = value
    saved.value = true
  } catch (e) {
    error.value = apiErrorMessage(e, "Impossible d'enregistrer ce réglage.")
  } finally {
    saving.value = false
  }
}
</script>
