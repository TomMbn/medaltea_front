<template>
  <section class="rounded-[24px] bg-white p-5 sm:p-6">
    <h2 :id="id" class="font-unbounded font-normal text-[20px] leading-[normal]">{{ title }}</h2>
    <p v-if="note" class="mt-2 text-[14px] text-neutre-600 leading-[normal]">{{ note }}</p>
    <p v-if="!rows.length" class="mt-4 text-[16px] text-neutre-600">Aucune donnée sur la période.</p>
    <div v-else class="mt-3 overflow-x-auto">
      <table class="w-full min-w-[420px] text-left text-[16px]" :aria-labelledby="id">
        <thead>
          <tr class="text-neutre-600">
            <th v-for="c in columns" :key="c.key" scope="col" class="py-2 pr-4 font-medium">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i" class="border-t border-bleu-100">
            <component :is="j === 0 ? 'th' : 'td'" v-for="(c, j) in columns" :key="c.key" :scope="j === 0 ? 'row' : undefined" class="py-2 pr-4 font-normal">{{ row[c.key] }}</component>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useId } from 'vue'

// Tableau du cockpit d'administration : `rows` contient des textes déjà formatés (utils/adminStats),
// la première colonne sert d'en-tête de ligne.
defineProps({
  title: { type: String, required: true },
  note: { type: String, default: '' },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
})
const id = useId()
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
