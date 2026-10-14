<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <!-- Bandeau : compte patient connecté -->
    <div v-if="route.query.compte === 'patient'" class="fixed top-28 inset-x-0 z-40 px-4 pointer-events-none">
      <p class="pointer-events-auto mx-auto max-w-[760px] bg-white rounded-[16px] shadow-lg border border-amber-200 text-sm px-5 py-4 text-[#012828]" role="status">
        Vous êtes connecté avec un compte <strong>patient</strong>. Pour proposer des rendez-vous, créez un compte praticien avec une autre adresse email.
      </p>
    </div>

    <!-- Hero -->
    <section class="bg-[#156F71] text-white pt-36 pb-20 px-4">
      <div class="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-white/70 mb-4">Pour les praticiens</p>
          <h1 class="font-unbounded font-bold text-3xl lg:text-5xl leading-tight mb-6">
            Développez votre activité avec <span class="text-[#EC7F7A]">Léya</span>
          </h1>
          <p class="text-lg text-white/85 mb-8 max-w-[520px]">
            Une fiche professionnelle visible par ceux qui cherchent un praticien près de chez eux, et un agenda en ligne pour recevoir leurs demandes de rendez-vous.
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/inscription-pro" class="bg-[#EC7F7A] text-white font-bold px-7 py-3.5 rounded-[14px] hover:brightness-105 transition">
              Créer mon compte praticien
            </NuxtLink>
            <NuxtLink :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro/rendez-vous' } }" class="border-2 border-white text-white font-bold px-7 py-3.5 rounded-[14px] hover:bg-white/10 transition">
              Se connecter
            </NuxtLink>
          </div>
        </div>
        <div class="hidden lg:flex justify-center">
          <img src="/images/panda-standing.webp" alt="" width="300" height="375" class="h-[340px] w-auto drop-shadow-xl" />
        </div>
      </div>
    </section>

    <!-- Bénéfices -->
    <section class="py-16 px-4" aria-labelledby="benefits-title">
      <div class="max-w-[1100px] mx-auto">
        <h2 id="benefits-title" class="font-unbounded font-bold text-2xl lg:text-3xl text-center mb-10 text-[#012828]">Tout pour recevoir vos patients</h2>
        <ul class="grid gap-5 md:grid-cols-3">
          <li v-for="b in benefits" :key="b.title" class="bg-white rounded-[20px] p-6 shadow-sm">
            <span class="w-11 h-11 rounded-full bg-[#e0ecf2] text-[#156F71] flex items-center justify-center mb-4" aria-hidden="true">
              <component :is="b.icon" :size="22" />
            </span>
            <h3 class="font-unbounded font-bold text-base mb-2 text-[#012828]">{{ b.title }}</h3>
            <p class="text-sm text-[#012828]/70 leading-relaxed">{{ b.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="pb-16 px-4" aria-labelledby="steps-title">
      <div class="max-w-[1100px] mx-auto bg-white rounded-[24px] shadow-sm p-8 lg:p-12">
        <h2 id="steps-title" class="font-unbounded font-bold text-2xl lg:text-3xl text-center mb-10 text-[#012828]">Prêt en trois étapes</h2>
        <ol class="grid gap-8 md:grid-cols-3">
          <li v-for="(s, i) in steps" :key="s.title" class="text-center">
            <span class="w-12 h-12 rounded-full bg-[#EC7F7A] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">{{ i + 1 }}</span>
            <h3 class="font-bold mb-1 text-[#012828]">{{ s.title }}</h3>
            <p class="text-sm text-[#012828]/70">{{ s.text }}</p>
          </li>
        </ol>
        <div class="flex justify-center mt-10">
          <NuxtLink to="/inscription-pro" class="bg-[#012828] text-white font-bold px-8 py-3.5 rounded-[14px] hover:bg-[#156F71] transition-colors">
            Créer mon compte praticien
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Questions fréquentes -->
    <section class="pb-16 px-4" aria-labelledby="faq-title">
      <div class="max-w-[760px] mx-auto">
        <h2 id="faq-title" class="font-unbounded font-bold text-2xl lg:text-3xl text-center mb-8 text-[#012828]">Questions fréquentes</h2>
        <div class="grid gap-3">
          <details v-for="f in faqs" :key="f.q" class="group bg-white rounded-[16px] shadow-sm px-6 py-4">
            <summary class="font-semibold text-[#012828] cursor-pointer list-none flex items-center justify-between gap-4">
              {{ f.q }}
              <span class="text-[#156F71] text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
            </summary>
            <p class="text-sm text-[#012828]/70 mt-3 leading-relaxed">{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <div class="w-11/12 max-w-[1100px] mx-auto pb-8">
    </div>
  </div>
</template>

<script setup>
import { Search, CalendarCheck, SlidersHorizontal } from 'lucide-vue-next'

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

const benefits = [
  { icon: Search, title: 'Soyez trouvé près de chez vous', text: 'Votre fiche apparaît dans la recherche par ville et par spécialité, avec vos coordonnées, vos prestations et vos tarifs.' },
  { icon: CalendarCheck, title: 'Un agenda en ligne', text: 'Vos patients réservent sur vos créneaux libres, à toute heure. Vous recevez les demandes dans votre espace.' },
  { icon: SlidersHorizontal, title: 'Vous gardez la main', text: 'Confirmation automatique ou validation de chaque demande, horaires modifiables, absences et congés en quelques clics.' },
]

const steps = [
  { title: 'Créez votre compte', text: 'Renseignez votre fiche et vos spécialités en quelques minutes.' },
  { title: 'Définissez vos horaires', text: 'Ajoutez vos prestations et les plages où vous recevez.' },
  { title: 'Recevez vos rendez-vous', text: 'Les patients réservent, vous confirmez ou ils sont confirmés automatiquement.' },
]

const faqs = [
  { q: 'Quels praticiens peuvent s\'inscrire ?', a: 'Les praticiens en médecines alternatives et complémentaires qui exercent à titre professionnel dans l\'une des spécialités proposées, et qui disposent des autorisations et assurances requises. Vous certifiez l\'exactitude de vos informations à l\'inscription.' },
  { q: 'Que voient les patients de mon profil ?', a: 'Votre nom, vos spécialités, l\'adresse de votre cabinet, votre téléphone professionnel, votre tarif et vos créneaux disponibles. Vous pouvez demander la modification ou la suppression de votre fiche à tout moment.' },
  { q: 'Puis-je choisir de valider chaque rendez-vous ?', a: 'Oui. Dans vos paramètres, choisissez la confirmation automatique ou la validation manuelle de chaque demande.' },
  { q: 'Combien coûte le service ?', a: 'Les conditions tarifaires sont précisées dans les conditions générales des praticiens. Toute évolution est annoncée à l\'avance.' },
]
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
details > summary::-webkit-details-marker { display: none; }
</style>
