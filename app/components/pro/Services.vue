<template>
  <div>
    <h2 class="font-unbounded font-bold text-lg mb-2">Prestations</h2>
    <p class="text-sm text-gray-600 mb-5">Chaque prestation définit la durée des créneaux proposés aux patients.</p>

    <p v-if="error" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mb-3" role="alert">{{ error }}</p>

    <ul v-if="items.length" class="grid gap-2 mb-8">
      <li v-for="t in items" :key="t.id" class="rounded-xl border border-gray-200 px-4 py-3" :class="t.isActive === false ? 'opacity-50' : ''">
        <template v-if="editing === t.id">
          <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="saveEdit(t)">
            <div class="sm:col-span-2">
              <label :for="`e-name-${t.id}`" class="block text-xs font-semibold mb-1">Nom</label>
              <input :id="`e-name-${t.id}`" v-model="draft.name" required maxlength="80" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" />
            </div>
            <div>
              <label :for="`e-dur-${t.id}`" class="block text-xs font-semibold mb-1">Durée (min)</label>
              <input :id="`e-dur-${t.id}`" v-model.number="draft.durationMin" type="number" min="5" max="480" required class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" />
            </div>
            <div>
              <label :for="`e-price-${t.id}`" class="block text-xs font-semibold mb-1">Prix (€)</label>
              <input :id="`e-price-${t.id}`" v-model.number="draft.price" type="number" min="0" step="1" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" />
            </div>
            <div>
              <label :for="`e-mode-${t.id}`" class="block text-xs font-semibold mb-1">Lieu</label>
              <select :id="`e-mode-${t.id}`" v-model="draft.mode" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm">
                <option value="cabinet">Au cabinet</option>
                <option value="visio">Visio</option>
              </select>
            </div>
            <div class="sm:col-span-2 flex gap-2">
              <button class="bg-[#012828] text-white text-xs font-bold px-4 py-2 rounded-[10px] disabled:opacity-50" :disabled="busy">Enregistrer</button>
              <button type="button" class="text-xs px-4 py-2 rounded-[10px] border border-gray-300" @click="editing = null">Annuler</button>
            </div>
          </form>
        </template>
        <div v-else class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold">{{ t.name }} <span v-if="t.isActive === false" class="text-xs font-normal text-gray-500">(désactivée)</span></p>
            <p class="text-xs text-gray-500">{{ t.durationMin }} min · {{ t.mode === 'visio' ? 'Visio' : 'Au cabinet' }}<template v-if="t.price != null"> · {{ t.price }} €</template></p>
          </div>
          <div v-if="t.isActive !== false" class="flex gap-3 text-sm">
            <button class="underline" @click="startEdit(t)">Modifier</button>
            <button class="underline text-red-700" @click="disable(t)">Désactiver</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="text-sm text-gray-500 bg-[#e0ecf2]/60 rounded-xl p-4 mb-8">Aucune prestation : ajoutez-en une pour ouvrir la réservation en ligne.</p>

    <h3 class="font-semibold text-sm mb-3">Ajouter une prestation</h3>
    <form class="grid gap-3 sm:grid-cols-4" @submit.prevent="add">
      <div class="sm:col-span-4">
        <label for="n-name" class="block text-xs font-semibold mb-1">Nom</label>
        <input id="n-name" v-model="form.name" required maxlength="80" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" placeholder="Première séance" />
      </div>
      <div>
        <label for="n-dur" class="block text-xs font-semibold mb-1">Durée (min)</label>
        <input id="n-dur" v-model.number="form.durationMin" type="number" min="5" max="480" required class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" />
      </div>
      <div>
        <label for="n-price" class="block text-xs font-semibold mb-1">Prix (€)</label>
        <input id="n-price" v-model.number="form.price" type="number" min="0" step="1" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm" />
      </div>
      <div>
        <label for="n-mode" class="block text-xs font-semibold mb-1">Lieu</label>
        <select id="n-mode" v-model="form.mode" class="w-full rounded-xl border border-gray-300 p-2.5 text-sm">
          <option value="cabinet">Au cabinet</option>
          <option value="visio">Visio</option>
        </select>
      </div>
      <div class="flex items-end">
        <button class="w-full bg-[#012828] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#156F71] disabled:opacity-50" :disabled="busy">Ajouter</button>
      </div>
    </form>
    <p class="text-xs text-gray-500 mt-4">Une prestation désactivée n'est plus proposée aux patients ; les rendez-vous déjà pris sont conservés.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ initial: { type: Array, default: () => [] } })

const items = ref(Array.isArray(props.initial) ? props.initial.slice() : [])
const error = ref('')
const busy = ref(false)
const editing = ref(null)
const draft = ref({})
const form = ref({ name: '', durationMin: 60, price: null, mode: 'cabinet' })

async function reload() {
  const list = await $fetch('/api/backend/praticiens/me/consultation-types')
  items.value = Array.isArray(list) ? list : []
}

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
  } catch (e) { error.value = apiErrorMessage(e, 'Désactivation impossible.') }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
