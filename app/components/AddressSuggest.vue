<template>
  <div class="relative">
    <label :for="id" class="label">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="results.length > 0 && open"
      :aria-controls="`${id}-listbox`"
      :aria-activedescendant="active >= 0 ? `${id}-opt-${active}` : undefined"
      autocomplete="off"
      class="field"
      :placeholder="placeholder"
      @input="onInput"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter="onEnter"
      @keydown.esc="open = false"
      @blur="onBlur"
    />
    <ul v-if="results.length && open" :id="`${id}-listbox`" role="listbox" class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <li v-for="(a, i) in results" :id="`${id}-opt-${i}`" :key="a.label" role="option" :aria-selected="i === active">
        <button type="button" class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#e0ecf2]" :class="i === active ? 'bg-[#e0ecf2]' : ''" @mousedown.prevent="pick(a)">{{ a.label }}</button>
      </li>
    </ul>
    <p v-if="empty" class="text-xs text-[#012828]/70 mt-1" role="status">Aucune adresse trouvée : vous pouvez saisir les champs ci-dessous à la main.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Recherche d'adresse assistée (Base Adresse Nationale, via notre serveur). L'adresse choisie est renvoyée avec ses coordonnées.
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'Rechercher une adresse' },
  placeholder: { type: String, default: 'Ex. : 9 quai de la Fosse, Nantes' },
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'select'])

const results = ref([])
const open = ref(false)
const active = ref(-1)
const empty = ref(false)
let timer = null
let token = 0

function onInput(e) {
  const q = e.target.value
  emit('update:modelValue', q)
  empty.value = false
  clearTimeout(timer)
  if (q.trim().length < 3) { results.value = []; return }
  const current = ++token
  timer = setTimeout(async () => {
    try {
      const res = await $fetch('/api/address', { query: { q: q.trim() } })
      if (current !== token) return
      results.value = Array.isArray(res) ? res : []
      empty.value = results.value.length === 0
      open.value = true
      active.value = -1
    } catch {
      if (current === token) { results.value = []; empty.value = true }
    }
  }, 250)
}
function pick(a) {
  emit('update:modelValue', a.label)
  emit('select', a)
  results.value = []
  open.value = false
  empty.value = false
  active.value = -1
  token++
}
function move(d) {
  if (!results.value.length) return
  open.value = true
  active.value = (active.value + d + results.value.length) % results.value.length
}
function onEnter(e) {
  if (open.value && active.value >= 0) { e.preventDefault(); pick(results.value[active.value]) }
}
function onBlur() { setTimeout(() => { open.value = false }, 120) }
</script>

<style scoped>
.label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem; }
.field { width: 100%; border: 1px solid #d1d5db; border-radius: 12px; padding: 0.625rem 0.75rem; font-size: 0.875rem; background: #fff; }
</style>
