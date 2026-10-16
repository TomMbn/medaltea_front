<template>
  <!-- Barre flottante (maquette V5) -->
  <div class="fixed top-0 inset-x-0 z-50 pt-5 pointer-events-none">
    <!-- Variante « Pro » : page de présentation de l'espace praticien (visiteurs) -->
    <nav v-if="isProLanding" class="mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4.5rem)] max-w-[1654px] bg-white rounded-leya-m shadow-douce pl-5 pr-2 lg:pl-8 lg:pr-3 py-2 lg:py-3 flex items-center justify-between gap-6 pointer-events-auto" aria-label="Navigation espace praticien">
      <div class="flex items-center gap-[10px] shrink-0">
        <NuxtLink to="/" class="flex items-center min-h-[44px]" aria-label="Léya, accueil">
          <img src="/images/logo.svg" alt="Léya" width="87" height="39" class="h-[34px] lg:h-[43px] w-auto" />
        </NuxtLink>
        <span class="rounded-full bg-corail-500 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900">Pro</span>
      </div>
      <div class="hidden lg:flex items-center gap-9 text-[16px] font-medium text-vert-900">
        <a href="#fonctionnement" class="hover:text-vert-600 transition-colors">Fonctionnement</a>
        <a href="#etapes" class="hover:text-vert-600 transition-colors">Inscription</a>
        <a href="#faq" class="hover:text-vert-600 transition-colors">FAQ</a>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro' } }" class="hidden sm:inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full border-[1.5px] border-vert-900 text-vert-900 text-[18px] font-semibold whitespace-nowrap hover:bg-white transition-colors">
          Se connecter
          <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
        </NuxtLink>
        <NuxtLink to="/inscription-pro" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold whitespace-nowrap hover:bg-vert-600 transition-colors">
          Rejoindre<span class="hidden sm:inline"> Léya</span>
          <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
        </NuxtLink>
      </div>
    </nav>

    <nav v-else class="mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4.5rem)] max-w-[1654px] bg-white rounded-leya-m shadow-douce pl-5 pr-3 lg:pl-8 lg:pr-3 py-2.5 lg:py-3 flex items-center justify-between gap-6 pointer-events-auto" aria-label="Navigation principale">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center min-h-[44px] shrink-0" aria-label="Léya, accueil">
        <img src="/images/logo.svg" alt="Léya" width="87" height="39" class="h-10 lg:h-[43px] w-auto" />
      </NuxtLink>

      <!-- Navigation (bureau) : la page active est repérée par une pastille verte -->
      <div class="hidden lg:flex items-center gap-1">
        <NuxtLink to="/medecines" class="nav-link">Médecines</NuxtLink>
        <NuxtLink to="/trouver-un-praticien" class="nav-link">Trouver un praticien</NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/praticiens-pro" class="nav-link">Espace praticien</NuxtLink>
      </div>

      <!-- Actions (bureau) -->
      <div class="hidden lg:flex items-center gap-3">
        <!-- Visiteur -->
        <template v-if="!isLoggedIn">
          <NuxtLink v-if="route.path !== '/login' && route.path !== '/register'" to="/login" class="btn-sec">
            Connexion<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span>
          </NuxtLink>
        </template>

        <!-- Praticien connecté -->
        <template v-else-if="isPro">
          <button class="nav-link" @click="handleLogout">Déconnexion</button>
          <NuxtLink to="/pro" class="btn-pri">Mon espace praticien<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
        </template>

        <!-- Administrateur connecté -->
        <template v-else-if="isAdmin">
          <button class="nav-link" @click="handleLogout">Déconnexion</button>
          <NuxtLink to="/admin" class="btn-pri">Administration<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
        </template>

        <!-- Patient connecté -->
        <div v-else ref="accountRef" class="relative">
          <button
            class="btn-sec"
            aria-haspopup="menu"
            :aria-expanded="isAccountOpen"
            @click="isAccountOpen = !isAccountOpen"
          >
            Mon compte<span class="btn-dot"><ChevronDown :size="18" aria-hidden="true" /></span>
          </button>
          <div v-if="isAccountOpen" role="menu" class="absolute right-0 mt-2 w-60 bg-white rounded-leya-m shadow-douce border border-bleu-100 py-2">
            <!-- Mes rendez-vous, préférences et données sont accessibles depuis la page « Mon profil » -->
            <NuxtLink to="/mon-compte" role="menuitem" class="block px-5 py-3 text-base font-semibold text-vert-900 hover:bg-bleu-50" @click="isAccountOpen = false">Mon profil</NuxtLink>
            <button role="menuitem" class="w-full text-left px-5 py-3 text-base font-semibold text-red-700 hover:bg-bleu-50 border-t border-bleu-100" @click="handleLogout">Déconnexion</button>
          </div>
        </div>

        <!-- Parler à Léya (patients et visiteurs) -->
        <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="btn-pri">
          Parler à Léya<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span>
        </NuxtLink>
      </div>

      <!-- Bouton du menu (mobile) -->
      <div class="lg:hidden flex items-center">
        <button aria-label="Ouvrir le menu" :aria-expanded="isMenuOpen" class="text-vert-900 hover:text-vert-600 focus:outline-none p-2" @click="isMenuOpen = !isMenuOpen">
          <Menu v-if="!isMenuOpen" :size="28" />
          <X v-else :size="28" />
        </button>
      </div>
    </nav>

    <!-- Menu déroulant (mobile) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isMenuOpen" class="mx-auto w-[calc(100%-2rem)] mt-3 bg-white rounded-leya-m shadow-douce border border-bleu-100 overflow-hidden pointer-events-auto">
        <div class="flex flex-col p-6 gap-2">
          <NuxtLink to="/medecines" class="menu-link" @click="isMenuOpen = false">Médecines</NuxtLink>
          <NuxtLink to="/trouver-un-praticien" class="menu-link" @click="isMenuOpen = false">Trouver un praticien</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/praticiens-pro" class="menu-link" @click="isMenuOpen = false">Espace praticien</NuxtLink>
          <NuxtLink v-if="isLoggedIn && !isPro && !isAdmin" to="/mes-rendez-vous" class="menu-link" @click="isMenuOpen = false">Mes rendez-vous</NuxtLink>
          <NuxtLink v-if="isLoggedIn && !isPro && !isAdmin" to="/mon-compte" class="menu-link" @click="isMenuOpen = false">Mes informations</NuxtLink>

          <div class="flex flex-col gap-3 pt-3">
            <NuxtLink v-if="!isLoggedIn" to="/login" class="btn-sec justify-between" @click="isMenuOpen = false">Connexion<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
            <NuxtLink v-else-if="isPro" to="/pro" class="btn-pri justify-between" @click="isMenuOpen = false">Mon espace praticien<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
            <NuxtLink v-else-if="isAdmin" to="/admin" class="btn-pri justify-between" @click="isMenuOpen = false">Administration<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
            <button v-if="isLoggedIn" class="border border-neutre-200 text-vert-900 px-[25px] py-[10px] rounded-leya-s text-lg text-center" @click="handleLogout">Déconnexion</button>
            <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="btn-pri justify-between" @click="isMenuOpen = false">Parler à Léya<span class="btn-dot"><ArrowUpRight :size="18" aria-hidden="true" /></span></NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const accountRef = ref(null)

const { isLoggedIn, isPro, isAdmin, syncRole, logout } = useSession()
const isProLanding = computed(() => route.path === '/praticiens-pro' && !isLoggedIn.value)

async function handleLogout() {
  await logout()
  isMenuOpen.value = false
  isAccountOpen.value = false
  router.push('/')
}

// Ferme le menu « Mon compte » au clic extérieur ou à la touche Échap.
function onDocClick(e) {
  if (isAccountOpen.value && accountRef.value && !accountRef.value.contains(e.target)) isAccountOpen.value = false
}
function onKey(e) { if (e.key === 'Escape') isAccountOpen.value = false }

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
  syncRole() // sessions ouvertes avant l'introduction du rôle
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* Liens de navigation (maquette) : 16 px, graisse 500, pastille verte sur la page active */
.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  color: var(--vert-900);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  line-height: normal;
  transition: background-color 0.15s, color 0.15s;
}
.nav-link:hover { background-color: var(--vert-50); }
.nav-link.router-link-active { background-color: var(--vert-50); }
@media (max-width: 1279px) { .nav-link { padding: 8px 10px; } }

.menu-link {
  color: var(--vert-900);
  font-weight: 600;
  font-size: 17px;
  padding: 13px 0;
  border-bottom: 1px solid var(--bleu-100);
}

/* Boutons de la maquette : texte + pastille ronde à flèche (principal : vert foncé, secondaire : contour) */
.btn-pri, .btn-sec {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 4px 4px 4px 24px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;
}
.btn-pri { background-color: var(--vert-900); color: #fff; }
.btn-pri:hover { background-color: var(--vert-600); }
.btn-sec { border: 1.5px solid var(--vert-900); color: var(--vert-900); background: transparent; }
.btn-sec:hover { background-color: var(--vert-50); }
.btn-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
  color: var(--vert-900);
}
.btn-pri .btn-dot { background-color: var(--corail-500); }
.btn-sec .btn-dot { border: 1.5px solid var(--vert-900); }
@media (max-width: 1279px) {
  .btn-pri, .btn-sec { font-size: 16px; padding-left: 16px; gap: 10px; }
  .btn-dot { width: 36px; height: 36px; }
}
</style>
