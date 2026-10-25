<template>
  <div class="medicine-page min-h-screen overflow-x-clip bg-gradient-to-b from-bleu-50 to-[#e0ecf2]">

    <!-- Hero -->
    <section class="relative pt-[120px] lg:pt-[150px] pb-14 lg:pb-24" aria-labelledby="med-title">
      <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[270px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/medecines/feuille-hero.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[86.8%] top-[620px] w-[15.3%] opacity-[0.7] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/footer/feuille-2.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[51%] top-[40px] w-[8.7%] opacity-[0.7] pointer-events-none select-none" style="animation: none; transform: rotate(-25deg);" />

      <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] grid grid-cols-1 lg:grid-cols-[1fr_600px] gap-10 lg:gap-8 items-start">
        <div>
          <nav aria-label="Fil d'Ariane" class="inline-flex items-center bg-white rounded-full px-4 py-[5px] text-[16px] font-medium text-vert-900">
            <NuxtLink to="/medecines" class="hover:underline py-1">Médecines</NuxtLink>
            <span aria-hidden="true" class="mx-1.5">›</span>
            <span aria-current="page">{{ medicine.name }}</span>
          </nav>

          <span class="mt-8 lg:mt-[34px] w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-vert-600 flex items-center justify-center" aria-hidden="true">
            <span class="inline-flex" style="filter: brightness(0) invert(1);">
              <img :src="pictogram" alt="" width="48" height="34" class="max-w-[40px] lg:max-w-[48px] max-h-[40px] w-auto h-auto" />
            </span>
          </span>

          <h1 id="med-title" class="mt-8 lg:mt-[34px] font-unbounded font-normal text-vert-900 text-[30px] sm:text-[40px] lg:text-[clamp(36px,3.3vw,56px)] leading-[1.15] flex flex-col items-start gap-1 lg:gap-2 lg:max-w-[560px]">
            <span class="text-balance">{{ tagline.lead }}</span>
            <!-- Article élidé (l’) : il reste collé au nom de la médecine, jamais seul en fin de ligne.
                 Sans article, un nom long (médecine traditionnelle chinoise) peut passer à la ligne sur mobile. -->
            <span class="flex items-center" :class="{ 'whitespace-nowrap': tagline.elided }">
              <span v-if="tagline.elided" class="mr-1">{{ tagline.elided }}</span>
              <span class="bg-corail-100 text-corail-700 rounded-full px-5 lg:px-[22px] pt-0.5 pb-2 lg:pb-[10px]">{{ medicine.name.toLowerCase() }}</span>
            </span>
          </h1>

          <p class="mt-8 lg:mt-12 text-[18px] lg:text-[24px] leading-snug text-neutre-600 max-w-[640px]">{{ medicine.heroLead ?? `${medicine.shortDescription}.` }}</p>

          <ul v-if="chips.length" class="mt-8 flex flex-wrap gap-2" aria-label="Motifs de consultation fréquents">
            <li v-for="c in chips" :key="c.label" class="inline-flex items-center gap-2 bg-white rounded-full pl-3 pr-4 py-[9px] text-[16px] font-medium text-vert-900"><component :is="c.icon" :size="14" class="text-vert-600" aria-hidden="true" /> {{ c.label }}</li>
          </ul>

          <div class="mt-8 lg:mt-10 flex flex-wrap gap-3">
            <button type="button" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow" @click="scrollToPractitioners">
              Trouver {{ medicine.ctaLabel }}
              <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </button>
            <NuxtLink to="/chatbot" class="inline-flex items-center gap-[14px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-white/60 transition-colors">
              Poser une question à Léya
              <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
          </div>
        </div>

        <div class="relative mx-auto lg:mx-0 w-full max-w-[420px] lg:max-w-none">
          <div class="photo-mask aspect-[600/680] w-full">
            <NuxtImg :src="medicine.heroImage" :alt="`${medicine.name} : séance avec un praticien`" class="w-full h-full object-cover" width="1200" height="1360" format="webp" quality="80" sizes="xs:90vw lg:600px" fetchpriority="high" />
          </div>
          <div v-if="practitionerCount > 0" class="absolute left-0 lg:-left-12 bottom-6 lg:-bottom-10 -rotate-[5deg] bg-white rounded-[24px] shadow-douce px-6 lg:px-8 py-5 lg:py-6 flex flex-col gap-1">
            <span class="font-unbounded font-medium text-[44px] lg:text-[56px] leading-none text-vert-600">{{ practitionerCount }}</span>
            <span class="text-[15px] lg:text-[16px] text-neutre-600">praticiens référencés en {{ medicine.name.toLowerCase() }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Définition -->
    <section class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pb-16 lg:pb-24" aria-labelledby="med-def">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div class="rounded-[28px] overflow-hidden aspect-[4/3] lg:aspect-[3/2]">
          <NuxtImg :src="medicine.definitionImage" :alt="`${medicine.name} : définition`" class="w-full h-full object-cover" width="1200" height="800" format="webp" quality="75" sizes="xs:100vw lg:660px" loading="lazy" />
        </div>
        <div>
          <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-4">En bref</p>
          <h2 id="med-def" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900 mb-6">Qu’est-ce que {{ medicine.nameWithArticle }} ?</h2>
          <p v-for="(para, i) in medicine.definitionText" :key="i" class="text-[17px] lg:text-[20px] leading-snug text-neutre-600 mb-4">{{ para }}</p>
          <template v-if="medicine.conditions?.length">
            <h3 class="font-unbounded font-normal text-[18px] lg:text-[20px] text-vert-900 mt-8 mb-4">Motifs de consultation fréquents</h3>
            <ul class="flex flex-wrap gap-2">
              <li v-for="condition in medicine.conditions.slice(0, 6)" :key="condition" class="bg-white rounded-full px-4 py-[9px] text-[16px] font-medium text-vert-900">{{ condition }}</li>
            </ul>
          </template>
        </div>
      </div>
    </section>

    <!-- Mosaïque -->
    <section class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pb-16 lg:pb-24" aria-label="En images">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-[26px] lg:items-stretch">
        <div class="flex flex-col gap-4 lg:gap-7">
          <div class="relative rounded-[35px] overflow-hidden h-[220px] lg:h-[212px]">
            <NuxtImg :src="medicine.mosaicImage1" :alt="medicine.name" class="absolute inset-0 w-full h-full object-cover" width="850" height="424" format="webp" quality="75" sizes="xs:100vw lg:425px" loading="lazy" />
          </div>
          <div class="bg-bleu-300 rounded-leya-m px-7 py-6 flex flex-col justify-between gap-8 lg:flex-1">
            <p class="flex items-center gap-3 text-[18px] lg:text-[20px] text-vert-900"><Clock :size="20" aria-hidden="true" /> Temps moyen d’une séance</p>
            <p class="font-unbounded font-normal text-[18px] text-vert-900">{{ medicine.duration }}</p>
          </div>
        </div>

        <div class="relative rounded-[35px] overflow-hidden min-h-[300px] lg:min-h-[391px]">
          <NuxtImg :src="medicine.mosaicImage2" :alt="medicine.mosaicImage2Tagline" class="absolute inset-0 w-full h-full object-cover" width="850" height="800" format="webp" quality="75" sizes="xs:100vw lg:425px" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true"></div>
          <p class="absolute left-5 bottom-7 right-16 font-unbounded font-normal text-white text-[26px] lg:text-[34px] leading-tight">{{ medicine.mosaicImage2Tagline }}</p>
        </div>

        <div class="flex flex-col gap-4 lg:gap-5">
          <div v-if="practitionerCount > 0" class="bg-vert-600 rounded-leya-m px-4 pt-7 pb-8 flex items-start justify-between gap-3 text-white">
            <div class="font-unbounded font-normal">
              <p class="text-[40px] lg:text-[47px] leading-none">{{ practitionerCount }}</p>
              <p class="text-[20px] lg:text-[24px] mt-2 leading-tight">praticiens référencés</p>
            </div>
            <NuxtLink :to="{ path: '/trouver-un-praticien', query: { specialite: medicine.slug }, hash: '#resultats' }" class="shrink-0 bg-white text-black text-[14px] rounded-leya-m px-4 py-2 hover:bg-white/90 transition-colors">Voir la liste</NuxtLink>
          </div>
          <div class="relative rounded-[35px] overflow-hidden min-h-[240px] lg:flex-1">
            <NuxtImg :src="medicine.mosaicImage3" :alt="medicine.name" class="absolute inset-0 w-full h-full object-cover" width="850" height="440" format="webp" quality="75" sizes="xs:100vw lg:425px" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ce que la pratique peut apporter -->
    <section class="relative bg-vert-600 overflow-hidden pt-14 lg:pt-[72px] pb-16 lg:pb-[100px]" aria-labelledby="med-benefits">
      <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[1%] top-[40px] w-[12%] pointer-events-none" style="animation: none; transform: rotate(10deg);" />
      <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[2%] top-[-10px] w-[10%] pointer-events-none" style="animation: none; transform: rotate(-40deg);" />
      <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px]">
        <h2 id="med-benefits" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-white max-w-[640px]">Ce que {{ medicine.nameWithArticle }} peut apporter</h2>
        <p class="mt-4 text-[17px] lg:text-[20px] text-bleu-100 max-w-[640px]">Une approche complémentaire, qui ne remplace pas un avis ou un traitement médical.</p>
        <ul class="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          <li v-for="benefit in medicine.benefits" :key="benefit" class="bg-white rounded-[24px] shadow-douce p-6 lg:p-7 flex flex-col gap-5">
            <span class="w-11 h-11 rounded-full bg-corail-100 text-corail-700 flex items-center justify-center"><Check :size="20" aria-hidden="true" /></span>
            <p class="text-[17px] lg:text-[18px] leading-snug text-vert-900">{{ benefit }}</p>
          </li>
        </ul>
        <button type="button" class="mt-10 inline-flex items-center gap-[14px] min-h-[48px] bg-white text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1" @click="scrollToPractitioners">
          Trouver {{ medicine.ctaLabel }}
          <span class="w-10 h-10 rounded-full bg-vert-900 flex items-center justify-center text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </button>
      </div>
    </section>

    <!-- Séance -->
    <section class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pt-16 lg:pt-24 pb-16 lg:pb-24" aria-labelledby="med-steps">
      <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-4">La séance</p>
      <h2 id="med-steps" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900">Comment se passe une séance ?</h2>

      <ol class="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
        <li v-for="(step, i) in medicine.steps" :key="step.title" class="relative">
          <div class="flex items-center">
            <span class="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] shrink-0 rounded-full bg-white shadow-douce flex items-center justify-center font-unbounded text-[18px] lg:text-[20px] text-corail-500">{{ String(i + 1).padStart(2, '0') }}</span>
            <span v-if="i < medicine.steps.length - 1" class="hidden md:block h-[2px] flex-1 bg-corail-500/30" aria-hidden="true"></span>
          </div>
          <h3 class="mt-6 font-unbounded font-normal text-[18px] lg:text-[20px] text-vert-900">{{ step.title }}</h3>
          <p class="mt-3 text-[16px] lg:text-[18px] leading-snug text-neutre-600 max-w-[290px]">{{ step.description }}</p>
        </li>
      </ol>

      <div class="mt-14 lg:mt-20 bg-vert-600 rounded-[28px] p-7 lg:p-10 text-white">
        <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px]">Avant de commencer</h3>
        <ul class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 text-[16px] lg:text-[18px] leading-snug">
          <li class="flex items-start gap-3"><span class="w-[26px] h-[26px] shrink-0 rounded-full bg-white text-vert-600 flex items-center justify-center"><Info :size="14" aria-hidden="true" /></span> Cette pratique ne remplace pas un avis ni un traitement prescrit par votre médecin.</li>
          <li class="flex items-start gap-3"><span class="w-[26px] h-[26px] shrink-0 rounded-full bg-white text-vert-600 flex items-center justify-center"><Info :size="14" aria-hidden="true" /></span> En cas de symptôme persistant ou inquiétant, ou de pathologie suivie, parlez-en d’abord à un professionnel de santé.</li>
        </ul>
      </div>
    </section>

    <!-- Praticiens + question à Léya -->
    <section ref="practitionersRef" class="relative mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pb-24 lg:pb-32 scroll-mt-28" aria-labelledby="med-pract">
      <img :src="pictogram" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[6%] -top-[40px] w-[28%] max-w-[420px] opacity-[0.06] pointer-events-none select-none" style="animation: none;" />
      <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-12">
        <div>
          <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-4">Praticiens</p>
          <h2 id="med-pract" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900">Des praticiens en {{ medicine.name.toLowerCase() }}</h2>
        </div>
        <NuxtLink :to="{ path: '/trouver-un-praticien', query: { specialite: medicine.slug }, hash: '#resultats' }" class="self-start lg:self-auto inline-flex items-center gap-[14px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:bg-white/60 transition-colors whitespace-nowrap">
          Voir tous les praticiens
          <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900/30 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
      </div>

      <div class="relative">
        <MedicinePraticiens :slug="medicine.slug" :name="medicine.name" :show-link="false" />
      </div>

      <!-- Question à Léya -->
      <div class="relative mt-28 lg:mt-[130px] mx-auto max-w-[520px]">
        <div class="absolute z-0 w-[110px] sm:w-[150px] right-[8%] sm:right-[43px] -top-[84px] sm:-top-[112px] -scale-x-100 pointer-events-none" aria-hidden="true">
          <img src="/images/landing/mascotte-panda.webp" alt="" width="223" height="193" class="panda--sur-vert w-full h-auto" />
        </div>
        <div class="relative z-10 bg-vert-600 rounded-[32px] p-8 lg:p-10 text-white">
          <h2 class="font-unbounded font-normal text-[22px] lg:text-[26px] leading-tight">Une question sur {{ medicine.nameWithArticle }} ?</h2>
          <p class="mt-4 text-[17px] lg:text-[18px] leading-snug text-bleu-100">Léya vous répond en quelques secondes.</p>
          <form class="mt-8 bg-white rounded-full pl-5 pr-1.5 py-1.5 flex items-center gap-2.5 focus-ring-within" @submit.prevent="ask">
            <input v-model="question" type="text" :aria-label="`Votre question sur ${medicine.nameWithArticle}`" :placeholder="`Posez votre question sur ${medicine.nameWithArticle}…`" class="focus-in-parent flex-1 min-w-0 bg-transparent text-[16px] sm:text-[18px] text-vert-900 placeholder-neutre-600 focus:outline-none" />
            <button type="submit" aria-label="Envoyer la question à Léya" class="w-11 h-11 shrink-0 rounded-full bg-corail-500 text-white flex items-center justify-center hover:bg-[#f1aeab] transition-colors"><ArrowRight :size="18" aria-hidden="true" /></button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Clock, Check, Info, Leaf, Wind, Moon, Heart, Activity, ArrowUpRight, ArrowRight } from 'lucide-vue-next'
import { getMedecineBySlug } from '~/data/medecines'

const route = useRoute()
const medicine = getMedecineBySlug(route.params.slug)

if (!medicine) {
  throw createError({ statusCode: 404, statusMessage: 'Médecine introuvable' })
}

useSeoMeta({
  title: medicine.seo.title,
  description: medicine.seo.description,
  ogTitle: medicine.seo.title,
  ogDescription: medicine.seo.description,
  ogImage: `https://leya-sante.fr${medicine.heroImage}`,
  ogUrl: `https://leya-sante.fr/medecines/${medicine.slug}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: medicine.seo.title,
  twitterDescription: medicine.seo.description,
  twitterImage: `https://leya-sante.fr${medicine.heroImage}`,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://leya-sante.fr' },
            { '@type': 'ListItem', position: 2, name: 'Médecines', item: 'https://leya-sante.fr/medecines' },
            { '@type': 'ListItem', position: 3, name: medicine.name, item: `https://leya-sante.fr/medecines/${medicine.slug}` },
          ],
        },
        {
          '@type': 'WebPage',
          name: medicine.seo.title,
          description: medicine.seo.description,
          url: `https://leya-sante.fr/medecines/${medicine.slug}`,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': 'https://leya-sante.fr/#website' },
        },
      ],
    }),
  }],
})

const { countFor } = await useSpecialityCounts()
const practitionerCount = countFor(medicine.slug)

// Pictogrammes de la maquette ; l'acupuncture (absente de la maquette) garde son pictogramme actuel.
const pictograms = {
  osteopathie: '/images/landing/med-osteopathie.svg',
  sophrologie: '/images/landing/med-sophrologie.svg',
  naturopathie: '/images/landing/med-naturopathie.svg',
  hypnotherapie: '/images/landing/med-hypnotherapie.svg',
  massage: '/images/landing/med-massage.svg',
}
const pictogram = pictograms[medicine.slug] ?? medicine.icon

const chipIcons = { wind: Wind, moon: Moon, heart: Heart, info: Info, activity: Activity, leaf: Leaf }
// « … avec l’ » + « ostéopathie » : l’article élidé passe sur la ligne de la médecine
const tagline = (() => {
  const t = medicine.heroTagline
  const i = t.lastIndexOf(' ')
  return t.endsWith('’') && i > 0 ? { lead: t.slice(0, i), elided: t.slice(i + 1) } : { lead: t, elided: '' }
})()

const chips = computed(() => medicine.heroChips
  ? medicine.heroChips.map(c => ({ label: c.label, icon: chipIcons[c.icon] }))
  : (medicine.conditions ?? []).slice(0, 4).map(label => ({ label, icon: Leaf })))

const practitionersRef = ref(null)
function scrollToPractitioners() {
  practitionersRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const question = ref('')
function ask() {
  const text = question.value.trim()
  if (!text) return
  navigateTo({ path: '/chatbot', query: { q: text } })
}
</script>

<style scoped>
/* Photo à la forme découpée de la maquette (le canal alpha de l'image sert de masque) */
.photo-mask {
  -webkit-mask: url('/images/medecines/masque-fiche.webp') center / 100% 100% no-repeat;
  mask: url('/images/medecines/masque-fiche.webp') center / 100% 100% no-repeat;
}
</style>
