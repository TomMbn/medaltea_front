<template>
  <section class="bg-[#156F71] py-16 px-4" aria-labelledby="praticien-results-title">
    <div class="max-w-[1200px] mx-auto">
      <h2 id="praticien-results-title" class="text-white text-2xl md:text-3xl font-bold text-center mb-3 leading-snug font-unbounded">
        <template v-if="q">Résultats pour « {{ q }} »</template>
        <template v-else>Nos praticiens</template>
      </h2>
      <p class="text-white/70 text-center mb-10 font-sans">
        {{ filtered.length }} praticien{{ filtered.length > 1 ? 's' : '' }}
      </p>

      <p v-if="error" class="text-center text-white bg-white/10 rounded-2xl p-6">
        La liste des praticiens est momentanément indisponible. Merci de réessayer dans un instant.
      </p>

      <p v-else-if="!filtered.length" class="text-center text-white bg-white/10 rounded-2xl p-6">
        <template v-if="q">Aucun praticien ne correspond à cette recherche. Essayez une autre ville ou un autre code postal.</template>
        <template v-else>Les premiers praticiens arrivent bientôt.</template>
      </p>

      <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="p in filtered" :key="p.id" class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div
              class="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-base"
              :style="{ backgroundColor: colors[p.id % colors.length] }"
              aria-hidden="true"
            >
              {{ initials(p) }}
            </div>
            <div class="min-w-0">
              <div class="font-unbounded font-bold text-[#012828] text-sm leading-tight truncate">
                {{ p.firstName }} {{ p.lastName }}
              </div>
              <div class="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin :size="12" /> <span class="truncate">{{ p.city }}<template v-if="p.postalCode"> ({{ p.postalCode }})</template></span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 mt-auto">
            <span v-if="p.price" class="text-[#E8755A] text-sm font-semibold">{{ p.price }} € par séance</span>
            <span v-else />
            <NuxtLink
              :to="`/praticiens/${p.id}`"
              class="flex items-center gap-1 bg-[#012828] text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-[#156F71] transition-colors whitespace-nowrap"
            >
              Prendre rendez-vous <ArrowUpRight :size="12" />
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  praticiens: { type: Array, default: () => [] },
  q: { type: String, default: '' },
  error: { type: Boolean, default: false },
})

const colors = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']

const normalize = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const filtered = computed(() => {
  const needle = normalize(props.q).trim()
  if (!needle) return props.praticiens
  return props.praticiens.filter(p =>
    normalize(`${p.firstName} ${p.lastName} ${p.city} ${p.postalCode} ${p.address}`).includes(needle),
  )
})

const initials = (p) => `${(p.firstName || '?')[0]}${(p.lastName || '')[0] || ''}`.toUpperCase()
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
