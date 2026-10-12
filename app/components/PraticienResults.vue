<template>
  <section class="bg-[#156F71] py-16 px-4" aria-labelledby="praticien-results-title">
    <div class="max-w-[1200px] mx-auto">
      <h2 id="praticien-results-title" class="text-white text-2xl md:text-3xl font-bold text-center mb-3 leading-snug font-unbounded">
        <template v-if="q || specialityName">
          Résultats<template v-if="q"> pour « {{ q }} »</template><template v-if="specialityName"> en {{ specialityName }}</template>
        </template>
        <template v-else>Nos praticiens</template>
      </h2>
      <p class="text-white/70 text-center mb-10 font-sans">
        {{ filtered.length }} praticien{{ filtered.length > 1 ? 's' : '' }}
      </p>

      <p v-if="error" class="text-center text-white bg-white/10 rounded-2xl p-6">
        La liste des praticiens est momentanément indisponible. Merci de réessayer dans un instant.
      </p>

      <p v-else-if="!filtered.length" class="text-center text-white bg-white/10 rounded-2xl p-6">
        <template v-if="q || specialityName">Aucun praticien ne correspond à cette recherche. Essayez une autre ville, un autre code postal ou une autre spécialité.</template>
        <template v-else>Les premiers praticiens arrivent bientôt.</template>
      </p>

      <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PraticienCard v-for="p in filtered" :key="p.id" :praticien="p" />
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  praticiens: { type: Array, default: () => [] },
  q: { type: String, default: '' },
  specialityName: { type: String, default: '' },
  error: { type: Boolean, default: false },
})

const normalize = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const filtered = computed(() => {
  const needle = normalize(props.q).trim()
  if (!needle) return props.praticiens
  return props.praticiens.filter(p =>
    normalize(`${p.firstName} ${p.lastName} ${p.city} ${formatPostalCode(p.postalCode)} ${p.address} ${(p.specialities || []).map(x => x.name).join(' ')}`).includes(needle),
  )
})

</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
