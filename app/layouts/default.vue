<template>
  <div class="h-screen flex flex-col bg-[#f4f7f9] font-sans antialiased selection:bg-[#EC7F7A]/30 overflow-hidden">
    <TheNavbar v-if="!isRegisterPage" />
    
    <!-- Chatbot Layout (Home Page) -->
    <main v-if="!isRegisterPage" class="mx-auto w-11/12 max-w-7xl pb-6 pt-28 flex-1 flex flex-col min-h-0 transition-all duration-500">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[112px] min-h-0">
        <!-- Sidebar Illustration (Left Panel) -->
        <div class="hidden lg:block lg:col-span-4 h-full pb-8">
          <ChatbotIllustration />
        </div>

        <!-- Main Dynamic Content (Right Panel) -->
        <div class="col-span-1 lg:col-span-8 flex flex-col h-full min-h-0 pb-8">
          <slot />
        </div>
      </div>
    </main>

    <!-- Fullscreen Layout (Register Page) -->
    <main v-else class="flex-1 flex flex-col w-full h-full min-h-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()
const isRegisterPage = computed(() => route.path === '/register')
</script>
