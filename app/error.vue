<template>
  <main class="min-h-screen bg-[#e0ecf2] flex flex-col items-center justify-center px-4 text-center text-[#012828]">
    <p class="font-unbounded text-6xl font-bold text-[#EC7F7A] mb-4">{{ error?.statusCode || 404 }}</p>
    <h1 class="font-unbounded text-2xl lg:text-3xl font-bold mb-4">
      {{ error?.statusCode === 404 ? 'Page introuvable' : 'Une erreur est survenue' }}
    </h1>
    <p class="font-sans opacity-70 mb-8 max-w-md">
      {{ error?.statusCode === 404 ? "La page que vous cherchez n'existe pas ou a été déplacée." : "Veuillez réessayer dans quelques instants." }}
    </p>
    <button class="bg-[#EC7F7A] text-white px-7 py-3 rounded-[12px] font-bold hover:shadow-md" @click="handleError">
      Retour à l'accueil
    </button>
  </main>
</template>

<script setup>
defineProps({ error: Object })
useHead({ htmlAttrs: { lang: 'fr' } })
useSeoMeta({ title: 'Page introuvable — Léya', robots: 'noindex, nofollow' })
const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
