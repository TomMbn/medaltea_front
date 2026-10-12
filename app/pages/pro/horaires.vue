<template>
  <div>
    <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-1">Horaires</h1>
    <p class="text-sm text-[#012828]/60 mb-6">Votre semaine type : les créneaux proposés aux patients en découlent. Pour un congé ponctuel, utilisez <NuxtLink to="/pro/absences" class="underline">Absences</NuxtLink>.</p>
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8">
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
