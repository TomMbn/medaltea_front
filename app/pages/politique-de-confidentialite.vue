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
      <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>.
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
          <td>Mesure d'audience anonyme</td>
          <td>Pages visitées, type d'appareil, pays, provenance. Aucune donnée personnelle ni identifiant persistant</td>
          <td>Intérêt légitime</td>
          <td>Statistiques agrégées uniquement</td>
        </tr>
        <tr>
          <td>Recherche « autour de moi » (facultative)</td>
          <td>Position approximative de votre appareil (arrondie à environ 1 km), uniquement si vous l'autorisez dans votre navigateur</td>
          <td>Votre consentement</td>
          <td>Non conservée : utilisée le temps de la recherche pour trier les praticiens par distance</td>
        </tr>
        <tr>
          <td>Présentation de fiches de praticiens dans l'annuaire</td>
          <td>Nom, prénom, spécialités, adresse et téléphone professionnels, site web. Informations professionnelles publiques ou fournies par le praticien</td>
          <td>Intérêt légitime (faciliter la recherche d'un praticien) ; pour une fiche gérée par le praticien, exécution du contrat</td>
          <td>Tant que la fiche est en ligne ; suppression sur demande</td>
        </tr>
        <tr>
          <td>Revendication d'une fiche par un praticien</td>
          <td>Message, numéro RPPS et/ou SIRET (facultatifs), identité du compte demandeur</td>
          <td>Intérêt légitime (vérifier l'identité du demandeur)</td>
          <td>Le temps de l'instruction de la demande, puis un an après la décision</td>
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

    <h2>Fiches de praticiens créées par {{ legal.brandName }}</h2>
    <p>
      {{ legal.brandName }} peut présenter dans son annuaire des fiches de praticiens créées à partir d'informations
      professionnelles accessibles publiquement ou transmises par le praticien (nom, spécialités, adresse et téléphone
      professionnels). La source est indiquée sur la fiche lorsqu'elle existe.
    </p>
    <p>
      Ces fiches ne permettent pas la prise de rendez-vous en ligne tant que le praticien n'a pas revendiqué sa fiche.
      Les informations affichées sont celles que le praticien rend lui-même publiques dans le cadre de son activité
      professionnelle.
    </p>
    <p>
      <strong>Vous êtes concerné par une fiche ?</strong> Vous pouvez à tout moment demander sa correction ou son retrait,
      ou vous opposer à son affichage, en écrivant à
      <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a> en indiquant l'adresse de la fiche.
      Nous répondons sans retard injustifié et au plus tard dans un délai d'un mois. La fiche est retirée de l'annuaire
      et des moteurs de recherche dès la prise en compte de la demande.
    </p>
    <p>
      Vous pouvez également revendiquer votre fiche depuis celle-ci : après vérification par l'équipe {{ legal.brandName }},
      vous en devenez le gestionnaire et pouvez la compléter.
    </p>

    <h2>Destinataires et sous-traitants</h2>
    <ul>
      <li>Google (Gemini) : génération des réponses de l'assistant virtuel.</li>
      <li>{{ legal.hostName }} : hébergement du site (partie visible par les internautes).</li>
      <li>Base Adresse Nationale (data.gouv.fr) : saisie assistée de l'adresse du cabinet à l'inscription des praticiens, via notre serveur (seule l'adresse tapée est transmise).</li>
      <li>Umami (Umami Software, Inc.) : mesure d'audience anonyme, sans cookie.</li>
      <li>{{ legal.backHostName }} (France) : hébergement de l'API et de la base de données, où sont stockés les comptes, les rendez-vous et les fiches.</li>
    </ul>
    <p>
      Vos données ne sont pas vendues. Si un sous-traitant est situé hors de l'Union européenne, le transfert est
      encadré par des garanties appropriées (clauses contractuelles types ou décision d'adéquation).
    </p>

    <h2>Cookies</h2>
    <p>
      {{ legal.brandName }} utilise uniquement des cookies strictement nécessaires au fonctionnement du service
      (authentification et maintien de votre session). Ils ne nécessitent pas de consentement. La mesure d'audience
      est réalisée avec Umami, sans cookie ni identifiant persistant et sans recoupement entre sites. Aucun cookie
      publicitaire n'est déposé.
    </p>

    <h2>Vos droits</h2>
    <p>
      Vous disposez des droits d'accès, de rectification, d'effacement, d'opposition, de limitation, de portabilité,
      ainsi que du droit de retirer votre consentement et de définir des directives post-mortem. Pour les exercer,
      écrivez à <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>. Nous répondons dans un délai d'un mois.
    </p>
    <p>
      Pour les praticiens dont une fiche est publiée : droit d'accès, de rectification, d'effacement et d'opposition,
      exercés par email à <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>
      (voir « Fiches de praticiens créées par {{ legal.brandName }} »).
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
useWebPageSchema({ name: "Politique de confidentialité", description: 'Comment Léya collecte, utilise et protège vos données personnelles, y compris celles échangées avec l\'assistant virtuel.', breadcrumbs: [{ name: "Politique de confidentialité", path: '/politique-de-confidentialite' }] })
</script>
