<template>
  <section class="landing-intro relative">
    <div class="hero-container py-12 lg:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        
        <!-- Left: Image Wrapper -->
        <div class="relative w-full h-full">
          <div class="w-full h-full aspect-[4/3] lg:aspect-auto rounded-[40px] overflow-hidden shadow-xl">
            <img 
              src="/images/women-phone.jpeg" 
              alt="Femme utilisant l'application Medaltea" 
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Decorative Galet Badge -->
          <div class="absolute -top-8 -left-8 w-24 h-24 lg:w-32 lg:h-32 bg-[#90BAD1] rounded-full flex items-center justify-center z-20 shadow-lg">
            <img 
              src="/images/galet.svg" 
              alt="Icone Galet" 
              class="w-[60%] h-[60%] object-contain mt-1"
            />
          </div>
        </div>

        <!-- Right: Content Card -->
        <div class="bg-[#156F71] rounded-[40px] p-8 lg:p-14 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h2 class="text-[32px] lg:text-[44px] font-normal font-unbounded mb-6 leading-tight">
              Qu'est-ce que Medaltea
            </h2>
            
            <p class="text-white text-[16px] lg:text-[18px] leading-relaxed mb-8 font-sans opacity-95">
              C'est la première plateforme d’IA générative au service des médecines douces et de votre bien-être. Trouvez l’orientation dont vous avez besoin en un instant, gratuitement.
            </p>

            <ul class="space-y-4 mb-10">
              <li v-for="item in features" :key="item" class="flex items-center gap-4">
                <div class="w-6 h-6 flex items-center justify-center shrink-0">
                  <Check :size="20" stroke-width="3" class="text-white" />
                </div>
                <span class="text-[16px] lg:text-[17px] font-sans font-medium">{{ item }}</span>
              </li>
            </ul>
          </div>

          <button 
            @click="navigateTo('/chatbot')"
            class="group inline-flex items-center justify-center gap-3 bg-white text-[#012828] font-bold px-8 py-4 rounded-[20px] transition-all hover:bg-gray-100 self-start text-[17px]"
          >
            <span class="font-sans">Je consulte</span>
            <div class="w-6 h-6 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight :size="20" stroke-width="3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Check, ArrowUpRight } from 'lucide-vue-next'

const features = [
  "Conseils personnalisés en médecine douce",
  "Orientation vers des solutions de bien-être adaptées",
  "Accès gratuit et instantané"
]
</script>

<style scoped>
.hero-container {
  width: 91.66%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 1023px) {
  .hero-container {
    width: 100%;
    padding: 0 24px;
  }
}
</style>
