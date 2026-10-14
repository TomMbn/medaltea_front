<template>
  <div class="min-h-screen bg-[#e0ecf2] font-sans text-[#012828]">
    <header class="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div class="mx-auto max-w-[1280px] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink to="/pro/rendez-vous" class="shrink-0 flex items-center min-h-[44px]" aria-label="Léya — Espace praticien">
            <img src="/images/logo.svg" alt="Léya" class="h-9 w-auto" />
          </NuxtLink>
          <span class="hidden sm:inline text-xs font-semibold text-[#156F71] bg-[#e0ecf2] rounded-full px-3 py-1 whitespace-nowrap">Espace praticien</span>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <NuxtLink v-if="praticienId" :to="`/praticiens/${praticienId}`" target="_blank" class="hidden sm:inline-block py-3 hover:underline">Ma fiche publique ↗</NuxtLink>
          <NuxtLink to="/" class="hidden sm:inline-block py-3 hover:underline">Voir le site</NuxtLink>
          <button class="font-semibold border border-gray-300 rounded-[10px] px-4 py-3 hover:bg-gray-50 transition-colors" @click="handleLogout">
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 lg:py-10 lg:flex lg:gap-8">
      <nav class="lg:w-60 lg:shrink-0 mb-6 lg:mb-0" aria-label="Navigation de l'espace praticien">
        <ul ref="tabsRef" class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" :class="{ 'tabs-fade': tabsMore }" @scroll.passive="updateTabs">
          <li v-for="item in items" :key="item.to" class="shrink-0">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-[12px] px-4 py-3 text-sm font-semibold whitespace-nowrap bg-white/60 hover:bg-white transition-colors"
              active-class="!bg-[#012828] !text-white"
            >
              <component :is="item.icon" :size="18" aria-hidden="true" />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <main class="flex-1 min-w-0">
        <slot />
        <p class="text-xs text-[#012828]/50 mt-8 text-center">
          <NuxtLink to="/cgu-pro" class="hover:underline">CGU praticiens</NuxtLink> ·
          <NuxtLink to="/politique-de-confidentialite" class="hover:underline">Confidentialité</NuxtLink> ·
          <a :href="`mailto:${legal.contactEmail}`" class="hover:underline">Aide</a>
        </p>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { CalendarCheck, CalendarOff, Clock3, House, ListChecks, Settings, UserRound } from 'lucide-vue-next'
import { legal } from '~/data/legal'

const items = [
  { to: '/pro/bienvenue', label: 'Accueil', icon: House },
  { to: '/pro/rendez-vous', label: 'Rendez-vous', icon: CalendarCheck },
  { to: '/pro/fiche', label: 'Ma fiche', icon: UserRound },
  { to: '/pro/horaires', label: 'Horaires', icon: Clock3 },
  { to: '/pro/absences', label: 'Absences', icon: CalendarOff },
  { to: '/pro/prestations', label: 'Prestations', icon: ListChecks },
  { to: '/pro/parametres', label: 'Paramètres', icon: Settings },
]

const { syncRole, logout, praticienId } = useSession()

// Onglets défilables sur téléphone : un fondu à droite signale qu'il en reste à découvrir
const tabsRef = ref(null)
const tabsMore = ref(false)
function updateTabs() {
  const el = tabsRef.value
  tabsMore.value = !!el && el.scrollWidth - el.clientWidth - el.scrollLeft > 4 && el.scrollWidth > el.clientWidth
}
onMounted(() => { updateTabs(); window.addEventListener('resize', updateTabs) })
onBeforeUnmount(() => window.removeEventListener('resize', updateTabs))

// Un compte patient n'a rien à faire ici (sessions anciennes sans rôle comprises).
onMounted(async () => {
  if ((await syncRole()) === 'patient') await navigateTo({ path: '/praticiens-pro', query: { compte: 'patient' } })
})

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>

<style scoped>
@media (max-width: 1023px) {
  .tabs-fade { -webkit-mask-image: linear-gradient(to right, #000 85%, transparent); mask-image: linear-gradient(to right, #000 85%, transparent); }
}
</style>
