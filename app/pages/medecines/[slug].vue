<template>
  <div class="medicine-page min-h-screen bg-[#e0ecf2] overflow-x-hidden">

    <!-- Hero -->
    <div class="relative w-full overflow-hidden h-[420px] md:h-[520px] rounded-b-[30px]">
      <NuxtImg
        :src="medicine.heroImage"
        :alt="medicine.name"
        class="w-full h-full object-cover"
        width="1440" height="520" format="webp" quality="85"
        fetchpriority="high"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <div class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-8">
          {{ medicine.icon }}
        </div>
        <h1 class="font-unbounded font-bold text-4xl md:text-5xl mb-10">{{ medicine.name }}</h1>
        <button
          class="bg-white text-[#012828] text-sm font-medium rounded-full px-4 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
          @click="scrollToPractitioners"
        >
          Trouvez {{ medicine.ctaLabel }}
        </button>
      </div>
    </div>

    <!-- Définition -->
    <div class="w-11/12 max-w-[1200px] mx-auto py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="rounded-[20px] overflow-hidden h-[260px] md:h-auto">
          <NuxtImg
            :src="medicine.definitionImage"
            :alt="`${medicine.name} — définition`"
            class="w-full h-full object-cover"
            width="600" height="380" format="webp" quality="80" loading="lazy"
          />
        </div>
        <div>
          <h2 class="font-unbounded font-bold text-2xl md:text-3xl text-[#012828] mb-6">
            Qu'est-ce que {{ medicine.nameWithArticle }} ?
          </h2>
          <p
            v-for="(para, i) in medicine.definitionText"
            :key="i"
            class="text-[#012828]/70 leading-relaxed mb-4 text-[16px]"
          >
            {{ para }}
          </p>
          <h3 class="font-unbounded font-bold text-[17px] text-[#012828] mt-8 mb-4">
            Pour qui est-ce recommandé ?
          </h3>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="condition in medicine.conditions.slice(0, 6)"
              :key="condition"
              class="bg-[#90BAD14F] border border-[#90BAD1] text-[#012828] text-sm px-5 py-2.5 rounded-[50px] font-sans"
            >
              {{ condition }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mosaïque -->
    <div class="w-11/12 max-w-[1440px] mx-auto pb-20">
      <div class="flex flex-col lg:flex-row gap-4">

        <!-- Colonne gauche : image + stats côte-à-côte sur mobile, empilés sur desktop -->
        <div class="flex flex-row lg:flex-col gap-4 lg:flex-1">
          <div class="flex-1 lg:flex-none relative rounded-[20px] overflow-hidden h-[180px] lg:h-[250px]">
            <NuxtImg
              :src="medicine.mosaicImage1"
              :alt="medicine.name"
              class="w-full h-full object-cover"
              width="460" height="280" format="webp" quality="80" loading="lazy"
            />
          </div>
          <div class="flex-1 lg:flex-none bg-[#90BAD1] rounded-[20px] h-[180px] lg:h-[160px] flex flex-col justify-between p-5 lg:p-6">
            <div class="flex items-center gap-2 text-[#012828]/60">
              <Clock :size="15" />
              <span class="text-sm font-medium">Temps moyen d'une séance</span>
            </div>
            <div class="font-unbounded font-bold text-2xl text-[#012828]">{{ medicine.duration }}</div>
          </div>
        </div>

        <!-- Colonne centrale -->
        <div class="relative rounded-[20px] overflow-hidden h-[260px] lg:h-auto lg:flex-1">
          <NuxtImg
            :src="medicine.mosaicImage2"
            :alt="medicine.mosaicImage2Tagline"
            class="w-full h-full object-cover"
            width="460" height="476" format="webp" quality="80" loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span class="absolute bottom-5 left-5 text-white font-unbounded font-bold text-xl">
            {{ medicine.mosaicImage2Tagline }}
          </span>
        </div>

        <!-- Colonne droite : count + image côte-à-côte sur mobile, empilés sur desktop -->
        <div class="flex flex-row lg:flex-col gap-4 lg:flex-1">
          <div class="flex-1 lg:flex-none relative bg-[#156F71] rounded-[20px] h-[180px] lg:h-[160px] flex items-center p-5 lg:p-6 overflow-hidden">
            <NuxtLink
              to="/coming-soon"
              class="absolute top-5 right-5 bg-white text-[#012828] text-sm font-medium rounded-full px-4 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Voir la liste →
            </NuxtLink>
            <div class="text-white">
              <div class="font-unbounded font-bold text-5xl lg:text-6xl leading-none">{{ medicine.count }}</div>
              <div class="font-unbounded text-base lg:text-lg mt-2 opacity-80">{{ medicine.name }}</div>
            </div>
          </div>
          <div class="flex-1 lg:flex-none relative rounded-[20px] overflow-hidden h-[180px] lg:h-[250px]">
            <NuxtImg
              :src="medicine.mosaicImage3"
              :alt="medicine.name"
              class="w-full h-full object-cover"
              width="460" height="280" format="webp" quality="80" loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Comment ça fonctionne -->
    <div class="w-11/12 max-w-[1200px] mx-auto pb-20">
      <h2 class="font-unbounded font-bold text-2xl md:text-3xl text-[#012828] text-center mb-12">
        Comment ça fonctionne ?
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          v-for="(step, i) in medicine.steps"
          :key="i"
          class="bg-[#e0ecf2] rounded-[20px] p-8 border border-[#EC7F7A]"
        >
          <div class="flex items-center gap-3 mb-4">
            <span class="w-9 h-9 rounded-full bg-[#EC7F7A] text-white font-unbounded font-bold flex items-center justify-center text-lg shrink-0">
              {{ i + 1 }}
            </span>
            <h3 class="font-unbounded font-bold text-2xl text-black">{{ step.title }}</h3>
          </div>
          <p class="text-black/80 leading-relaxed text-base font-light font-sans">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- Principaux bienfaits -->
    <div class="w-full pb-20">
      <div class="relative overflow-hidden py-16" style="background: linear-gradient(90deg, #156F71 46.59%, rgba(0,0,0,0) 100%)">
        <div class="absolute inset-0 pointer-events-none">
          <NuxtImg
            :src="medicine.heroImage"
            :alt="medicine.name"
            class="w-full h-full object-cover"
            width="1440" height="420" format="webp" quality="60" loading="lazy"
          />
        </div>
        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(90deg, #156F71 46.59%, rgba(0,0,0,0) 100%)" />
        <div class="w-11/12 max-w-[1200px] mx-auto relative z-10">
        <div class="max-w-lg">
          <h2 class="font-unbounded font-bold text-2xl md:text-3xl text-white mb-8">
            Principaux bienfaits
          </h2>
          <ul class="space-y-3 mb-10">
            <li
              v-for="benefit in medicine.benefits"
              :key="benefit"
              class="flex items-start gap-3 text-white/85 text-[15px]"
            >
              <Check :size="17" class="text-white mt-0.5 shrink-0" />
              <span>{{ benefit }}</span>
            </li>
          </ul>
          <button
            class="bg-white text-[#012828] text-sm font-medium rounded-full px-4 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
            @click="scrollToPractitioners"
          >
            Trouvez {{ medicine.ctaLabel }}
          </button>
        </div>
        </div>
      </div>
    </div>

    <!-- Praticiens -->
    <div ref="practitionersRef" class="w-11/12 max-w-[1200px] mx-auto pb-20">
      <h2 class="font-unbounded font-bold text-2xl md:text-3xl text-[#012828] text-center mb-2">
        Voici des praticiens proche de chez vous
      </h2>
      <div class="flex justify-center mb-12">
        <div class="h-1 w-16 bg-[#EC7F7A] rounded-full" />
      </div>

      <!-- Carousel -->
      <div class="relative max-w-[1080px] mx-auto">

        <!-- Flèche gauche : absolute pour ne pas décaler les cards -->
        <button
          @click="prevSlide"
          :disabled="currentSlide === 0"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-[#012828]/40 hover:text-[#012828] disabled:opacity-20 transition-colors"
        >
          <ChevronLeft :size="22" />
        </button>

        <!-- Cards : padding latéral = place pour les flèches -->
        <div class="flex gap-4 px-10">
          <div
            v-for="(p, i) in visiblePractitioners"
            :key="currentSlide + i"
            class="flex-1 bg-white rounded-[20px] p-5"
            style="border: 1px solid #90BAD1; box-shadow: 0px 4px 30px 0px #B0B0B02B;"
          >
            <!-- Header -->
            <div class="flex items-center gap-3 mb-5">
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                :style="{ backgroundColor: avatarColors[(currentSlide + i) % avatarColors.length] }"
              >
                {{ initials(p.name) }}
              </div>
              <div>
                <div class="font-unbounded font-bold text-[#012828] text-base">{{ p.name }}</div>
                <div class="text-[#EC7F7A] text-sm font-medium">{{ medicine.name }}</div>
                <div class="flex items-center gap-1 text-[#012828]/50 text-sm mt-0.5">
                  <MapPin :size="11" />
                  <span>{{ p.city }}</span>
                </div>
              </div>
            </div>

            <!-- Durée -->
            <div class="flex items-center gap-1.5 text-[#012828]/50 text-sm mb-5">
              <Clock :size="13" />
              <span>{{ medicine.duration }}</span>
            </div>

            <!-- Footer -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-1.5 text-[#012828] font-bold text-sm">
                <span>{{ p.rating }}</span>
                <Star :size="14" class="text-yellow-400 fill-yellow-400" />
                <ArrowUpRight :size="14" class="text-[#012828]/40" />
              </div>
              <NuxtLink
                to="/coming-soon"
                class="flex items-center justify-center gap-1.5 bg-[#012828] text-white text-xs font-medium px-4 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors"
              >
                Découvrir les disponibilités
                <ArrowUpRight :size="13" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Flèche droite : absolute -->
        <button
          @click="nextSlide"
          :disabled="currentSlide >= mockPractitioners.length - cardsPerView"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-[#012828]/40 hover:text-[#012828] disabled:opacity-20 transition-colors"
        >
          <ChevronRight :size="22" />
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Clock, Check, MapPin, Star, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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

const practitionersRef = ref(null)

function scrollToPractitioners() {
  practitionersRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const avatarColors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']

function initials(name) {
  return name.split(' ').map(n => n[0]).join('')
}

const mockPractitioners = [
  { name: 'Anaëlle Bellanger', city: 'Saumur', rating: 5 },
  { name: 'Marc Dupont', city: 'Paris 15e', rating: 4 },
  { name: 'Sophie Martin', city: 'Lyon 6e', rating: 5 },
  { name: 'Thomas Bernard', city: 'Bordeaux', rating: 4 },
  { name: 'Claire Rousseau', city: 'Nantes', rating: 5 },
]

const windowWidth = ref(1200)

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', () => { windowWidth.value = window.innerWidth })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => { windowWidth.value = window.innerWidth })
})

const cardsPerView = computed(() => {
  if (windowWidth.value < 640) return 1
  if (windowWidth.value < 1024) return 2
  return 3
})

const currentSlide = ref(0)

watch(cardsPerView, () => { currentSlide.value = 0 })

const visiblePractitioners = computed(() =>
  mockPractitioners.slice(currentSlide.value, currentSlide.value + cardsPerView.value)
)

function prevSlide() {
  if (currentSlide.value > 0) currentSlide.value--
}
function nextSlide() {
  if (currentSlide.value < mockPractitioners.length - cardsPerView.value) currentSlide.value++
}
</script>
