<template>
  <div class="relative w-full h-full overflow-hidden rounded-[32px] bg-vert-600 text-white">
    <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="absolute left-[-30px] top-[260px] w-[200px] opacity-20 pointer-events-none select-none" style="animation: none;" />
    <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="absolute right-[-20px] top-[110px] w-[220px] opacity-20 pointer-events-none select-none" style="animation: none;" />

    <NuxtLink to="/" class="absolute left-10 top-10 inline-flex items-center gap-2" aria-label="Léya, retour à l'accueil">
      <img src="/images/footer/logo-blanc.svg" alt="" width="89" height="40" class="h-10 w-auto" style="animation: none;" />
      <span class="rounded-full bg-corail-500 px-3 py-1 text-[14px] font-semibold leading-[normal] text-white">Pro</span>
    </NuxtLink>

    <img src="/images/chatbot-mascotte-accueil.webp" alt="" aria-hidden="true" width="254" height="300" class="absolute left-[62%] top-[150px] w-[110px] xl:w-[130px] h-auto pointer-events-none select-none" style="animation: none;" />

    <div class="absolute left-10 right-10 bottom-10">
      <p class="font-unbounded font-normal text-[24px] xl:text-[32px] leading-[normal]">Rejoignez les praticiens qui reçoivent des patients sur Léya</p>
      <ul class="mt-6 flex flex-col gap-4 text-[16px] leading-[normal]">
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
  'Environ 2 minutes, tout reste modifiable ensuite',
]
</script>
