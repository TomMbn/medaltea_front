<template>
  <div class="bg-bleu-50 text-vert-900 overflow-x-clip">
    <!-- Bandeau : compte patient connecté -->
    <div v-if="route.query.compte === 'patient'" class="fixed top-28 inset-x-0 z-40 px-4 pointer-events-none">
      <p class="pointer-events-auto mx-auto max-w-[760px] bg-white rounded-[16px] shadow-lg border border-amber-200 text-sm px-5 py-4 text-vert-900" role="status">
        Vous êtes connecté avec un compte <strong>patient</strong>. Pour proposer des rendez-vous, créez un compte praticien avec une autre adresse email.
      </p>
    </div>

    <!-- Hero (réplique proportionnelle de la maquette jusqu'à 1728 px) -->
    <section class="pro-hero relative pt-32 pb-16 xl:pb-0" aria-labelledby="pro-hero-title">
      <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="hidden xl:block absolute opacity-30 pointer-events-none select-none rotate-[15deg]" style="animation: none; left: calc(var(--u) * 1482); top: calc(var(--u) * 620); width: calc(var(--u) * 200);" />
      <img src="/images/footer/feuille-3.svg" alt="" aria-hidden="true" class="hidden xl:block absolute opacity-30 pointer-events-none select-none -rotate-[20deg]" style="animation: none; left: calc(var(--u) * 860); top: calc(var(--u) * 18); width: calc(var(--u) * 180);" />
      <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden lg:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />

      <div class="relative mx-auto w-[calc(100%-2rem)] max-w-[1328px] xl:max-w-none xl:w-full xl:px-0">
        <div class="pro-hero-text">
          <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600">Espace praticien</p>
          <h1 id="pro-hero-title" class="mt-4 font-unbounded font-normal text-[32px] sm:text-[44px] xl:text-[56px] leading-[1.23]">
            Recevez des patients
            <span class="block mt-1"><span class="inline-block rounded-full bg-corail-100 px-[22px] pt-[2px] pb-[10px]">déjà orientés</span></span>
            vers votre pratique
          </h1>
          <p class="mt-8 text-[18px] xl:text-[24px] leading-[normal] text-neutre-600 max-w-[620px]">
            Léya oriente les patients vers la bonne médecine, puis vers vous. Votre fiche, votre agenda et vos demandes de rendez-vous : tout votre cabinet au même endroit.
          </p>
          <div class="mt-10 xl:mt-[42px] flex flex-wrap items-center gap-3">
            <NuxtLink to="/inscription-pro" class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full bg-vert-900 text-white text-[16px] font-medium hover:bg-vert-600 transition-colors">
              Créer mon profil gratuitement
              <span class="w-10 h-10 rounded-full bg-corail-500 text-vert-900 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
            </NuxtLink>
            <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro' } }" class="inline-flex items-center min-h-[48px] px-5 rounded-full text-vert-900 text-[16px] font-medium hover:text-vert-600 transition-colors">Se connecter</NuxtLink>
          </div>
          <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[16px] font-medium text-vert-600">
            <li v-for="c in checks" :key="c" class="inline-flex items-center gap-2"><Check :size="16" aria-hidden="true" /> {{ c }}</li>
          </ul>
        </div>

        <!-- Aperçu de l'espace praticien : schéma illustratif, sans donnée réelle ni fictive -->
        <div class="pro-mock hidden xl:block" aria-hidden="true">
          <div class="pro-laptop">
            <div class="pro-screen">
              <div class="pro-side">
                <div class="pro-side-logo"><img src="/images/footer/logo-blanc.svg" alt="" style="animation: none;" /><span>Pro</span></div>
                <span class="pro-nav on">Rendez-vous</span>
                <span class="pro-nav">Ma fiche</span>
                <span class="pro-nav">Horaires</span>
                <span class="pro-nav">Paramètres</span>
              </div>
              <div class="pro-main">
                <p class="pro-h">Vos rendez-vous</p>
                <div class="pro-row"><i class="t"></i><i class="l w1"></i><b class="ok">Confirmé</b></div>
                <div class="pro-row"><i class="t"></i><i class="l w2"></i><b class="ok">Confirmé</b></div>
                <div class="pro-row"><i class="t"></i><i class="l w3"></i><b class="wait">En attente</b></div>
                <p class="pro-h mt">Demandes à confirmer</p>
                <div class="pro-req"><i class="l w1"></i><span class="pro-btn">Accepter</span><span class="pro-btn ghost">Autre créneau</span></div>
                <div class="pro-req"><i class="l w2"></i><span class="pro-btn">Accepter</span><span class="pro-btn ghost">Autre créneau</span></div>
              </div>
            </div>
            <div class="pro-base"></div>
          </div>
          <div class="pro-notif">
            <span class="pro-notif-ico"><CalendarCheck :size="18" /></span>
            <span><strong>Nouvelle demande de RDV</strong><small>Reçue dans votre espace</small></span>
          </div>
          <span class="pro-pill">Gratuit pendant le lancement</span>
        </div>
      </div>
    </section>

    <!-- Pensé pour votre quotidien -->
    <section class="mx-auto w-[calc(100%-2rem)] max-w-[1328px] pt-10 pb-10 xl:pt-[60px] xl:pb-[80px]" aria-labelledby="pro-quotidien-title">
      <div class="relative h-[420px] sm:h-[520px] xl:h-[620px] rounded-[32px] overflow-hidden bg-vert-900">
        <NuxtImg src="/images/pro/photo-quotidien.webp" alt="" class="absolute inset-0 w-full h-full object-cover" width="1328" height="620" format="webp" quality="80" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent to-[55%]"></div>
        <div class="relative px-6 sm:px-10 xl:px-[60px] pt-10 sm:pt-16 xl:pt-[60px]">
          <h2 id="pro-quotidien-title" class="font-unbounded font-normal text-white text-[26px] sm:text-[32px] xl:text-[40px] leading-[normal] max-w-[560px]">Pensé pour votre quotidien de praticien</h2>
          <p class="mt-6 xl:mt-10 text-[18px] xl:text-[20px] text-white max-w-[480px]">Moins d’administratif, plus de temps pour vos patients.</p>
        </div>
      </div>
    </section>

    <!-- Ce que Léya change -->
    <section id="fonctionnement" class="relative scroll-mt-32 pt-12 pb-12 xl:pt-20 xl:pb-[64px]" aria-labelledby="pro-change-title">
      <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="hidden xl:block absolute left-0 bottom-[30px] w-[150px] opacity-30 rotate-[15deg] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="hidden xl:block absolute right-[40px] top-0 w-[160px] opacity-30 -rotate-[20deg] pointer-events-none select-none" style="animation: none;" />
      <div class="relative mx-auto w-[calc(100%-2rem)] max-w-[1328px]">
        <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600">Ce que Léya change</p>
        <h2 id="pro-change-title" class="mt-3 font-unbounded font-normal text-[26px] sm:text-[32px] xl:text-[40px] leading-[normal]">Tout votre cabinet au même endroit</h2>

        <div class="mt-10 xl:mt-[54px] grid gap-4 md:grid-cols-2 xl:grid-cols-[648px_320px_1fr]">
          <div class="md:col-span-2 xl:col-span-1 min-h-[220px] xl:h-[280px] rounded-[28px] bg-vert-600 p-7 flex flex-col justify-between">
            <span class="w-[52px] h-[52px] rounded-full bg-white text-vert-600 flex items-center justify-center"><Compass :size="22" aria-hidden="true" /></span>
            <div>
              <h3 class="text-[20px] text-white">Des patients orientés vers vous</h3>
              <p class="mt-[6px] text-[18px] text-bleu-100">Léya aide les patients à trouver la bonne médecine, puis le praticien près de chez eux : votre fiche est visible dans la recherche par ville et par spécialité.</p>
            </div>
          </div>
          <div class="min-h-[220px] xl:h-[280px] rounded-[28px] bg-white p-7 flex flex-col justify-between">
            <span class="w-[52px] h-[52px] rounded-full bg-bleu-50 text-vert-600 flex items-center justify-center"><CalendarCheck :size="22" aria-hidden="true" /></span>
            <div>
              <h3 class="text-[20px]">Un agenda en ligne</h3>
              <p class="mt-[6px] text-[18px] text-neutre-600">Vos horaires, vos absences et vos demandes de rendez-vous au même endroit.</p>
            </div>
          </div>
          <div class="min-h-[220px] xl:h-[280px] rounded-[28px] bg-corail-100 p-7 flex flex-col justify-between">
            <span class="w-[52px] h-[52px] rounded-full bg-white text-corail-700 flex items-center justify-center"><SlidersHorizontal :size="22" aria-hidden="true" /></span>
            <div>
              <h3 class="text-[20px] text-corail-700">Vous gardez la main</h3>
              <p class="mt-[6px] text-[18px] text-neutre-600">Confirmation automatique ou validation de chaque demande, à votre choix.</p>
            </div>
          </div>

        </div>
        <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[420px_420px_1fr]">
          <div class="relative min-h-[240px] xl:h-[240px] rounded-[28px] overflow-hidden">
            <NuxtImg src="/images/pro/bento-praticien.webp" alt="" class="absolute inset-0 w-full h-full object-cover" width="420" height="240" format="webp" quality="80" loading="lazy" />
            <span class="absolute left-5 bottom-5 inline-flex items-center gap-2 rounded-full bg-white pl-3 pr-4 py-[9px] text-[16px] font-medium"><UserRound :size="14" aria-hidden="true" /> Une fiche à votre image</span>
          </div>
          <div class="min-h-[240px] xl:h-[240px] rounded-[28px] bg-bleu-300 p-7 flex flex-col justify-between ">
            <span class="w-[52px] h-[52px] rounded-full bg-bleu-50 text-vert-900 flex items-center justify-center"><FileText :size="22" aria-hidden="true" /></span>
            <div>
              <h3 class="text-[20px]">Votre pratique, en détail</h3>
              <p class="mt-[6px] text-[18px] text-neutre-600">Spécialités, prestations, tarifs, diplômes et modalités de consultation sur une seule page.</p>
            </div>
          </div>
          <div class="relative min-h-[240px] xl:h-[240px] rounded-[28px] overflow-hidden md:col-span-2 xl:col-span-1">
            <NuxtImg src="/images/pro/bento-seance.webp" alt="" class="absolute inset-0 w-full h-full object-cover" width="456" height="240" format="webp" quality="80" loading="lazy" />
            <span class="absolute left-5 bottom-5 inline-flex items-center gap-2 rounded-full bg-white pl-3 pr-4 py-[9px] text-[16px] font-medium"><Clock :size="14" aria-hidden="true" /> Horaires et absences</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Rejoindre Léya en 3 étapes -->
    <section id="etapes" class="relative scroll-mt-32 bg-vert-600 text-white overflow-hidden" aria-labelledby="pro-steps-title">
      <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="hidden xl:block absolute left-[10px] top-[60px] w-[170px] opacity-20 rotate-[15deg] pointer-events-none select-none" style="animation: none;" />
      <img src="/images/footer/feuille-4.svg" alt="" aria-hidden="true" class="hidden xl:block absolute right-[40px] top-[135px] w-[190px] opacity-20 -rotate-[20deg] pointer-events-none select-none" style="animation: none;" />
      <div class="relative mx-auto w-[calc(100%-2rem)] max-w-[1328px] py-14 xl:pt-[90px] xl:pb-[100px]">
        <h2 id="pro-steps-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] xl:text-[40px] leading-[normal]">Rejoindre Léya en 3 étapes</h2>
        <ol class="mt-10 xl:mt-[86px] grid gap-5 xl:gap-6 md:grid-cols-3">
          <li v-for="(s, i) in steps" :key="s.title" class="bg-white rounded-[28px] p-7 min-h-[200px] xl:h-[240px] flex flex-col gap-3 text-vert-900" :class="s.tilt">
            <span class="text-[40px] leading-[normal] text-corail-500">0{{ i + 1 }}</span>
            <h3 class="text-[20px]">{{ s.title }}</h3>
            <p class="text-[18px] text-neutre-600">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Questions fréquentes -->
    <section id="faq" class="scroll-mt-32 py-14 xl:py-[100px]" aria-labelledby="pro-faq-title">
      <div class="mx-auto w-[calc(100%-2rem)] max-w-[1328px]">
        <h2 id="pro-faq-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] xl:text-[40px] leading-[normal]">Vos questions</h2>
        <div class="mt-8 xl:mt-10 grid gap-3">
          <details v-for="f in faqs" :key="f.q" class="group bg-white rounded-[16px] px-6 py-4">
            <summary class="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-[16px] xl:text-[18px]">
              {{ f.q }}
              <span class="w-8 h-8 shrink-0 rounded-full bg-corail-100 text-corail-700 flex items-center justify-center group-open:rotate-180 transition-transform" aria-hidden="true"><ChevronDown :size="16" /></span>
            </summary>
            <p class="mt-3 text-[16px] text-neutre-600 leading-relaxed max-w-[900px]">{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowUpRight, Check, Compass, CalendarCheck, SlidersHorizontal, UserRound, FileText, Clock, ChevronDown } from 'lucide-vue-next'

const route = useRoute()

const title = 'Praticiens : développez votre activité avec Léya'
const description = 'Créez votre fiche praticien et ouvrez la prise de rendez-vous en ligne : visibilité locale, agenda, gestion des demandes.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://leya-sante.fr/og-image.jpg',
  ogUrl: 'https://leya-sante.fr/praticiens-pro',
  twitterCard: 'summary_large_image',
})

useWebPageSchema({ name: title, description, breadcrumbs: [{ name: 'Espace praticiens', path: '/praticiens-pro' }] })

const checks = ['Inscription en quelques minutes', 'Sans engagement', 'Tout reste modifiable']

const steps = [
  { title: 'Créez votre profil', text: 'Spécialité, modalités, tarifs : quelques minutes suffisent.', tilt: 'md:rotate-[1.5deg]' },
  { title: 'Renseignez vos diplômes', text: 'Vos diplômes et identifiants professionnels s’affichent sur votre fiche.', tilt: 'md:-rotate-1' },
  { title: 'Recevez vos premiers patients', text: 'Votre fiche devient visible dans les recherches et dans Léya.', tilt: 'md:rotate-1' },
]

const faqs = [
  { q: 'Combien coûte Léya pour un praticien ?', a: 'Créer votre fiche et recevoir des demandes de rendez-vous est gratuit pendant le lancement. Toute évolution des conditions sera annoncée à l’avance et précisée dans les conditions générales des praticiens.' },
  { q: 'Quels praticiens peuvent s’inscrire ?', a: 'Les praticiens en médecines alternatives et complémentaires qui exercent à titre professionnel dans l’une des spécialités proposées, et qui disposent des autorisations et assurances requises. Vous certifiez l’exactitude de vos informations à l’inscription.' },
  { q: 'Que voient les patients de mon profil ?', a: 'Votre nom, vos spécialités, l’adresse de votre cabinet, votre téléphone professionnel, votre tarif, les diplômes que vous avez renseignés et vos créneaux disponibles.' },
  { q: 'Puis-je choisir de valider chaque rendez-vous ?', a: 'Oui. Dans vos paramètres, choisissez la confirmation automatique ou la validation manuelle de chaque demande.' },
  { q: 'Puis-je arrêter à tout moment ?', a: 'Oui, vous pouvez demander la modification ou la suppression de votre fiche à tout moment, sans engagement.' },
]
</script>

<style scoped>
.pro-hero { --u: calc(min(100vw, 1728px) / 1728); }
@media (min-width: 1280px) {
  .pro-hero { height: calc(var(--u) * 940); padding-top: 0; }
  .pro-hero-text { position: absolute; left: calc(var(--u) * 200); top: calc(var(--u) * 190); width: calc(var(--u) * 700); }
  .pro-hero-text h1 { font-size: calc(var(--u) * 56); margin-top: calc(var(--u) * 20); white-space: nowrap; line-height: 1.25; }
  .pro-hero-text p:not(:first-child) { font-size: max(18px, calc(var(--u) * 24)); }
}

/* Aperçu de l'espace praticien : 1em = 10 px de la maquette à 1728 px */
.pro-mock { position: absolute; left: calc(var(--u) * 854); top: calc(var(--u) * 230); width: calc(var(--u) * 845); font-size: calc(var(--u) * 10); }
.pro-laptop { transform: rotate(3deg); filter: drop-shadow(0 1.2em 1.6em rgba(1, 40, 40, 0.08)); width: 72.8em; margin: 3em 0 0 1em; }
.pro-screen { display: flex; width: 72.8em; height: 48.1em; padding: 1.4em; background: var(--vert-900); border-radius: 2.4em; box-sizing: border-box; }
.pro-side { width: 11.3em; flex: none; background: var(--vert-600); border-radius: 1.2em 0 0 1.2em; padding: 1.3em .8em; display: flex; flex-direction: column; gap: .4em; }
.pro-side-logo { display: flex; align-items: center; gap: .4em; padding: 0 .5em 1.1em; }
.pro-side-logo img { height: 1.4em; width: auto; }
.pro-side-logo span { background: var(--corail-500); color: var(--vert-900); font-size: .65em; font-weight: 500; padding: .35em .65em; border-radius: 99em; }
.pro-nav { color: #fff; font-size: .73em; font-weight: 600; padding: .65em .8em; border-radius: 1.4em; }
.pro-nav.on { background: #fff; color: var(--vert-900); }
.pro-main { flex: 1; background: var(--bleu-50); border-radius: 0 1.2em 1.2em 0; padding: 2em 2.2em; display: flex; flex-direction: column; gap: .8em; }
.pro-h { font-size: 1.2em; font-weight: 600; color: var(--vert-900); }
.pro-h.mt { margin-top: 1em; }
.pro-row, .pro-req { background: #fff; border-radius: 1em; padding: 1em 1.2em; display: flex; align-items: center; gap: 1.2em; }
.pro-row .t { width: 4em; height: .9em; border-radius: 1em; background: var(--bleu-100); }
.pro-req .l, .pro-row .l { height: .9em; border-radius: 1em; background: var(--bleu-100); }
.l.w1 { width: 14em; } .l.w2 { width: 11em; } .l.w3 { width: 16em; }
.pro-row b { margin-left: auto; font-size: .9em; font-weight: 600; padding: .3em .9em; border-radius: 99em; }
.pro-row b.ok { background: #d9efe5; color: var(--vert-600); }
.pro-row b.wait { background: var(--corail-100); color: var(--corail-700); }
.pro-req .l { margin-right: auto; }
.pro-btn { font-size: .9em; font-weight: 600; background: var(--vert-900); color: #fff; padding: .45em 1em; border-radius: 99em; }
.pro-btn.ghost { background: transparent; color: var(--vert-900); border: 1.5px solid var(--vert-900); }
.pro-base { height: 1.2em; margin: 0 -6em; background: #c8d6dc; border-radius: 0 0 2em 2em; }
.pro-notif { position: absolute; left: 0; bottom: 3em; display: flex; align-items: center; gap: 1.2em; background: var(--vert-600); color: #fff; padding: 1.4em 2em 1.4em 1.4em; border-radius: 2em; transform: rotate(-3deg); box-shadow: 0 1.2em 3.2em rgba(1, 40, 40, 0.12); }
.pro-notif-ico { width: 4.4em; height: 4.4em; border-radius: 50%; background: #fff; color: var(--vert-600); display: flex; align-items: center; justify-content: center; }
.pro-notif strong { display: block; font-size: 1.8em; font-weight: 600; }
.pro-notif small { display: block; font-size: 1.6em; color: var(--bleu-100); }
.pro-pill { position: absolute; right: 1em; top: 0; background: var(--corail-500); color: var(--vert-900); font-size: 1.6em; font-weight: 500; padding: .5em 1em; border-radius: 99em; transform: rotate(-3deg); }

details > summary::-webkit-details-marker { display: none; }
@media (prefers-reduced-motion: reduce) { details > summary span { transition: none; } }
</style>
