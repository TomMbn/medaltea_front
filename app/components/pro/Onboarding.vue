<template>
  <section v-if="ready && !done" class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8" aria-labelledby="onboarding-title">
    <h2 id="onboarding-title" class="font-unbounded font-bold text-lg mb-1">Ouvrez la réservation en ligne</h2>
    <p class="text-sm text-[#012828]/70 mb-5">Deux étapes pour que vos patients puissent prendre rendez-vous.</p>

    <ol class="grid gap-3">
      <li v-for="(step, i) in steps" :key="step.to" class="flex items-center gap-4 rounded-xl border px-4 py-3" :class="step.done ? 'border-emerald-200 bg-emerald-50/60' : 'border-gray-200'">
        <span class="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold" :class="step.done ? 'bg-emerald-600 text-white' : 'bg-[#e0ecf2] text-[#156F71]'" aria-hidden="true">
          {{ step.done ? '✓' : i + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold">{{ step.title }}<span v-if="step.done" class="sr-only"> (terminé)</span></p>
          <p class="text-xs text-[#012828]/60">{{ step.text }}</p>
        </div>
        <NuxtLink v-if="!step.done" :to="step.to" class="shrink-0 bg-[#012828] text-white text-xs font-bold px-4 py-2 rounded-[10px] hover:bg-[#156F71] transition-colors">
          {{ step.cta }}
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// Clés partagées avec les pages Prestations et Horaires : les données ne sont chargées qu'une fois.
const { data: types, status: typesStatus } = await useAsyncData('pro-types', () => $fetch('/api/backend/praticiens/me/consultation-types'), { server: false, default: () => [] })
const { data: hours, status: hoursStatus } = await useAsyncData('pro-hours', () => $fetch('/api/backend/praticiens/me/availabilities'), { server: false, default: () => [] })

const ready = computed(() => typesStatus.value !== 'pending' && hoursStatus.value !== 'pending')
const hasTypes = computed(() => (Array.isArray(types.value) ? types.value : []).some(t => t.isActive !== false))
const hasHours = computed(() => Array.isArray(hours.value) && hours.value.length > 0)

const steps = computed(() => [
  { title: 'Ajoutez une prestation', text: 'Par exemple « Première séance », 60 min.', to: '/pro/prestations', cta: 'Ajouter', done: hasTypes.value },
  { title: 'Définissez vos horaires', text: 'Les plages où vous recevez, chaque semaine.', to: '/pro/horaires', cta: 'Définir', done: hasHours.value },
])
const done = computed(() => steps.value.every(s => s.done))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
