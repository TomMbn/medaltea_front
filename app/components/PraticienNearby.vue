<template>
  <section class="bg-[#156F71] py-16 px-4">
    <div class="max-w-[1200px] mx-auto">

      <!-- Titre -->
      <h2 class="text-white text-2xl md:text-3xl font-bold text-center mb-12 leading-snug">
        Voici des praticiens proche de
        <span class="relative inline-block ml-1">
          chez vous
          <svg
            class="absolute -bottom-2 left-0 w-full overflow-visible"
            height="10" viewBox="0 0 100 10" preserveAspectRatio="none"
          >
            <path
              d="M1 7 C15 3, 30 9, 50 6 C70 3, 85 8, 99 4"
              stroke="#E8755A" stroke-width="2.5" fill="none"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </span>
      </h2>

      <!-- Carousel -->
      <div class="relative max-w-[1000px] mx-auto">

        <!-- Flèche gauche -->
        <button
          @click="prev"
          :disabled="current === 0"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronLeft :size="22" />
        </button>

        <!-- Cards -->
        <div class="flex gap-4 px-10">
          <div
            v-for="(p, i) in visible"
            :key="current + i"
            class="flex-1 bg-white rounded-2xl p-4 shadow-sm"
          >
            <!-- Header -->
            <div class="flex items-center gap-3 mb-4">
              <!-- Avatar + badge rating -->
              <div class="relative shrink-0">
                <div
                  class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base"
                  :style="{ backgroundColor: avatarColors[(current + i) % avatarColors.length] }"
                >
                  {{ initials(p.name) }}
                </div>
                <span class="absolute -bottom-1 -left-1 bg-[#012828] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 leading-none">
                  {{ p.rating }}★
                </span>
              </div>
              <!-- Info -->
              <div>
                <div class="font-unbounded font-bold text-[#012828] text-sm leading-tight">{{ p.name }}</div>
                <div class="text-[#E8755A] text-xs font-medium mt-0.5">{{ p.specialty }}</div>
                <div class="flex items-center gap-1 text-gray-400 text-sm mt-1">
                  <MapPin :size="10" />
                  <span>{{ p.city }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-2">
              <span class="text-[#E8755A] text-sm font-semibold">{{ p.price }}€ par séance</span>
              <NuxtLink
                to="/coming-soon"
                class="flex items-center gap-1 bg-[#012828] text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-[#156F71] transition-colors whitespace-nowrap"
              >
                Découvrir <ArrowUpRight :size="12" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Flèche droite -->
        <button
          @click="next"
          :disabled="current >= practitioners.length - perView"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronRight :size="22" />
        </button>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const practitioners = [
  { name: 'Anaëlle Bellanger', specialty: 'Ergothérapeute', city: 'Saumur', rating: 5, price: 60 },
  { name: 'Marc Dupont', specialty: 'Ostéopathe', city: 'Paris 15e', rating: 4, price: 70 },
  { name: 'Sophie Martin', specialty: 'Naturopathe', city: 'Lyon 6e', rating: 5, price: 55 },
  { name: 'Thomas Bernard', specialty: 'Sophrologie', city: 'Bordeaux', rating: 4, price: 65 },
  { name: 'Claire Rousseau', specialty: 'Acupuncture', city: 'Nantes', rating: 5, price: 60 },
]

const avatarColors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']

function initials(name) {
  return name.split(' ').map(n => n[0]).join('')
}

const windowWidth = ref(1200)
function updateWidth() { windowWidth.value = window.innerWidth }
onMounted(() => { windowWidth.value = window.innerWidth; window.addEventListener('resize', updateWidth) })
onUnmounted(() => window.removeEventListener('resize', updateWidth))

const perView = computed(() => {
  if (windowWidth.value < 640) return 1
  if (windowWidth.value < 1024) return 2
  return 3
})

const current = ref(0)
const visible = computed(() => practitioners.slice(current.value, current.value + perView.value))

function prev() { if (current.value > 0) current.value-- }
function next() { if (current.value < practitioners.length - perView.value) current.value++ }
</script>
