<template>
  <div 
    :class="[
      'flex flex-col bg-[#e0ecf2] font-sans antialiased selection:bg-[#EC7F7A]/30 overflow-x-hidden',
      isChatPage || isAuthPage ? 'h-[100dvh] overflow-hidden' : 'min-h-screen overflow-y-auto'
    ]"
  >
    <!-- Navbar (Hidden on Auth pages) -->
    <TheNavbar v-if="!isAuthPage" />
    
    <!-- MODE: Chat (Constrained Grid with Sidebar) -->
    <main v-if="isChatPage" class="mx-auto w-11/12 max-w-[1440px] pt-28 pb-10 flex-1 flex flex-col min-h-0 overflow-hidden">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[112px] min-h-0 overflow-hidden">
        <!-- Sidebar Illustration -->
        <div class="hidden lg:block lg:col-span-4 flex flex-col min-h-0 overflow-hidden">
          <ChatbotIllustration />
        </div>
        <!-- Main Chat Area -->
        <div class="col-span-1 lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden">
          <slot />
        </div>
      </div>
    </main>

    <!-- MODE: Auth (Clean 50/50 Layout - Slot is full-page) -->
    <main v-else-if="isAuthPage" class="flex-1 flex flex-col w-full h-screen min-h-0 overflow-hidden">
      <slot />
    </main>

    <!-- MODE: Landing (Full-width sections with standard padding/scroll) -->
    <main v-else class="flex-1 flex flex-col w-full min-h-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()

const isAuthPage = computed(() => ['/register', '/login'].includes(route.path))
const isChatPage = computed(() => route.path === '/chatbot')
const isLandingPage = computed(() => route.path === '/')
</script>
