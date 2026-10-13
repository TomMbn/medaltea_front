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
          <td>
            Pages consultées (sans les paramètres de l'adresse), site de provenance, type d'appareil, navigateur,
            système, langue, pays et ville approximative. L'adresse IP n'est pas conservée
          </td>
          <td>Intérêt légitime</td>
          <td>13 mois, puis suppression automatique</td>
        </tr>
        <tr>
          <td>Statistiques d'usage du service (comptes connectés)</td>
          <td>
            Type d'action et date, rôle (patient ou praticien), identifiant de compte pseudonymisé, identifiant de la
            fiche pour les praticiens. Jamais le contenu des messages, les symptômes, les motifs de rendez-vous,
            l'email ou le nom
          </td>
          <td>Intérêt légitime (amélioration du service)</td>
          <td>13 mois au plus ; supprimées avec votre compte</td>
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

    <h2>Mesure d'audience et statistiques d'usage</h2>
    <p>
      La fréquentation du site est mesurée avec Umami, un logiciel libre installé sur le serveur de
      {{ legal.brandName }} : ces données ne sont transmises à aucun tiers et servent uniquement à produire des
      statistiques. La mesure ne dépose aucun cookie, n'enregistre pas les paramètres des adresses visitées et
      respecte le signal « Do Not Track » de votre navigateur. Votre adresse IP sert seulement à déduire le pays et la
      ville, et à calculer un identifiant de visite renouvelé chaque mois ; elle n'est pas conservée. Les requêtes de
      mesure transitent par notre hébergeur, {{ legal.hostName }}, avant d'atteindre notre serveur.
    </p>
    <AudienceOptOut />
    <p>
      Lorsque vous êtes connecté, nos serveurs enregistrent aussi certaines actions (création de compte, connexion,
      prise ou annulation d'un rendez-vous, envoi d'un message à l'assistant virtuel, limite quotidienne de messages
      atteinte, revendication d'une fiche, suppression du compte), afin de comprendre l'usage du service et de
      l'améliorer. Elles sont associées à un identifiant pseudonymisé, calculé à partir de votre compte, qui ne contient
      ni votre email ni votre nom. Ces statistiques ne contiennent jamais le contenu de vos messages, vos symptômes ni
      le motif de vos rendez-vous. Elles sont conservées 13 mois au plus et supprimées lorsque vous supprimez votre
      compte. Aucun cookie ni traceur n'est utilisé dans votre navigateur pour ce suivi. Vous pouvez vous y opposer en
      écrivant à <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>.
    </p>

    <h2>Destinataires et sous-traitants</h2>
    <ul>
      <li>Google (Gemini) : génération des réponses de l'assistant virtuel.</li>
      <li>{{ legal.hostName }} : hébergement du site et relais des requêtes de mesure d'audience vers notre serveur.</li>
      <li>Base Adresse Nationale (data.gouv.fr) : saisie assistée de l'adresse du cabinet à l'inscription des praticiens, via notre serveur (seule l'adresse tapée est transmise).</li>
      <li>Serveur applicatif de l'éditeur : gestion des comptes, des rendez-vous et de l'authentification, mesure d'audience et statistiques d'usage.</li>
    </ul>
    <p>
      Vos données ne sont pas vendues. Si un sous-traitant est situé hors de l'Union européenne, le transfert est
      encadré par des garanties appropriées (clauses contractuelles types ou décision d'adéquation).
    </p>

    <h2>Cookies</h2>
    <p>
      {{ legal.brandName }} utilise uniquement des cookies strictement nécessaires au fonctionnement du service
      (authentification et maintien de votre session). Ils ne nécessitent pas de consentement. La mesure d'audience
      n'utilise ni cookie ni identifiant stocké sur votre appareil, et produit uniquement des statistiques anonymes,
      sans recoupement entre sites ; seul votre choix de la désactiver est mémorisé dans votre navigateur. Aucun cookie
      publicitaire n'est déposé.
    </p>

    <h2>Vos droits</h2>
    <p>
      Vous disposez des droits d'accès, de rectification, d'effacement, d'opposition, de limitation, de portabilité,
      ainsi que du droit de retirer votre consentement et de définir des directives post-mortem. Pour les exercer,
      écrivez à <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>. Nous répondons dans un délai d'un mois.
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
