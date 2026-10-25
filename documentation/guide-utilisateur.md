# Guide d'utilisation

Ce guide présente Léya du point de vue de ses trois profils : **patient** (ou visiteur), **praticien** et **administrateur**. Site : <https://leya-sante.fr>.

## 1. Visiteur et patient

### Sans compte
- **Assistant IA** (`/chatbot`) : décrivez ce que vous ressentez ; l'assistant propose des médecines douces adaptées et, si vous l'acceptez, des praticiens proches. Il ne pose aucun diagnostic. En cas d'urgence, il renvoie vers le 15. La conversation reste dans votre navigateur et disparaît à la fermeture de l'onglet.
- **Pages de médecines** (`/medecines`) : présentation de chaque pratique, avec les praticiens associés.
- **Trouver un praticien** (`/trouver-un-praticien`) : recherche par ville (rayon de 15 km), par nom ou par médecine, en liste ou sur la **carte**. Si la ville est inconnue, le site propose de chercher un praticien portant ce nom.
- **Fiche praticien** : présentation, adresse, prestations, horaires et disponibilités.
- **Réservation sans compte** : choisir un créneau, indiquer nom, e-mail et un motif facultatif (500 caractères au plus), puis valider le contrôle anti-robot. Le rendez-vous peut être exporté en iCal.

### Avec un compte
1. **Créer un compte** (`/register`), puis se connecter (`/login`).
2. **Mes rendez-vous** : suivre les demandes (en attente, confirmé, refusé, autre créneau proposé), annuler, exporter en iCal.
3. **Mon compte** : préférences de recherche (ville, rayon), notifications, **export** de toutes vos données et **suppression** du compte, mesure d'audience (droit d'opposition).

## 2. Praticien

### S'inscrire
`/praticiens-pro` présente l'offre (gratuite pendant le lancement). Le bouton d'inscription ouvre le parcours `/inscription-pro` : identité, profession, puis création du compte. Une fiche existante peut être **revendiquée** ; elle est alors vérifiée par l'administration (badge « Profil vérifié »).

**Fiche déjà répertoriée à son nom** : si une fiche existante ressemble à la nouvelle (nom et ville, SIREN, RPPS ou téléphone), la nouvelle fiche reste masquée de l'annuaire et le tableau de bord `/pro` propose un choix :
- **Reprendre et modifier cette fiche** : le praticien garde la fiche existante ; sa nouvelle fiche y est fusionnée puis supprimée ;
- **Repartir de ma nouvelle fiche** : la nouvelle fiche remplace l'existante, qui est supprimée ; sa note Google et ses informations manquantes (SIRET, etc.) sont reprises ;
- **Aucune de ces fiches n'est la mienne** : la fiche est publiée (refusé si la fiche existante a le même nom et la même adresse).

Les deux premiers choix sont vérifiés par l'administration. Dans tous les cas, il ne reste qu'une fiche : l'adresse de la fiche supprimée redirige vers celle qui reste. Le même choix est proposé quand un praticien qui a déjà sa fiche en revendique une autre.

### Découvrir sans s'engager
`/demo` ouvre l'espace praticien avec des **données fictives**, entièrement dans le navigateur. Rien n'est envoyé au serveur ; un bandeau permet de quitter la démo.

### Espace praticien (`/pro`)
| Page | Usage |
|---|---|
| Tableau de bord | Demandes à traiter, prochains rendez-vous |
| Agenda | Vues jour, semaine, mois ; bouton pour s'abonner à l'agenda |
| Rendez-vous | Confirmer, refuser ou proposer un autre créneau |
| Ma fiche | Modifier la fiche avec aperçu en direct, vérifier sa complétude |
| Horaires | Plages d'ouverture hebdomadaires |
| Absences | Congés et indisponibilités ponctuelles |
| Prestations | Durée, tarif, description |
| Statistiques | Nombre de vues de la fiche |
| Paramètres | Lien d'abonnement iCal (à coller dans Google Agenda, Apple Calendrier, Outlook), notifications push |

**Notifications** : dans Paramètres, activez les notifications pour être prévenu d'une nouvelle demande. Sur mobile, installez d'abord le site sur l'écran d'accueil (PWA).

## 3. Administrateur

Le rôle est attribué côté serveur (aucune inscription publique). Après connexion, `/admin` donne accès à :
- **Revendications** : approuver ou refuser les demandes de rattachement d'un praticien à une fiche. Chaque demande indique ce que fera l'approbation : reprise de la fiche, ou remplacement par la fiche du demandeur.
- **Fiches** : consulter les fiches et le badge « Profil vérifié ».

## 4. Installer l'application (PWA)
- **Android / Chrome** : menu → « Installer l'application ».
- **iPhone / Safari** : Partager → « Sur l'écran d'accueil ».
- **Ordinateur** : icône d'installation dans la barre d'adresse.

## 5. Questions fréquentes
- *L'assistant a-t-il accès à mes données ?* Non, la conversation n'est pas enregistrée sur le serveur.
- *Ma position est-elle utilisée ?* Seulement si vous l'autorisez, pour proposer des praticiens proches ; sinon la ville de vos préférences ou une saisie manuelle.
- *Comment supprimer mon compte ?* Mon compte → Supprimer. L'export des données est disponible au même endroit.
