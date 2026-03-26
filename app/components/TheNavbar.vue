<template>
  <!-- Floating Wrapper -->
  <div class="fixed top-0 inset-x-0 z-50 pt-6 px-4 pointer-events-none">
    <nav class="mx-auto w-11/12 max-w-7xl bg-white rounded-[20px] shadow-lg border border-gray-100 px-8 py-2.5 flex items-center justify-between pointer-events-auto">
      
      <!-- Left Zone: Logo -->
      <div class="flex items-center shrink-0">
        <NuxtLink to="/" class="flex items-center">
            <img src="/images/logo.svg" alt="Medaltea Logo" class="h-7 w-auto" />
        </NuxtLink>
      </div>

      <!-- Right Group: Navigation + Buttons (Desktop) -->
      <div class="hidden lg:flex items-center gap-12">
        <!-- Navigation Links -->
        <div class="flex items-center gap-8 text-[15px] font-semibold text-[#012828]">
          <a href="#" class="hover:text-[#1c6c63] transition-colors">Les Médecines</a>
          <a href="#" class="flex items-center gap-1.5 hover:text-[#1c6c63] transition-colors text-nowrap">
            <MapPin :size="18" class="text-[#01211e]" />
            Trouver un praticien
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="flex items-center gap-2">
          <button class="btn-dark text-white px-7 py-1.5 rounded-[10px] font-bold text-[14px] shadow-md">
            M'inscrire
          </button>
          <button class="btn-chatbot text-white px-7 py-1.5 rounded-[10px] font-bold text-[14px] shadow-md">
            Chatbot
          </button>
        </div>
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
          <a href="#" class="px-4 py-3 font-semibold text-[#012828] hover:bg-gray-50 rounded-xl">Les Médecines</a>
          <a href="#" class="px-4 py-3 font-semibold text-[#012828] hover:bg-gray-50 rounded-xl flex items-center gap-3">
            <MapPin :size="20" />
            Trouver un praticien
          </a>
          <hr class="border-gray-100 my-2" />
          <div class="flex flex-col gap-3">
            <button class="w-full btn-dark text-white px-6 py-3 rounded-[10px] font-bold text-center border-2 border-transparent">
              M'inscrire
            </button>
            <button class="w-full btn-chatbot text-white px-6 py-3 rounded-[10px] font-bold text-center">
              Chatbot
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)
</script>

<style scoped>
.btn-dark {
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
