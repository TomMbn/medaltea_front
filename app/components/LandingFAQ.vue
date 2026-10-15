<template>
  <section class="landing-faq mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] pb-20 lg:pb-28" aria-labelledby="faq-title">
    <div class="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-12 lg:gap-[100px] items-start">
      <!-- Titre + bloc d'aide -->
      <div>
        <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-5">FAQ</p>
        <h2 id="faq-title" class="font-unbounded font-normal text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.15] text-vert-900">Vos questions,<br />nos réponses</h2>
        <p class="mt-8 text-[17px] lg:text-[20px] leading-snug text-neutre-600 max-w-[440px]">Vous ne trouvez pas votre réponse ? Posez votre question à Léya, ou écrivez à l’équipe.</p>

        <div class="relative mt-32 lg:mt-[172px] max-w-[480px]">
          <div class="absolute z-0 w-[150px] sm:w-[223px] right-[2%] sm:right-auto sm:left-[259px] -top-[130px] sm:-top-[165px] -scale-x-100 pointer-events-none" aria-hidden="true"><img src="/images/landing/mascotte-panda.webp" alt="" width="223" height="193" class="w-full h-auto" /></div>
          <div class="relative z-10 bg-white rounded-[28px] shadow-douce p-6 sm:p-8">
            <p class="font-unbounded text-[18px] sm:text-[20px] text-vert-900">Une autre question ?</p>
            <form class="mt-6 bg-bleu-50 rounded-full pl-5 pr-1.5 py-1.5 flex items-center gap-2.5 focus-ring-within" @submit.prevent="ask">
              <input v-model="question" type="text" aria-label="Votre question à Léya" placeholder="Posez votre question à Léya…" class="focus-in-parent flex-1 min-w-0 bg-transparent text-[16px] sm:text-[18px] text-vert-900 placeholder-neutre-600 focus:outline-none" />
              <button type="submit" aria-label="Envoyer la question à Léya" class="w-11 h-11 shrink-0 rounded-full bg-corail-500 text-white flex items-center justify-center hover:bg-[#f1aeab] transition-colors"><ArrowRight :size="18" aria-hidden="true" /></button>
            </form>
            <a href="mailto:contact@leya-sante.fr" class="mt-6 inline-flex items-center gap-2 text-[18px] font-semibold text-vert-900 hover:underline">Écrire à l’équipe <ArrowUpRight :size="18" aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <!-- Accordéon -->
      <div class="lg:pt-2">
        <div v-for="(item, index) in faqs" :key="item.question" class="border-b border-neutre-200 first:pt-0">
          <h3>
            <button
              type="button"
              class="w-full flex items-start justify-between gap-6 text-left py-6"
              :aria-expanded="openIndex === index"
              :aria-controls="`faq-panel-${index}`"
              @click="toggle(index)"
            >
              <span class="font-unbounded font-normal text-[18px] sm:text-[22px] lg:text-[26px] leading-tight text-vert-600">{{ item.question }}</span>
              <span class="shrink-0 text-[26px] leading-none text-black" aria-hidden="true">{{ openIndex === index ? '−' : '+' }}</span>
            </button>
          </h3>
          <div
            :id="`faq-panel-${index}`"
            :inert="openIndex !== index || undefined"
            class="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
            :class="openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <p class="pb-6 text-[16px] lg:text-[18px] leading-relaxed text-black max-w-[603px]">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'

const openIndex = ref(0)
const toggle = (index) => { openIndex.value = openIndex.value === index ? null : index }

const question = ref('')
const asking = ref(false)
function ask() {
  const text = question.value.trim()
  if (!text || asking.value) return
  asking.value = true
  navigateTo({ path: '/chatbot', query: { q: text } })
}

const faqs = [
  {
    question: 'Comment choisir le bon praticien ?',
    answer: "Recherchez par ville et par spécialité, puis consultez la fiche de chaque praticien : prestations, tarifs, horaires et adresse. Vous pouvez aussi demander conseil à l'assistant Léya pour identifier la discipline qui correspond à votre besoin. Léya ne remplace pas un avis médical.",
  },
  {
    question: 'Quels sont les délais de prise de rendez-vous ?',
    answer: "Vous voyez en direct les créneaux libres de chaque praticien et vous réservez en quelques clics. Les disponibilités varient d'un praticien à l'autre.",
  },
  {
    question: 'Puis-je annuler une consultation ?',
    answer: "Oui, vous pouvez annuler un rendez-vous à venir depuis « Mes rendez-vous ». Les conditions d'annulation (délai, éventuels frais) sont celles de chaque praticien : renseignez-vous auprès de lui avant de réserver.",
  },
  {
    question: 'Léya est-elle gratuite ?',
    answer: "Oui, l'assistant Léya et la recherche de praticiens sont gratuits pour les patients. Le tarif d'une séance est fixé par chaque praticien et affiché sur sa fiche.",
  },
  {
    question: 'Pourquoi Léya ne recommande aucun produit ?',
    answer: "Léya est un assistant d'orientation : il vous aide à comprendre un besoin et à trouver une discipline ou un praticien, sans vendre ni recommander de produit ou de marque.",
  },
]

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }),
  }],
})
</script>
