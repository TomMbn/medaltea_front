<template>
  <div 
    :class="[
      'relative flex flex-col font-sans antialiased selection:bg-[#EC7F7A]/30 overflow-x-hidden',
      isChatPage ? 'h-[100dvh] overflow-hidden bg-gradient-to-b from-bleu-50 to-[#e0ecf2]' : 'bg-[#e0ecf2] min-h-screen overflow-y-auto'
    ]"
  >
    <!-- Navbar (Hidden on Auth pages) -->
    <TheNavbar v-if="!isAuthPage" />
    
    <!-- MODE: Chat (panneau latéral et discussion, pleine hauteur) -->
    <img v-if="isChatPage" src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden xl:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <main v-if="isChatPage" class="relative flex-1 min-h-0 overflow-hidden flex flex-col w-full px-4 xl:px-[39px] pt-28 xl:pt-[138px] pb-4 xl:pb-8">
      <slot />
    </main>

    <!-- MODE: Auth (Clean 50/50 Layout - Slot is full-page) -->
    <main v-else-if="isAuthPage" class="flex-1 flex flex-col w-full min-h-0 overflow-y-auto">
      <slot />
    </main>

    <!-- MODE: Landing (Full-width sections with standard padding/scroll) -->
    <main v-else class="flex-1 flex flex-col w-full min-h-0">
      <slot />
    </main>

    <!-- Pied de page : pleine largeur, une seule fois (absent du chat, de la connexion et du compte praticien) -->
    <TheFooter v-if="showFooter" />
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()

const isAuthPage = computed(() => ['/register', '/login', '/inscription-pro'].includes(route.path))
const isChatPage = computed(() => route.path === '/chatbot')
const isLandingPage = computed(() => route.path === '/')
const { isPro } = useSession()
const showFooter = computed(() => !isAuthPage.value && !isChatPage.value && !(isPro.value && route.path === '/mon-compte'))
</script>
