<template>
  <!-- Floating Wrapper -->
  <div class="fixed top-0 inset-x-0 z-50 pt-6 pointer-events-none">
    <nav class="mx-auto w-11/12 max-w-[1440px] bg-white rounded-[20px] shadow-sm border border-gray-100 px-8 py-2.5 flex items-center justify-between pointer-events-auto">
      
      <!-- Left Zone: Logo -->
      <div class="flex items-center shrink-0">
        <NuxtLink to="/" class="flex items-center">
            <img src="/images/logo.svg" alt="Léya" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <!-- Center Nav Links (Desktop) -->
      <div class="hidden lg:flex items-center gap-7">
        <NuxtLink
          to="/medecines"
          class="text-[#012828] font-semibold text-[14px] opacity-60 hover:opacity-100 transition-opacity"
          active-class="!opacity-100"
        >
          Les Médecines
        </NuxtLink>
        <NuxtLink
          to="/trouver-un-praticien"
          class="text-[#012828] font-semibold text-[14px] opacity-60 hover:opacity-100 transition-opacity"
          active-class="!opacity-100"
        >
          Trouver un praticien
        </NuxtLink>
      </div>

      <!-- Right Group (Desktop) -->
      <div class="hidden lg:flex items-center gap-4">
        <!-- Visiteur -->
        <template v-if="!isLoggedIn">
          <NuxtLink to="/praticiens-pro" class="text-[#012828] font-semibold text-[14px] opacity-60 hover:opacity-100 transition-opacity text-nowrap">
            Vous êtes praticien ?
          </NuxtLink>
          <NuxtLink v-if="route.path !== '/login' && route.path !== '/register'" to="/login" class="btn-signup text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:shadow-md active:scale-95 text-nowrap">
            Connexion
          </NuxtLink>
        </template>

        <!-- Praticien connecté -->
        <template v-else-if="isPro">
          <NuxtLink to="/pro/rendez-vous" class="btn-signup text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:shadow-md active:scale-95 text-nowrap">
            Mon espace praticien
          </NuxtLink>
          <button class="text-[#012828] font-semibold text-[14px] opacity-60 hover:opacity-100 transition-opacity" @click="handleLogout">Déconnexion</button>
        </template>

        <!-- Patient connecté -->
        <div v-else ref="accountRef" class="relative">
          <button
            class="btn-signup text-white pl-5 pr-4 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:shadow-md active:scale-95 text-nowrap flex items-center gap-2"
            aria-haspopup="menu"
            :aria-expanded="isAccountOpen"
            @click="isAccountOpen = !isAccountOpen"
          >
            Mon compte <ChevronDown :size="16" aria-hidden="true" />
          </button>
          <div v-if="isAccountOpen" role="menu" class="absolute right-0 mt-2 w-56 bg-white rounded-[16px] shadow-xl border border-gray-100 py-2">
            <NuxtLink to="/mes-rendez-vous" role="menuitem" class="block px-5 py-2.5 text-sm font-semibold text-[#012828] hover:bg-gray-50" @click="isAccountOpen = false">Mes rendez-vous</NuxtLink>
            <NuxtLink to="/trouver-un-praticien" role="menuitem" class="block px-5 py-2.5 text-sm font-semibold text-[#012828] hover:bg-gray-50" @click="isAccountOpen = false">Prendre rendez-vous</NuxtLink>
            <NuxtLink to="/mon-compte" role="menuitem" class="block px-5 py-2.5 text-sm font-semibold text-[#012828] hover:bg-gray-50" @click="isAccountOpen = false">Mes informations</NuxtLink>
            <button role="menuitem" class="w-full text-left px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-gray-50 border-t border-gray-100" @click="handleLogout">Déconnexion</button>
          </div>
        </div>

        <!-- Chatbot Button (patients et visiteurs) -->
        <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="btn-chatbot text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:scale-110 active:scale-95">
          Chatbot
        </NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden flex items-center">
        <button aria-label="Ouvrir le menu" :aria-expanded="isMenuOpen" @click="isMenuOpen = !isMenuOpen" class="text-[#012828] hover:text-[#1c6c63] focus:outline-none p-1">
          <Menu v-if="!isMenuOpen" :size="32" />
          <X v-else :size="32" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Dropdown -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isMenuOpen" class="mx-auto w-11/12 mt-4 bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden pointer-events-auto">
        <div class="flex flex-col p-6 gap-4">
          <NuxtLink to="/medecines" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">
            Les Médecines
          </NuxtLink>
          <NuxtLink to="/trouver-un-praticien" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">
            Trouver un praticien
          </NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/praticiens-pro" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">Vous êtes praticien ?</NuxtLink>
          <NuxtLink v-if="isLoggedIn && !isPro" to="/mes-rendez-vous" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">Mes rendez-vous</NuxtLink>
          <NuxtLink v-if="isLoggedIn && !isPro" to="/mon-compte" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">Mes informations</NuxtLink>

          <NuxtLink v-if="!isLoggedIn" to="/login" class="w-full btn-signup text-white py-3 rounded-[12px] font-bold text-center" @click="isMenuOpen = false">Connexion</NuxtLink>
          <NuxtLink v-else-if="isPro" to="/pro/rendez-vous" class="w-full btn-signup text-white py-3 rounded-[12px] font-bold text-center" @click="isMenuOpen = false">Mon espace praticien</NuxtLink>
          <button v-if="isLoggedIn" class="w-full border border-gray-300 text-[#012828] py-3 rounded-[12px] font-bold text-center" @click="handleLogout">Déconnexion</button>

          <NuxtLink v-if="!isPro && route.path !== '/chatbot'" to="/chatbot" class="w-full btn-chatbot text-white py-3 rounded-[12px] font-bold text-center" @click="isMenuOpen = false">
            Chatbot
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X, ChevronDown } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const accountRef = ref(null)

const { isLoggedIn, isPro, syncRole, logout } = useSession()

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
.btn-signup {
  background-color: #012828;
  border: 2px solid transparent;
}

.btn-chatbot {
  /* Inner (fill) gradient: #EC7F7A to #F1AEAB */
  /* Outer (border) gradient: Gray (#90BAD1) to Rose (#EC7F7A) */
  background: linear-gradient(135deg, #EC7F7A 0%, #F1AEAB 100%) padding-box,
              linear-gradient(135deg, #90BAD1 0%, #EC7F7A 100%) border-box;
  border: 2px solid transparent;
}
</style>
