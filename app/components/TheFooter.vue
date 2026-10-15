<template>
  <footer class="relative mt-20 lg:mt-40 bg-vert-600 text-white" aria-label="Pied de page">
    <!-- Décor (maquette V5) : masqué sur petits écrans -->
    <div class="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <img v-for="leaf in leaves" :key="leaf.src" :src="leaf.src" alt="" loading="lazy" class="leaf" :style="leaf.style" />
      <img src="/images/footer/illustration-sophrologie.svg" alt="" loading="lazy" class="absolute" style="left: 61.34%; top: 140px; width: 32.4%;" />
    </div>
    <img
      src="/images/footer/mascotte.webp"
      alt=""
      width="355"
      height="420"
      loading="lazy"
      class="hidden lg:block absolute pointer-events-none z-10"
      style="right: 12.8%; top: -150px; width: clamp(220px, 20.55%, 355px); height: auto;"
    />

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px]">
      <!-- Appel à l'action -->
      <div class="pt-14 lg:pt-[140px] pb-12 lg:pb-[100px] border-b border-white/80">
        <h2 class="font-unbounded font-normal text-[28px] sm:text-[36px] lg:text-[44px] xl:text-h1 leading-[1.15] max-w-[760px]">
          <template v-if="isProLanding">Prêt à rejoindre<br />Léya ?</template>
          <template v-else>Parlez à Léya,<br />on vous oriente</template>
        </h2>
        <p class="mt-5 text-lg lg:text-[20px] text-bleu-100 max-w-[560px] leading-snug">
          <template v-if="isProLanding">Créez votre profil gratuitement, sans engagement. Quelques minutes suffisent pour ouvrir votre fiche aux patients.</template>
          <template v-else>Une question sur votre sommeil, votre stress ou une douleur ? Commencez maintenant, c’est gratuit.</template>
        </p>
        <div v-if="isProLanding" class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/inscription-pro" class="pill-btn bg-corail-500 text-vert-900">
            Créer mon profil
            <span class="pill-dot bg-white text-corail-500"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
          <a href="mailto:contact@leya-sante.fr" class="pill-btn bg-white text-vert-900">
            Nous contacter
            <span class="pill-dot bg-vert-900 text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </a>
        </div>
        <div v-else class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/chatbot" class="pill-btn bg-corail-500 text-vert-900">
            Commencer la conversation
            <span class="pill-dot bg-white text-corail-500"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
          <NuxtLink to="/trouver-un-praticien" class="pill-btn bg-white text-vert-900">
            Trouver un praticien
            <span class="pill-dot bg-vert-900 text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
        </div>
      </div>

      <!-- Colonnes -->
      <div class="pt-12 lg:pt-[60px] pb-12 lg:pb-[100px] grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[280px_repeat(4,auto)] lg:justify-between">
        <div class="col-span-2 lg:col-span-1 max-w-[280px]">
          <img src="/images/footer/logo-blanc.svg" alt="Léya" width="89" height="40" class="h-10 w-auto" loading="lazy" />
          <p class="mt-5 text-base text-bleu-100 leading-snug">Des médecines douces mieux comprises, des praticiens de confiance.</p>
          <div class="mt-4 -ml-2.5 flex items-center">
            <a href="https://www.facebook.com/LeyaSante/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" class="social"><Facebook :size="22" aria-hidden="true" /></a>
            <a href="https://www.instagram.com/leya.sante/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" class="social"><Instagram :size="22" aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/company/leya-sante/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" class="social"><Linkedin :size="22" aria-hidden="true" /></a>
            <a href="mailto:contact@leya-sante.fr" aria-label="Nous écrire par e-mail" class="social"><Mail :size="22" aria-hidden="true" /></a>
          </div>
        </div>

        <nav aria-label="Découvrir" class="foot-col">
          <p class="foot-title">Découvrir</p>
          <NuxtLink to="/medecines">Médecines</NuxtLink>
          <NuxtLink to="/chatbot">Parler à Léya</NuxtLink>
        </nav>

        <nav aria-label="Praticiens" class="foot-col">
          <p class="foot-title">Praticiens</p>
          <NuxtLink to="/trouver-un-praticien">Trouver un praticien</NuxtLink>
          <NuxtLink to="/praticiens-pro">Espace praticien</NuxtLink>
          <NuxtLink to="/inscription-pro">Rejoindre Léya</NuxtLink>
        </nav>

        <nav aria-label="Nos médecines" class="foot-col">
          <p class="foot-title">Nos médecines</p>
          <NuxtLink v-for="m in medecines" :key="m.slug" :to="`/medecines/${m.slug}`">{{ m.name }}</NuxtLink>
        </nav>

        <nav aria-label="Léya" class="foot-col">
          <p class="foot-title">Léya</p>
          <a href="mailto:contact@leya-sante.fr">Contact</a>
          <NuxtLink to="/cgu">CGU</NuxtLink>
          <NuxtLink to="/cgu-pro">CGU praticiens</NuxtLink>
        </nav>
      </div>

      <!-- Bas de page -->
      <div class="pb-10 lg:pb-[60px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-base">
        <p class="text-bleu-100 flex flex-wrap items-center gap-x-1 gap-y-0">
          <span class="mr-2">© 2026 Léya</span>
          <NuxtLink to="/mentions-legales" class="foot-inline">Mentions légales</NuxtLink>
          <span aria-hidden="true" class="hidden sm:inline">·</span>
          <NuxtLink to="/politique-de-confidentialite" class="foot-inline">Confidentialité et cookies</NuxtLink>
        </p>
        <p class="font-medium">Léya ne remplace pas un avis médical. Urgence : 15 ou 112.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail } from 'lucide-vue-next'
import { medecines } from '~/data/medecines'

const route = useRoute()
const isProLanding = computed(() => route.path === '/praticiens-pro')

// Feuilles décoratives : position du centre (en % de la largeur du pied de page, en px depuis le haut), largeur et rotation de la maquette (1 728 px de large)
const leafDefs = [
  { n: 1, x: 165.6, y: 267.7, w: 200, r: 10 },
  { n: 2, x: 587, y: 654.8, w: 150, r: -25 },
  { n: 3, x: 978.4, y: 225.5, w: 180, r: 30 },
  { n: 4, x: 1480.8, y: 613.6, w: 220, r: -12 },
  { n: 5, x: 1685.9, y: 60.5, w: 130, r: -40 },
]
const leaves = leafDefs.map(l => ({
  src: `/images/footer/feuille-${l.n}.svg`,
  style: {
    left: `${(l.x / 1728 * 100).toFixed(2)}%`,
    top: `${l.y}px`,
    width: `${(l.w / 1728 * 100).toFixed(2)}%`,
    transform: `translate(-50%, -50%) rotate(${l.r}deg)`,
  },
}))
</script>

<style scoped>
.leaf { position: absolute; height: auto; animation: none; will-change: auto; }
img { animation: none; }

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 4px 4px 4px 24px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 18px;
  white-space: nowrap;
  transition: box-shadow 0.15s, transform 0.15s;
}
.pill-btn:hover { box-shadow: 0 8px 24px rgba(1, 40, 40, 0.25); transform: translateY(-1px); }
@media (prefers-reduced-motion: reduce) { .pill-btn:hover { transform: none; } }
.pill-dot { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; }

.foot-col { display: flex; flex-direction: column; gap: 4px; }
.foot-title { font-weight: 600; font-size: 18px; color: #fff; margin-bottom: 8px; }
.foot-col a { color: var(--bleu-100); font-size: 16px; padding: 6px 0; }
.foot-col a:hover, .foot-inline:hover { color: #fff; text-decoration: underline; }
.foot-inline { padding: 8px 4px; }
.social { color: var(--bleu-100); padding: 10px; display: inline-flex; }
.social:hover { color: #fff; }
</style>
