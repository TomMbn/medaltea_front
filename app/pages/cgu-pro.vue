<template>
  <LegalPage title="Conditions générales des praticiens">
    <p>
      Ces conditions complètent les <NuxtLink to="/cgu">conditions générales d'utilisation</NuxtLink> et s'appliquent aux praticiens
      qui créent un compte professionnel sur {{ legal.siteUrl }}.
    </p>

    <h2>1. Objet</h2>
    <p>
      {{ legal.brandName }} met à disposition des praticiens en médecines alternatives et complémentaires une fiche de présentation et
      un outil de prise de rendez-vous en ligne. {{ legal.brandName }} n'est pas partie à la relation entre le praticien et ses patients.
    </p>

    <h2>2. Conditions d'inscription</h2>
    <ul>
      <li>Être majeur et exercer, à titre professionnel, une activité correspondant à l'une des spécialités proposées.</li>
      <li>Fournir des informations exactes et les tenir à jour (identité, adresse du cabinet, téléphone, spécialités, tarifs).</li>
      <li>Disposer des autorisations, diplômes, titres et assurances requis pour exercer (notamment une assurance de responsabilité civile professionnelle).</li>
      <li>Ne revendiquer que les titres auxquels vous avez légalement droit : certains titres, comme celui d'ostéopathe, sont réglementés.</li>
    </ul>

    <h2>3. Engagements du praticien</h2>
    <ul>
      <li>Ne faire aucune promesse de guérison ni aucune allégation thérapeutique non démontrée.</li>
      <li>Ne pas inciter un patient à interrompre ou à retarder un suivi médical.</li>
      <li>Honorer les rendez-vous confirmés, ou prévenir le patient dans les meilleurs délais et annuler depuis l'espace praticien.</li>
      <li>Respecter la réglementation applicable à son activité, notamment en matière de secret professionnel et d'information du patient.</li>
    </ul>

    <h2>4. Données des patients</h2>
    <p>
      Les informations transmises par un patient pour préparer un rendez-vous, comme le motif, peuvent concerner sa santé. Le praticien s'engage à
      les utiliser uniquement pour préparer et réaliser la consultation, à ne pas les divulguer et à les protéger. Pour les données qu'il conserve
      dans le cadre de son exercice, il agit en tant que responsable de traitement.
    </p>

    <h2>5. Visibilité et contenu de la fiche</h2>
    <p>
      Les informations de la fiche (nom, spécialités, adresse du cabinet, téléphone professionnel, tarif) sont visibles publiquement. Le praticien peut
      les modifier ou demander la suppression de sa fiche à tout moment à
      <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>.
    </p>
    <p>
      Le praticien peut masquer sa fiche de l'annuaire à tout moment depuis son espace (Paramètres), ou demander son retrait
      définitif à <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>. {{ legal.brandName }} traite cette
      demande au plus tard dans un délai d'un mois.
    </p>

    <h2>6. Revendication d'une fiche</h2>
    <p>
      Si une fiche à votre nom existe déjà dans l'annuaire, vous pouvez en demander la gestion depuis cette fiche, avec un
      compte praticien. Vous pouvez joindre votre numéro RPPS ou SIRET pour faciliter la vérification.
    </p>
    <p>
      Chaque demande est examinée manuellement par l'équipe {{ legal.brandName }}. Une seule demande en attente est possible
      par compte et par fiche. Vous êtes informé de la décision dans votre espace praticien ; en cas de refus, le motif est
      indiqué.
    </p>
    <p>
      {{ legal.brandName }} peut refuser une demande ou retirer la gestion d'une fiche en cas de doute sur l'identité du
      demandeur, d'informations inexactes ou d'usurpation.
    </p>

    <h2>7. Suspension et résiliation</h2>
    <p>
      {{ legal.brandName }} peut suspendre ou supprimer une fiche en cas d'informations inexactes, de manquement à ces conditions ou de signalement
      sérieux. Le praticien peut cesser d'utiliser le service à tout moment.
    </p>

    <h2>8. Tarifs du service</h2>
    <p>L'accès au service est, à la date de mise à jour de ces conditions, gratuit pour les praticiens. Toute évolution tarifaire sera notifiée à l'avance.</p>

    <h2>9. Droit applicable</h2>
    <p>Ces conditions sont soumises au droit français.</p>
  </LegalPage>
</template>

<script setup>
import { legal } from '~/data/legal'

useSeoMeta({
  title: 'Conditions générales des praticiens — Léya',
  description: 'Conditions applicables aux praticiens inscrits sur Léya : engagements, données des patients et visibilité de la fiche.',
})
useWebPageSchema({ name: "Conditions générales des praticiens", description: 'Conditions applicables aux praticiens inscrits sur Léya : engagements, données des patients et visibilité de la fiche.', breadcrumbs: [{ name: "Conditions générales des praticiens", path: '/cgu-pro' }] })
</script>
