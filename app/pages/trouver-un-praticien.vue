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
const title = 'Trouver un praticien — Léya'
const description = 'Trouvez facilement des praticiens en médecines alternatives près de chez vous. Comparez les profils, consultez les avis et prenez rendez-vous en ligne.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://leya-sante.fr/og-image.jpg',
  ogUrl: 'https://leya-sante.fr/trouver-un-praticien',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://leya-sante.fr/og-image.jpg',
})
</script>
