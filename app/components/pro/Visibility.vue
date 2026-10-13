<template>
  <div>
    <h2 class="font-unbounded font-bold text-lg mb-2">Visibilité de ma fiche</h2>
    <p v-if="loadError" class="text-sm text-gray-500">Impossible de lire l'état actuel de votre fiche pour le moment.</p>
    <template v-else-if="fiche">
      <p class="text-sm text-gray-600 mb-4">
        <template v-if="active">Votre fiche est visible dans l'annuaire et vos patients peuvent réserver.</template>
        <template v-else>Votre fiche est masquée : elle n'apparaît plus dans l'annuaire et la réservation est impossible. Vos rendez-vous existants ne sont pas modifiés.</template>
      </p>
      <button type="button" class="border text-sm font-bold px-5 py-2.5 rounded-[12px] transition-colors disabled:opacity-50" :class="active ? 'border-red-700 text-red-800 hover:bg-red-50' : 'border-[#012828] hover:bg-[#012828] hover:text-white'" :disabled="busy" @click="toggle">
        {{ active ? 'Masquer ma fiche' : 'Rendre ma fiche visible' }}
      </button>
      <p v-if="message" class="text-sm text-emerald-700 mt-3" role="status">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-700 mt-3" role="alert">{{ error }}</p>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const { data: fiche, error: loadError, refresh } = await useAsyncData('pro-fiche', () => $fetch('/api/backend/praticiens/me'), { server: false })
const active = computed(() => fiche.value?.isActive !== false)
const busy = ref(false)
const message = ref('')
const error = ref('')

async function toggle() {
  const next = !active.value
  if (!next && !window.confirm('Masquer votre fiche ? Les patients ne pourront plus vous trouver ni réserver.')) return
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch(`/api/backend/praticiens/${fiche.value.id}`, { method: 'PUT', body: { isActive: next } })
    await refresh()
    message.value = next ? 'Votre fiche est de nouveau visible.' : 'Votre fiche est masquée.'
  } catch (e) {
    error.value = apiErrorMessage(e, 'Impossible de modifier la visibilité. Réessayez dans un instant.')
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
