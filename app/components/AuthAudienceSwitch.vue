<template>
  <nav aria-label="Type de compte" class="inline-flex self-start rounded-full bg-white p-1 text-[16px] font-medium leading-[normal]">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.to"
      :aria-current="tab.key === current ? 'page' : undefined"
      class="rounded-full px-5 py-[9px] transition-colors"
      :class="tab.key === current ? 'bg-vert-900 text-white' : 'text-vert-900 hover:bg-bleu-50'"
    >{{ tab.label }}</NuxtLink>
  </nav>
</template>

<script setup>
// Bascule patient / praticien, affichée en haut des pages de connexion et d'inscription :
// un praticien qui arrive sur la mauvaise page doit le voir tout de suite.
const props = defineProps({
  page: { type: String, required: true }, // 'login' | 'register'
  current: { type: String, required: true }, // 'patient' | 'pro'
  redirect: { type: String, default: '' }, // destination à conserver côté patient
})

const tabs = computed(() => {
  const patientQuery = props.redirect ? { redirect: props.redirect } : {}
  return props.page === 'login'
    ? [
        { key: 'patient', label: 'Patient', to: { path: '/login', query: patientQuery } },
        { key: 'pro', label: 'Praticien', to: { path: '/login', query: { espace: 'pro', redirect: '/pro/rendez-vous' } } },
      ]
    : [
        { key: 'patient', label: 'Patient', to: { path: '/register', query: patientQuery } },
        { key: 'pro', label: 'Praticien', to: { path: '/inscription-pro' } },
      ]
})
</script>
