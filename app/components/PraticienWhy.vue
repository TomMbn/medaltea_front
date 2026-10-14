<template>
  <section class="relative pt-10 lg:pt-0 pb-20 lg:pb-32" aria-labelledby="praticien-why-title">
    <img src="/images/landing/med-osteopathie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[-4%] bottom-[-40px] w-[31%] max-w-[540px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-5 items-center">
      <div class="flex flex-col gap-10 lg:gap-[63px] items-start">
        <div class="flex flex-col gap-8 lg:gap-[47px]">
          <div class="flex flex-col gap-5 lg:gap-7">
            <h2 id="praticien-why-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-black">Pourquoi choisir un praticien sur Léya ?</h2>
            <p class="text-[18px] lg:text-[24px] leading-snug text-black max-w-[576px]">Trouvez facilement des praticiens adaptés à votre besoin, sans perdre de temps à comparer des dizaines de profils.</p>
          </div>
          <ul class="flex flex-col gap-5 max-w-[557px]">
            <li v-for="item in items" :key="item" class="flex items-start gap-[22px]">
              <span class="w-9 h-9 rounded-full bg-corail-500 text-white flex items-center justify-center shrink-0"><Check :size="16" aria-hidden="true" /></span>
              <span class="text-[17px] lg:text-[20px] leading-snug text-black pt-1">{{ item }}</span>
            </li>
          </ul>
        </div>
        <NuxtLink to="/trouver-un-praticien#resultats" class="inline-flex items-center gap-[17px] bg-black text-white text-[18px] lg:text-[20px] rounded-leya-xl px-[30px] py-4 lg:py-5 hover:bg-vert-900 transition-colors">
          Je consulte <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="w-full max-w-[654px] lg:ml-auto">
        <NuxtImg src="/images/praticiens/pourquoi.webp" alt="Une femme souriante devant son ordinateur" class="w-full h-auto" width="654" height="555" format="webp" quality="80" loading="lazy" sizes="xs:100vw lg:654px" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { Check, ArrowUpRight } from 'lucide-vue-next'

const items = [
  'Des fiches complètes : spécialités, prestations, tarifs, horaires et adresse',
  'Des informations claires pour choisir en toute confiance',
]
</script>
