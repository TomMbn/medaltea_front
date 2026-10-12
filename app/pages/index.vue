<template>
  <div class="landing-page overflow-x-hidden bg-[#e0ecf2] min-h-screen">
    <!-- Hero -->
    <LandingHero />
    
    <!-- 1. The Floating White Sheet (Intro + Steps) -->
    <div class="relative w-full flex flex-col items-center">
      <!-- Background Decorator for Intro & Steps -->
      <div 
        class="absolute top-[200px] lg:top-[280px] bottom-0 left-1/2 -translate-x-1/2 w-11/12 max-w-[1440px] bg-white rounded-[20px] shadow-sm z-0"
      ></div>

      <!-- Content over the sheet -->
      <div class="relative z-10 w-11/12 max-w-[1440px] flex flex-col items-center">
        <div class="w-full">
          <LandingIntro />
          <LandingSteps />
        </div>
      </div>
    </div>

    <!-- 2. Subsequent Sections on Grey Background -->
    <div class="w-full flex flex-col items-center bg-[#e0ecf2]">
      <div class="w-11/12 max-w-[1440px]">
        <LandingBenefits />
        <LandingPraticien />
        <LandingMedicines />
        <LandingFAQ class="pb-16" />

        <!-- Footer -->
        <TheFooter />
      </div>
    </div>
  </div>
</template>

<script setup>

useSeoMeta({
  title: 'Léya — La médecine alternative, intelligente et accessible',
  description: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  ogTitle: 'Léya — La médecine alternative, intelligente et accessible',
  ogDescription: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  ogImage: 'https://leya-sante.fr/og-image.jpg',
  ogUrl: 'https://leya-sante.fr',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Léya — La médecine alternative, intelligente et accessible',
  twitterDescription: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  twitterImage: 'https://leya-sante.fr/og-image.jpg',
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://leya-sante.fr/#organization',
          name: 'Léya',
          url: 'https://leya-sante.fr',
          logo: 'https://leya-sante.fr/favicon.png',
          email: 'contact@leya-sante.fr',
          sameAs: [
            'https://www.facebook.com/people/Medaltea-Medaltea/61584876630055/',
            'https://www.instagram.com/medaltea.france/',
            'https://www.linkedin.com/company/medaltea',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://leya-sante.fr/#website',
          url: 'https://leya-sante.fr',
          name: 'Léya',
          inLanguage: 'fr-FR',
          publisher: { '@id': 'https://leya-sante.fr/#organization' },
        },
      ],
    }),
  }],
})
</script>
