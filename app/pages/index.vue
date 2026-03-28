<template>
  <div class="landing-page overflow-x-hidden bg-[#f4f7f9] min-h-screen">
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
    <div class="w-full flex flex-col items-center bg-[#f4f7f9]">
      <div class="w-11/12 max-w-[1440px]">
        <LandingBenefits />
        <LandingPraticien />
        <LandingMedicines />
        <LandingFAQ class="pb-16" />

        <!-- Footer -->
        <div class="py-12 border-t border-gray-200 text-center opacity-30 text-sm">
          © 2026 Medaltea - Tous droits réservés.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Full Landing Page Composition
</script>
