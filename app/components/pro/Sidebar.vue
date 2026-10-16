<template>
  <aside class="bg-vert-600 text-white flex flex-col gap-2 lg:h-full lg:w-[280px] lg:shrink-0 px-5 pt-5 lg:pt-8 pb-4 lg:pb-6 overflow-y-auto" aria-label="Espace praticien">
    <div class="flex items-center justify-between lg:justify-start gap-[10px] lg:pb-7 lg:pl-3">
      <NuxtLink to="/pro" class="flex items-center gap-[10px]" aria-label="Léya, tableau de bord praticien">
        <img src="/images/footer/logo-blanc.svg" alt="" width="76" height="34" class="h-[34px] w-auto" style="animation: none;" />
        <span class="rounded-full bg-corail-500 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900">Pro</span>
      </NuxtLink>
      <button type="button" class="lg:hidden inline-flex items-center gap-2 rounded-full border border-white/40 px-4 min-h-[44px] text-[16px]" @click="$emit('logout')"><LogOut :size="16" aria-hidden="true" /> Déconnexion</button>
    </div>

    <nav aria-label="Navigation de l'espace praticien" class="lg:flex-1">
      <ul ref="listRef" class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" :class="{ 'tabs-fade': more }" @scroll.passive="update">
        <li v-for="item in items" :key="item.to" class="shrink-0">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 rounded-[14px] px-[14px] py-3 text-[18px] font-semibold leading-[normal] whitespace-nowrap transition-colors text-white hover:bg-white/10"
            :class="isActive(item) ? '!bg-white !text-vert-900' : ''"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <component :is="item.icon" :size="20" aria-hidden="true" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <NuxtLink v-if="percent < 100" :to="missing[0]?.to || '/pro/fiche'" class="hidden lg:flex flex-col gap-2 rounded-[16px] bg-white/[0.12] p-4 hover:bg-white/[0.18] transition-colors">
      <span class="text-[16px] font-medium leading-[normal]">Fiche complétée à {{ percent }} %</span>
      <span class="h-2 rounded bg-white/25 overflow-hidden" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Complétion de la fiche">
        <span class="block h-full rounded bg-corail-500 transition-all duration-700" :style="{ width: `${percent}%` }"></span>
      </span>
    </NuxtLink>

    <!-- Compte et déconnexion : toujours visibles, même sur un écran peu haut (la liste des pages défile) -->
    <div class="hidden lg:flex items-center gap-3 pt-4 mt-auto sticky bottom-0 -mb-6 pb-6 bg-vert-600">
      <span class="w-10 h-10 shrink-0 rounded-full bg-bleu-100 text-vert-900 flex items-center justify-center text-[15px] font-medium" aria-hidden="true">{{ initials }}</span>
      <div class="min-w-0 flex-1 leading-[normal]">
        <p class="text-[16px] font-medium truncate">{{ displayName }}</p>
        <p v-if="speciality" class="text-[16px] text-bleu-100 truncate">{{ speciality }}</p>
      </div>
      <button type="button" class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Déconnexion" title="Déconnexion" @click="$emit('logout')"><LogOut :size="18" aria-hidden="true" /></button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LayoutDashboard, CalendarDays, Activity, CalendarCheck, Leaf, Clock3, CalendarOff, ListChecks, Settings, LogOut } from 'lucide-vue-next'

defineEmits(['logout'])

// Entrées reliées à des pages qui fonctionnent. « Avis » et « Facturation » de la maquette
// sont masqués : les fonctions correspondantes ne sont pas embarquées (plan V5, N9, N1).
const items = [
  { to: '/pro', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { to: '/pro/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/pro/rendez-vous', label: 'Rendez-vous', icon: CalendarCheck },
  { to: '/pro/fiche', label: 'Ma fiche', icon: Leaf },
  { to: '/pro/statistiques', label: 'Statistiques', icon: Activity },
  { to: '/pro/horaires', label: 'Horaires', icon: Clock3 },
  { to: '/pro/absences', label: 'Absences', icon: CalendarOff },
  { to: '/pro/prestations', label: 'Prestations', icon: ListChecks },
  { to: '/pro/parametres', label: 'Paramètres', icon: Settings },
]
const route = useRoute()
const isActive = (item) => (item.exact ? route.path === item.to : route.path === item.to || route.path.startsWith(`${item.to}/`))

const { fiche, percent, missing } = useProCompletion()
const { data: me } = useAsyncData('pro-me', () => $fetch('/api/backend/users/me'), { server: false, lazy: true, default: () => null })
const displayName = computed(() => [me.value?.firstName, me.value?.lastName].filter(Boolean).join(' ') || 'Mon espace')
const initials = computed(() => ((me.value?.firstName?.[0] || '') + (me.value?.lastName?.[0] || '') || 'P').toUpperCase())
const speciality = computed(() => fiche.value?.specialities?.[0]?.name || '')

// Menu défilable sur téléphone : un fondu à droite signale qu'il reste des entrées
const listRef = ref(null)
const more = ref(false)
function update() {
  const el = listRef.value
  more.value = !!el && el.scrollWidth > el.clientWidth && el.scrollWidth - el.clientWidth - el.scrollLeft > 4
}
onMounted(() => { update(); window.addEventListener('resize', update) })
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<style scoped>
@media (max-width: 1023px) {
  .tabs-fade { -webkit-mask-image: linear-gradient(to right, #000 85%, transparent); mask-image: linear-gradient(to right, #000 85%, transparent); }
}
</style>
