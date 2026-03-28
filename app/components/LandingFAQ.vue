<template>
  <section class="landing-faq py-24 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
      
      <!-- Left: Imagery -->
      <div class="flex-1">
        <h2 class="text-[34px] font-bold font-unbounded text-[#012828] mb-12">
          FAQ
        </h2>
        <div class="rounded-[40px] overflow-hidden shadow-2xl h-[400px]">
          <img src="/images/AdobeStock_550036958.jpeg" alt="FAQ Wellness" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Right: Accordion -->
      <div class="flex-1 pt-12 lg:pt-24">
        <div class="space-y-4">
          <div v-for="(item, index) in faqs" :key="index" class="border-b border-gray-100 pb-4">
            <button 
              @click="toggle(index)"
              class="w-full flex items-center justify-between text-left py-4 group"
            >
              <span class="text-[18px] font-bold text-[#012828] font-sans group-hover:text-[#EC7F7A] transition-colors">
                {{ item.question }}
              </span>
              <Plus :size="24" :class="{'rotate-45': openIndex === index}" class="text-[#EC7F7A] transition-transform duration-300" />
            </button>
            
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="openIndex === index" class="mt-2 text-[#012828]/60 text-[16px] leading-relaxed font-sans pb-4">
                {{ item.answer }}
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: "Comment choisir le bon praticien ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed ut perspiciatis unde omnis iste natus."
  },
  {
    question: "Quels sont les délais de prise de rendez-vous ?",
    answer: "Phasellus feugiat sodales nulla euismod. Sed ut perspiciatis unde omnis iste natuer sit voluptatem accusantium doloremque."
  },
  {
    question: "Puis-je annuler une consultation ?",
    answer: "Sed aliquam, metus nec finibus consectetur, nisi quam sollicitudin elit, ac aliquam massa metus id ex. Lorem ipsum dolor sit amet."
  }
]
</script>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
</style>
