<template>
  <section class="bg-white py-20 px-4">
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

      <!-- Gauche : texte -->
      <div>
        <h2 class="font-unbounded font-bold text-3xl text-[#012828] mb-5 leading-snug">
          Pourquoi choisir un praticien sur Léya ?
        </h2>
        <p class="text-gray-500 text-base leading-relaxed mb-8">
          Trouvez facilement des praticiens adaptés à votre besoin, sans perdre de temps à comparer des dizaines de profils.
        </p>

        <!-- Checkmarks -->
        <ul class="space-y-4 mb-10">
          <li v-for="item in items" :key="item" class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-[#E8755A]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Check :size="13" class="text-[#E8755A]" stroke-width="3" />
            </span>
            <span class="text-[#012828] text-sm leading-relaxed">{{ item }}</span>
          </li>
        </ul>

        <!-- CTA -->
        <NuxtLink
          to="/trouver-un-praticien"
          class="inline-flex items-center gap-2 bg-[#012828] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#156F71] transition-colors"
        >
          Je consulte <ArrowUpRight :size="15" />
        </NuxtLink>
      </div>

      <!-- Droite : photo -->
      <div class="rounded-2xl overflow-hidden h-[400px] shadow-sm">
        <img
          src="https://placehold.co/600x400/e0ecf2/012828?text=Photo"
          alt="Praticienne avec un patient"
          class="w-full h-full object-cover"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { Check, ArrowUpRight } from 'lucide-vue-next'

const items = [
  'Des professionnels sélectionnés selon des critères de qualité et de pertinence',
  'Des informations claires pour choisir en toute confiance',
]
</script>
