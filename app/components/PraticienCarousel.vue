<template>
  <section v-if="items.length" class="pc relative pb-16 lg:pb-24" aria-labelledby="praticien-carousel-title">
    <div class="mx-auto w-[calc(100%-1.5rem)] lg:w-[calc(100%-4.5rem)] max-w-[1673px] bg-vert-600 rounded-leya-m pc-panel px-4 pt-10 pb-12 lg:pt-[58px] lg:pb-[100px]">
      <h2 id="praticien-carousel-title" class="text-center font-unbounded font-normal text-white text-[24px] sm:text-[28px] lg:text-[32px] leading-tight">
        Des praticiens à <span class="relative inline-block">découvrir<img src="/images/praticiens/soulignement.svg" alt="" aria-hidden="true" class="absolute left-0 right-0 -bottom-2 w-full h-[14px]" style="animation: none;" /></span>
      </h2>

      <div class="relative mt-10 lg:mt-[81px] mx-auto max-w-[1205px] flex items-center">
        <button type="button" class="hidden md:flex absolute -left-9 z-10 w-8 h-10 items-center justify-center text-white/80 hover:text-white disabled:opacity-30" aria-label="Praticiens précédents" :disabled="atStart" @click="scrollBy(-1)">
          <ChevronLeft :size="28" aria-hidden="true" />
        </button>
        <ul ref="track" class="flex gap-[19px] overflow-x-auto snap-x snap-mandatory scroll-smooth w-full pb-2 -mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" @scroll.passive="onScroll">
          <li v-for="p in items" :key="p.id" class="snap-start shrink-0 basis-[85%] sm:basis-[calc((100%-19px)/2)] lg:basis-[calc((100%-38px)/3)] min-w-0">
            <NuxtLink :to="`/praticiens/${p.slug || p.id}`" class="group flex flex-col h-full bg-white rounded-leya-m pt-[18px] pb-[22px] pl-[22px] pr-6 shadow-[0_4px_15px_rgba(176,176,176,0.17)] hover:shadow-douce transition-shadow">
              <div class="flex items-center gap-[17px] min-w-0 mb-[13px]">
                <div class="relative shrink-0 w-[82px] h-[82px]">
                  <img v-if="photoOf(p) && !failed[p.id]" :src="photoOf(p)" alt="" width="82" height="82" loading="lazy" referrerpolicy="no-referrer" class="w-full h-full rounded-full object-cover bg-bleu-50" @error="failed[p.id] = true" />
                  <span v-else class="w-full h-full rounded-full flex items-center justify-center text-white font-unbounded text-[24px]" :style="{ backgroundColor: colors[p.id % colors.length] }" aria-hidden="true">{{ initials(p) }}</span>
                  <span v-if="ratingOf(p)" class="absolute left-0 bottom-0 inline-flex items-center gap-[3px] bg-[#fbf5d6] border-[0.5px] border-[#ffe854] rounded-[5px] px-[7px] py-[3px] text-[16px] text-black">{{ ratingOf(p) }} <Star :size="16" class="fill-[#ffe854] text-[#ffe854]" aria-hidden="true" /></span>
                </div>
                <div class="min-w-0 flex flex-col gap-[7px] leading-[normal]">
                  <p class="font-unbounded font-normal text-[18px] lg:text-[20px] leading-[normal] text-black line-clamp-2 break-words">{{ p.firstName }} {{ p.lastName }}</p>
                  <p v-if="p.specialities?.length" class="text-[16px] lg:text-[18px] font-semibold text-corail-500 truncate">{{ p.specialities[0].name }}</p>
                  <p v-if="p.city" class="flex items-center gap-2.5 text-[16px] lg:text-[18px] font-light text-black min-w-0"><MapPin :size="16" class="shrink-0" aria-hidden="true" /> <span class="truncate">{{ p.city }}</span></p>
                </div>
              </div>
              <div class="h-px bg-[#b5b5b5] mb-[11px]" aria-hidden="true"></div>
              <div class="flex items-center justify-between gap-3 mt-auto">
                <span v-if="priceOf(p) && p.bookable !== false" class="text-[16px] text-black"><span class="font-medium text-corail-500">dès {{ priceOf(p) }} €</span></span>
                <span v-else-if="p.bookable === false" class="text-[14px] text-neutre-600">Réservation indisponible</span>
                <span v-else></span>
                <span class="inline-flex items-center gap-2.5 bg-vert-900 text-white text-[16px] h-10 px-5 rounded-leya-xl whitespace-nowrap group-hover:bg-vert-600 transition-colors">Découvrir <ArrowUpRight :size="16" aria-hidden="true" /></span>
              </div>
            </NuxtLink>
          </li>
        </ul>
        <button type="button" class="hidden md:flex absolute -right-9 z-10 w-8 h-10 items-center justify-center text-white/80 hover:text-white disabled:opacity-30" aria-label="Praticiens suivants" :disabled="atEnd" @click="scrollBy(1)">
          <ChevronRight :size="28" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { MapPin, ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-vue-next'

// Praticiens de l'annuaire (données réelles) : les fiches réservables d'abord quand il y en a
const { data } = await useAsyncData('praticiens-carousel', async () => {
  const get = (query) => $fetch('/api/backend/praticiens', { query }).catch(() => [])
  const bookable = await get({ bookable: true, limit: 9 })
  if (Array.isArray(bookable) && bookable.length >= 3) return bookable
  const all = await get({ limit: 9 })
  return Array.isArray(all) ? all : []
})
const items = computed(() => data.value ?? [])

const failed = reactive({})
const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const initials = (p) => `${(p.firstName || '?')[0]}${(p.lastName || '')[0] || ''}`.toUpperCase()
const photoOf = (p) => {
  const url = p.photoThumbUrl || p.photoUrl
  try { return new URL(url).protocol === 'https:' ? url : '' } catch { return '' }
}
const priceOf = (p) => p.priceFrom ?? p.price ?? null
const ratingOf = (p) => (p.averageRating && p.reviewCount > 0 ? String(Number(p.averageRating).toFixed(1)).replace('.', ',') : '')

// Flèches : défilement d'une carte à la fois
const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
function onScroll() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 2
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
}
function scrollBy(dir) {
  const el = track.value
  const card = el?.querySelector('li')
  if (!el || !card) return
  el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 19), behavior: 'smooth' })
}
onMounted(onScroll)
</script>

<style scoped>
/* Unité de la maquette (1728 px) : espaces proportionnels sur grand écran */
.pc { --u: calc(min(100vw, 1728px) / 1728); }
@media (min-width: 1280px) {
  .pc { padding-top: calc(var(--u) * 124); }
  .pc-panel { padding-bottom: calc(var(--u) * 145); }
}
</style>
