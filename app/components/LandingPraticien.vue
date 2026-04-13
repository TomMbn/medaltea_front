<template>
  <section class="landing-praticien py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1200px] mx-auto relative rounded-[20px] overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-[#156F71]">
      
      <!-- Left: Content Area (Teal) -->
      <div class="lg:w-1/2 p-6 sm:p-10 lg:p-20 text-white flex flex-col justify-center">
        <h2 class="text-2xl sm:text-[32px] lg:text-[44px] font-normal font-unbounded leading-tight mb-6">
          Trouvez un praticien <br class="hidden lg:block"/> près de chez vous
        </h2>
        <p class="text-white/90 text-[16px] lg:text-[18px] mb-8 lg:mb-12 font-sans max-w-[480px]">
          Consultez des professionnels certifiés, triés par spécialité et localisation.
        </p>
        <NuxtLink to="/coming-soon" class="px-8 py-3.5 rounded-[30px] border-2 border-white text-white font-bold text-[16px] lg:text-[17px] transition-all hover:bg-white/10 flex items-center gap-3 self-start group">
          <span class="font-sans">Voir tous les praticiens</span>
          <ArrowUpRight :size="20" stroke-width="3" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </NuxtLink>
      </div>

      <!-- Right: Main Image Area -->
      <div class="lg:w-1/2 relative min-h-[400px]">
        <NuxtImg 
          src="/images/women-hypno.jpg" 
          alt="Séance d'hypnothérapie" 
          class="absolute inset-0 w-full h-full object-cover"
          width="800"
          height="600"
          format="webp"
          quality="80"
          loading="lazy"
          placeholder
          sizes="sm:100vw md:50vw lg:600px"
        />
        
        <!-- Floating Profile Card: Fabrice Desuet -->
        <div class="absolute left-4 bottom-4 lg:left-10 lg:bottom-10 bg-white rounded-[20px] p-4 lg:p-5 shadow-2xl flex items-center gap-4 min-w-[260px] sm:min-w-[320px] animate-float z-20">
          <div class="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-100 flex-shrink-0">
             <NuxtImg 
              src="/images/praticien-landing.jpg" 
              class="w-full h-full object-cover" 
              alt="Fabrice Desuet Avatar" 
              width="128"
              height="128"
              format="webp"
              quality="90"
              loading="lazy"
              placeholder
            />
          </div>
          <div class="flex-grow">
            <div class="text-[#012828] font-bold text-[18px]">Fabrice Desuet</div>
            <div class="text-[#EC7F7A] text-[14px] font-medium leading-none mb-2">Hypnothérapeute</div>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-[#012828] font-bold text-[14px]">5/5</span>
              <div class="flex gap-0.5 text-yellow-400">
                <Star v-for="i in 5" :key="i" :size="14" fill="currentColor" />
              </div>
              <span class="text-[#012828]/40 text-[13px]">(32 avis)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowUpRight, Star } from 'lucide-vue-next'
</script>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 5s infinite ease-in-out;
}
</style>
