<template>
  <section class="landing-intro py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7f9]">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
      
      <!-- Left: Descriptive Image Card -->
      <div class="flex-1 w-full relative">
        <div class="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl group">
          <img 
            src="/images/AdobeStock_313373132.jpeg" 
            alt="Consultation Illustration" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <!-- Badge Accessory -->
          <div class="absolute -top-6 -left-6 w-20 h-20 bg-[#EC7F7A]/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
             <Stethoscope class="text-[#012828]" :size="32" />
          </div>
        </div>
      </div>

      <!-- Right: Content -->
      <div class="flex-1 bg-[#014949] rounded-[40px] p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
        <!-- Abstract background pattern -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <h2 class="text-[34px] font-bold font-unbounded mb-8 relative z-10">
          Qu'est-ce que Medaltea
        </h2>
        
        <p class="text-white/80 text-[18px] leading-relaxed mb-10 font-sans relative z-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
        </p>

        <ul class="space-y-6 mb-12 relative z-10">
          <li class="flex items-start gap-4">
            <div class="w-6 h-6 rounded-full bg-[#EC7F7A] flex items-center justify-center shrink-0 mt-1">
              <Check :size="14" stroke-width="4" />
            </div>
            <span class="text-[17px] font-medium opacity-90">Phasellus feugiat sodales nulla euismod.</span>
          </li>
          <li class="flex items-start gap-4">
            <div class="w-6 h-6 rounded-full bg-[#EC7F7A] flex items-center justify-center shrink-0 mt-1">
              <Check :size="14" stroke-width="4" />
            </div>
            <span class="text-[17px] font-medium opacity-90">Sed ut perspiciatis unde omnis iste natuer sit voluptatem accusantium doloremque.</span>
          </li>
        </ul>

        <button class="btn-cta group relative inline-flex items-center gap-3 bg-white text-[#012828] font-bold px-10 py-5 rounded-[20px] transition-all hover:bg-[#EC7F7A] hover:text-white overflow-hidden">
          <span>Je consulte</span>
          <ChevronRight :size="20" class="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Check, ChevronRight, Stethoscope } from 'lucide-vue-next'
</script>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}

.landing-intro {
  background-color: #f4f7f9;
}

.btn-cta {
  font-family: 'Futura PT', sans-serif;
  font-size: 18px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
}
</style>
