<template>
  <div>
    <ProPageHead title="Ma fiche" subtitle="Ces informations apparaissent sur votre fiche publique." />
    <ProDuplicates />
    <ProClaimRequests />
    <ProFiche />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Ma fiche — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>
