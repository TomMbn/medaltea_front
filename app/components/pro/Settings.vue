<template>
  <div>
    <h2 class="font-unbounded font-bold text-lg mb-2">Confirmation des rendez-vous</h2>
    <p class="text-sm text-gray-600 mb-5">Choisissez comment les demandes de vos patients sont traitées.</p>

    <fieldset :disabled="saving">
      <legend class="sr-only">Mode de confirmation</legend>
      <label class="flex items-start gap-3 rounded-xl border px-4 py-3 mb-3 cursor-pointer" :class="auto === true ? 'border-[#156F71] bg-[#e0ecf2]/50' : 'border-gray-200'">
        <input type="radio" name="auto" class="mt-1 accent-[#156F71]" :checked="auto === true" @change="save(true)" />
        <span>
          <span class="block text-sm font-semibold">Confirmation automatique</span>
          <span class="block text-xs text-gray-500">Tout créneau réservé est confirmé immédiatement.</span>
        </span>
      </label>
      <label class="flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer" :class="auto === false ? 'border-[#156F71] bg-[#e0ecf2]/50' : 'border-gray-200'">
        <input type="radio" name="auto" class="mt-1 accent-[#156F71]" :checked="auto === false" @change="save(false)" />
        <span>
          <span class="block text-sm font-semibold">Je valide chaque demande</span>
          <span class="block text-xs text-gray-500">Les demandes restent « en attente » jusqu'à votre réponse.</span>
        </span>
      </label>
    </fieldset>

    <p v-if="auto === null" class="text-xs text-gray-500 mt-3">Réglage actuel non affiché : sélectionnez une option pour l'appliquer.</p>
    <p v-if="saved" class="text-sm text-emerald-700 mt-3" role="status">Réglage enregistré.</p>
    <p v-if="error" class="text-sm text-red-700 mt-3" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const auto = ref(null)
const saving = ref(false)
const saved = ref(false)
const error = ref('')

// La valeur actuelle est lue dans le profil quand l'API la fournit ; sinon le réglage reste neutre.
onMounted(async () => {
  try {
    const me = await $fetch('/api/backend/users/me')
    const value = me?.praticien?.autoConfirm ?? me?.autoConfirm
    if (typeof value === 'boolean') auto.value = value
  } catch { /* le réglage reste neutre */ }
})

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
