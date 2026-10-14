<template>
  <section class="landing-concept relative mx-auto w-[calc(100%-1.5rem)] max-w-[1642px] pb-14 lg:pb-24" aria-labelledby="concept-title">
    <!-- Feuille blanche (démarre sous le haut de la photo) -->
    <div class="absolute inset-x-0 top-[160px] lg:top-[290px] bottom-0 bg-white rounded-leya-m shadow-douce" aria-hidden="true"></div>

    <div class="relative mx-auto w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[1328px] pt-6 lg:pt-5">
      <!-- Qu'est-ce que Léya ? -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div class="relative">
          <div class="h-full min-h-[260px] aspect-[4/3] lg:aspect-auto lg:min-h-[501px] rounded-leya-m overflow-hidden">
            <NuxtImg
              src="/images/women-phone.jpeg"
              alt="Femme consultant l'assistant Léya sur son téléphone"
              class="w-full h-full object-cover"
              width="1000"
              height="800"
              format="webp"
              quality="75"
              loading="eager"
              sizes="xs:400px md:800px lg:654px"
            />
          </div>
          <div class="absolute -top-6 -left-3 lg:-left-10 2xl:-left-[76px] lg:top-[53px] w-20 h-20 lg:w-[129px] lg:h-[129px] bg-bleu-300 rounded-full flex items-center justify-center z-10" aria-hidden="true">
            <img src="/images/galet.svg" alt="" class="w-[56%] h-[56%] object-contain" />
          </div>
        </div>

        <div class="bg-vert-600 rounded-leya-m p-7 sm:p-10 lg:px-10 lg:py-[47px] text-white flex flex-col">
          <h2 id="concept-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.15] mb-5">Qu’est-ce que Léya ?</h2>
          <p class="text-[17px] lg:text-[20px] leading-snug mb-7">
            Léya associe un assistant IA et un annuaire de praticiens, au service des médecines douces et de votre bien-être. Trouvez l’orientation dont vous avez besoin en un instant, gratuitement.
          </p>
          <ul class="space-y-4 mb-8">
            <li v-for="item in features" :key="item" class="flex items-center gap-4 text-[17px] lg:text-[20px]">
              <img src="/images/landing/coche.svg" alt="" width="29" height="27" class="w-[29px] h-[27px] shrink-0" />
              <span>{{ item }}</span>
            </li>
          </ul>
          <NuxtLink to="/trouver-un-praticien" class="mt-auto self-start inline-flex items-center gap-[17px] bg-white text-vert-900 text-[18px] lg:text-[20px] rounded-leya-xl px-[30px] py-[16px] lg:py-5 hover:shadow-douce transition-shadow">
            Je consulte <ArrowUpRight :size="18" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>

      <!-- Comment ça marche ? -->
      <h2 id="comment-ca-marche" class="scroll-mt-32 font-unbounded font-normal text-[22px] sm:text-[32px] lg:text-[40px] text-center text-black mt-14 lg:mt-[110px] mb-14 lg:mb-[50px]">Comment ça marche ?</h2>

      <div class="relative grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14 lg:gap-x-[32px]">
        <!-- Étape 1 -->
        <div>
          <div class="step-visual step-link bg-bleu-50 relative flex flex-col justify-end gap-3 lg:gap-5 px-[6.6%] pb-4">
            <div class="absolute z-0 w-[53%] max-w-[223px] left-[43.7%] top-[-19.6%] -scale-x-100 pointer-events-none" aria-hidden="true"><img src="/images/landing/mascotte-panda.webp" alt="" width="223" height="193" class="w-full h-auto" /></div>
            <div class="relative z-10 bg-white rounded-full shadow-douce flex items-center gap-2.5 pl-[18px] pr-1.5 py-1.5">
              <span class="flex-1 min-w-0 truncate text-[15px] sm:text-[16px] text-vert-900">Je dors mal depuis un mois…</span>
              <span class="w-9 h-9 shrink-0 rounded-full bg-corail-500 flex items-center justify-center text-white"><ArrowRight :size="16" aria-hidden="true" /></span>
            </div>
            <div class="relative z-10 flex gap-2">
              <span class="pill-need"><span class="pill-need-icon"><Moon :size="18" aria-hidden="true" /></span> Sommeil</span>
              <span class="pill-need"><span class="pill-need-icon"><Activity :size="18" aria-hidden="true" /></span> Stress</span>
            </div>
          </div>
          <img src="/images/landing/chiffre-1.svg" alt="1" width="53" height="84" class="mt-5 mb-4 h-[64px] lg:h-[84px] w-auto" />
          <h3 class="font-unbounded font-normal text-[20px] lg:text-[26px] leading-tight text-black mb-4 max-w-[320px]">Partagez vos besoins</h3>
          <p class="text-[16px] leading-snug text-black max-w-[340px]">Expliquez à Léya, notre chatbot IA, vos préoccupations de santé, vos symptômes ou vos objectifs de bien-être, avec vos propres mots.</p>
        </div>

        <!-- Étape 2 -->
        <div>
          <div class="step-visual step-link bg-vert-600 relative">
            <div class="absolute left-[5.7%] right-[5.7%] top-[10.8%] bg-white rounded-[18px] px-5 py-[18px] flex flex-col gap-2.5">
              <p class="text-[16px] font-medium text-vert-600">Léya</p>
              <p class="text-[15px] sm:text-[16px] leading-snug text-vert-900">Essayez un rituel du soir sans écran. La sophrologie peut aussi vous aider à retrouver le sommeil.</p>
            </div>
          </div>
          <img src="/images/landing/chiffre-2.svg" alt="2" width="87" height="84" class="mt-5 mb-4 h-[64px] lg:h-[84px] w-auto" />
          <h3 class="font-unbounded font-normal text-[20px] lg:text-[26px] leading-tight text-black mb-4 max-w-[320px]">Recevez des recommandations</h3>
          <p class="text-[16px] leading-snug text-black max-w-[340px]">Obtenez des suggestions personnalisées de thérapies naturelles et de praticiens près de chez vous.</p>
        </div>

        <!-- Étape 3 -->
        <div>
          <div class="step-visual relative">
            <NuxtImg
              src="/images/women-phone.jpeg"
              alt=""
              class="absolute inset-0 w-full h-full object-cover"
              width="842"
              height="520"
              format="webp"
              quality="75"
              loading="lazy"
              sizes="xs:400px md:421px"
            />
            <div class="absolute left-[4.7%] bottom-[7%] bg-white rounded-[18px] flex items-center gap-3 pl-3.5 pr-[18px] py-3">
              <span class="w-10 h-10 rounded-full bg-bleu-50 flex items-center justify-center text-vert-600 shrink-0"><CalendarDays :size="18" aria-hidden="true" /></span>
              <span class="flex flex-col text-[15px] sm:text-[16px] leading-tight">
                <span class="font-medium text-vert-900">Mardi 14 oct. · 10 h 30</span>
                <span class="text-vert-600">Sophrologue · Confirmé</span>
              </span>
            </div>
          </div>
          <img src="/images/landing/chiffre-3.svg" alt="3" width="82" height="80" class="mt-5 mb-4 h-[64px] lg:h-[84px] w-auto" />
          <h3 class="font-unbounded font-normal text-[20px] lg:text-[26px] leading-tight text-black mb-4 max-w-[320px]">Réservez et avancez vers le mieux-être</h3>
          <p class="text-[16px] leading-snug text-black max-w-[340px]">Entrez en contact avec des praticiens, prenez rendez-vous et commencez votre parcours vers un bien-être naturel.</p>
        </div>
      </div>

      <div class="flex justify-center mt-12 lg:mt-14">
        <NuxtLink to="/chatbot" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
          Essayer maintenant
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
      </div>
    </div>

    <img src="/images/landing/bambou.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[12.6%] bottom-[2.6%] w-[12.4%] h-auto pointer-events-none" style="animation: none;" />
  </section>
</template>

<script setup>
import { ArrowUpRight, ArrowRight, Moon, Activity, CalendarDays } from 'lucide-vue-next'

const features = [
  'Conseils personnalisés en médecine douce',
  'Orientation vers des solutions de bien-être adaptées',
  'Accès gratuit et instantané',
]
</script>

<style scoped>
.step-visual {
  width: 100%;
  aspect-ratio: 421 / 260;
  border-radius: 24px;
  overflow: visible;
}
/* Trait corail entre deux visuels : il occupe exactement l'espace de 32 px entre les colonnes */
@media (min-width: 768px) {
  .step-link::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -32px;
    width: 32px;
    height: 2px;
    background: var(--corail-500);
    transform: translateY(-50%);
  }
}
.step-visual > img:not([aria-hidden]) { border-radius: 24px; }
.pill-need {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px 8px 10px;
  font-weight: 500;
  font-size: 16px;
  color: var(--vert-900);
}
@media (min-width: 1024px) { .pill-need { padding: 10px 20px 10px 12px; } .pill-need-icon { width: 40px !important; height: 40px !important; } }
.pill-need-icon {
  width: 36px; height: 36px; border-radius: 999px;
  background: var(--bleu-50);
  display: flex; align-items: center; justify-content: center;
  color: var(--vert-600);
}
</style>
