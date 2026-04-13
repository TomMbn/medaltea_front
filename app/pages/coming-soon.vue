<template>
  <div class="min-h-screen bg-[#e0ecf2] flex flex-col items-center px-4 relative overflow-hidden pt-20 lg:pt-0 lg:justify-center">
    <!-- Animated Background Orbs -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#90BAD1] blur-[120px] opacity-30 rounded-full animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EC7F7A] blur-[120px] opacity-20 rounded-full animate-pulse [animation-delay:2s]"></div>

    <div class="max-w-[1200px] w-full flex flex-col items-center text-center relative z-10">
      <!-- Panda Mascot -->
      <div class="mb-8 lg:mb-12 animate-float">
        <NuxtImg 
          src="/images/panda-standing.png" 
          alt="Medaltea Panda" 
          class="w-40 lg:w-64 h-auto drop-shadow-2xl"
          width="256"
          height="256"
        />
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center">
        <h1 class="text-4xl lg:text-7xl font-normal font-unbounded text-[#012828] mb-6 lg:mb-8 leading-tight">
          Cette fonctionnalité <br />
          <span class="text-[#EC7F7A]">arrive bientôt</span>
        </h1>
        
        <p class="text-lg lg:text-xl text-[#012828]/70 font-sans max-w-[600px] mb-10 lg:mb-12">
          Nos équipes travaillent d'arrache-pied pour vous proposer les meilleurs praticiens certifiés et une expérience de consultation simplifiée.
        </p>

        <!-- CTA (Below the text as requested) -->
        <NuxtLink 
          to="/"
          class="group flex items-center gap-3 bg-[#012828] text-white px-8 py-4 rounded-[20px] font-bold text-lg hover:bg-[#012828]/90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95"
        >
          <span class="font-sans">Retour à l'accueil</span>
          <ArrowLeft :size="20" stroke-width="3" class="transition-transform group-hover:-translate-x-1" />
        </NuxtLink>
      </div>
    </div>

    <!-- Footer Status -->
    <div class="absolute bottom-8 text-[#012828]/40 font-medium text-sm lg:text-base">
      © 2026 Medaltea — L'expertise santé au naturel
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: false
})
</script>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.animate-float {
  animation: float 6s infinite ease-in-out;
}
</style>
