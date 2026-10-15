<template>
  <!-- Barre flottante (maquette V5) -->
  <div class="fixed top-0 inset-x-0 z-50 pt-5 pointer-events-none">
    <!-- Variante « Pro » : page de présentation de l'espace praticien (visiteurs) -->
    <nav v-if="isProLanding" class="mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4.5rem)] max-w-[1600px] bg-white rounded-full shadow-[0_12px_32px_rgba(1,40,40,0.08)] pl-5 pr-2 lg:pl-8 lg:pr-3 py-2 lg:py-3 flex items-center justify-between gap-6 pointer-events-auto" aria-label="Navigation espace praticien">
      <div class="flex items-center gap-[10px] shrink-0">
        <NuxtLink to="/" class="flex items-center min-h-[44px]" aria-label="Léya, accueil">
          <img src="/images/logo.svg" alt="Léya" width="87" height="39" class="h-[34px] w-auto" />
        </NuxtLink>
        <span class="rounded-full bg-corail-500 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900">Pro</span>
      </div>
      <div class="hidden lg:flex items-center gap-9 text-[16px] font-medium text-vert-900">
        <a href="#fonctionnement" class="hover:text-vert-600 transition-colors">Fonctionnement</a>
        <a href="#etapes" class="hover:text-vert-600 transition-colors">Inscription</a>
        <a href="#faq" class="hover:text-vert-600 transition-colors">FAQ</a>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro' } }" class="hidden sm:inline-flex items-center min-h-[48px] px-6 rounded-full border-[1.5px] border-vert-900 text-vert-900 text-[16px] font-medium hover:bg-vert-900 hover:text-white transition-colors">Se connecter</NuxtLink>
        <NuxtLink to="/inscription-pro" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[16px] font-medium whitespace-nowrap hover:bg-vert-600 transition-colors">
          Rejoindre<span class="hidden sm:inline"> Léya</span>
          <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
        </NuxtLink>
      </div>
    </nav>

    <nav v-else class="mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4.5rem)] max-w-[1654px] bg-white rounded-leya-m border border-[rgba(160,160,160,0.38)] shadow-[0_1px_15px_rgba(144,186,209,0.31)] pl-5 pr-3 lg:pl-[30px] lg:pr-[23px] py-2.5 lg:py-[18px] flex items-center justify-between gap-6 pointer-events-auto" aria-label="Navigation principale">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center min-h-[44px] shrink-0" aria-label="Léya, accueil">
        <img src="/images/logo.svg" alt="Léya" width="87" height="39" class="h-10 lg:h-[39px] w-auto" />
      </NuxtLink>

      <!-- Navigation et actions (bureau) -->
      <div class="hidden lg:flex items-center gap-5 xl:gap-[30px]">
        <NuxtLink to="/medecines" class="nav-link">Médecines</NuxtLink>
        <NuxtLink to="/trouver-un-praticien" class="nav-link inline-flex items-center gap-2 xl:gap-[10px]">
          <MapPin :size="18" aria-hidden="true" /> Trouver un praticien
        </NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/praticiens-pro" class="nav-link">Espace praticien</NuxtLink>

        <!-- Visiteur -->
        <template v-if="!isLoggedIn">
          <NuxtLink v-if="route.path !== '/login' && route.path !== '/register'" to="/login" class="btn-dark">Connexion</NuxtLink>
        </template>

        <!-- Praticien connecté -->
        <template v-else-if="isPro">
          <NuxtLink to="/pro" class="btn-dark">Mon espace praticien</NuxtLink>
          <button class="nav-link" @click="handleLogout">Déconnexion</button>
        </template>

        <!-- Patient connecté -->
        <div v-else ref="accountRef" class="relative">
          <button
            class="btn-dark inline-flex items-center gap-2"
            aria-haspopup="menu"
            :aria-expanded="isAccountOpen"
            @click="isAccountOpen = !isAccountOpen"
          >
            Mon compte <ChevronDown :size="16" aria-hidden="true" />
          </button>
          <div v-if="isAccountOpen" role="menu" class="absolute right-0 mt-2 w-60 bg-white rounded-leya-m shadow-douce border border-bleu-100 py-2">
            <!-- Mes rendez-vous, préférences et données sont accessibles depuis la page « Mon profil » -->
            <NuxtLink to="/mon-compte" role="menuitem" class="block px-5 py-3 text-base font-semibold text-vert-900 hover:bg-bleu-50" @click="isAccountOpen = false">Mon profil</NuxtLink>
            <button role="menuitem" class="w-full text-left px-5 py-3 text-base font-semibold text-red-700 hover:bg-bleu-50 border-t border-bleu-100" @click="handleLogout">Déconnexion</button>
          </div>
        </div>

        <!-- Parler à Léya (patients et visiteurs) -->
        <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="btn-chatbot">Parler à Léya</NuxtLink>
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
          <NuxtLink v-if="isLoggedIn && !isPro" to="/mes-rendez-vous" class="menu-link" @click="isMenuOpen = false">Mes rendez-vous</NuxtLink>
          <NuxtLink v-if="isLoggedIn && !isPro" to="/mon-compte" class="menu-link" @click="isMenuOpen = false">Mes informations</NuxtLink>

          <div class="flex flex-col gap-3 pt-3">
            <NuxtLink v-if="!isLoggedIn" to="/login" class="btn-dark text-center" @click="isMenuOpen = false">Connexion</NuxtLink>
            <NuxtLink v-else-if="isPro" to="/pro" class="btn-dark text-center" @click="isMenuOpen = false">Mon espace praticien</NuxtLink>
            <button v-if="isLoggedIn" class="border border-neutre-200 text-vert-900 px-[25px] py-[10px] rounded-leya-s text-lg text-center" @click="handleLogout">Déconnexion</button>
            <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="btn-chatbot text-center" @click="isMenuOpen = false">Parler à Léya</NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X, ChevronDown, MapPin, ArrowUpRight } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const accountRef = ref(null)

const { isLoggedIn, isPro, syncRole, logout } = useSession()
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
/* Liens de navigation : 16 px (lg), 18 px (xl), 20 px (2xl), graisse 600 comme la maquette */
.nav-link {
  color: var(--vert-900);
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  line-height: 1.3;
  transition: color 0.15s;
}
@media (min-width: 1280px) { .nav-link { font-size: 18px; } }
@media (min-width: 1536px) { .nav-link { font-size: 20px; } }
.nav-link:hover { color: var(--vert-600); }
.nav-link.router-link-active { text-decoration: underline; text-decoration-color: var(--corail-500); text-decoration-thickness: 2px; text-underline-offset: 8px; }

.menu-link {
  color: var(--vert-900);
  font-weight: 600;
  font-size: 17px;
  padding: 10px 0;
  border-bottom: 1px solid var(--bleu-100);
}

/* Bouton principal : vert foncé */
.btn-dark {
  background-color: var(--vert-900);
  color: #fff;
  border: 2px solid transparent;
  border-radius: var(--rayon-s);
  padding: 10px 25px;
  font-size: 16px;
  white-space: nowrap;
  transition: background-color 0.15s, box-shadow 0.15s;
}
@media (min-width: 1280px) { .btn-dark { font-size: 18px; } }
@media (min-width: 1536px) { .btn-dark { font-size: 20px; } }
.btn-dark:hover { background-color: var(--vert-600); box-shadow: var(--ombre-douce); }

/* « Parler à Léya » : dégradé corail de la maquette */
.btn-chatbot {
  background-image: linear-gradient(138.65deg, #ec7f7a 22.68%, #f1aeab 77.32%);
  border: 2px solid var(--corail-500);
  border-radius: var(--rayon-s);
  color: #fff;
  padding: 10px 25px;
  font-size: 16px;
  white-space: nowrap;
  transition: box-shadow 0.15s, transform 0.15s;
}
@media (min-width: 1280px) { .btn-chatbot { font-size: 18px; } }
@media (min-width: 1536px) { .btn-chatbot { font-size: 20px; } }
.btn-chatbot:hover { box-shadow: var(--ombre-douce); transform: translateY(-1px); }
@media (prefers-reduced-motion: reduce) { .btn-chatbot:hover { transform: none; } }
</style>
