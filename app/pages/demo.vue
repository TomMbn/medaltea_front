<template>
  <main class="min-h-screen bg-bleu-50 flex items-center justify-center px-4 text-vert-900">
    <p class="text-[18px]" role="status">Préparation de la démonstration…</p>
  </main>
</template>

<script setup>
// Lien direct vers la démonstration de l'espace praticien (à partager) : démarre une démo neuve puis ouvre le tableau de bord.
useSeoMeta({ title: 'Démonstration — Espace praticien Léya', robots: 'noindex, nofollow' })

onMounted(async () => {
  useDemo().start()
  await navigateTo('/pro', { replace: true })
})
</script>
