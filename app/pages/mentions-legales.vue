<template>
  <LegalPage title="Mentions légales">
    <h2>Éditeur du site</h2>
    <p>
      Le site <strong>{{ legal.siteUrl }}</strong> est édité à titre non professionnel par une personne physique qui a
      choisi de rester anonyme, conformément à l'article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance
      dans l'économie numérique. Son identité est communiquée à l'hébergeur du site.
    </p>
    <p>
      Contact : <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>
    </p>

    <h2>Directeur de la publication</h2>
    <p>{{ legal.publicationDirector }}</p>

    <h2>Hébergeur</h2>
    <p>
      Le site est hébergé par <strong>{{ legal.hostName }}</strong>, {{ legal.hostAddress }}
      (<a :href="legal.hostWebsite" target="_blank" rel="noopener noreferrer">{{ legal.hostWebsite }}</a>).
    </p>

    <h2>Propriété intellectuelle</h2>
    <p>
      L'ensemble des contenus du site (textes, images, logos, graphismes, structure) est protégé par le droit
      de la propriété intellectuelle et appartient à {{ legal.brandName }} ou à ses partenaires. Toute reproduction,
      représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.
    </p>

    <h2>Avertissement santé</h2>
    <p>
      {{ legal.brandName }} met en relation des patients et des praticiens en médecines alternatives et complémentaires.
      Les informations du site et les réponses de l'assistant virtuel sont données à titre informatif : elles ne
      constituent ni un diagnostic, ni un avis médical, et ne remplacent pas la consultation d'un professionnel de santé.
      En cas d'urgence, appelez le 15 (SAMU) ou le 112.
    </p>

    <h2>Responsabilité</h2>
    <p>
      {{ legal.brandName }} s'efforce de fournir des informations exactes et à jour, mais ne peut garantir leur exhaustivité.
      Les praticiens référencés exercent sous leur propre responsabilité. Le site peut contenir des liens vers des
      sites tiers dont {{ legal.brandName }} n'est pas responsable du contenu.
    </p>

    <h2>Données personnelles</h2>
    <p>
      Le traitement de vos données est décrit dans notre
      <NuxtLink to="/politique-de-confidentialite">politique de confidentialité</NuxtLink>.
    </p>

    <h2>Droit applicable</h2>
    <p>Les présentes mentions sont soumises au droit français. Tout litige relève des tribunaux français compétents.</p>
  </LegalPage>
</template>

<script setup>
import { legal } from '~/data/legal'

useSeoMeta({
  title: 'Mentions légales — Léya',
  description: 'Mentions légales du site Léya : éditeur, hébergeur, propriété intellectuelle et avertissement santé.',
})
useWebPageSchema({ name: "Mentions légales", description: 'Mentions légales du site Léya : éditeur, hébergeur, propriété intellectuelle et avertissement santé.', breadcrumbs: [{ name: "Mentions légales", path: '/mentions-legales' }] })
</script>
