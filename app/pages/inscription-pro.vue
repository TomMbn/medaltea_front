<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[680px] mx-auto pt-32 pb-8 text-[#012828]">
      <NuxtLink to="/praticiens-pro" class="inline-block text-sm text-[#156F71] hover:underline mb-4">← Espace praticien</NuxtLink>
      <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-2">Rejoindre Léya en tant que praticien</h1>
      <p class="text-[#012828]/70 font-sans mb-8">
        Déjà inscrit ?
        <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro/rendez-vous' } }" class="underline text-[#156F71]">Se connecter</NuxtLink>
      </p>

      <ProSignupWizard />

      <TheFooter />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Devenir praticien — Léya',
  description: 'Créez votre fiche praticien sur Léya en 2 minutes et ouvrez la prise de rendez-vous en ligne pour vos patients.',
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
