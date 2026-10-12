<template>
  <div>
    <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-1">Rendez-vous</h1>
    <p class="text-sm text-[#012828]/60 mb-6">Les demandes de vos patients et vos rendez-vous à venir.</p>
    <ProOnboarding class="mb-6" />
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8">
      <ProAppointments />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Rendez-vous — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
