<template>
  <div>
    <ProPageHead title="Rendez-vous" subtitle="Les demandes de vos patients et vos rendez-vous à venir." class="mb-1" />
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
