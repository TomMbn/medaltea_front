<template>
  <div>
    <ProPageHead title="Prestations" subtitle="Les types de consultation que vous proposez." class="mb-1" />
    <div class="bg-white rounded-[28px] p-5 sm:p-8">
      <ProServices />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Prestations — Espace praticien Léya', robots: 'noindex, nofollow' })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
