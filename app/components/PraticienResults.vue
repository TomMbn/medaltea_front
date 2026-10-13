<template>
  <section class="bg-[#156F71] py-16 px-4" aria-labelledby="praticien-results-title">
    <div class="max-w-[1200px] mx-auto">
      <h2 id="praticien-results-title" class="text-white text-2xl md:text-3xl font-bold text-center mb-3 leading-snug font-unbounded">
        <template v-if="q || specialityName">
          Résultats<template v-if="q"> pour « {{ q }} »</template><template v-if="specialityName"> en {{ specialityName }}</template>
        </template>
        <template v-else>Nos praticiens</template>
      </h2>
      <p class="text-white/70 text-center mb-8 font-sans" role="status" aria-live="polite">
        {{ total }} praticien{{ total > 1 ? 's' : '' }}
      </p>

      <!-- Tri et filtres -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white">
        <label class="flex items-center gap-2">
          <span>Trier par</span>
          <select :value="sort" class="rounded-full bg-white text-[#012828] font-medium px-4 py-2" @change="emit('update:sort', $event.target.value)">
            <option value="pertinence">Pertinence</option>
            <option value="disponibilite">Prochaine disponibilité</option>
            <option value="prix">Prix croissant</option>
            <option v-if="geo" value="distance">Distance</option>
          </select>
        </label>
        <label class="flex items-center gap-2 cursor-pointer rounded-full bg-white/10 px-4 py-2">
          <input type="checkbox" :checked="onlyBookable" class="accent-[#EC7F7A]" @change="emit('update:onlyBookable', $event.target.checked)" />
          Réservables en ligne uniquement
        </label>
        <label v-if="geo" class="flex items-center gap-2">
          <span>Rayon</span>
          <select :value="radius" class="rounded-full bg-white text-[#012828] font-medium px-4 py-2" @change="emit('update:radius', Number($event.target.value))">
            <option v-for="km in [10, 20, 30, 50, 100]" :key="km" :value="km">{{ km }} km</option>
          </select>
        </label>
        <button v-if="geo" type="button" class="inline-flex items-center gap-2 rounded-full bg-white text-[#012828] px-4 py-2 font-medium" @click="emit('unlocate')">
          <LocateFixed :size="15" aria-hidden="true" /> Autour de moi ✕
        </button>
      </div>
      <p v-if="geoError" class="text-center text-white bg-white/10 rounded-2xl p-3 mb-6 text-sm" role="alert">{{ geoError }}</p>

      <p v-if="error" class="text-center text-white bg-white/10 rounded-2xl p-6">
        La liste des praticiens est momentanément indisponible. Merci de réessayer dans un instant.
      </p>

      <p v-else-if="!praticiens.length && !loading" class="text-center text-white bg-white/10 rounded-2xl p-6">
        <template v-if="geo">Aucun praticien dans un rayon de {{ radius }} km autour de vous. Élargissez le rayon, ou retirez « Autour de moi » pour voir tous les praticiens.</template>
        <template v-else-if="q || specialityName || onlyBookable">Aucun praticien ne correspond à cette recherche. Essayez une autre ville, un autre code postal ou une autre spécialité.</template>
        <template v-else>Les premiers praticiens arrivent bientôt.</template>
      </p>

      <template v-else>
        <!-- Tri par défaut : les fiches réservables d'abord, puis les autres -->
        <template v-if="grouped">
          <h3 class="text-white font-unbounded font-bold text-lg mb-4">Réservables en ligne</h3>
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            <PraticienCard v-for="p in bookableList" :key="p.id" :praticien="p" />
          </ul>
          <h3 class="text-white font-unbounded font-bold text-lg mb-1">Autres praticiens</h3>
          <p class="text-white/70 text-sm mb-4">Réservation en ligne indisponible pour le moment.</p>
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PraticienCard v-for="p in otherList" :key="p.id" :praticien="p" />
          </ul>
        </template>
        <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PraticienCard v-for="p in praticiens" :key="p.id" :praticien="p" />
        </ul>

        <div v-if="praticiens.length < total" class="flex justify-center mt-10">
          <button type="button" :disabled="loading" class="bg-white text-[#012828] text-sm font-bold px-8 py-3 rounded-full hover:bg-[#e0ecf2] transition-colors disabled:opacity-60" @click="emit('more')">
            {{ loading ? 'Chargement…' : `Afficher plus (${total - praticiens.length} restants)` }}
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { LocateFixed } from 'lucide-vue-next'

const props = defineProps({
  praticiens: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  q: { type: String, default: '' },
  specialityName: { type: String, default: '' },
  error: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  sort: { type: String, default: 'pertinence' },
  onlyBookable: { type: Boolean, default: false },
  geo: { type: Object, default: null },
  geoError: { type: String, default: '' },
  radius: { type: Number, default: 30 },
})
const emit = defineEmits(['update:sort', 'update:onlyBookable', 'update:radius', 'unlocate', 'more'])

const bookableList = computed(() => props.praticiens.filter(p => p.bookable !== false))
const otherList = computed(() => props.praticiens.filter(p => p.bookable === false))
// Séparation visible seulement dans l'ordre par défaut, quand les deux groupes existent
const grouped = computed(() => props.sort === 'pertinence' && !props.onlyBookable && bookableList.value.length > 0 && otherList.value.length > 0)
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
