<template>
  <div class="min-h-screen bg-[#e0ecf2] relative overflow-hidden flex flex-col">
    <!-- Background Elements -->
    <div class="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#90BAD1] blur-[100px] opacity-25 rounded-full"></div>
    <div class="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#EC7F7A] blur-[100px] opacity-15 rounded-full"></div>

    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
      <div class="max-w-[800px] w-full flex flex-col items-center text-center">
        <!-- Mascot -->
        <div class="mb-10 lg:mb-16 animate-float">
          <NuxtImg 
            src="/images/panda-standing.png" 
            alt="Medaltea Panda" 
            class="w-36 lg:w-56 h-auto drop-shadow-xl"
            width="256"
            height="256"
          />
        </div>

        <!-- Heading -->
        <h1 class="text-3xl lg:text-6xl font-normal font-unbounded text-[#012828] mb-6 leading-tight">
          Un peu de patience... <br />
          <span class="text-[#EC7F7A]">C'est pour bientôt !</span>
        </h1>
        
        <!-- Description -->
        <p class="text-base lg:text-xl text-[#012828]/70 font-sans max-w-[540px] mb-12">
          Nous préparons une sélection de praticiens passionnés pour vous accompagner. Cette fonctionnalité sera disponible très prochainement.
        </p>

        <!-- Button (Positioned clearly at the bottom of the stack) -->
        <NuxtLink 
          to="/"
          class="group inline-flex items-center gap-3 bg-[#012828] text-white px-8 py-4 rounded-[20px] font-bold text-lg hover:bg-[#012828]/90 transition-all shadow-xl hover:scale-[1.05] active:scale-95"
        >
          <span class="font-sans">Retour à l'accueil</span>
          <ArrowLeft :size="20" stroke-width="3" class="transition-transform group-hover:-translate-x-1" />
        </NuxtLink>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-8 text-center text-[#012828]/30 font-medium text-xs lg:text-sm">
      © 2026 Medaltea — L’expertise des médecines douces
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
