<template>
  <section class="hero-section relative" :class="{ 'opacity-0 scale-95 pointer-events-none transition-all duration-500': isSubmitting }">
    <img src="/images/landing/hero-ellipse.svg" alt="" aria-hidden="true" class="hidden lg:block absolute pointer-events-none select-none" style="left: -22%; top: 264px; width: 40.8%; animation: none;" />
    <div class="hero-container relative">
      
      <!-- Left Content -->
      <div class="hero-content">
        <h1 class="hero-title">
          Trouvez des <br class="lg-br" />
          solutions naturelles <br class="lg-br" />
          pour votre <span class="text-rose">bien-être</span>
        </h1>

        <p class="hero-lead">
          Décrivez votre besoin à Léya, notre assistant IA : il vous oriente vers les médecines douces et les praticiens adaptés.
        </p>

        <!-- Search Bar Area Wrapper -->
        <div class="search-bar-wrapper">
          <!-- Mascotte -->
          <div class="absolute z-20 pointer-events-none right-4 lg:right-[11px] bottom-full mb-[-4px] lg:mb-[-27px] w-[80px] lg:w-[223px]" aria-hidden="true">
            <div class="-scale-x-100">
              <NuxtImg
                src="/images/landing/mascotte-panda.webp"
                alt=""
                class="w-full h-auto"
                width="223"
                height="193"
                loading="lazy"
                placeholder
              />
            </div>
          </div>

          <!-- Main Search/Input Box Wrapper (Gradient Border) -->
          <div class="relative w-full p-[3px] rounded-[20px] isolate flex flex-col min-h-[140px] lg:min-h-[177px]">
            <!-- 3px Gradient Border Layer -->
            <div 
              class="absolute inset-0 rounded-[20px] -z-10"
              style="background: linear-gradient(90deg, #EC7F7A 0%, #FFFFFF 47%, #90BAD1 100%)"
            ></div>
            
            <!-- White Inner Container -->
            <div class="flex-1 bg-white rounded-[17.5px] flex flex-col p-6 justify-between shadow-xl focus-ring-within">
              <!-- Input Row -->
              <div class="flex items-center gap-4">
                <textarea 
                  v-model="userInput"
                  aria-label="Votre message à Léya"
                  :rows="1"
                  @keydown.enter.prevent="handleSubmit"
                  class="focus-in-parent flex-1 text-[18px] sm:text-[22px] lg:text-[26px] border-none focus:ring-0 focus:outline-none placeholder-neutre-500 text-vert-900 resize-none py-2 bg-transparent font-sans w-full overflow-hidden min-h-[3.6rem] sm:min-h-0"
                  placeholder="Je n’arrive plus à m’endormir, qui consulter ?"
                ></textarea>
                
                <button 
                  aria-label="Envoyer le message"
                  @click="handleSubmit"
                  class="w-11 h-11 rounded-full bg-corail-500 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:bg-[#f1aeab] transition-all shrink-0 cursor-pointer"
                >
                  <ArrowUp :size="20" stroke-width="3" />
                </button>
              </div>

              <!-- Suggestion Chips -->
              <div class="flex flex-wrap gap-2 lg:gap-[22px] mt-auto">
                <button 
                  v-for="chip in suggestions" 
                  :key="chip.text"
                  @click="handleSuggestion(chip.text)"
                  class="min-h-[44px] lg:min-h-[61px] px-4 lg:px-[18px] bg-white border border-neutre-200 hover:bg-bleu-50 rounded-leya-m text-[15px] lg:text-[20px] text-black transition-colors flex items-center cursor-pointer"
                >
                  <span class="font-sans">{{ chip.text }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Réassurance (seulement ce qui est vrai : l'accès à l'assistant demande un compte, donc pas de « sans inscription ») -->
          <ul class="reassurance" aria-label="Points de confiance">
            <li><Check :size="18" aria-hidden="true" /> Gratuit</li>
            <li><Check :size="18" aria-hidden="true" /> Échanges non enregistrés par Léya</li>
          </ul>
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
            loading="lazy"
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
            loading="lazy"
            sizes="sm:60vw md:50vw lg:600px"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp, Check } from 'lucide-vue-next'

const userInput = ref('')
const isSubmitting = ref(false)
const suggestions = [
  { text: 'Soulager mon stress' },
  { text: 'Mieux dormir' },
  { text: 'Comprendre une douleur' },
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
  display: flex;
  align-items: center;
}

.hero-container {
  width: calc(100% - 2rem);
  max-width: 1328px;
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
  color: var(--corail-500);
}

.hero-lead {
  font-size: 18px;
  line-height: 1.3;
  color: #000;
  max-width: 658px;
  margin-top: -8px;
}
@media (min-width: 1024px) { .hero-lead { font-size: 20px; margin-top: -16px; } }
@media (min-width: 1280px) { .hero-lead { font-size: 24px; } }

.reassurance {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-top: 20px;
  padding-left: 10px;
  color: var(--vert-600);
  font-weight: 500;
  font-size: 16px;
}
.reassurance li { display: inline-flex; align-items: center; gap: 8px; }

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
  border-radius: var(--rayon-m);
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
    min-height: 100svh;
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
    font-size: clamp(36px, 3.6vw, 56px);
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

  /* Fluide jusqu'à 54 px : à 54 px fixes le titre passait sur 5 lignes entre 1280 et 1340 px et repoussait la carte hors de l'écran */
  .hero-title {
    font-size: clamp(40px, 3.65vw, 56px);
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

/* Écrans peu hauts (portables, barre de favoris, zoom du navigateur) : la carte « Demander à Léya » reste visible sans défiler */
@media (max-width: 1023px) {
  .search-bar-wrapper {
    margin-top: 88px;
  }
}

@media (min-width: 1024px) and (max-height: 760px) {
  .hero-section {
    padding-top: 108px;
    padding-bottom: 40px;
  }

  .hero-content {
    padding-top: 32px;
  }

  .search-bar-wrapper {
    margin-top: 40px;
  }
}

/* 1024 à 1279 px : la mascotte (223 px de haut) ne doit pas recouvrir le paragraphe */
@media (min-width: 1024px) and (max-width: 1279px) {
  .search-bar-wrapper {
    margin-top: 190px;
  }
}
</style>
