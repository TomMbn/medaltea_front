<template>
  <div class="min-h-screen flex flex-col bg-[#f4f7f9] font-sans antialiased selection:bg-[#EC7F7A]/30 overflow-x-hidden">
    <!-- Navbar (Hidden on Auth pages) -->
    <TheNavbar v-if="!isAuthPage" />
    
    <!-- MODE: Chat (Constrained Grid with Sidebar) -->
    <main v-if="isChatPage" class="mx-auto w-11/12 max-w-7xl pb-6 pt-28 flex-1 flex flex-col min-h-0 transition-all duration-500">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[112px] min-h-0">
        <!-- Sidebar Illustration -->
        <div class="hidden lg:block lg:col-span-4 h-full pb-8">
          <ChatbotIllustration />
        </div>
        <!-- Main Chat Area -->
        <div class="col-span-1 lg:col-span-8 flex flex-col h-full min-h-0 pb-8">
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
