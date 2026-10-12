<template>
  <div class="max-w-[1080px] mx-auto">
    <ul v-if="praticiens.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <PraticienCard v-for="p in praticiens" :key="p.id" :praticien="p" />
    </ul>
    <p v-else class="text-center text-[#012828]/70 bg-white rounded-2xl p-6 font-sans">
      Les premiers praticiens en {{ name.toLowerCase() }} arrivent bientôt.
    </p>

    <div class="flex justify-center mt-8">
      <NuxtLink
        :to="{ path: '/trouver-un-praticien', query: speciality ? { specialite: slug } : {}, hash: '#resultats' }"
        class="inline-flex items-center gap-2 bg-[#012828] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#156F71] transition-colors"
      >
        {{ speciality ? `Voir tous les praticiens en ${name.toLowerCase()}` : 'Voir tous les praticiens' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  slug: { type: String, required: true },
  name: { type: String, required: true },
})

const { findBySlug } = await useSpecialities()
const speciality = computed(() => findBySlug(props.slug))

const { data } = await useAsyncData(
  `praticiens-${props.slug}`,
  () => (speciality.value
    ? $fetch('/api/backend/praticiens', { query: { specialityId: speciality.value.id } }).catch(() => [])
    : []),
  { default: () => [] },
)
// Six fiches maximum sur la page de la médecine ; la liste complète est dans la recherche.
const praticiens = computed(() => (Array.isArray(data.value) ? data.value.slice(0, 6) : []))
</script>
