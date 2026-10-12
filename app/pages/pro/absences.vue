<template>
  <div>
    <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-1">Absences</h1>
    <p class="text-sm text-[#012828]/60 mb-6">Congés, formation… Aucun créneau n'est proposé pendant une absence.</p>
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8">
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
