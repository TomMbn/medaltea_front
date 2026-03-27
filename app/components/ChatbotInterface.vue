<template>
  <div class="flex flex-col w-full max-w-[970px] mx-auto min-h-0">
    <!-- Initial View: Logo and Title (Centered) -->
    <div v-if="!isChatActive" class="flex flex-col items-center w-full relative pt-[127px]">
      <!-- Logo -->
      <div class="mb-[73px]">
        <img src="/images/logo.svg" alt="Medaltea Logo" class="h-12 w-auto" />
      </div>
      
      <!-- Title -->
      <h2 class="text-[34px] font-bold text-[#012828] text-center leading-tight whitespace-nowrap font-unbounded">
        Demandes moi <span class="text-[#EC7F7A]">quelque chose</span>
      </h2>
    </div>

    <!-- Chat History / Conversation View -->
    <div v-if="isChatActive" class="flex-1 flex flex-col min-h-0 pb-6 overflow-y-auto scrollbar-hide">
      <!-- User Bubble (Top Right) -->
      <div class="flex justify-end mb-12">
        <div class="relative p-[3px] rounded-[20px] max-w-[80%] isolate">
          <!-- 3px Gradient Border -->
          <div 
            class="absolute inset-0 rounded-[20px] -z-10"
            style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
          ></div>
          <!-- Bubble Content -->
          <div class="bg-white rounded-[17.5px] px-8 py-3.5 shadow-sm">
            <p class="text-[#012828] text-[18px] font-medium font-sans">
              J'ai des maux de têtes, que dois-je faire ?
            </p>
          </div>
        </div>
      </div>

      <!-- Bot Response -->
      <div class="max-w-[85%] animate-fade-in">
        <div class="text-[#012828] text-[15px] font-sans leading-relaxed space-y-6">
          <p>Si tu n'arrives plus à dormir la nuit, il faut d'abord comprendre pourquoi. La plupart du temps, c'est lié au stress, au rythme de vie ou aux habitudes avant de dormir. Voici les choses les plus efficaces à essayer.</p>
          
          <div class="space-y-4">
            <h3 class="font-bold">1. Recaler ton rythme de sommeil</h3>
            <p>Ton cerveau aime la régularité.</p>
            <p>Essaie de te coucher et te lever à la même heure tous les jours, même le week-end.</p>
            <p>Évite les siestes longues (max 20 minutes).</p>
            <p>Si tu ne dors pas après 20 min dans ton lit, lève-toi et fais quelque chose de calme (lecture, lumière douce) puis retourne te coucher.</p>
          </div>

          <div class="space-y-4">
            <h3 class="font-bold">2. Couper les stimulants</h3>
            <p>Certains éléments bloquent littéralement l'endormissement.</p>
            <p>À éviter le soir :</p>
            <p>...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Interface Wrapper (Input Bar) -->
    <div 
      class="w-full relative px-4 sm:px-0"
      :class="isChatActive ? 'mt-auto' : ''"
    >
      <!-- Panda Mascot (Sitting on border in chat mode OR Standing in landing mode) -->
      <div 
        :class="[
          'absolute z-20 pointer-events-none transition-all duration-500',
          isChatActive ? 'right-0 bottom-full mb-[-18px] w-[140px] h-[120px]' : 'right-4 bottom-full mb-[-31px] w-[80px] h-[95px]'
        ]"
      >
        <img 
          :src="isChatActive ? '/images/panda-2.png' : '/images/panda-standing.png'" 
          alt="Medaltea Panda Mascot" 
          class="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      <!-- Main Search/Input Box -->
      <div 
        class="relative w-full p-[3px] rounded-[20px] isolate flex flex-col transition-all duration-300 mx-auto"
        :class="[
          isChatActive ? 'h-[87px] mt-0 max-w-[1078px]' : 'min-h-[177px] mt-[31px] max-w-[970px]'
        ]"
      >
        <!-- 3px Gradient Border Layer -->
        <div 
          class="absolute inset-0 rounded-[20px] -z-10"
          style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
        ></div>
        
        <!-- White Inner Container -->
        <div 
          class="flex-1 bg-white rounded-[17.5px] flex flex-col transition-all duration-300"
          :class="isChatActive ? 'px-8 justify-center shadow-md' : 'p-6 justify-between shadow-xl'"
        >
          <!-- Input Row -->
          <div class="flex items-center gap-4">
            <textarea 
              v-model="userInput"
              :rows="isChatActive ? 1 : 1"
              @keydown.enter.prevent="sendMessage"
              class="flex-1 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-[#012828] resize-none py-2 bg-transparent font-sans"
              placeholder="Je n'arrives plus à m'endormir, qui consulter ?"
            ></textarea>
            
            <button 
              @click="sendMessage"
              class="w-10 h-10 rounded-full bg-[#EC7F7A] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0"
            >
              <ArrowUp :size="20" stroke-width="3" />
            </button>
          </div>

          <!-- Integrated Suggestion Chips (Visible only on initial state) -->
          <div v-if="!isChatActive" class="flex flex-wrap gap-2 mt-auto">
            <button 
              v-for="chip in suggestions" 
              :key="chip.text"
              @click="userInput = chip.text; sendMessage()"
              class="h-[42px] px-4 bg-white/70 backdrop-blur-sm hover:bg-white rounded-[14px] text-[14px] font-medium text-black transition-all flex items-center gap-2 border border-[#D9D9D9] shadow-sm"
            >
              <span class="text-lg">{{ chip.emoji }}</span>
              <span class="font-sans">{{ chip.text }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const isChatActive = ref(false)
const userInput = ref('')

const suggestions = [
  { text: 'Soulager mon stress', emoji: '🌿' },
  { text: 'Mieux dormir', emoji: '😴' },
  { text: 'Comprendre une douleur', emoji: '🤕' }
]

const sendMessage = () => {
  if (!userInput.value.trim()) return
  isChatActive.value = true
  userInput.value = ''
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
