<template>
  <div class="landing-page overflow-x-clip min-h-screen bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">
    <LandingHero />
    <LandingConcept />
    <LandingBenefits />
    <LandingFind />
    <LandingMedicines />
    <LandingChange />
    <LandingFAQ />
  </div>
</template>

<script setup>

useSeoMeta({
  title: 'Léya — La médecine alternative, intelligente et accessible',
  description: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.',
  ogTitle: 'Léya — La médecine alternative, intelligente et accessible',
  ogDescription: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.',
  ogImage: 'https://leya-sante.fr/og-image.jpg',
  ogUrl: 'https://leya-sante.fr',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Léya — La médecine alternative, intelligente et accessible',
  twitterDescription: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.',
  twitterImage: 'https://leya-sante.fr/og-image.jpg',
})

useWebPageSchema({ name: 'Léya — La médecine alternative, intelligente et accessible', description: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.', type: 'WebPage' })

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
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'contact@leya-sante.fr',
            availableLanguage: 'French',
          },
          sameAs: [
            'https://www.facebook.com/LeyaSante/',
            'https://www.instagram.com/leya.sante/',
            'https://www.linkedin.com/company/leya-sante/',
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
