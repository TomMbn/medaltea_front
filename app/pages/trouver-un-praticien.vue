<template>
  <div class="overflow-x-hidden min-h-screen">
    <PraticienHero />
    <div id="resultats" class="scroll-mt-28"><PraticienResults :praticiens="praticiens ?? []" :q="q" :error="!!error" /></div>
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
const route = useRoute()
const q = computed(() => String(route.query.q ?? ''))
const { data: praticiens, error } = await useAsyncData('praticiens', () => $fetch('/api/backend/praticiens'))

const title = 'Trouver un praticien — Léya'
const description = 'Trouvez facilement des praticiens en médecines alternatives près de chez vous. Prenez rendez-vous en ligne.'

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
