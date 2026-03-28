<template>
  <section class="landing-praticien py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto relative rounded-[40px] overflow-hidden min-h-[500px] flex items-center shadow-2xl">
      <!-- Background Image -->
      <img src="/images/AdobeStock_336398199.jpeg" alt="Practitioner background" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-[#014949]/70"></div>

      <div class="relative z-10 p-12 lg:p-20 max-w-[600px] text-white">
        <h2 class="text-[40px] font-bold font-unbounded leading-tight mb-8">
          Trouvez un praticien près de chez vous
        </h2>
        <p class="text-white/80 text-[18px] mb-12 font-sans">
          Consultez des centaines de praticiens fiables et partagés par notre bien-être ?
        </p>
        <button class="px-10 py-5 rounded-[20px] border-2 border-white text-white font-bold text-[18px] transition-all hover:bg-white hover:text-[#014949] flex items-center gap-3 group">
          <span>Voir tous les praticiens</span>
          <ArrowUpRight :size="24" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>

      <!-- Floating Profile Card -->
      <div class="absolute right-12 bottom-12 hidden lg:flex bg-white rounded-[20px] p-4 shadow-2xl items-center gap-4 animate-bounce-slow">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
           <img src="/images/AdobeStock_550036958.jpeg" class="w-full h-full object-cover" alt="Profile" />
        </div>
        <div>
          <div class="text-[#012828] font-bold text-[16px]">Emma Grant</div>
          <div class="text-[#012828]/40 text-[12px]">Psychologue</div>
          <div class="flex gap-1 mt-1 text-yellow-400">
            <Star :size="12" v-for="i in 5" :key="i" fill="currentColor" />
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
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
