<template>
  <section class="landing-faq py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-sm p-6 sm:p-10 lg:p-20 flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
      
      <!-- Left: Title & Image -->
      <div class="lg:w-1/2 w-full">
        <h2 class="text-2xl sm:text-[32px] lg:text-[44px] font-normal font-unbounded text-[#012828] mb-8 lg:mb-12">
          FAQ
        </h2>
        <div class="rounded-[20px] overflow-hidden shadow-lg aspect-video lg:aspect-auto lg:h-[320px]">
          <NuxtImg 
            src="/images/women-phone.jpeg" 
            alt="Consultation d'expert" 
            class="w-full h-full object-cover"
            width="800"
            height="320"
            format="webp"
            quality="80"
            loading="lazy"
            placeholder
            sizes="sm:100vw md:500px"
          />
        </div>
      </div>

      <!-- Right: Accordion -->
      <div class="lg:w-1/2 flex flex-col pt-4">
        <div class="divide-y divide-gray-200">
          <div v-for="(item, index) in faqs" :key="index" class="group">
            <button 
              @click="toggle(index)"
              class="w-full flex items-center justify-between text-left py-7 group"
            >
              <span class="text-[18px] lg:text-[20px] font-bold text-[#012828] font-unbounded group-hover:text-[#156F71] transition-colors leading-tight">
                {{ item.question }}
              </span>
              <div class="flex-shrink-0 ml-4 relative w-6 h-6 flex items-center justify-center">
                <Plus 
                  :size="24" 
                  class="text-[#012828] transition-all duration-300 absolute" 
                  :class="openIndex === index ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'"
                />
                <div 
                  class="w-5 h-[2px] bg-[#012828] transition-all duration-300 absolute"
                  :class="openIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                ></div>
              </div>
            </button>
            
            <div 
              class="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
              :class="openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <div class="pb-8 text-[#012828]/70 text-[16px] lg:text-[18px] leading-relaxed font-sans max-w-[540px]">
                  {{ item.answer }}
                </div>
              </div>
            </div>
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
    answer: "Medaltea vous guide à travers une sélection rigoureuse de professionnels certifiés. Vous pouvez filtrer par spécialité, localisation et consulter les avis pour trouver l'expert qui correspond le mieux à vos besoins de santé naturelle."
  },
  {
    question: "Quels sont les délais de prise de rendez-vous ?",
    answer: "La prise de rendez-vous est immédiate via notre plateforme. Les disponibilités varient selon les praticiens, mais la plupart proposent des créneaux dans la semaine en cours."
  },
  {
    question: "Puis-je annuler une consultation ?",
    answer: "Oui, vous pouvez annuler ou reporter votre consultation directement depuis votre espace personnel jusqu'à 24 heures avant le rendez-vous sans frais supplémentaires."
  }
]
</script>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
</style>
