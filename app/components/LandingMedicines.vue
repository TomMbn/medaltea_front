<template>
  <section class="landing-medicines relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pb-16 lg:pb-28" aria-labelledby="med-title">
    <div class="grid grid-cols-1 lg:grid-cols-[620px_1fr] lg:gap-x-10 gap-y-10">
      <!-- Liste des médecines -->
      <div>
        <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-4">Les médecines</p>
        <h2 id="med-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900 mb-8 lg:mb-10">Trouvez la médecine qui vous convient</h2>

        <ul class="lg:-ml-0">
          <li v-for="(m, i) in list" :key="m.slug" :class="i > 0 && !m.featured && !list[i - 1].featured ? 'border-t border-bleu-300/50' : ''">
            <button
              type="button"
              class="med-row group w-full text-left flex items-center gap-5 rounded-full py-[14px] pl-[14px] pr-5 lg:-ml-3.5 lg:w-[calc(100%+14px)] transition-colors"
              :class="m.featured ? 'bg-corail-100' : 'hover:bg-white/50'"
              :aria-pressed="m.featured"
              @click="selected = m.slug"
            >
              <span class="w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center" :class="m.featured ? 'bg-white' : 'bg-bleu-100'">
                <img :src="m.pictogram" alt="" width="26" height="26" class="max-w-[26px] max-h-[26px] w-auto h-auto" />
              </span>
              <span class="flex-1 min-w-0 font-unbounded font-normal text-[20px] sm:text-[24px] lg:text-[26px]" :class="m.featured ? 'text-corail-700' : 'text-vert-900'">{{ m.name }}</span>
              <ArrowUpRight :size="22" class="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" :class="m.featured ? 'text-corail-700' : 'text-vert-600'" aria-hidden="true" />
            </button>
          </li>
        </ul>

        <div class="mt-8 lg:mt-9">
          <NuxtLink to="/medecines" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
            Voir les {{ total }} médecines
            <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
        </div>
      </div>

      <!-- Visuel : photo mise en avant (sophrologie) -->
      <div class="relative hidden md:block lg:min-h-[640px]" aria-hidden="false">
        <img :key="featuredMed.slug" :src="featuredMed.pictogram" alt="" aria-hidden="true" class="absolute hidden lg:block right-[-6%] top-[90px] w-[112%] max-w-[700px] opacity-[0.1] pointer-events-none" style="animation: none;" />
        <NuxtImg
          :key="featuredMed.slug"
          :src="photo"
          :alt="featuredMed.slug === 'sophrologie' ? 'Une femme pratiquant la sophrologie dans son salon' : `Séance ${featuredMed.nameWithArticle}`"
          :class="featuredMed.slug === 'sophrologie' ? 'relative w-full max-w-[620px] ml-auto h-auto' : 'photo-forme relative w-full max-w-[620px] ml-auto aspect-[1240/1280] object-cover'"
          width="620"
          height="640"
          format="webp"
          quality="80"
          loading="lazy"
          sizes="md:50vw lg:620px"
        />
        <!-- Aperçu de la médecine mise en avant -->
        <NuxtLink
          :to="`/medecines/${featuredMed.slug}`"
          class="absolute top-0 right-0 lg:-right-4 lg:-top-[52px] w-[300px] lg:w-[340px] bg-white rounded-[24px] shadow-douce px-6 py-5 flex flex-col gap-2 rotate-3 hover:rotate-0 transition-transform"
        >
          <span class="font-unbounded text-[20px] text-vert-900">{{ featuredMed.name }}</span>
          <span class="text-[16px] leading-snug text-neutre-600">{{ featuredMed.shortDescription }}</span>
          <span class="inline-flex items-center gap-2 text-[18px] font-semibold text-vert-900">Découvrir {{ featuredMed.nameWithArticle }} <ArrowUpRight :size="18" aria-hidden="true" /></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import { medecines } from '~/data/medecines'

// Pictogrammes de la maquette ; l'acupuncture (absente de la maquette) garde son pictogramme actuel.
const pictograms = {
  osteopathie: '/images/landing/med-osteopathie.svg',
  sophrologie: '/images/landing/med-sophrologie.svg',
  naturopathie: '/images/landing/med-naturopathie.svg',
  hypnotherapie: '/images/landing/med-hypnotherapie.svg',
  massage: '/images/landing/med-massage.svg',
}
const order = ['osteopathie', 'sophrologie', 'naturopathie', 'acupuncture', 'hypnotherapie', 'massage']
// Médecine mise en avant : celle sur laquelle on a cliqué (sophrologie au départ, comme la maquette)
const selected = ref('sophrologie')

const list = computed(() => order
  .map(slug => medecines.find(m => m.slug === slug))
  .filter(Boolean)
  .map(m => ({ ...m, pictogram: pictograms[m.slug] ?? m.icon, featured: m.slug === selected.value })))
const featuredMed = computed(() => list.value.find(m => m.featured) ?? list.value[0])
// Nombre de médecines qui ont une page sur le site
const total = medecines.length
const photo = computed(() => (featuredMed.value.slug === 'sophrologie' ? '/images/landing/medecine-photo.webp' : featuredMed.value.heroImage))
</script>

<style scoped>
/* Même découpage que la photo de la maquette (coins en creux en haut à gauche et en bas à droite) */
.photo-forme { -webkit-mask: url('/images/landing/forme-photo.svg') center / 100% 100% no-repeat; mask: url('/images/landing/forme-photo.svg') center / 100% 100% no-repeat; }
</style>
