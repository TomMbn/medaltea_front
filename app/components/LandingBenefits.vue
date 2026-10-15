<template>
  <section class="landing-benefits mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pt-16 lg:pt-[110px] pb-12 lg:pb-[90px]" aria-labelledby="why-title">
    <div class="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-4 mb-10 lg:mb-14">
      <h2 id="why-title" class="flex-1 font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-black">Pourquoi choisir un praticien sur Léya ?</h2>
      <p class="lg:w-[640px] text-[17px] lg:text-[20px] leading-snug text-neutre-600">Un accompagnement pensé pour vous rassurer, de la première question au rendez-vous.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Colonne 1 : consultation -->
      <div class="relative rounded-[28px] overflow-hidden min-h-[460px] lg:h-[660px]">
        <NuxtImg src="/images/landing/bento-consultation.webp" alt="Un praticien et son patient en consultation" class="absolute inset-0 w-full h-full object-cover" width="840" height="1320" format="webp" quality="75" loading="lazy" sizes="xs:100vw lg:420px" />
        <div class="absolute left-5 right-5 bottom-5 bg-white rounded-leya-m px-6 py-[22px] flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-full bg-bleu-50 flex items-center justify-center text-vert-600 shrink-0"><Clock :size="18" aria-hidden="true" /></span>
            <h3 class="font-unbounded font-normal text-[18px] lg:text-[20px] text-vert-900">Simple et rapide</h3>
          </div>
          <p class="text-[16px] leading-snug text-neutre-600">Un praticien trouvé en quelques clics, des créneaux visibles tout de suite.</p>
        </div>
      </div>

      <!-- Colonne 2 : informations claires + pistes -->
      <div class="flex flex-col gap-4 lg:h-[660px]">
        <div class="bg-vert-600 rounded-[28px] p-7 flex flex-col justify-between gap-10 lg:flex-1 min-h-[240px]">
          <span class="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center text-vert-600"><Info :size="22" aria-hidden="true" /></span>
          <div class="flex flex-col gap-2.5">
            <h3 class="font-unbounded font-normal text-[22px] lg:text-[26px] leading-tight text-white">Des informations claires</h3>
            <p class="text-[17px] lg:text-[18px] leading-snug text-bleu-100">Des explications simples sur chaque médecine. Léya oriente, elle ne remplace pas un avis médical.</p>
          </div>
        </div>
        <div class="relative rounded-[28px] overflow-hidden min-h-[300px] lg:flex-1">
          <NuxtImg src="/images/landing/bento-famille.webp" alt="Une mère et son enfant à la maison" class="absolute inset-0 w-full h-full object-cover" width="840" height="644" format="webp" quality="75" loading="lazy" sizes="xs:100vw lg:420px" />
          <div class="absolute left-5 bottom-5 max-w-[calc(100%-2.5rem)] bg-white rounded-full flex items-center gap-3 pl-4 pr-5 py-3">
            <span class="w-9 h-9 rounded-full bg-bleu-50 flex items-center justify-center text-vert-600 shrink-0"><Heart :size="16" aria-hidden="true" /></span>
            <span class="text-[15px] sm:text-[16px] font-medium text-vert-900">Des pistes adaptées à votre situation</span>
          </div>
        </div>
      </div>

      <!-- Colonne 3 : photo + parcours guidé -->
      <div class="flex flex-col gap-4 lg:h-[660px]">
        <div class="relative rounded-[28px] overflow-hidden min-h-[260px] lg:flex-[2]">
          <NuxtImg src="/images/landing/bento-equipe.webp" alt="Un couple qui se réjouit devant un ordinateur" class="absolute inset-0 w-full h-full object-cover" width="880" height="700" format="webp" quality="75" loading="lazy" sizes="xs:100vw lg:440px" />
        </div>
        <div class="bg-white rounded-[28px] px-7 py-6 flex flex-col gap-3.5 lg:flex-1">
          <h3 class="font-unbounded font-normal text-[18px] lg:text-[20px] text-vert-900">Guidé à chaque étape</h3>
          <ul class="flex flex-wrap gap-2" aria-label="Étapes du parcours">
            <li v-for="step in steps" :key="step" class="inline-flex items-center gap-1.5 bg-vert-600 text-white text-[16px] font-medium rounded-full pl-2.5 pr-3 py-1.5"><Check :size="14" aria-hidden="true" /> {{ step }}</li>
            <li class="inline-flex items-center bg-bleu-50 text-vert-900 text-[16px] font-medium rounded-full px-3 py-1.5">RDV</li>
          </ul>
          <p class="text-[16px] leading-snug text-neutre-600">De la première question jusqu’au rendez-vous.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Clock, Info, Heart, Check } from 'lucide-vue-next'

const steps = ['Besoin', 'Pistes', 'Praticien']
</script>
