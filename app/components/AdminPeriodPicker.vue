<template>
  <div class="inline-flex gap-1 rounded-full bg-white p-1" role="group" aria-label="Période">
    <button v-for="d in PERIODS" :key="d" type="button" class="rounded-full px-5 py-[9px] min-h-[40px] text-[16px] font-medium transition-colors" :class="model === d ? 'bg-vert-600 text-white' : 'text-vert-900 hover:bg-bleu-50'" :aria-pressed="model === d" @click="model = d">{{ d }} jours</button>
  </div>
</template>

<script setup>
// Les seules périodes acceptées par l'API des statistiques (GET /admin/stats/*)
const PERIODS = [7, 30, 90]
const model = defineModel({ type: Number, default: 30 })
</script>
