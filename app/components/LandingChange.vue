<template>
  <section class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pb-16 lg:pb-28" aria-labelledby="change-title">
    <div class="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-10 lg:gap-12 items-start">
      <div class="flex flex-col gap-8 lg:gap-12">
        <div class="flex flex-col gap-6">
          <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600">Pourquoi Léya</p>
          <h2 id="change-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900">
            Ce que Léya change
            <span class="mt-2 inline-block bg-corail-100 text-corail-700 rounded-full px-4 pt-0.5 pb-1.5">pour vous</span>
          </h2>
          <p class="text-[17px] lg:text-[20px] leading-snug text-neutre-600 max-w-[440px]">Une plateforme pensée pour vous rassurer, de la première question jusqu’au rendez-vous.</p>
        </div>
        <a href="#comment-ca-marche" class="self-start inline-flex items-center gap-[14px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-white/60 transition-colors">
          Voir comment ça marche
          <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900/20 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </a>
      </div>

      <ul class="flex flex-col gap-5 lg:gap-[30px] lg:pt-2">
        <li v-for="(card, i) in cards" :key="card.title" class="change-card rounded-[24px] px-6 sm:px-7 py-6 flex gap-5 sm:gap-6 items-start" :class="[card.dark ? 'bg-vert-600' : 'bg-white', rotations[i]]">
          <span class="w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center" :class="card.dark ? 'bg-white text-vert-600' : 'bg-bleu-50 text-vert-600'">
            <component :is="card.icon" :size="22" aria-hidden="true" />
          </span>
          <div class="flex flex-col gap-1.5">
            <h3 class="font-unbounded font-normal text-[18px] sm:text-[20px] leading-tight" :class="card.dark ? 'text-white' : 'text-vert-900'">{{ card.title }}</h3>
            <p class="text-[16px] sm:text-[18px] leading-snug" :class="card.dark ? 'text-bleu-100' : 'text-neutre-600'">{{ card.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ArrowUpRight, Compass, Users, Ban } from 'lucide-vue-next'

const cards = [
  { icon: Compass, title: 'Une orientation, pas un diagnostic', text: 'Léya vous aide à identifier une discipline et vous invite à consulter un professionnel de santé en cas de doute. Urgence : 15.' },
  { icon: Users, dark: true, title: 'Des praticiens près de chez vous', text: 'Recherche par spécialité et par localisation, avec les créneaux libres affichés directement.' },
  { icon: Ban, title: 'Gratuit, privé, sans engagement', text: 'Léya n’enregistre aucune conversation et ne vend aucun produit.' },
]
// Légère inclinaison de la maquette (écrans larges seulement)
const rotations = ['lg:rotate-[1.5deg] lg:ml-6', 'lg:-rotate-[1.5deg] lg:-ml-2', 'lg:rotate-1 lg:ml-3']
</script>
