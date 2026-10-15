<template>
  <div>
    <ProPageHead title="Rendez-vous" :subtitle="subtitle" />
    <ProOnboarding class="mb-5" />
    <ProAppointmentsBoard />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Rendez-vous — Espace praticien Léya', robots: 'noindex, nofollow' })

// Sous-titre : rendez-vous restant aujourd'hui et demandes à traiter (données partagées avec la liste)
const { data: raw } = useAsyncData('pro-appointments', () => $fetch('/api/backend/praticiens/me/appointments'), { server: false, lazy: true, default: () => [] })
const now = ref(null)
onMounted(() => { now.value = new Date() })
const subtitle = computed(() => {
  if (!now.value) return ''
  const list = normalizeAppointments(raw.value).filter(a => (a.status === 'confirmed' || a.status === 'pending') && new Date(a.endAt ?? a.startAt) >= now.value)
  const today = list.filter(a => new Date(a.startAt).toDateString() === now.value.toDateString()).length
  const requests = list.filter(a => a.status === 'pending').length
  return `${today} à venir aujourd’hui · ${requests} demande${requests > 1 ? 's' : ''}`
})
</script>
