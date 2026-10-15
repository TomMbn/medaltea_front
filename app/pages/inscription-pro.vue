<template>
  <div class="min-h-screen min-h-[100svh] bg-bleu-50 text-vert-900 lg:flex lg:gap-10 xl:gap-20 lg:p-10">
    <!-- Panneau praticien -->
    <div class="hidden lg:block lg:w-[42vw] xl:w-[36vw] max-w-[620px] shrink-0 lg:sticky lg:top-10 lg:h-[calc(100svh-80px)]">
      <ProSignupPanel />
    </div>

    <div class="flex-1 min-w-0">
      <ProSignupWizard />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Devenir praticien — Léya',
  description: 'Créez votre fiche praticien sur Léya en 2 minutes et ouvrez la prise de rendez-vous en ligne pour vos patients.',
})
useWebPageSchema({ name: "Devenir praticien", description: 'Créez votre fiche praticien sur Léya en 2 minutes et ouvrez la prise de rendez-vous en ligne pour vos patients.', breadcrumbs: [{ name: "Devenir praticien", path: '/inscription-pro' }] })
</script>
