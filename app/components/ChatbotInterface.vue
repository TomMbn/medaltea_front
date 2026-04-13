<template>
  <div class="flex flex-col w-full max-w-[1440px] mx-auto min-h-0 h-full flex-1 overflow-hidden">
    <!-- Initial View: Logo and Title (Centered) -->
    <div v-if="!isChatActive" class="flex flex-col items-center w-full relative pt-8 lg:pt-[127px]">
      <!-- Logo -->
      <div class="mb-8 lg:mb-[73px]">
        <img src="/images/logo.svg" alt="Medaltea Logo" class="h-8 lg:h-12 w-auto" />
      </div>
      
      <!-- Title -->
      <h2 class="text-2xl lg:text-[34px] font-bold text-[#012828] text-center leading-tight font-unbounded">
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

        <div v-else class="w-full max-w-[1078px] mx-auto px-8 overflow-hidden">
          <div class="text-[#012828] text-[16px] font-sans leading-relaxed">
             <div class="inline markdown-content" v-html="msg.html || formatMessage(msg.parts?.[0]?.text || '')"></div>
          </div>
        </div>
      </div>

      <!-- Loading / Typing State -->
      <div v-if="isTyping" class="w-full max-w-[1078px] mx-auto px-8 opacity-50 pb-6">
        <div class="text-[#012828] text-[15px] font-sans leading-relaxed flex items-center gap-2">
          <span class="italic">Altea réfléchit...</span>
          <div class="flex gap-1">
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce"></span>
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1 h-1 bg-[#012828] rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
      
      <!-- Spacer to prevent mascot from covering text -->
      <div class="h-16 md:h-24 flex-none" aria-hidden="true"></div>
    </div>

    <!-- Interface Wrapper (Input Bar) -->
    <div 
      class="w-full relative flex-none"
      :class="isChatActive ? 'mt-auto pb-4 overflow-visible px-4 sm:px-0' : ''"
    >
      <!-- Mascot is moved inside the search box container below -->

      <!-- Main Search/Input Box -->
      <div 
        class="relative w-full p-[3px] rounded-[20px] isolate flex flex-col transition-all duration-300 mx-auto"
        :class="[
          isChatActive ? 'h-[87px] mt-0 max-w-[1078px]' : 'min-h-[150px] lg:min-h-[177px] mt-16 lg:mt-[31px] w-full'
        ]"
      >
        <!-- Panda Mascot (Moved here) -->
        <div 
          :class="[
            'absolute z-20 pointer-events-none transition-all duration-500',
            isChatActive ? 'right-4 bottom-full mb-[-8px] w-[100px] md:w-[140px] h-[86px] md:h-[120px]' : 'right-4 bottom-full mb-[0px] lg:mb-[-1px] w-[75px] lg:w-[80px] h-[90px] lg:h-[95px]'
          ]"
        >
          <img 
            :src="isChatActive ? '/images/panda-2.png' : '/images/panda-standing.png'" 
            alt="Medaltea Panda Mascot" 
            class="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        <!-- 3px Gradient Border Layer -->
        <div 
          class="absolute inset-0 rounded-[20px] -z-10"
          style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
        ></div>
        
        <!-- White Inner Container -->
        <div 
          class="flex-1 bg-white rounded-[17.5px] flex flex-col transition-all duration-300"
          :class="isChatActive ? 'px-8 justify-center shadow-sm' : 'p-6 justify-between shadow-lg'"
        >
          <!-- Input Row -->
          <div class="flex items-center gap-4">
            <textarea 
              v-model="userInput"
              :rows="1"
              @keydown.enter.prevent="sendMessage"
              :disabled="isTyping || isLimitReached"
              class="flex-1 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-[#012828] resize-none py-2 bg-transparent font-sans disabled:opacity-50 overflow-hidden"
              :placeholder="isLimitReached ? 'Limite quotidienne atteinte (10/10)' : 'Demander à Altea'"
            ></textarea>
            
            <button 
              @click="sendMessage"
              :disabled="isTyping || !userInput.trim() || isLimitReached"
              class="w-10 h-10 rounded-full bg-[#EC7F7A] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0 disabled:grayscale disabled:opacity-50"
            >
              <ArrowUp v-if="!isLimitReached" :size="20" stroke-width="3" />
              <Ban v-else :size="20" stroke-width="3" />
            </button>
          </div>

          <!-- Integrated Suggestion Chips (Visible only on initial state) -->
          <div v-if="!isChatActive" class="flex flex-wrap gap-2 mt-auto pt-4 lg:pt-0">
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
import { ref, nextTick, onMounted, computed } from 'vue'
import { ArrowUp, Ban } from 'lucide-vue-next'
import { marked } from 'marked'
import { useRoute } from 'vue-router'

const route = useRoute()
const isChatActive = ref(false)
const isTyping = ref(false)
const userInput = ref('')
const chatHistoryRef = ref(null)

const messages = ref([])

// --- RATE LIMITING / USAGE (CLIENT SIDE) ---
const MAX_DAILY_MESSAGES = 10
const userUsage = ref({ count: 0, lastReset: '' })

const isLimitReached = computed(() => {
  const today = new Date().toLocaleDateString()
  if (userUsage.value.lastReset !== today) return false
  return userUsage.value.count >= MAX_DAILY_MESSAGES
})

const loadUsage = () => {
  const stored = localStorage.getItem('medaltea_chat_usage')
  if (stored) {
    const data = JSON.parse(stored)
    const today = new Date().toLocaleDateString()
    if (data.lastReset === today) {
      userUsage.value = data
    } else {
      userUsage.value = { count: 0, lastReset: today }
    }
  } else {
    userUsage.value.lastReset = new Date().toLocaleDateString()
  }
}

const saveUsage = () => {
  localStorage.setItem('medaltea_chat_usage', JSON.stringify(userUsage.value))
}

const incrementUsage = () => {
  userUsage.value.count++
  saveUsage()
}

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
  if (!text || isTyping.value || isLimitReached.value) return

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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        history: messages.value.slice(0, -1)
      })
    })

    if (!response.ok) throw new Error('Network response was not ok')
    if (!response.body) throw new Error('No response body')

    // Prepare AI message bubble
    const aiMsgIndex = messages.value.length
    messages.value.push({
      role: 'model',
      parts: [{ text: '' }],
      isStreaming: true
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    isTyping.value = false // Stop thinking animation as soon as we start receiving
    
    let currentText = ''
    let displayedLength = 0
    let typingInterval = null

    // Typing Animation logic
    const startTyping = () => {
      if (typingInterval) return
      typingInterval = setInterval(() => {
        const diff = currentText.length - displayedLength
        if (diff > 0) {
          // Dynamic catch-up: Jump faster if we are lagging far behind
          const increment = diff > 300 ? 50 : diff > 100 ? 15 : 4
          displayedLength += increment
          
          if (displayedLength >= currentText.length) {
            displayedLength = currentText.length
          } else {
             // Look ahead to find the next "natural" break point (space or marker) 
             // to avoid cutting in the middle of a markdown tag or word
             const nextSpace = currentText.indexOf(' ', displayedLength)
             if (nextSpace !== -1 && nextSpace - displayedLength < 10) {
               displayedLength = nextSpace + 1
             }
          }
          
          const textToParse = currentText.substring(0, displayedLength)
          messages.value[aiMsgIndex].html = formatMessage(textToParse)
        } else if (!messages.value[aiMsgIndex].isStreaming) {
          clearInterval(typingInterval)
          typingInterval = null
        }
      }, 15) // Slightly faster pulse
    }

    startTyping()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      currentText += chunk
      messages.value[aiMsgIndex].parts[0].text = currentText
    }

    messages.value[aiMsgIndex].isStreaming = false

  } catch (error) {
    console.error('Chat Error:', error)
    isTyping.value = false
    messages.value.push({
      role: 'model',
      parts: [{ text: 'Désolée, une erreur est survenue lors de la communication avec Altea. Veuillez réessayer.' }]
    })
  } finally {
    // Increment usage (Client side)
    incrementUsage()
    await nextTick()
  }
}

const formatMessage = (text) => {
  if (!text) return ''
  return marked.parse(text, { breaks: true })
}

onMounted(() => {
  loadUsage()
  
  if (route.query.q) {
    userInput.value = route.query.q
    sendMessage()
    
    // Clean up URL without redirecting/reloading (Nuxt 3)
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.replaceState({}, '', url.pathname)
  }
})
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
