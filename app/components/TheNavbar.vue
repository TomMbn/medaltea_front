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
          to="/coming-soon"
          class="text-[#012828] font-semibold text-[14px] opacity-60 hover:opacity-100 transition-opacity"
        >
          Trouver un praticien
        </NuxtLink>
      </div>

      <!-- Right Group: Buttons (Desktop) -->
      <div class="hidden lg:flex items-center gap-4">
        <!-- Auth Buttons -->
        <template v-if="!isLoggedIn">
          <NuxtLink v-if="route.path !== '/login' && route.path !== '/register'" to="/login" class="btn-signup text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:shadow-md active:scale-95 text-nowrap">
            Connexion
          </NuxtLink>
        </template>
        
        <!-- User Handlers (when logged in) -->
        <template v-else>
          <button @click="handleLogout" class="btn-signup text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:shadow-md active:scale-95 text-nowrap">
            Déconnexion
          </button>
        </template>

        <!-- Chatbot Button -->
        <NuxtLink v-if="route.path !== '/chatbot'" to="/chatbot" class="btn-chatbot text-white px-7 py-2 rounded-[12px] font-bold text-[14px] transition-all hover:scale-110 active:scale-95">
          Chatbot
        </NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden flex items-center">
        <button @click="isMenuOpen = !isMenuOpen" class="text-[#012828] hover:text-[#1c6c63] focus:outline-none p-1">
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
          <NuxtLink to="/coming-soon" class="text-[#012828] font-semibold text-[15px] py-2 border-b border-gray-100" @click="isMenuOpen = false">
            Trouver un praticien
          </NuxtLink>
          <template v-if="!isLoggedIn">
            <NuxtLink to="/login" class="w-full btn-signup text-white py-3 rounded-[12px] font-bold text-center" @click="isMenuOpen = false">
              Connexion
            </NuxtLink>
          </template>
          <template v-else>
            <button @click="handleLogout" class="w-full btn-signup text-white py-3 rounded-[12px] font-bold text-center">
              Déconnexion
            </button>
          </template>

          <NuxtLink v-if="route.path !== '/chatbot'" to="/chatbot" class="w-full btn-chatbot text-white py-3 rounded-[12px] font-bold text-center" @click="isMenuOpen = false">
            Chatbot
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from '#app'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

const token = useCookie('token')
const accessToken = useCookie('accessToken')
const sbAccessToken = useCookie('sb-access-token')
const isLoggedIn = computed(() => !!token.value || !!accessToken.value || !!sbAccessToken.value)

function handleLogout() {
  token.value = null
  accessToken.value = null
  sbAccessToken.value = null
  isMenuOpen.value = false
  router.push('/')
}
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
