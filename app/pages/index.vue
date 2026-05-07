<template>
  <div class="landing-page overflow-x-hidden bg-[#e0ecf2] min-h-screen">
    <!-- Hero Boxed to Navbar Width -->
    <div class="w-11/12 max-w-[1440px] mx-auto pt-6">
      <LandingHero class="rounded-[20px] overflow-hidden" />
    </div>
    
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
        <footer class="py-12 border-t border-gray-200">
          <div class="flex flex-col items-center gap-6">
            <div class="flex items-center gap-8">
              <a href="https://www.facebook.com/people/Medaltea-Medaltea/61584876630055/" target="_blank" rel="noopener noreferrer" class="text-[#012828] opacity-60 hover:opacity-100 transition-opacity">
                <Facebook :size="24" />
              </a>
              <a href="https://www.instagram.com/medaltea.france/" target="_blank" rel="noopener noreferrer" class="text-[#012828] opacity-60 hover:opacity-100 transition-opacity">
                <Instagram :size="24" />
              </a>
              <a href="https://www.linkedin.com/company/medaltea" target="_blank" rel="noopener noreferrer" class="text-[#012828] opacity-60 hover:opacity-100 transition-opacity">
                <Linkedin :size="24" />
              </a>
              <a href="mailto:contact@leya-sante.fr" class="text-[#012828] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
                <Mail :size="24" />
              </a>
            </div>
            <div class="text-center opacity-40 text-sm font-sans">
              © 2026 Léya - Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-vue-next'

useSeoMeta({
  title: 'Léya — La médecine alternative, intelligente et accessible',
  description: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  ogTitle: 'Léya — La médecine alternative, intelligente et accessible',
  ogDescription: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  ogImage: 'https://leya-sante.fr/og-image.png',
  ogUrl: 'https://leya-sante.fr',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Léya — La médecine alternative, intelligente et accessible',
  twitterDescription: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.',
  twitterImage: 'https://leya-sante.fr/og-image.png',
})
</script>
