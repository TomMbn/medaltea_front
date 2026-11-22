<template>
  <div class="relative min-h-screen bg-bleu-50 text-vert-900 font-sans overflow-x-clip">
    <TheNavbar />

    <main class="err relative pt-[128px] sm:pt-[160px] pb-16 xl:pb-24 px-4 flex flex-col items-center gap-5 xl:gap-7 text-center">
      <!-- Décor de la maquette : disques bleus et feuilles tracées (positions en px à 1728 px de large) -->
      <div class="hidden lg:block absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <img src="/images/erreur/fond-gauche.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 41.15); top: calc(var(--u) * 220.2); width: calc(var(--u) * 338.02);" />
        <img src="/images/erreur/feuille-gauche.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 111.17); top: calc(var(--u) * 272.41); width: calc(var(--u) * 198); transform: rotate(18deg);" />
        <img src="/images/erreur/fond-droite.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 1321.82); top: calc(var(--u) * 57.24); width: calc(var(--u) * 415.87);" />
        <img src="/images/erreur/feuille-droite.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 1412.76); top: calc(var(--u) * 127.17); width: calc(var(--u) * 234); transform: rotate(-24deg);" />
        <img src="/images/erreur/fond-bas-gauche.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 235.31); top: calc(var(--u) * 562.94); width: calc(var(--u) * 234.87);" />
        <img src="/images/erreur/feuille-bas-gauche.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 289.74); top: calc(var(--u) * 606.08); width: calc(var(--u) * 126); transform: rotate(-38deg);" />
        <img src="/images/erreur/fond-bas-droite.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 1227.58); top: calc(var(--u) * 639.32); width: calc(var(--u) * 246.76);" />
        <img src="/images/erreur/feuille-bas-droite.svg" alt="" class="deco" style="animation: none; left: calc(var(--u) * 1283.46); top: calc(var(--u) * 683.05); width: calc(var(--u) * 135); transform: rotate(30deg);" />
      </div>

      <p class="relative text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600">Erreur {{ code }} · {{ is404 ? 'Page introuvable' : 'Un problème est survenu' }}</p>

      <!-- 4 · panda · 4 -->
      <!-- Comme dans la maquette, la rangée coupe l'anneau en haut et en bas (grand écran) -->
      <div class="panda-zone relative flex items-center gap-2 lg:overflow-hidden" :aria-label="is404 ? 'Erreur 404' : `Erreur ${code}`" role="img">
        <span v-if="is404" class="digit font-unbounded font-normal leading-[1.214]">4</span>
        <span class="disc relative inline-flex items-center justify-center shrink-0" aria-hidden="true">
          <img src="/images/erreur/anneau.svg" alt="" class="halo absolute max-w-none" width="460" height="460" style="animation: none;" />
          <span class="absolute inset-0 rounded-full bg-corail-500"></span>
          <img src="/images/pro/mascotte-pro.webp" alt="" class="panda relative h-[88%] w-auto" width="254" height="300" />
          <span class="absolute left-1/2 -translate-x-1/2 -top-3 sm:left-[63%] sm:translate-x-0 sm:top-[2%] rounded-full bg-white px-[18px] py-[10px] text-[16px] font-medium leading-[normal] whitespace-nowrap shadow-douce">{{ is404 ? 'On cherche ensemble ?' : 'On réessaie ?' }}</span>
        </span>
        <span v-if="is404" class="digit font-unbounded font-normal leading-[1.214]">4</span>
      </div>

      <h1 class="relative font-unbounded font-normal text-[24px] sm:text-[32px] leading-[normal]">{{ is404 ? 'Cette page est introuvable' : 'Une erreur est survenue' }}</h1>
      <p class="relative max-w-[560px] text-[16px] sm:text-[18px] leading-[normal] text-neutre-600">
        <template v-if="is404">Le lien a peut-être changé, ou l’adresse contient une faute de frappe. Reprenons depuis un endroit connu.</template>
        <template v-else>Un problème est survenu de notre côté. Réessayez dans quelques instants, ou reprenez depuis l’accueil.</template>
      </p>

      <!-- Recherche -->
      <form v-if="is404" class="relative w-full max-w-[560px] flex items-center gap-3 rounded-full bg-white border border-neutre-200 pl-6 pr-2 py-2 focus-within:border-vert-600" role="search" @submit.prevent="search">
        <Search :size="22" class="shrink-0 text-vert-900" aria-hidden="true" />
        <label for="err-q" class="sr-only">Rechercher un praticien ou une médecine douce</label>
        <input id="err-q" v-model="q" type="search" placeholder="Rechercher un praticien ou une médecine douce" class="flex-1 min-w-0 text-ellipsis bg-transparent text-[16px] leading-[normal] text-vert-900 placeholder:text-neutre-600 focus:outline-none" />
        <button type="submit" class="shrink-0 w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center" aria-label="Lancer la recherche"><ArrowUpRight :size="20" aria-hidden="true" /></button>
      </form>

      <div class="relative flex flex-wrap items-center justify-center gap-4">
        <button type="button" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[18px] font-semibold hover:bg-vert-600 transition-colors" @click="home">
          Retour à l’accueil
          <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </button>
        <NuxtLink to="/trouver-un-praticien" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full border-[1.5px] border-vert-900 text-vert-900 text-[18px] font-semibold hover:bg-white transition-colors" @click="clearError()">
          Trouver un praticien
          <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
      </div>

      <!-- Liens utiles -->
      <ul class="relative mt-4 w-full max-w-[760px] grid gap-4 sm:grid-cols-2 text-left">
        <li v-for="l in links" :key="l.to">
          <NuxtLink :to="l.to" class="block h-full rounded-[32px] bg-white p-7 shadow-douce hover:-translate-y-0.5 transition-transform focus-visible:outline-2 focus-visible:outline-vert-600" @click="clearError()">
            <span class="flex w-[52px] h-[52px] items-center justify-center rounded-full bg-bleu-50 text-vert-900" aria-hidden="true"><component :is="l.icon" :size="24" /></span>
            <span class="mt-[14px] block text-[20px] font-medium leading-[normal]">{{ l.title }}</span>
            <span class="mt-[14px] block text-[16px] leading-[normal] text-neutre-600">{{ l.text }}</span>
          </NuxtLink>
        </li>
      </ul>
    </main>

    <TheFooter class="!mt-0" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, ArrowUpRight, Leaf, MessageCircle } from 'lucide-vue-next'

const props = defineProps({ error: Object })
const code = computed(() => props.error?.statusCode || 404)
const is404 = computed(() => code.value === 404)

// Mesure d'audience : pages introuvables et erreurs (l'adresse est enregistrée par la page vue, sans paramètres)
onMounted(() => trackEventWhenReady('page-error', { status: code.value }))
useHead({ htmlAttrs: { lang: 'fr' } })
useSeoMeta({ title: is404.value ? 'Page introuvable — Léya' : 'Erreur — Léya', robots: 'noindex, nofollow' })

// « Ressources » de la maquette est masqué : la page n'existe pas
const links = [
  { to: '/medecines', title: 'Découvrir les médecines', text: 'Sophrologie, naturopathie, hypnothérapie : trouvez ce qui vous correspond.', icon: Leaf },
  { to: '/chatbot', title: 'Parler à Léya', text: 'Décrivez votre situation, le chatbot vous oriente en quelques questions.', icon: MessageCircle },
]

const home = () => clearError({ redirect: '/' })

// Recherche : une médecine connue ouvre sa liste de praticiens, sinon le texte cherche une ville ou un nom
const q = ref('')
const { specialities } = await useSpecialities()
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
function search() {
  const text = q.value.trim()
  const t = norm(text)
  const hit = t.length >= 3 ? specialities.value.find(s => norm(s.name).includes(t) || t.includes(norm(s.name))) : null
  const query = hit ? { specialite: hit.slug } : text ? { q: text } : { tous: '1' }
  clearError({ redirect: `/trouver-un-praticien?${new URLSearchParams(query).toString()}` })
}
</script>

<style scoped>
/* Unité de la maquette (1728 px) : la composition est une réplique proportionnelle, avec des minimums sur petits écrans */
.err { --u: calc(min(100vw, 1728px) / 1728); }
.deco { position: absolute; display: block; height: auto; }
.digit { font-size: clamp(110px, calc(var(--u) * 280), 280px); color: var(--vert-900); }
.disc { --s: clamp(150px, calc(var(--u) * 340), 340px); width: var(--s); height: var(--s); }
.halo { width: calc(var(--s) * 1.353); height: calc(var(--s) * 1.353); left: 50%; top: 50%; transform: translate(-50%, -50%); }
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
