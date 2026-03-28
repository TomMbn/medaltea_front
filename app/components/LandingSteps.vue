<template>
  <section class="landing-steps py-24 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] mb-20">
        Comment ça marche ?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-24 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>

        <!-- Step 1 -->
        <div class="step-card flex flex-col items-center group">
          <div class="step-number text-[80px] font-bold text-[#EC7F7A]/20 font-unbounded leading-none mb-6 transition-colors group-hover:text-[#EC7F7A]/40">1</div>
          <h3 class="text-[20px] font-bold text-[#012828] mb-4 font-unbounded">Partagez vos besoins</h3>
          <p class="text-[#012828]/60 text-[16px] leading-[1.6] max-w-[280px] font-sans">
            Expliquez à Altea votre état de bien-être actuel et elle vous proposera les types de soins les mieux adaptés.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="step-card flex flex-col items-center group">
          <div class="step-number text-[80px] font-bold text-[#EC7F7A]/20 font-unbounded leading-none mb-6 transition-colors group-hover:text-[#EC7F7A]/40">2</div>
          <h3 class="text-[20px] font-bold text-[#012828] mb-4 font-unbounded text-center">Recevez des recommandations</h3>
          <p class="text-[#012828]/60 text-[16px] leading-[1.6] max-w-[280px] font-sans">
            Obtenez des suggestions de types de soins personnalisés, pour choisir la médecine de demain qui fera de bien à vous.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="step-card flex flex-col items-center group">
          <div class="step-number text-[80px] font-bold text-[#EC7F7A]/20 font-unbounded leading-none mb-6 transition-colors group-hover:text-[#EC7F7A]/40">3</div>
          <h3 class="text-[20px] font-bold text-[#012828] mb-4 font-unbounded">Réservez et avancez vers le mieux-être</h3>
          <p class="text-[#012828]/60 text-[16px] leading-[1.6] max-w-[280px] font-sans">
            Prenez rendez-vous avec des praticiens pour mettre vos soins en marche, et commencer votre parcours vers un bien-être durable.
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
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
.landing-steps {
  background-color: white;
}
</style>
