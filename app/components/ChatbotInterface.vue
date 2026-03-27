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
    <div v-if="isChatActive" class="flex-1 flex flex-col min-h-0 pb-6 overflow-y-auto scrollbar-hide" ref="chatHistoryRef">
      <!-- Dynamic Messages -->
      <div v-for="(msg, index) in messages" :key="index" class="mb-8 last:mb-0">
        <!-- User Bubble -->
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div class="relative p-[3px] rounded-[20px] max-w-[80%] isolate">
            <div class="absolute inset-0 rounded-[20px] -z-10" style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"></div>
            <div class="bg-white rounded-[17.5px] px-8 py-3.5 shadow-sm">
              <p class="text-[#012828] text-[18px] font-medium font-sans whitespace-pre-wrap">
                {{ msg.parts[0].text }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bot Response -->
        <div v-else class="w-full max-w-[1078px] mx-auto px-8 animate-fade-in overflow-hidden">
          <div class="text-[#012828] text-[16px] font-sans leading-relaxed">
             <div v-html="formatMessage(msg.parts[0].text)" class="markdown-content"></div>
          </div>
        </div>
      </div>

      <!-- Loading / Typing State -->
      <div v-if="isTyping" class="w-full max-w-[1078px] mx-auto px-8 animate-fade-in opacity-50 pb-6">
        <div class="text-[#012828] text-[15px] font-sans leading-relaxed flex items-center gap-2">
          <span class="italic">Medaltea réfléchit...</span>
          <div class="flex gap-1">
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce"></span>
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interface Wrapper (Input Bar) -->
    <div 
      class="w-full relative px-4 sm:px-0"
      :class="isChatActive ? 'mt-auto pb-4 overflow-visible' : ''"
    >
      <!-- Panda Mascot -->
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
              :rows="1"
              @keydown.enter.prevent="sendMessage"
              :disabled="isTyping"
              class="flex-1 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-[#012828] resize-none py-2 bg-transparent font-sans disabled:opacity-50"
              placeholder="Je n'arrives plus à m'endormir, qui consulter ?"
            ></textarea>
            
            <button 
              @click="sendMessage"
              :disabled="isTyping || !userInput.trim()"
              class="w-10 h-10 rounded-full bg-[#EC7F7A] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0 disabled:grayscale disabled:opacity-50"
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
import { ref, nextTick } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { marked } from 'marked'

const isChatActive = ref(false)
const isTyping = ref(false)
const userInput = ref('')
const chatHistoryRef = ref(null)

const messages = ref([])

const suggestions = [
  { text: 'Soulager mon stress', emoji: '🌿' },
  { text: 'Mieux dormir', emoji: '😴' },
  { text: 'Comprendre une douleur', emoji: '🤕' }
]

const scrollToBottom = async () => {
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isTyping.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    parts: [{ text }]
  })

  userInput.value = ''
  isChatActive.value = true
  isTyping.value = true
  
  await scrollToBottom()

  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        message: text,
        history: messages.value.slice(0, -1) // Send history excluding the last message
      }
    })

    messages.value.push({
      role: 'model',
      parts: [{ text: response.text }]
    })
  } catch (err) {
    console.error('Chat Error:', err)
    messages.value.push({
      role: 'model',
      parts: [{ text: "Désolé, j'ai rencontré un problème technique. Peux-tu réessayer ?" }]
    })
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}

const formatMessage = (text) => {
  if (!text) return ''
  return marked.parse(text, { breaks: true })
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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Markdown Styling */
:deep(.markdown-content p) {
  margin-bottom: 1rem;
}
:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-content strong) {
  font-weight: 700;
  color: #012828;
}
:deep(.markdown-content ul), :deep(.markdown-content ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}
:deep(.markdown-content li) {
  margin-bottom: 0.5rem;
  list-style-type: disc;
}
:deep(.markdown-content h1), :deep(.markdown-content h2), :deep(.markdown-content h3) {
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #012828;
}
:deep(.markdown-content h3) {
  font-size: 1.1rem;
}
</style>
