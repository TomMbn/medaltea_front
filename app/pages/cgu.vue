<template>
  <LegalPage title="Conditions générales d'utilisation">
    <h2>1. Objet</h2>
    <p>
      Les présentes conditions encadrent l'accès et l'utilisation du site {{ legal.siteUrl }} et des services
      proposés sous la marque {{ legal.brandName }} (éditeur identifié dans les
      <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>). En créant un compte ou en utilisant le
      site, vous acceptez ces conditions.
    </p>

    <h2>2. Description du service</h2>
    <p>
      {{ legal.brandName }} est une plateforme d'information et de mise en relation entre des patients et des praticiens
      en médecines alternatives et complémentaires. Elle propose notamment des contenus informatifs, un annuaire de
      praticiens et un assistant virtuel basé sur l'intelligence artificielle.
    </p>

    <h2>3. Avertissement : pas de conseil médical</h2>
    <p>
      Les médecines alternatives et complémentaires ne se substituent pas à la médecine conventionnelle. Le contenu du
      site et les réponses de l'assistant virtuel sont fournis à titre informatif, ne constituent pas un diagnostic ni un
      avis médical, et ne doivent pas retarder ou remplacer une consultation médicale. L'assistant virtuel peut commettre
      des erreurs. En cas d'urgence, appelez le 15 (SAMU) ou le 112.
    </p>

    <h2>4. Compte utilisateur</h2>
    <p>
      La création d'un compte est réservée aux personnes majeures. Vous vous engagez à fournir des informations exactes
      et à garder votre mot de passe confidentiel. Vous êtes responsable de l'activité réalisée depuis votre compte.
      Vous pouvez supprimer votre compte à tout moment en nous écrivant à
      <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>.
    </p>

    <h2>5. Rôle de {{ legal.brandName }} vis-à-vis des praticiens</h2>
    <p>
      {{ legal.brandName }} n'est pas partie à la relation entre le patient et le praticien. Les praticiens exercent sous
      leur propre responsabilité, notamment pour leurs qualifications, leurs tarifs et la qualité de leurs prestations.
      Les modalités de prise de rendez-vous, d'annulation et de paiement seront précisées lors de l'ouverture de ce service.
    </p>

    <h2>6. Utilisation acceptable</h2>
    <p>Vous vous engagez à ne pas :</p>
    <ul>
      <li>utiliser le service à des fins illicites ou frauduleuses ;</li>
      <li>tenter de perturber le site, d'y accéder sans autorisation ou d'extraire massivement ses données ;</li>
      <li>usurper l'identité d'un tiers ou publier des contenus illicites ou diffamatoires.</li>
    </ul>
    <p>L'usage de l'assistant virtuel est limité à un nombre de requêtes quotidien.</p>

    <h2>7. Propriété intellectuelle</h2>
    <p>
      Les contenus du site sont protégés et restent la propriété de {{ legal.brandName }} ou de ses concédants. Aucune
      reproduction n'est autorisée sans accord écrit préalable.
    </p>

    <h2>8. Responsabilité</h2>
    <p>
      {{ legal.brandName }} est tenue à une obligation de moyens. Elle ne peut être tenue responsable des dommages
      indirects, de l'indisponibilité temporaire du site, ni de l'usage fait des informations qu'il contient.
    </p>

    <h2>9. Données personnelles</h2>
    <p>
      Vos données sont traitées conformément à notre
      <NuxtLink to="/politique-de-confidentialite">politique de confidentialité</NuxtLink>.
    </p>

    <h2>10. Modification des conditions</h2>
    <p>
      {{ legal.brandName }} peut modifier ces conditions à tout moment. Les utilisateurs seront informés de toute
      modification substantielle.
    </p>

    <h2>11. Droit applicable</h2>
    <p>Les présentes conditions sont soumises au droit français.</p>
  </LegalPage>
</template>

<script setup>
import { legal } from '~/data/legal'

useSeoMeta({
  title: 'Conditions générales d\'utilisation — Léya',
  description: 'Conditions générales d\'utilisation de la plateforme Léya : service, compte utilisateur, responsabilités et avertissement santé.',
})
</script>
