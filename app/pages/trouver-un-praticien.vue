<template>
  <div class="overflow-x-hidden min-h-screen">
    <PraticienHero />
    <PraticienNearby />
    <PraticienWhy />
    <div class="bg-[#e0ecf2]">
      <div class="w-11/12 max-w-[1440px] mx-auto">
        <LandingFAQ class="pb-16" />
        <TheFooter />
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Trouver un praticien — Léya',
  description: 'Trouvez facilement des praticiens en médecines alternatives près de chez vous. Comparez les profils, consultez les avis et prenez rendez-vous en ligne.',
})
</script>
