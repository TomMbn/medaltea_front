<template>
  <LegalPage title="Politique de confidentialité">
    <p>
      {{ legal.brandName }} accorde une grande importance à la protection de vos données personnelles. Cette politique
      explique quelles données nous collectons, pourquoi, et comment exercer vos droits, conformément au
      Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
    </p>

    <h2>Responsable du traitement</h2>
    <p>
      L'éditeur du site {{ legal.siteUrl }} (identité communiquée à l'hébergeur, voir les
      <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>). Contact :
      <a :href="`mailto:${legal.dpoEmail}`">{{ legal.dpoEmail }}</a>.
    </p>

    <h2>Données collectées et finalités</h2>
    <table>
      <thead>
        <tr><th>Finalité</th><th>Données</th><th>Base légale</th><th>Durée de conservation</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Création et gestion du compte</td>
          <td>Adresse email, mot de passe (chiffré)</td>
          <td>Exécution du contrat</td>
          <td>Durée du compte, puis suppression à la demande</td>
        </tr>
        <tr>
          <td>Assistant virtuel (chatbot)</td>
          <td>Messages que vous saisissez, pouvant contenir des informations de santé</td>
          <td>Votre consentement explicite</td>
          <td>Non conservés par {{ legal.brandName }} : ils sont traités le temps de la réponse</td>
        </tr>
        <tr>
          <td>Authentification et sécurité</td>
          <td>Cookies de session, données techniques de connexion</td>
          <td>Intérêt légitime / exécution du contrat</td>
          <td>7 jours (cookies de session)</td>
        </tr>
        <tr>
          <td>Échanges avec notre équipe</td>
          <td>Email et contenu de votre message</td>
          <td>Intérêt légitime</td>
          <td>3 ans après le dernier contact</td>
        </tr>
      </tbody>
    </table>

    <h2>Données de santé et assistant virtuel</h2>
    <p>
      Les messages envoyés à l'assistant virtuel peuvent révéler des informations relatives à votre santé, qui sont des
      données sensibles. Nous vous recommandons de ne pas y communiquer d'informations qui vous identifient directement.
      Ces messages sont traités avec votre consentement explicite, que vous pouvez retirer à tout moment, et sont
      transmis à notre sous-traitant Google (modèle Gemini) pour générer les réponses. {{ legal.brandName }} ne
      conserve pas ces conversations ; Google peut toutefois les traiter selon ses propres conditions d'utilisation de l'API.
    </p>

    <h2>Destinataires et sous-traitants</h2>
    <ul>
      <li>Google (Gemini) : génération des réponses de l'assistant virtuel.</li>
      <li>{{ legal.hostName }} : hébergement du site.</li>
      <li>Serveur applicatif de l'éditeur : gestion des comptes et de l'authentification.</li>
    </ul>
    <p>
      Vos données ne sont pas vendues. Si un sous-traitant est situé hors de l'Union européenne, le transfert est
      encadré par des garanties appropriées (clauses contractuelles types ou décision d'adéquation).
    </p>

    <h2>Cookies</h2>
    <p>
      {{ legal.brandName }} utilise uniquement des cookies strictement nécessaires au fonctionnement du service
      (authentification et maintien de votre session). Ils ne nécessitent pas de consentement. Aucun cookie publicitaire
      ou de mesure d'audience n'est déposé sans votre accord préalable.
    </p>

    <h2>Vos droits</h2>
    <p>
      Vous disposez des droits d'accès, de rectification, d'effacement, d'opposition, de limitation, de portabilité,
      ainsi que du droit de retirer votre consentement et de définir des directives post-mortem. Pour les exercer,
      écrivez à <a :href="`mailto:${legal.dpoEmail}`">{{ legal.dpoEmail }}</a>. Nous répondons dans un délai d'un mois.
    </p>
    <p>
      Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
      <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
    </p>

    <h2>Sécurité</h2>
    <p>
      Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données
      (chiffrement des échanges, mots de passe protégés, accès restreints).
    </p>

    <h2>Modification de la politique</h2>
    <p>Cette politique peut évoluer. La date de dernière mise à jour figure en haut de cette page.</p>
  </LegalPage>
</template>

<script setup>
import { legal } from '~/data/legal'

useSeoMeta({
  title: 'Politique de confidentialité — Léya',
  description: 'Comment Léya collecte, utilise et protège vos données personnelles, y compris celles échangées avec l\'assistant virtuel.',
})
</script>
