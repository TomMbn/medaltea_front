<template>
  <NuxtLayout v-if="isAdmin" name="admin">
    <AdminOverview />
  </NuxtLayout>
  <AdminLogin v-else />
</template>

<script setup>
import { computed } from 'vue'

// /admin est à la fois l'entrée de l'administration et sa page d'accueil : connexion dédiée, puis vue d'ensemble.
// Layout choisi dans le gabarit : la connexion s'affiche sans la navigation de l'administration
definePageMeta({ layout: false, middleware: ['admin'] })

const { isAdmin } = useSession()
useSeoMeta({
  title: computed(() => (isAdmin.value ? 'Vue d’ensemble — Administration Léya' : 'Connexion — Administration Léya')),
  robots: 'noindex, nofollow',
})
</script>
