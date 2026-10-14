<template>
  <div>
    <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-1">Ma fiche</h1>
    <p class="text-sm text-[#012828]/60 mb-6">
      Ces informations apparaissent sur votre fiche publique.
      <NuxtLink v-if="praticienId" :to="`/praticiens/${praticienId}`" target="_blank" class="underline text-[#156F71]">Voir ma fiche ↗</NuxtLink>
    </p>
    <ProClaimRequests />
    <ProFiche />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Ma fiche — Espace praticien Léya', robots: 'noindex, nofollow' })
const { praticienId } = useSession()
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
