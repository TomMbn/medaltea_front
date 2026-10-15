<template>
  <section v-if="ready && !done" class="bg-white rounded-[28px] p-5 sm:p-8" aria-labelledby="onboarding-title">
    <h2 id="onboarding-title" class="font-unbounded font-normal text-[20px] mb-1">Ouvrez la réservation en ligne</h2>
    <p class="text-[16px] text-neutre-600 mb-5">Deux étapes pour que vos patients puissent prendre rendez-vous.</p>

    <ol class="grid gap-3">
      <li v-for="(step, i) in steps" :key="step.to" class="flex items-center gap-4 rounded-[16px] border px-4 py-3" :class="step.done ? 'border-emerald-200 bg-emerald-50/60' : 'border-bleu-100'">
        <span class="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[16px] font-bold" :class="step.done ? 'bg-emerald-600 text-white' : 'bg-bleu-50 text-vert-600'" aria-hidden="true">
          {{ step.done ? '✓' : i + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-[16px] font-semibold">{{ step.title }}<span v-if="step.done" class="sr-only"> (terminé)</span></p>
          <p class="text-[14px] text-neutre-600">{{ step.text }}</p>
        </div>
        <NuxtLink v-if="!step.done" :to="step.to" class="shrink-0 bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 transition-colors">
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
