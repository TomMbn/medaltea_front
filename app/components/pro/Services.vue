<template>
  <div>
    <h2 class="font-unbounded font-normal text-[20px] mb-2">Vos prestations</h2>
    <p class="text-[16px] text-neutre-600 mb-5">Chaque prestation définit la durée des créneaux proposés aux patients.</p>

    <p v-if="error" class="text-[16px] text-red-700 bg-red-50 rounded-[16px] p-3 mb-3" role="alert">{{ error }}</p>

    <ul v-if="items.length" class="grid gap-2 mb-8">
      <li v-for="t in items" :key="t.id" class="rounded-[16px] border border-bleu-100 px-4 py-3" >
        <template v-if="editing === t.id">
          <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="saveEdit(t)">
            <div class="sm:col-span-2">
              <label :for="`e-name-${t.id}`" class="block text-[16px] font-medium mb-1">Nom</label>
              <input :id="`e-name-${t.id}`" v-model="draft.name" required maxlength="80" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" />
            </div>
            <div>
              <label :for="`e-dur-${t.id}`" class="block text-[16px] font-medium mb-1">Durée (min)</label>
              <input :id="`e-dur-${t.id}`" v-model.number="draft.durationMin" type="number" min="5" max="480" required class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" />
            </div>
            <div>
              <label :for="`e-price-${t.id}`" class="block text-[16px] font-medium mb-1">Prix (€)</label>
              <input :id="`e-price-${t.id}`" v-model.number="draft.price" type="number" min="0" step="1" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" />
            </div>
            <div>
              <label :for="`e-mode-${t.id}`" class="block text-[16px] font-medium mb-1">Lieu</label>
              <select :id="`e-mode-${t.id}`" v-model="draft.mode" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]">
                <option value="cabinet">Au cabinet</option>
                <option value="visio">Visio</option>
                <option value="domicile">À domicile</option>
              </select>
            </div>
            <div class="sm:col-span-2 flex gap-2">
              <button class="bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full disabled:opacity-50" :disabled="busy">Enregistrer</button>
              <button type="button" class="text-[16px] px-5 min-h-[44px] rounded-full border border-neutre-300" @click="editing = null">Annuler</button>
            </div>
          </form>
        </template>
        <div v-else class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[16px] font-semibold">{{ t.name }}</p>
            <p class="text-[14px] text-neutre-600">{{ t.durationMin }} min · {{ ({ visio: 'Visio', domicile: 'À domicile' }[t.mode] || 'Au cabinet') }}<template v-if="t.price != null"> · {{ t.price }} €</template></p>
          </div>
          <div class="flex gap-3 text-[16px]">
            <button class="underline" @click="startEdit(t)">Modifier</button>
            <button class="underline text-red-700" @click="disable(t)">Supprimer</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="text-[16px] text-neutre-600 bg-bleu-50 rounded-[16px] p-4 mb-8">Aucune prestation : ajoutez-en une pour ouvrir la réservation en ligne.</p>

    <h3 class="font-semibold text-[16px] mb-3">Ajouter une prestation</h3>
    <form class="grid gap-3 sm:grid-cols-4" @submit.prevent="add">
      <div class="sm:col-span-4">
        <label for="n-name" class="block text-[16px] font-medium mb-1">Nom</label>
        <input id="n-name" v-model="form.name" required maxlength="80" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" placeholder="Première séance" />
      </div>
      <div>
        <label for="n-dur" class="block text-[16px] font-medium mb-1">Durée (min)</label>
        <input id="n-dur" v-model.number="form.durationMin" type="number" min="5" max="480" required class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" />
      </div>
      <div>
        <label for="n-price" class="block text-[16px] font-medium mb-1">Prix (€)</label>
        <input id="n-price" v-model.number="form.price" type="number" min="0" step="1" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]" />
      </div>
      <div>
        <label for="n-mode" class="block text-[16px] font-medium mb-1">Lieu</label>
        <select id="n-mode" v-model="form.mode" class="w-full rounded-[16px] border border-neutre-300 px-4 min-h-[48px] text-[16px]">
          <option value="cabinet">Au cabinet</option>
          <option value="visio">Visio</option>
                <option value="domicile">À domicile</option>
        </select>
      </div>
      <div class="flex items-end">
        <button class="w-full bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 disabled:opacity-50" :disabled="busy">Ajouter</button>
      </div>
    </form>
    <p class="text-[14px] text-neutre-600 mt-4">Une prestation supprimée n'est plus proposée aux patients ; les rendez-vous déjà pris sont conservés. Pour la proposer de nouveau, ajoutez-la à nouveau.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data: loaded, refresh: refreshTypes } = await useAsyncData('pro-types', () => $fetch('/api/backend/praticiens/me/consultation-types'), { server: false, default: () => [] })
// L'API ne permet pas de réactiver une prestation désactivée : elle n'est plus affichée (les rendez-vous déjà pris la conservent)
const items = computed(() => (Array.isArray(loaded.value) ? loaded.value : []).filter(t => t.isActive !== false))
const error = ref('')
const busy = ref(false)
const editing = ref(null)
const draft = ref({})
const form = ref({ name: '', durationMin: 60, price: null, mode: 'cabinet' })

const reload = () => refreshTypes()

const cleanPrice = (v) => (v === null || v === '' || Number.isNaN(v) ? undefined : v)

async function add() {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/backend/praticiens/me/consultation-types', {
      method: 'POST',
      body: { name: form.value.name.trim(), durationMin: form.value.durationMin, price: cleanPrice(form.value.price), mode: form.value.mode },
    })
    form.value = { name: '', durationMin: 60, price: null, mode: 'cabinet' }
    await reload()
  } catch (e) { error.value = apiErrorMessage(e, "Impossible d'ajouter cette prestation.") }
  finally { busy.value = false }
}

function startEdit(t) {
  editing.value = t.id
  draft.value = { name: t.name, durationMin: t.durationMin, price: t.price ?? null, mode: t.mode || 'cabinet' }
}

async function saveEdit(t) {
  busy.value = true
  error.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/consultation-types/${t.id}`, {
      method: 'PATCH',
      body: { name: draft.value.name.trim(), durationMin: draft.value.durationMin, price: cleanPrice(draft.value.price), mode: draft.value.mode },
    })
    editing.value = null
    await reload()
  } catch (e) { error.value = apiErrorMessage(e, 'Modification impossible.') }
  finally { busy.value = false }
}

async function disable(t) {
  error.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/consultation-types/${t.id}`, { method: 'DELETE' })
    await reload()
  } catch (e) { error.value = apiErrorMessage(e, 'Suppression impossible.') }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
