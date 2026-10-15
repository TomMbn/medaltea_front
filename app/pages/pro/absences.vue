<template>
  <div>
    <ProPageHead title="Absences" subtitle="Congés, formation… Aucun créneau n’est proposé pendant une absence." class="mb-1" />
    <div class="bg-white rounded-[28px] p-5 sm:p-8">
      <ProAbsences />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Absences — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
