<template>
  <div class="min-h-screen bg-[#e0ecf2] overflow-x-hidden">

    <!-- Hero -->
    <div class="bg-[#156F71] pt-28 pb-[16vw]">
      <div class="text-center px-6 pt-10">
        <div class="relative inline-block mb-8">
          <span
            class="inline-block bg-[#EC7F7A] text-white text-sm font-bold font-unbounded tracking-widest py-[15px] px-[35px] uppercase rounded-tr-[50px] rounded-bl-[50px]"
          >
            Liste des médecines alternatives
          </span>
        </div>
        <h1 class="font-unbounded font-bold text-4xl md:text-5xl text-white mb-5 max-w-2xl mx-auto leading-tight">
          Rechercher la médecine qui vous convient
        </h1>
        <p class="text-white/70 text-base max-w-md mx-auto leading-relaxed">
          Explorez nos disciplines de médecines alternatives et trouvez la thérapie adaptée à vos besoins.
        </p>
      </div>
    </div>

    <!-- Bande d'images (chevauche le bas du hero) -->
    <div class="flex gap-3 px-3 -mt-[14vw] relative z-10 mb-20">
      <div
        v-for="img in stripImages"
        :key="img.alt"
        class="flex-1 h-[27vw] rounded-[20px] overflow-hidden"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          class="w-full h-full object-cover"
          width="350" height="220" format="webp" quality="80" loading="lazy"
        />
      </div>
    </div>

    <!-- Filters + Grid -->
    <div class="w-11/12 max-w-[1200px] mx-auto pb-12">

      <!-- Barre de filtres -->
      <div class="flex items-center gap-3 mb-8">
        <button class="flex items-center gap-2 border border-[#012828]/20 text-[#012828] text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#012828]/50 transition-colors">
          Filtrer par <ChevronDown :size="15" />
        </button>
        <button class="flex items-center gap-2 border border-[#012828]/20 text-[#012828] text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#012828]/50 transition-colors">
          Problèmes rencontrés <ChevronDown :size="15" />
        </button>
        <span class="ml-auto text-[#EC7F7A] text-sm font-semibold">{{ medecines.length }} résultats</span>
      </div>

      <!-- Grille -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="med in medecines"
          :key="med.slug"
          :to="`/medecines/${med.slug}`"
          class="group flex flex-col bg-white rounded-[20px] overflow-hidden hover:-translate-y-1 transition-all duration-300"
          style="aspect-ratio: 429/397; box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.07);"
        >
          <!-- IMAGE ZONE: proportional height (260/397 of card) — icon anchored inside -->
          <div class="relative flex-shrink-0 overflow-hidden" style="aspect-ratio: 429/260;">
            <NuxtImg
              :src="med.heroImage"
              :alt="med.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              width="429" height="260" format="webp" quality="80" loading="lazy"
            />
            <!-- Icon: pinned bottom-right of image, always proportional -->
            <div
              class="absolute z-10 flex items-center justify-center text-3xl"
              style="bottom: 8px; right: 12px; width: 64px; height: 64px; border-radius: 14px; background: #B8CFD8;"
            >
              {{ med.icon }}
            </div>
          </div>

          <!-- WHITE CONTENT ZONE: takes remaining height, flat top edge -->
          <div class="flex-1 flex flex-col justify-center px-4">
            <!-- Row 1: title + button -->
            <div class="flex items-center justify-between gap-3 mb-2">
              <h2 class="font-unbounded font-bold text-[18px] text-[#012828] leading-snug">{{ med.name }}</h2>
              <span class="flex items-center gap-1.5 bg-[#012828] text-white text-sm font-medium whitespace-nowrap shrink-0" style="padding: 10px 20px; border-radius: 999px;">
                Découvrir <ArrowRight :size="13" />
              </span>
            </div>
            <!-- Row 2: practitioner count -->
            <div class="flex items-center gap-1.5 text-[#012828]/50 text-sm">
              <Users :size="13" />
              <span>{{ med.count }} praticiens</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end mt-10">
        <button class="flex items-center gap-2 text-[#EC7F7A] text-sm font-semibold hover:opacity-70 transition-opacity">
          Page suivante <ArrowRight :size="15" />
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="w-11/12 max-w-[1200px] mx-auto">
      <TheFooter />
    </div>

  </div>
</template>

<script setup>
import { ChevronDown, ArrowRight, Users } from 'lucide-vue-next'
import { medecines } from '~/data/medecines'

const stripImages = [
  { src: '/images/medicines-1.jpeg', alt: 'Massage' },
  { src: '/images/medicine-2.jpeg', alt: 'Herboristerie' },
  { src: '/images/medicine-3.jpeg', alt: 'Acupuncture' },
  { src: '/images/medicine-4.jpeg', alt: 'Yoga' },
  { src: '/images/medicine-5.jpeg', alt: 'Ostéopathie' },
]

useSeoMeta({
  title: 'Les Médecines alternatives — Découvrez toutes les disciplines | Léya',
  description: 'Explorez l\'annuaire des médecines alternatives sur Léya : ostéopathie, naturopathie, sophrologie, acupuncture, hypnothérapie et plus encore.',
  ogTitle: 'Les Médecines alternatives — Léya',
  ogDescription: 'Explorez toutes les disciplines de médecines alternatives sur Léya et trouvez le praticien adapté à vos besoins.',
  ogUrl: 'https://leya-sante.fr/medecines',
})
</script>
