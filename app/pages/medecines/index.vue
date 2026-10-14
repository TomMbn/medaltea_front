<template>
  <div class="min-h-screen overflow-x-hidden bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">

    <!-- Hero vert + bandeau de photos -->
    <section class="relative bg-vert-600 pt-36 lg:pt-[177px] pb-8 lg:pb-0" aria-labelledby="med-list-title">
      <div class="mx-auto w-[calc(100%-2rem)] max-w-[878px] flex flex-col items-center text-center gap-6 lg:gap-9">
        <span class="inline-block bg-corail-500 text-white font-semibold text-[15px] lg:text-[18px] px-7 lg:px-[35px] py-3 lg:py-[15px] rounded-full">Liste des médecines alternatives</span>
        <h1 id="med-list-title" class="font-unbounded font-normal text-white text-[30px] sm:text-[40px] lg:text-[56px] leading-[1.15]">Rechercher la médecine qui vous convient</h1>
        <p class="text-white text-[17px] lg:text-[24px] leading-snug">Ostéopathie, sophrologie, naturopathie… Découvrez chaque pratique, ce qu’elle soulage et le déroulé d’une séance.</p>
      </div>

      <div class="relative z-10 mt-10 lg:mt-[35px] px-4 lg:px-[7px] lg:-mb-[88px]">
        <ul class="flex gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 lg:pb-0 mx-auto max-w-[1714px]" aria-label="Aperçu des médecines">
          <li v-for="(photo, i) in strip" :key="photo.src" class="snap-start shrink-0 basis-[55%] sm:basis-[34%] lg:basis-0 lg:flex-1 aspect-[330/450] rounded-leya-m overflow-hidden">
            <NuxtImg :src="photo.src" :alt="photo.alt" class="w-full h-full object-cover" width="660" height="900" format="webp" quality="75" :loading="i < 2 ? 'eager' : 'lazy'" sizes="xs:55vw sm:34vw lg:20vw" />
          </li>
        </ul>
      </div>
    </section>

    <!-- Recherche + résultats -->
    <section class="relative pt-16 lg:pt-[190px] pb-16 lg:pb-24" aria-label="Liste des médecines">
      <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[-40px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/landing/med-sophrologie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[-4%] top-[60px] w-[36%] max-w-[630px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[-4%] bottom-[240px] w-[33%] max-w-[573px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

      <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px]">
        <form class="flex" role="search" @submit.prevent>
          <label class="flex items-center gap-2.5 bg-white rounded-full px-[18px] py-3 w-full sm:w-[360px] focus-ring-within cursor-text">
            <Search :size="18" class="text-vert-600 shrink-0" aria-hidden="true" />
            <input v-model="search" type="search" aria-label="Rechercher une médecine" placeholder="Rechercher une médecine" class="focus-in-parent bg-transparent text-[17px] lg:text-[18px] text-vert-900 placeholder-neutre-600 focus:outline-none w-full min-w-0" />
          </label>
        </form>

        <p class="mt-10 lg:mt-12 mb-8 lg:mb-12 text-[16px] text-black" role="status" aria-live="polite">
          <span class="font-medium text-corail-500">{{ filtered.length }}</span> {{ filtered.length > 1 ? 'médecines' : 'médecine' }}
        </p>

        <ul v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <li v-for="med in filtered" :key="med.slug">
            <NuxtLink :to="`/medecines/${med.slug}`" class="group block h-full bg-white rounded-leya-m overflow-hidden shadow-[0_4px_10px_rgba(161,161,161,0.2)] hover:-translate-y-1 hover:shadow-douce transition-all duration-300 pb-6 lg:pb-[33px]">
              <div class="relative aspect-[429/274] overflow-hidden">
                <NuxtImg :src="med.heroImage" :alt="`${med.name} : séance`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width="858" height="548" format="webp" quality="75" loading="lazy" sizes="xs:100vw sm:50vw lg:429px" />
                <span class="absolute bottom-0 right-[11px] w-[64px] h-[64px] lg:w-[81px] lg:h-[81px] bg-bleu-300 rounded-leya-s flex items-center justify-center">
                  <img :src="med.pictogram" alt="" width="60" height="45" class="max-w-[44px] max-h-[44px] lg:max-w-[56px] lg:max-h-[56px] w-auto h-auto" />
                </span>
              </div>
              <div class="mt-5 lg:mt-[25px] px-5 sm:px-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
                <div class="flex flex-col gap-3.5 flex-1 basis-[210px] min-w-0">
                  <h2 class="font-unbounded font-normal text-[20px] xl:text-[22px] 2xl:text-[24px] leading-tight text-black">{{ med.name }}</h2>
                  <p class="flex items-center gap-2.5 text-[16px] text-black"><Stethoscope :size="16" aria-hidden="true" /> {{ countLabel(med.slug) }}</p>
                </div>
                <span class="shrink-0 inline-flex items-center gap-2.5 bg-vert-900 text-white text-[16px] h-10 px-[22px] lg:px-[30px] rounded-leya-xl group-hover:bg-vert-600 transition-colors">Découvrir <ArrowRight :size="16" aria-hidden="true" /></span>
              </div>
            </NuxtLink>
          </li>
        </ul>
        <p v-else class="text-[18px] text-neutre-600 py-10">Aucune médecine ne correspond à « {{ search }} ». <button type="button" class="underline text-vert-600" @click="search = ''">Effacer la recherche</button></p>
      </div>
    </section>

    <!-- Aide au choix -->
    <section class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pt-24 lg:pt-[165px] pb-20 lg:pb-32" aria-labelledby="med-help-title">
      <div class="relative">
        <div class="absolute z-0 w-[150px] lg:w-[223px] right-[4%] lg:right-[9%] -top-[130px] lg:-top-[165px] -scale-x-100 pointer-events-none" aria-hidden="true">
          <img src="/images/landing/mascotte-panda.webp" alt="" width="223" height="193" class="w-full h-auto" />
        </div>
        <div class="relative z-10 bg-vert-600 rounded-[32px] overflow-hidden px-7 sm:px-10 lg:px-14 py-10 lg:py-[56px] lg:min-h-[240px]">
          <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[14%] top-[20px] w-[300px] h-auto opacity-[0.12] pointer-events-none" style="animation: none;" />
          <div class="relative max-w-[640px]">
            <h2 id="med-help-title" class="font-unbounded font-normal text-[22px] sm:text-[26px] leading-tight text-white">Vous hésitez entre plusieurs médecines ?</h2>
            <p class="mt-4 text-[17px] lg:text-[20px] leading-snug text-bleu-100">Décrivez votre besoin à Léya, elle vous oriente vers la médecine qui peut vous convenir.</p>
            <NuxtLink to="/chatbot" class="mt-8 lg:mt-10 inline-flex items-center gap-[14px] min-h-[48px] bg-white text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
              Demander à Léya
              <span class="w-10 h-10 rounded-full bg-vert-900 flex items-center justify-center text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Stethoscope, ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import { medecines } from '~/data/medecines'

const { countFor } = await useSpecialityCounts()

const search = ref('')

// Pictogrammes de la maquette ; l'acupuncture (absente de la maquette) garde son pictogramme actuel.
const pictograms = {
  osteopathie: '/images/landing/med-osteopathie.svg',
  sophrologie: '/images/landing/med-sophrologie.svg',
  naturopathie: '/images/landing/med-naturopathie.svg',
  hypnotherapie: '/images/landing/med-hypnotherapie.svg',
  massage: '/images/landing/med-massage.svg',
}
const list = medecines.map(m => ({ ...m, pictogram: pictograms[m.slug] ?? m.icon }))

// Recherche locale, insensible à la casse et aux accents (nom, description, motifs de consultation)
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const filtered = computed(() => {
  const q = norm(search.value).trim()
  if (!q) return list
  return list.filter(m => norm([m.name, m.shortDescription, ...(m.conditions ?? [])].join(' ')).includes(q))
})

const countLabel = (slug) => {
  const n = countFor(slug)
  return n > 0 ? `${n} praticien${n > 1 ? 's' : ''}` : 'Aucun praticien pour le moment'
}

const strip = [
  { src: '/images/medecines/bandeau-1.webp', alt: 'Massage des pieds' },
  { src: '/images/medecines/bandeau-2.webp', alt: 'Plantes et huiles pour la naturopathie' },
  { src: '/images/medecines/bandeau-3.webp', alt: 'Séance d\'acupuncture' },
  { src: '/images/medecines/bandeau-4.webp', alt: 'Femme pratiquant la sophrologie' },
  { src: '/images/medecines/bandeau-5.webp', alt: 'Massage avec des ventouses' },
]

useSeoMeta({
  title: 'Médecines alternatives : les disciplines à découvrir | Léya',
  description: 'Explorez l\'annuaire des médecines alternatives sur Léya : ostéopathie, naturopathie, sophrologie, acupuncture, hypnothérapie et plus encore.',
  ogTitle: 'Médecines alternatives : les disciplines à découvrir — Léya',
  ogDescription: 'Explorez toutes les disciplines de médecines alternatives sur Léya et trouvez le praticien adapté à vos besoins.',
  ogUrl: 'https://leya-sante.fr/medecines',
})

useWebPageSchema({ name: 'Médecines alternatives : les disciplines à découvrir', description: 'Explorez l\'annuaire des médecines alternatives sur Léya : ostéopathie, naturopathie, sophrologie, acupuncture, hypnothérapie et plus encore.', type: 'CollectionPage', breadcrumbs: [{ name: "Médecines", path: '/medecines' }] })
</script>
