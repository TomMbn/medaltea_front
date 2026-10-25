<template>
  <div class="flex-1 min-h-0 flex gap-0 w-full">
    <!-- Panneau latéral : paysage, confidentialité, accroche -->
    <aside class="hidden xl:flex relative w-[485px] shrink-0 rounded-[30px] overflow-hidden bg-bleu-300" aria-label="À propos de la conversation">
      <img src="/images/landscape.webp" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover" style="animation: none;" />
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(222,222,222,0)] to-[rgba(144,186,209,0.3)]" aria-hidden="true"></div>

      <button type="button" class="absolute left-5 top-[22px] inline-flex items-center justify-center gap-[10px] h-[61px] w-[190px] bg-white rounded-[20px] border-b-[5px] border-white shadow-[0_4px_10px_rgba(138,138,138,0.25)] text-[20px] text-vert-900 leading-[normal] hover:shadow-douce transition-shadow" @click="resetChat">
        <Plus :size="20" aria-hidden="true" /> Nouveau chat
      </button>

      <div class="absolute left-10 right-10 top-[92px] bg-white/85 rounded-[20px] px-4 py-3">
        <p class="flex items-center gap-[10px] text-[16px] font-medium text-vert-900 leading-[normal]">
          <span class="w-7 h-7 rounded-full bg-vert-900 text-white flex items-center justify-center shrink-0"><Check :size="14" aria-hidden="true" /></span>
          {{ isChatActive ? 'Conversation privée' : 'Vos échanges restent privés' }}
        </p>
        <p class="mt-2 text-[16px] leading-[normal] text-neutre-600">
          {{ isChatActive ? 'Rien n’est enregistré : vos échanges sont effacés à la fermeture de la page.' : 'Aucune conversation n’est enregistrée. Tout est effacé à la fermeture de la page.' }}
        </p>
      </div>

      <div class="absolute left-[35px] right-8 bottom-8 flex gap-[37px]">
        <span class="w-px h-[120px] bg-white shrink-0 -mt-[11px]" aria-hidden="true"></span>
        <p class="w-[361px] max-w-full font-unbounded font-normal text-[32px] leading-[normal] text-white">Expliquez-nous ce que vous ressentez, on vous guide.</p>
      </div>
    </aside>

    <!-- Zone de discussion -->
    <section class="flex-1 min-w-0 min-h-0 flex flex-col" :class="isChatActive ? 'xl:pl-[78px] xl:pr-[17px]' : ''" aria-label="Discussion avec Léya">
      <!-- Accueil : logo, titre -->
      <div v-if="!isChatActive" class="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center pb-10 xl:pb-[34px] xl:pl-[28px]">
        <!-- my-auto (et non justify-center) : centré s'il y a de la place, sinon le haut reste accessible en défilant -->
        <div class="w-full max-w-[970px] mx-auto my-auto flex flex-col items-center">
          <img src="/images/logo.svg" alt="Léya" class="h-12 lg:h-[65px] w-auto" />
          <h2 class="mt-8 lg:mt-[68px] font-unbounded font-normal text-[22px] sm:text-[28px] lg:text-[32px] leading-[normal] text-vert-900 text-center">Posez-moi votre question</h2>

          <div class="panda-zone relative w-full mt-12 lg:mt-[46px]">
            <!-- Mascotte, posée sur le bord de la saisie -->
            <img src="/images/chatbot-mascotte-accueil.webp" alt="" aria-hidden="true" width="148" height="175" class="panda hidden sm:block absolute right-6 lg:right-[-4px] bottom-[calc(100%-22px)] w-[110px] lg:w-[148px] xl:w-[110px] 2xl:w-[148px] h-auto pointer-events-none select-none" />
            <div class="relative p-[3px] rounded-[20px] isolate">
              <div class="absolute inset-0 rounded-[20px] -z-10" style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"></div>
              <div class="focus-ring-within bg-white rounded-[17.5px] px-5 lg:pl-[23px] lg:pr-8 pt-5 pb-5 lg:pb-[23px] flex flex-col gap-6 lg:gap-[35px]">
                <div class="flex items-start justify-between gap-4">
                  <textarea
                    v-model="userInput"
                    aria-label="Votre message à Léya"
                    rows="1"
                    maxlength="2000"
                    :disabled="isBusy || isLimitReached"
                    class="focus-in-parent flex-1 [field-sizing:content] max-h-40 text-[18px] lg:text-[26px] leading-[normal] text-vert-900 placeholder-neutre-500 resize-none bg-transparent focus:outline-none disabled:opacity-50"
                    :placeholder="isLimitReached ? 'Limite quotidienne atteinte (10/10)' : 'Je n’arrive plus à m’endormir, qui consulter ?'"
                    @keydown.enter.exact.prevent="sendMessage"
                  ></textarea>
                  <button type="button" aria-label="Envoyer le message" :disabled="isBusy || !userInput.trim() || isLimitReached" class="send-btn" @click="sendMessage">
                    <ArrowUp v-if="!isLimitReached" :size="22" stroke-width="2.5" aria-hidden="true" />
                    <Ban v-else :size="22" stroke-width="2.5" aria-hidden="true" />
                  </button>
                </div>
                <div class="flex flex-wrap gap-3 lg:gap-[22px]">
                  <button v-for="chip in suggestions" :key="chip" type="button" class="h-12 lg:h-[61px] px-[10px] min-w-[0] bg-white border border-neutre-200 rounded-[20px] text-[16px] lg:text-[20px] text-black leading-[normal] hover:bg-bleu-50 transition-colors disabled:opacity-50" :disabled="isBusy || isLimitReached" @click="userInput = chip; sendMessage()">{{ chip }}</button>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-5 lg:mt-[22px] text-center text-[14px] lg:text-[16px] text-neutre-600 leading-snug">Exemples : « Je me réveille à 4 h chaque nuit » · « J’ai mal au bas du dos depuis une semaine »</p>
          <p class="mt-6 lg:mt-[25px] flex items-start justify-center gap-2 text-center text-[14px] lg:text-[16px] text-vert-600 leading-snug max-w-[786px]">
            <Info :size="16" class="shrink-0 mt-0.5" aria-hidden="true" />
            <span>Léya ne pose pas de diagnostic et ne remplace pas un avis médical. En cas d’urgence, appelez le 15. Évitez de saisir des informations qui vous identifient. <NuxtLink to="/politique-de-confidentialite" class="underline">Confidentialité</NuxtLink></span>
          </p>
        </div>
      </div>

      <!-- Conversation -->
      <div v-else ref="chatHistoryRef" class="flex-1 min-h-0 overflow-y-auto scrollbar-hide pt-2 pb-6 flex flex-col gap-5" aria-live="polite">
        <template v-for="(msg, index) in messages" :key="index">
          <!-- Message de l'utilisateur -->
          <div v-if="msg.role === 'user'" class="flex justify-end">
            <div class="relative p-[3px] rounded-[20px] max-w-[85%] lg:max-w-[70%] isolate">
              <div class="absolute inset-0 rounded-[20px] -z-10" style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"></div>
              <div class="bg-white rounded-[17.5px] px-5 lg:px-6 py-3.5 lg:py-[18px]">
                <p class="text-vert-900 text-[18px] lg:text-[24px] leading-[normal] whitespace-pre-wrap break-words">{{ msg.parts[0].text }}</p>
              </div>
            </div>
          </div>

          <!-- Réponse de Léya -->
          <div v-else class="w-full max-w-[1040px]">
            <p class="flex items-center gap-[10px] text-[18px] font-semibold text-vert-600 leading-[normal]">
              <span class="w-9 h-9 rounded-full bg-vert-600 flex items-center justify-center shrink-0"><img src="/images/landing/med-sophrologie.svg" alt="" width="22" height="16" class="w-[22px] h-auto" style="animation: none; filter: brightness(0) invert(1);" /></span>
              Léya
            </p>
            <div class="mt-5 lg:mt-7 max-w-[1000px] text-vert-900 text-[17px] lg:text-[18px] leading-[1.25]">
              <div class="markdown-content" v-html="msg.html || formatMessage(msg.parts?.[0]?.text || '')"></div>
            </div>

            <template v-if="!msg.isStreaming && !msg.isError">
              <div v-if="mentionedMedicines(msg).length && !isUrgent(msg)" class="mt-7">
                <p class="text-[18px] font-semibold text-vert-900 leading-[normal]">Médecines qui peuvent aider</p>
                <ul class="mt-3 flex flex-wrap gap-[10px]">
                  <li v-for="m in mentionedMedicines(msg)" :key="m.slug">
                    <NuxtLink :to="`/medecines/${m.slug}`" class="inline-flex items-center gap-[10px] bg-white border border-bleu-100 rounded-full pl-2 pr-4 py-2 text-[16px] font-medium text-vert-900 leading-[normal] hover:bg-bleu-50 transition-colors">
                      <span class="w-9 h-9 rounded-full bg-bleu-50 flex items-center justify-center shrink-0"><img :src="m.pictogram" alt="" width="22" height="22" class="max-w-[22px] max-h-[22px] w-auto h-auto" style="animation: none;" /></span>
                      {{ m.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
              <!-- Praticiens proches : seulement sur la dernière réponse, jamais en cas d'urgence -->
              <ChatPraticiens v-if="msg === lastModelMessage && !isUrgent(msg)" :key="mentionedMedicines(msg).map(m => m.slug).join()" :slugs="mentionedMedicines(msg).map(m => m.slug)" />
              <div class="mt-6 flex items-center gap-1.5">
                <button type="button" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-vert-900 hover:bg-bleu-50 transition-colors" :aria-label="copiedIndex === index ? 'Réponse copiée' : 'Copier la réponse'" @click="copyMessage(msg, index)">
                  <Check v-if="copiedIndex === index" :size="16" aria-hidden="true" />
                  <Copy v-else :size="16" aria-hidden="true" />
                </button>
              </div>
            </template>
          </div>
        </template>

        <!-- Réflexion -->
        <div v-if="isTyping" class="w-full max-w-[1040px]" role="status">
          <p class="flex items-center gap-[10px] text-[18px] font-semibold text-vert-600 leading-[normal]">
            <span class="w-9 h-9 rounded-full bg-vert-600 flex items-center justify-center shrink-0"><img src="/images/landing/med-sophrologie.svg" alt="" width="22" height="16" class="w-[22px] h-auto" style="animation: none; filter: brightness(0) invert(1);" /></span>
            Léya
          </p>
          <p class="mt-4 flex items-center gap-2 text-[17px] text-neutre-600">
            <span class="italic">{{ pandaState === 'recherche' ? 'Léya cherche des pistes…' : 'Léya réfléchit…' }}</span>
            <span class="flex gap-1" aria-hidden="true">
              <span class="w-1.5 h-1.5 bg-vert-600 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-vert-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-vert-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
          </p>
        </div>
      </div>

      <!-- Barre de saisie (conversation) -->
      <div v-if="isChatActive" class="flex-none pt-3">
        <div v-if="canSuggestPractitioners" class="mb-4 flex flex-wrap gap-2.5">
          <NuxtLink :to="otherPractitionersLink" class="inline-flex bg-white text-vert-900 text-[16px] font-medium rounded-full px-4 py-[9px] leading-[normal] hover:bg-bleu-50 transition-colors">{{ otherPractitionersLink === '/trouver-un-praticien' ? 'Trouver un praticien' : 'Voir d’autres praticiens' }}</NuxtLink>
        </div>
        <div class="relative" @mouseenter="pandaRef?.saluer()">
          <!-- Mascotte : ses expressions suivent l'échange (écoute, réflexion, recherche, trouvé, réponse, content, oups) -->
          <div class="hidden md:block absolute right-0 lg:right-[-4px] bottom-[calc(100%-28px)] w-[150px] lg:w-[223px] pointer-events-none select-none">
            <LeyaPanda ref="pandaRef" :etat="pandaState" miroir />
          </div>
          <div class="relative p-[3px] rounded-[20px] isolate">
            <div class="absolute inset-0 rounded-[20px] -z-10" style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"></div>
            <div class="focus-ring-within bg-white rounded-[17.5px] h-[75px] lg:h-[81px] pl-5 lg:pl-[34px] pr-5 lg:pr-6 flex items-center gap-4">
              <input
                v-model="userInput"
                type="text"
                aria-label="Votre message à Léya"
                maxlength="2000"
                :disabled="isBusy || isLimitReached"
                class="focus-in-parent flex-1 min-w-0 text-[18px] lg:text-[20px] text-vert-900 placeholder-neutre-500 bg-transparent focus:outline-none disabled:opacity-50"
                :placeholder="isLimitReached ? 'Limite quotidienne atteinte (10/10)' : 'Posez votre question…'"
                @keydown.enter.exact.prevent="sendMessage"
              />
              <button type="button" aria-label="Envoyer le message" :disabled="isBusy || !userInput.trim() || isLimitReached" class="send-btn" @click="sendMessage">
                <ArrowUp v-if="!isLimitReached" :size="22" stroke-width="2.5" aria-hidden="true" />
                <Ban v-else :size="22" stroke-width="2.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <p class="mt-2.5 text-[14px] lg:text-[16px] text-neutre-600 leading-snug">
          Léya ne remplace pas un avis médical. En cas d’urgence, appelez le 15. Évitez de saisir des informations qui vous identifient.
          <NuxtLink to="/politique-de-confidentialite" class="underline">Confidentialité</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { ArrowUp, Ban, Plus, Check, Copy, Info } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { medecines, medecinePictogram } from '~/data/medecines'
import { mentionedMedicineSlugs } from '~/utils/mentions'

const route = useRoute()
// La conversation vit en mémoire de l'application (pas sur le serveur, pas sur le disque) : elle survit à un changement de page
// (fiche d'un praticien, médecine…) et disparaît à la fermeture ou au rechargement de la page, comme annoncé.
const messages = useState('leya-chat-messages', () => [])
const isTyping = useState('leya-chat-typing', () => false)
const epochState = useState('leya-chat-epoch', () => 0)
const isChatActive = computed(() => messages.value.length > 0)
const isBusy = computed(() => isTyping.value || messages.value.some(m => m.isStreaming))
const userInput = ref('')
const chatHistoryRef = ref(null)
const copiedIndex = ref(-1)

// Expressions du panda au fil de l'échange : « écoute » pendant la saisie, « réflexion » dès l'envoi, « recherche » si la réponse
// tarde, « trouvé » quand elle arrive, « réponse » pendant l'écriture, « content » une fois finie, « oups » après une erreur.
// La réponse arrive en texte brut, sans signal de recherche : le passage à « recherche » se fait au bout d'un délai.
const SEARCH_DELAY_MS = 2500
const FOUND_MS = 1200
const PLEASED_MS = 2600
const pandaRef = ref(null)
const isSearching = ref(false)
const celebration = ref('') // 'trouve' | 'content' | ''
let searchTimer = null
let celebrationTimer = null
const isStreaming = computed(() => messages.value.some(m => m.isStreaming))
watch(isTyping, (typing) => {
  clearTimeout(searchTimer)
  isSearching.value = false
  if (typing) searchTimer = setTimeout(() => { isSearching.value = true }, SEARCH_DELAY_MS)
}, { immediate: true })
function celebrate(state, ms) {
  clearTimeout(celebrationTimer)
  celebration.value = state
  celebrationTimer = setTimeout(() => { celebration.value = '' }, ms)
}
watch(isStreaming, (streaming, wasStreaming) => {
  if (streaming) celebrate('trouve', FOUND_MS)
  else if (wasStreaming) celebrate('content', PLEASED_MS)
})
onBeforeUnmount(() => { clearTimeout(searchTimer); clearTimeout(celebrationTimer) })
const pandaState = computed(() => {
  if (isTyping.value) return isSearching.value ? 'recherche' : 'reflexion'
  if (celebration.value) return celebration.value
  if (isStreaming.value) return 'reponse'
  if (userInput.value.trim()) return 'ecoute'
  if (lastModelMessage.value?.isError) return 'oups'
  return 'repos'
})


// --- RATE LIMITING / USAGE (CLIENT SIDE) ---
const MAX_DAILY_MESSAGES = 10
const userUsage = ref({ count: 0, lastReset: '' })

const isLimitReached = computed(() => {
  const today = new Date().toLocaleDateString()
  if (userUsage.value.lastReset !== today) return false
  return userUsage.value.count >= MAX_DAILY_MESSAGES
})

const loadUsage = () => {
  const stored = localStorage.getItem('leya_chat_usage')
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
  localStorage.setItem('leya_chat_usage', JSON.stringify(userUsage.value))
}

const incrementUsage = () => {
  loadUsage()
  userUsage.value.count++
  saveUsage()
}

const suggestions = ['Soulager mon stress', 'Mieux dormir', 'Comprendre une douleur']

const scrollToBottom = async () => {
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}

// --- Nouveau chat : repart de zéro (rien n'est conservé)
let typingInterval = null
function resetChat() {
  epochState.value++
  if (typingInterval) { clearInterval(typingInterval); typingInterval = null }
  messages.value = []
  isTyping.value = false
  userInput.value = ''
  copiedIndex.value = -1
  clearTimeout(celebrationTimer)
  celebration.value = ''
}

// --- Médecines citées dans la réponse (reconnues dans le texte, rien n'est inventé)
const mentionedMedicines = (msg) => {
  const text = msg.parts?.[0]?.text || ''
  return mentionedMedicineSlugs(text)
    .map(slug => medecines.find(x => x.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
    .map(m => ({ slug: m.slug, name: m.name, pictogram: medecinePictogram(m) }))
}

// Urgence médicale : la consigne de l'assistant est de recommander le 15 AVANT tout autre conseil. On regarde donc le début de la réponse
// (la mention « en cas d'urgence, appelez le 15 » en fin de réponse ne compte pas) : pas de pastilles ni de praticiens dans ce cas.
const isUrgent = (msg) => /\b(SAMU|urgences?|le\s+15)\b/i.test((msg.parts?.[0]?.text || '').slice(0, 250))

const lastModelMessage = computed(() => [...messages.value].reverse().find(m => m.role === 'model'))
const canSuggestPractitioners = computed(() => !!lastModelMessage.value && !lastModelMessage.value.isStreaming && !lastModelMessage.value.isError && !isTyping.value)

// « Voir d'autres praticiens » : la recherche s'ouvre sur la première médecine citée
const otherPractitionersLink = computed(() => {
  const msg = lastModelMessage.value
  const first = msg && !isUrgent(msg) ? mentionedMedicines(msg)[0] : null
  return first ? { path: '/trouver-un-praticien', query: { specialite: first.slug }, hash: '#resultats' } : '/trouver-un-praticien'
})

async function copyMessage(msg, index) {
  try {
    await navigator.clipboard.writeText(msg.parts?.[0]?.text || '')
    copiedIndex.value = index
    setTimeout(() => { if (copiedIndex.value === index) copiedIndex.value = -1 }, 1800)
  } catch { /* copie impossible : rien à faire */ }
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isBusy.value || isLimitReached.value) return
  const myEpoch = epochState.value

  // Add user message
  messages.value.push({
    role: 'user',
    parts: [{ text }]
  })

  userInput.value = ''
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
        history: messages.value.slice(0, -1).map(m => ({
          role: m.role,
          parts: m.parts
        }))
      })
    })

    if (response.status === 401) {
        await useSession().logout()
        await navigateTo('/login')
        return
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.statusMessage || 'Network response was not ok');
    }

    if (!response.body) throw new Error('No response body')
    if (myEpoch !== epochState.value) return

    // Prepare AI message bubble
    const aiMsg = {
      role: 'model',
      parts: [{ text: '' }],
      isStreaming: true,
      html: ''
    }
    messages.value.push(aiMsg)
    const aiMsgIndex = messages.value.length - 1

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    isTyping.value = false // Stop thinking animation as soon as we start receiving

    let currentText = ''
    let displayedLength = 0

    // Typing Animation logic
    const startTyping = () => {
      if (typingInterval) return
      typingInterval = setInterval(() => {
        const target = messages.value[aiMsgIndex]
        if (!target || myEpoch !== epochState.value) { clearInterval(typingInterval); typingInterval = null; return }
        const diff = currentText.length - displayedLength
        if (diff > 0) {
          const increment = diff > 300 ? 50 : diff > 100 ? 15 : 4
          displayedLength += increment

          if (displayedLength >= currentText.length) {
            displayedLength = currentText.length
          } else {
             const nextSpace = currentText.indexOf(' ', displayedLength)
             if (nextSpace !== -1 && nextSpace - displayedLength < 10) {
               displayedLength = nextSpace + 1
             }
          }

          const textToParse = currentText.substring(0, displayedLength)
          target.html = formatMessage(textToParse)
          scrollToBottom()
        } else if (!target.isStreaming) {
          clearInterval(typingInterval)
          typingInterval = null
        }
      }, 15)
    }

    startTyping()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (myEpoch !== epochState.value) { reader.cancel().catch(() => {}); return }

      const chunk = decoder.decode(value, { stream: true })
      currentText += chunk
      aiMsg.parts[0].text = currentText
    }

    // Via le tableau réactif : modifier l'objet d'origine ne déclencherait pas l'affichage des pastilles ni du bouton « Voir d'autres praticiens »
    const done = messages.value[aiMsgIndex]
    if (done) done.isStreaming = false

  } catch (error) {
    console.error('Chat Error:', error)
    if (myEpoch !== epochState.value) return
    isTyping.value = false

    let errorText = 'Désolée, une erreur est survenue lors de la communication avec Léya. Veuillez réessayer.'
    if (error.message && (error.message.includes('journalière') || error.message.includes('limite'))) {
      errorText = error.message
    }

    messages.value.push({
      role: 'model',
      parts: [{ text: errorText }],
      isError: true
    })
  } finally {
    if (myEpoch === epochState.value) {
      incrementUsage()
      await nextTick()
      await scrollToBottom()
    }
  }
}

const formatMessage = (text) => renderMarkdown(text)

onMounted(() => {
  loadUsage()
  if (messages.value.length) scrollToBottom()

  if (route.query.q) {
    userInput.value = route.query.q
    sendMessage()

    // Clean up URL without redirecting/reloading (Nuxt 3)
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.replaceState({}, '', url.pathname)
  }
})
// Pas d'interruption au changement de page : la réponse en cours continue de s'écrire dans la conversation conservée
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.send-btn {
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  margin-block: -3px;
  border-radius: 9999px;
  background: #ec7f7a;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color .15s, opacity .15s;
}
.send-btn:hover:not(:disabled) { background: #f1aeab; }
.send-btn:disabled { opacity: .5; cursor: not-allowed; }

/* Markdown : listes à coches, comme dans la maquette */
:deep(.markdown-content p) {
  margin-bottom: 1.75rem;
}
:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-content strong) {
  font-weight: 600;
  color: #012828;
}
:deep(.markdown-content ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.75rem;
}
:deep(.markdown-content ul > li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}
:deep(.markdown-content ul > li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.1rem;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: #d7e7f0 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23156f71' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center / 12px no-repeat;
}
:deep(.markdown-content ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
:deep(.markdown-content ol > li) {
  margin-bottom: 0.5rem;
}
:deep(.markdown-content h1), :deep(.markdown-content h2), :deep(.markdown-content h3) {
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #012828;
  font-size: 1.125rem;
}
:deep(.markdown-content a) {
  color: #156f71;
  text-decoration: underline;
}
</style>
