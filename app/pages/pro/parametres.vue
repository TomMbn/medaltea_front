<template>
  <div>
    <ProPageHead title="Paramètres" subtitle="Réglages de votre compte praticien." class="mb-1" />
    <div class="bg-white rounded-[28px] p-5 sm:p-8">
      <ProSettings />
    </div>
    <div id="agenda-externe" class="bg-white rounded-[28px] p-5 sm:p-8 mt-6 scroll-mt-24 transition-shadow duration-500" :class="flash ? 'shadow-[0_0_0_3px_#156F71]' : ''">
      <ProCalendarLink />
    </div>
    <div class="bg-white rounded-[28px] p-5 sm:p-8 mt-6">
      <ProVisibility />
    </div>
    <div class="bg-white rounded-[28px] p-5 sm:p-8 mt-6">
      <h2 class="font-unbounded font-normal text-[20px] mb-2">Mon compte et mes données</h2>
      <p class="text-[16px] text-neutre-600 mb-4">Modifier mes informations, télécharger mes données ou supprimer mon compte.</p>
      <NuxtLink to="/mon-compte" class="inline-flex items-center border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-900 hover:text-white transition-colors">Gérer mon compte</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

definePageMeta({ layout: 'pro', middleware: ['auth', 'pro'] })
useSeoMeta({ title: 'Paramètres — Espace praticien Léya', robots: 'noindex, nofollow' })

// Arrivée depuis le bouton de l'Agenda : on défile jusqu'à la carte du lien d'agenda et on la met en évidence un instant
const route = useRoute()
const flash = ref(false)
function showCalendarCard() {
  if (route.hash !== '#agenda-externe') return
  setTimeout(() => {
    document.getElementById('agenda-externe')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    flash.value = true
    setTimeout(() => { flash.value = false }, 2500)
  }, 400)
}
onMounted(showCalendarCard)
watch(() => route.hash, showCalendarCard)
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
