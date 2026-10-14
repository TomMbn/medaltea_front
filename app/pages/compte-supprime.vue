<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[560px] mx-auto pt-40 pb-8 text-[#012828] text-center">
      <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-4">Votre compte a été supprimé</h1>
      <p class="text-sm leading-relaxed text-[#012828]/80 mb-8">
        Vos informations ont été effacées et vos rendez-vous à venir annulés. Merci d'avoir utilisé Léya.
      </p>
      <NuxtLink to="/" class="inline-block bg-[#012828] text-white text-sm font-bold px-6 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors">Retour à l'accueil</NuxtLink>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'Compte supprimé — Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
