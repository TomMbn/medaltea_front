<template>
  <div class="flex flex-col items-center justify-center w-full max-w-[970px] mx-auto py-12 px-4">
    <!-- Logo and Title Group -->
    <div class="flex flex-col items-center mb-10 w-full relative">
      <!-- Logo -->
      <div class="mb-[73px]">
        <img src="/images/logo.svg" alt="Medaltea Logo" class="h-9 w-auto" />
      </div>
      
      <!-- Title -->
      <h2 class="text-[34px] font-bold text-[#012828] text-center leading-tight whitespace-nowrap font-unbounded">
        Demandes moi <span class="text-[#EC7F7A]">quelque chose !</span>
      </h2>
    </div>

      <!-- Main Search Box (Input + Chips) -->
      <div class="relative w-full min-h-[177px] p-[3px] rounded-[20px] isolate flex flex-col mt-[31px]">
        <!-- 3px Gradient Border Layer -->
        <div 
          class="absolute inset-0 rounded-[20px] -z-10"
          style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
        ></div>

        <!-- Panda Mascot (Standing on border) -->
        <div class="absolute right-4 bottom-full mb-[-3px] w-[148px] h-[175px] z-20 pointer-events-none">
          <img 
            src="/images/panda-standing.png" 
            alt="Medaltea Panda Mascot" 
            class="w-full h-full object-contain"
          />
        </div>
        
        <!-- White Inner Container -->
        <div class="flex-1 bg-white rounded-[17.5px] p-6 flex flex-col justify-between shadow-xl">
          <!-- Input Row -->
          <div class="flex items-center gap-4">
            <textarea 
              rows="1"
              class="flex-1 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-[#012828] resize-none py-2 bg-transparent font-sans"
              placeholder="Je n'arrives plus à m'endormir, qui consulter ?"
            ></textarea>
            
            <button class="w-10 h-10 rounded-full bg-[#EC7F7A] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0">
              <ArrowUp :size="20" stroke-width="3" />
            </button>
          </div>

          <!-- Integrated Suggestion Chips -->
          <div class="flex flex-wrap gap-3 mt-auto">
            <button 
              v-for="chip in suggestions" 
              :key="chip.text"
              class="h-[42px] px-4 bg-white/70 backdrop-blur-sm hover:bg-white rounded-[14px] text-[14px] font-medium text-black transition-all flex items-center gap-2 border border-[#D9D9D9] shadow-sm"
            >
              <span class="text-lg">{{ chip.emoji }}</span>
              <span class="font-sans">{{ chip.text }}</span>
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ArrowUp } from 'lucide-vue-next'

const suggestions = [
  { text: 'Soulager mon stress', emoji: '🌿' },
  { text: 'Mieux dormir', emoji: '😴' },
  { text: 'Comprendre une douleur', emoji: '🤕' }
]
</script>
