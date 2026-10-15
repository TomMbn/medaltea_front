<template>
  <div>
    <ProPageHead title="Horaires" subtitle="Votre semaine type : les créneaux proposés aux patients en découlent. Pour un congé ponctuel, utilisez la page Absences." class="mb-1" />
    <div class="bg-white rounded-[28px] p-5 sm:p-8">
      <ProWeeklyHours />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Horaires — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
