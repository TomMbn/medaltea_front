<template>
  <div class="relative w-full h-full overflow-hidden bg-vert-600 text-white p-10 xl:p-16 flex flex-col">
    <!-- Motifs de feuilles -->
    <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="absolute left-[10%] bottom-[34%] w-[150px] opacity-20 -rotate-[25deg] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="absolute right-[3%] top-[10%] w-[200px] opacity-20 rotate-[15deg] pointer-events-none select-none" style="animation: none;" />

    <NuxtLink to="/" class="relative inline-flex items-center gap-[10px] self-start" aria-label="Léya, retour à l'accueil">
      <img src="/images/footer/logo-blanc.svg" alt="" width="89" height="40" class="h-10 w-auto" style="animation: none;" />
      <span class="rounded-full bg-corail-500 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900">Pro</span>
    </NuxtLink>

    <!-- Bascule patient / praticien : dans le panneau pour garder le formulaire identique à la maquette -->
    <AuthAudienceSwitch class="absolute right-10 xl:right-16 top-10 xl:top-16" page="register" current="pro" />

    <img src="/images/chatbot-mascotte-accueil.webp" alt="" aria-hidden="true" width="254" height="300" class="absolute left-[58%] top-[120px] w-[150px] xl:left-[371px] xl:top-[140px] xl:w-[186px] h-auto -rotate-6 pointer-events-none select-none" style="animation: none;" />

    <div class="relative mt-auto">
      <p class="font-unbounded font-normal text-[24px] xl:text-[32px] leading-[normal] max-w-[492px]">Rejoignez les praticiens qui reçoivent des patients sur Léya</p>
      <ul class="mt-6 flex flex-col gap-4 xl:gap-6 text-[18px] xl:text-[20px] leading-[normal]">
        <li v-for="b in benefits" :key="b" class="flex items-center gap-3">
          <span class="w-7 h-7 shrink-0 rounded-full bg-white text-vert-600 flex items-center justify-center"><Check :size="14" aria-hidden="true" /></span>
          {{ b }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'
const benefits = [
  'Votre fiche visible par les patients de votre ville',
  'Un agenda en ligne et la gestion des demandes',
  'Environ 3 minutes, tout reste modifiable ensuite',
]
</script>
