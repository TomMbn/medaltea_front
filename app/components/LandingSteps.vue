<template>
  <section class="landing-steps py-16 lg:pt-24 lg:pb-32">
    <div class="hero-container">
      <h2 class="text-[32px] lg:text-[44px] font-normal font-unbounded text-[#012828] text-center mb-16 lg:mb-24">
        Comment ça marche ?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        <!-- Step 1 -->
        <div class="step-item">
          <div class="step-number text-[#EC7F7A] font-unbounded text-[80px] lg:text-[120px] leading-none mb-6">
            1
          </div>
          <h3 class="text-[20px] lg:text-[24px] font-bold text-[#012828] mb-4 font-unbounded">
            Partagez vos besoins
          </h3>
          <p class="text-[#012828] text-[16px] lg:text-[17px] leading-relaxed font-sans opacity-80">
            Expliquez à Altéa, notre chatbot IA vos préoccupations de santé, vos symptômes ou vos objectifs de bien-être, avec vos propres mots.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="step-item">
          <div class="step-number text-[#EC7F7A] font-unbounded text-[80px] lg:text-[120px] leading-none mb-6">
            2
          </div>
          <h3 class="text-[20px] lg:text-[24px] font-bold text-[#012828] mb-4 font-unbounded">
            Recevez des recommandations
          </h3>
          <p class="text-[#012828] text-[16px] lg:text-[17px] leading-relaxed font-sans opacity-80">
            Obtenez des suggestions personnalisées de thérapies naturelles et de praticiens qualifiés près de chez vous.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="step-item">
          <div class="step-number text-[#EC7F7A] font-unbounded text-[80px] lg:text-[120px] leading-none mb-6">
            3
          </div>
          <h3 class="text-[20px] lg:text-[24px] font-bold text-[#012828] mb-4 font-unbounded">
            Réservez et avancez vers le mieux-être
          </h3>
          <p class="text-[#012828] text-[16px] lg:text-[17px] leading-relaxed font-sans opacity-80">
            Entrez en contact avec des praticiens, prenez rendez-vous et commencez votre parcours vers un bien-être naturel.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Pure presentation component
</script>

<style scoped>
.hero-container {
  width: 91.66%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
}

.step-number {
  opacity: 0.8;
  /* Matching the subtle pink weight in the mockup */
}

@media (max-width: 1023px) {
  .hero-container {
    width: 100%;
    padding: 0 24px;
  }
}
</style>
