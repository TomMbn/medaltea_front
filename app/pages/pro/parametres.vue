<template>
  <div>
    <ProPageHead title="Paramètres" subtitle="Réglages de votre compte praticien." class="mb-1" />
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8">
      <ProSettings />
    </div>
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8 mt-6">
      <ProVisibility />
    </div>
    <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8 mt-6">
      <h2 class="font-unbounded font-bold text-lg mb-2">Mon compte et mes données</h2>
      <p class="text-sm text-gray-600 mb-4">Modifier mes informations, télécharger mes données ou supprimer mon compte.</p>
      <NuxtLink to="/mon-compte" class="inline-block border border-[#012828] text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#012828] hover:text-white transition-colors">Gérer mon compte</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Paramètres — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
