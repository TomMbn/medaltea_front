<template>
  <!-- Rendu côté client uniquement : le choix est mémorisé dans ce navigateur -->
  <p v-if="ready">
    <span role="status">
      {{ disabled ? 'Vous avez désactivé la mesure d\'audience sur ce navigateur.' : 'La mesure d\'audience est active sur ce navigateur.' }}
    </span>
    <button type="button" class="underline font-semibold text-[#156F71] ml-1" @click="toggle">
      {{ disabled ? 'La réactiver' : 'La désactiver' }}
    </button>
  </p>
</template>

<script setup>
// Clé lue par le script Umami avant chaque envoi : tant qu'elle est présente, rien n'est mesuré
const KEY = 'umami.disabled'
const ready = ref(false)
const disabled = ref(false)

onMounted(() => {
  try { disabled.value = !!localStorage.getItem(KEY) } catch { /* stockage indisponible */ }
  ready.value = true
})

function toggle() {
  try {
    if (disabled.value) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, '1')
    disabled.value = !disabled.value
  } catch { /* stockage indisponible : le choix ne peut pas être mémorisé */ }
}
</script>
