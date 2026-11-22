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
    <AuthAudienceSwitch class="absolute left-10 top-[100px] xl:left-16 xl:top-[108px] 2xl:left-auto 2xl:right-16 2xl:top-16" page="register" current="pro" />

    <!-- Mascotte : sur grand écran (maquette à 1728 px) position exacte ; en dessous, elle occupe la place libre entre le haut et le titre, sans jamais être coupée ni recouvrir le texte -->
    <img src="/images/chatbot-mascotte-accueil.webp" alt="" aria-hidden="true" width="254" height="300" class="panda--sur-vert hidden 2xl:block absolute left-[371px] top-[140px] w-[186px] h-auto -rotate-6 pointer-events-none select-none" style="animation: none;" />
    <div class="relative flex-1 min-h-0 flex justify-end items-start pt-[80px] xl:pt-16 pr-[4%] 2xl:hidden" aria-hidden="true">
      <img src="/images/chatbot-mascotte-accueil.webp" alt="" width="254" height="300" class="panda--sur-vert h-full max-h-[200px] w-auto max-w-[45%] object-contain object-top -rotate-6 pointer-events-none select-none" style="animation: none;" />
    </div>


    <div class="relative mt-auto">
      <p class="font-unbounded font-normal text-[24px] xl:text-[32px] [@media(max-height:780px)]:xl:text-[24px] leading-[normal] max-w-[492px]">Rejoignez les praticiens qui reçoivent des patients sur Léya</p>
      <ul class="mt-6 flex flex-col gap-4 xl:gap-6 [@media(max-height:780px)]:xl:gap-3 [@media(max-height:780px)]:mt-4 text-[18px] xl:text-[20px] [@media(max-height:780px)]:xl:text-[17px] leading-[normal]">
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
