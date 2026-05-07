<template>
  <section class="hero-section" :class="{ 'opacity-0 scale-95 pointer-events-none transition-all duration-500': isSubmitting }">
    <div class="hero-container">
      
      <!-- Left Content -->
      <div class="hero-content">
        <h1 class="hero-title">
          Trouvez des <br class="lg-br" />
          solutions naturelles <br class="lg-br" />
          pour votre <span class="text-rose">bien-être</span>
        </h1>

        <!-- Search Bar Area Wrapper -->
        <div class="search-bar-wrapper">
          <!-- Panda Mascot -->
          <div class="absolute z-20 pointer-events-none right-4 bottom-full mb-[-4px] lg:mb-[-8px] w-[80px] h-[70px] lg:w-[140px] lg:h-[120px]">
            <NuxtImg 
              src="/images/panda-2.png" 
              alt="Léya Panda Mascot"
              class="w-full h-full object-contain"
              width="140"
              height="120"
              format="webp"
              quality="80"
              loading="lazy"
            />
          </div>

          <!-- Main Search/Input Box Wrapper (Gradient Border) -->
          <div class="relative w-full p-[3px] rounded-[20px] isolate flex flex-col min-h-[140px] lg:min-h-[177px]">
            <!-- 3px Gradient Border Layer -->
            <div 
              class="absolute inset-0 rounded-[20px] -z-10"
              style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
            ></div>
            
            <!-- White Inner Container -->
            <div class="flex-1 bg-white rounded-[17.5px] flex flex-col p-6 justify-between shadow-xl">
              <!-- Input Row -->
              <div class="flex items-center gap-4">
                <textarea 
                  v-model="userInput"
                  :rows="1"
                  @keydown.enter.prevent="handleSubmit"
                  class="flex-1 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-[#012828] resize-none py-2 bg-transparent font-sans w-full overflow-hidden"
                  placeholder="Demander à Léya"
                ></textarea>
                
                <button 
                  @click="handleSubmit"
                  class="w-10 h-10 rounded-full bg-[#EC7F7A] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0 cursor-pointer"
                >
                  <ArrowUp :size="20" stroke-width="3" />
                </button>
              </div>

              <!-- Suggestion Chips -->
              <div class="flex flex-wrap gap-2 mt-auto">
                <button 
                  v-for="chip in suggestions" 
                  :key="chip.text"
                  @click="handleSuggestion(chip.text)"
                  class="h-[42px] px-4 bg-white shadow-sm border border-[#D9D9D9] hover:bg-gray-50 rounded-[14px] text-[14px] font-medium text-black transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span class="text-lg">{{ chip.emoji }}</span>
                  <span class="font-sans">{{ chip.text }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Images Stack -->
      <div class="images-stack">
        <!-- Main Large Image (Background/Physically Top) -->
        <div class="image-card main-card">
          <NuxtImg 
            src="/images/hero-section-2.jpeg" 
            alt="Wellness Experience" 
            class="full-img"
            width="800"
            height="626"
            format="webp"
            quality="80"
            fetchpriority="high"
            preload
            placeholder
            sizes="sm:100vw md:80vw lg:800px"
          />
        </div>
        
        <!-- Overlapping Top Left Image (Physically Bottom/Layered on top) -->
        <div class="image-card overlay-card">
          <NuxtImg 
            src="/images/hero-section.jpeg" 
            alt="Natural Therapy" 
            class="full-img"
            width="600"
            height="393"
            format="webp"
            quality="80"
            fetchpriority="high"
            preload
            placeholder
            sizes="sm:60vw md:50vw lg:600px"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const userInput = ref('')
const isSubmitting = ref(false)
const suggestions = [
  { text: 'Soulager mon stress', emoji: '🌿' },
  { text: 'Mieux dormir', emoji: '😴' },
  { text: 'Comprendre une douleur', emoji: '🤕' }
]

const handleSubmit = () => {
  if (!userInput.value.trim() || isSubmitting.value) return
  isSubmitting.value = true
  
  setTimeout(() => {
    navigateTo({
      path: '/chatbot',
      query: { q: userInput.value.trim() }
    })
  }, 400)
}

const handleSuggestion = (text) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  
  setTimeout(() => {
    navigateTo({
      path: '/chatbot',
      query: { q: text }
    })
  }, 400)
}
</script>

<style scoped>
.hero-section {
  padding-top: 124px;
  padding-bottom: 80px;
  background-color: #e0ecf2;
  display: flex;
  align-items: center;
}

.hero-container {
  width: 91.666%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-family: 'Unbounded', cursive;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.1;
  color: #012828;
  margin-bottom: 32px;
}

@media (min-width: 640px) {
  .hero-title {
    font-size: 38px;
    margin-bottom: 40px;
  }
}

.text-rose {
  color: #EC7F7A;
}

.search-bar-wrapper {
  width: 100%;
  position: relative;
  margin-top: 64px;
  z-index: 30;
}

/* CSS below is mostly for the hero layout, specific search styling is now handled by Tailwind classes in the template */

/* Images Stack */
.images-stack {
  display: none;
}

.image-card {
  border-radius: 40px;
  overflow: hidden;
}

.main-card {
  position: absolute;
  right: 0;
  bottom: 80px;
  width: 72%;
  aspect-ratio: 382 / 299;
}

.overlay-card {
  position: absolute;
  left: 0;
  top: 0;
  width: 52%;
  aspect-ratio: 281 / 184;
  z-index: 20;
}

.full-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Utilities */
.lg-br {
  display: none;
}

/* lg (1024px) : row layout, images proportionnelles */
@media (min-width: 1024px) {
  .hero-section {
    min-height: 100vh;
  }

  .images-stack {
    display: block;
    position: relative;
    flex: 0 0 36%;
    aspect-ratio: 11 / 10;
    align-self: flex-start;
    z-index: 20;
    overflow: hidden;
  }

  .hero-container {
    flex-direction: row;
    gap: 40px;
  }

  .hero-title {
    font-size: clamp(36px, 3.6vw, 54px);
  }

  .hero-content {
    flex: 1;
    min-width: 0;
    padding-top: 60px;
  }

  .lg-br {
    display: block;
  }

  .search-bar-wrapper {
    width: min(900px, calc(100% + 80px));
    margin-right: -80px;
  }
}

/* xl (1280px) : design complet */
@media (min-width: 1280px) {
  .hero-container {
    gap: 60px;
  }

  .hero-title {
    font-size: 54px;
  }

  .hero-content {
    padding-top: 81px;
  }

  .search-bar-wrapper {
    width: 900px;
    margin-right: -150px;
  }

  .images-stack {
    flex: 0 0 550px;
    align-self: flex-start;
    /* aspect-ratio 11/10 → height = 550 / 1.1 = 500px */
  }

  .main-card {
    width: 72%;
  }

  .overlay-card {
    width: 54%;
  }
}
</style>
