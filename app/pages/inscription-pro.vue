<template>
  <div class="min-h-screen bg-bleu-50 text-vert-900 lg:fixed lg:inset-0 lg:min-h-0 lg:flex">
    <!-- Panneau praticien (collé au bord de l'écran, comme sur la maquette) -->
    <div class="hidden lg:block lg:w-[40vw] xl:w-[36vw] max-w-[620px] shrink-0 lg:h-full">
      <ProSignupPanel />
    </div>

    <!-- Le formulaire défile seul (le panneau reste en place) et sa barre d'actions reste visible en bas -->
    <div class="flex-1 min-w-0 lg:h-full lg:overflow-y-auto" data-scroll>
      <ProSignupWizard />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Devenir praticien — Léya',
  description: 'Créez votre fiche praticien sur Léya en quelques minutes et ouvrez la prise de rendez-vous en ligne pour vos patients.',
})
useWebPageSchema({ name: "Devenir praticien", description: 'Créez votre fiche praticien sur Léya en quelques minutes et ouvrez la prise de rendez-vous en ligne pour vos patients.', breadcrumbs: [{ name: "Devenir praticien", path: '/inscription-pro' }] })
</script>
