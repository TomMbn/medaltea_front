<template>
  <div class="min-h-screen bg-bleu-50 font-sans text-vert-900">
    <header class="bg-vert-600 text-white">
      <div class="mx-auto flex w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <img src="/images/footer/logo-blanc.svg" alt="Léya" class="h-8 w-auto" style="animation: none;" />
          <span class="rounded-full bg-corail-500 px-3 py-[2px] text-[14px] font-semibold text-vert-900">Administration</span>
        </NuxtLink>
        <nav class="flex flex-1 flex-wrap items-center gap-2" aria-label="Administration">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[16px] font-medium hover:bg-white/15 transition-colors" :active-class="l.exact ? '' : ACTIVE" :exact-active-class="l.exact ? ACTIVE : ''">{{ l.label }}<template v-if="l.to === '/admin/prospection' && alerts > 0"><span class="rounded-full bg-corail-500 px-2 text-[14px] font-semibold leading-[22px] text-vert-900" aria-hidden="true">{{ alerts }}</span><span class="sr-only"> ({{ alerts }} {{ alerts > 1 ? 'alertes' : 'alerte' }})</span></template></NuxtLink>
        </nav>
        <NuxtLink to="/" class="text-[16px] underline-offset-2 hover:underline">Voir le site</NuxtLink>
        <button type="button" class="rounded-full border border-white/60 px-4 py-2 text-[16px] font-medium hover:bg-white/15 transition-colors" @click="leave">Déconnexion</button>
      </div>
    </header>
    <main class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] py-8 lg:py-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const { logout } = useSession()
const route = useRoute()
const ACTIVE = 'bg-white !text-vert-900 hover:!bg-white'
// `exact` : /admin est le préfixe de toutes les pages, son lien n'est actif que sur la vue d'ensemble
const links = [
  { to: '/admin', label: 'Vue d’ensemble', exact: true },
  { to: '/admin/inscriptions', label: 'Inscriptions' },
  { to: '/admin/reservations', label: 'Réservations' },
  { to: '/admin/demandes', label: 'Demandes' },
  { to: '/admin/economie', label: 'Économie' },
  { to: '/admin/prospection', label: 'Prospection' },
  { to: '/admin/revendications', label: 'Revendications' },
  { to: '/admin/fiches', label: 'Fiches' },
]
// Pastille de l'onglet Prospection : praticiens à contacter et relances dues, relue à chaque changement de page.
// Silencieuse en cas d'erreur : la navigation ne dépend pas de ce compteur.
const alerts = ref(0)
async function refreshAlerts() {
  try {
    alerts.value = (await $fetch('/api/backend/admin/prospects/summary'))?.alerts ?? 0
  } catch {
    alerts.value = 0
  }
}
onMounted(refreshAlerts)
watch(() => route.fullPath, refreshAlerts)

async function leave() {
  await logout()
  await navigateTo('/')
}
</script>
