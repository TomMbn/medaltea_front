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

Le rôle est attribué côté serveur (aucune inscription publique). L'équipe se connecte sur `/admin`, qui a sa propre page de connexion, distincte de celle des patients et des praticiens : un compte qui n'est pas administrateur y est refusé et aussitôt déconnecté. Une page de l'administration ouverte sans session renvoie vers `/admin`, puis y revient après la connexion. Une fois connecté, `/admin` donne accès à :
- **Revendications** : approuver ou refuser les demandes de rattachement d'un praticien à une fiche. Chaque demande indique ce que fera l'approbation : reprise de la fiche, ou remplacement par la fiche du demandeur.
- **Fiches** : consulter les fiches et le badge « Profil vérifié ».

`/admin` ouvre sur le **cockpit de supervision**. Chaque page affiche des indicateurs agrégés (aucun patient n'est listé), sur 7, 30 ou 90 jours au choix, sauf la page Économie (26 semaines fixes) :

| Page | Ce qu'elle montre |
|---|---|
| **Vue d'ensemble** | Cinq tuiles comparées à la période précédente de même durée (nouveaux patients, nouveaux praticiens, RDV pris, praticiens ayant reçu un RDV, messages à l'assistant), une tuile d'état actuel (demandes en attente) et les éléments à traiter. |
| **Inscriptions** | Comptes créés par semaine, utilisateurs actifs, part des inscrits qui passent à l'action (patient qui réserve, praticien devenu réservable), rétention par semaine d'inscription. |
| **Réservations** | RDV pris et honorés, taux d'annulation et d'absence, délais, taux de remplissage, et offre de l'annuaire par spécialité et par ville. |
| **Demandes** | Demandes de revendication : en attente, reçues, taux d'approbation, délai moyen de traitement. Deux boutons mènent aux pages Revendications et Fiches. |
| **Économie** | Estimations sur 26 semaines : revenu mensuel théorique, churn, CAC, LTV, ROAS. Les hypothèses (prix de l'abonnement, budget marketing) sont affichées au-dessus des chiffres. |

À savoir pour lire ces chiffres :
- Un tiret « – » signifie que l'indicateur n'est pas calculable (pas de donnée, ou source indisponible), jamais zéro.
- Un taux porte sur la période affichée ; « État actuel » désigne une valeur indépendante de la période.
- Les inscriptions et l'usage de l'assistant viennent du suivi pseudonymisé des comptes. S'il est indisponible, la vue d'ensemble l'indique et la page Inscriptions affiche un message.
- Chaque graphique a un lien « Voir les données » qui affiche le tableau des valeurs.
- Pendant un changement de période, les chiffres s'estompent jusqu'à l'arrivée des nouvelles valeurs.
- Dans un graphique, une semaine sans activité apparaît à zéro.
- Les indicateurs ont les mêmes définitions que les tableaux de bord Grafana, accessibles par le lien « Analyse détaillée » en bas de page quand il est configuré.

Définition des indicateurs :

| Indicateur | Définition |
|---|---|
| Période | De minuit (heure de Paris) il y a 6, 29 ou 89 jours jusqu'à maintenant. La période précédente couvre les 7, 30 ou 90 jours d'avant. |
| Nouveaux patients, nouveaux praticiens | Comptes créés sur la période, par rôle. Les comptes opposés au suivi ne sont pas comptés. |
| Utilisateurs actifs | Comptes distincts ayant fait au moins une action suivie sur la période. |
| Patients inscrits ayant réservé | Part des comptes patients créés sur la période qui ont réservé au moins un rendez-vous. |
| Praticiens inscrits devenus réservables | Part des comptes praticiens créés sur la période qui ont ajouté une prestation et des horaires. |
| Rétention | Part des comptes d'une semaine d'inscription revenus 1, 2 et 4 semaines plus tard. |
| RDV pris | Réservations effectuées sur la période (date de réservation). |
| RDV honorés | Rendez-vous de la période (date du rendez-vous) clôturés comme honorés par le praticien. |
| Taux d'annulation | Part des rendez-vous de la période annulés par le patient ou le praticien. |
| Taux d'absence | Part des patients absents parmi les rendez-vous clôturés de la période. |
| Délai entre réservation et RDV | Médiane, en jours, pour les rendez-vous réservés sur la période. |
| Délai de confirmation | Médiane, en heures, entre la réservation et la confirmation par le praticien. |
| Taux de remplissage | Heures de rendez-vous non annulés rapportées aux heures d'ouverture des fiches gérées par un praticien (horaires actuels). |
| Fiches gérées, réservables, sans compte | État actuel de l'annuaire : fiches rattachées à un compte praticien, parmi elles celles qui ont une prestation et des horaires, et fiches répertoriées que personne ne gère. |
| Demandes en attente | Demandes de revendication à traiter, à l'instant présent. |
| Taux d'approbation, délai de traitement | Sur les demandes décidées pendant la période. |
| Revenu mensuel théorique | Fiches gérées par un praticien multipliées par le prix de l'abonnement. Ce n'est pas un chiffre d'affaires encaissé. |
| Churn mensuel | Part des praticiens ayant reçu une réservation un mois donné et aucune le mois suivant. Estimation par l'activité. |
| CAC | Budget marketing de la période divisé par les praticiens devenus clients. Vide sans budget renseigné. |
| LTV | Prix mensuel de l'abonnement divisé par le churn mensuel. |
| ROAS | Revenu des praticiens arrivés sur la période divisé par le budget marketing de la période. |

## 4. Installer l'application (PWA)
- **Android / Chrome** : menu → « Installer l'application ».
- **iPhone / Safari** : Partager → « Sur l'écran d'accueil ».
- **Ordinateur** : icône d'installation dans la barre d'adresse.

## 5. Questions fréquentes
- *L'assistant a-t-il accès à mes données ?* Non, la conversation n'est pas enregistrée sur le serveur.
- *Ma position est-elle utilisée ?* Seulement si vous l'autorisez, pour proposer des praticiens proches ; sinon la ville de vos préférences ou une saisie manuelle.
- *Comment supprimer mon compte ?* Mon compte → Supprimer. L'export des données est disponible au même endroit.
