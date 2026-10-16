# Analyse d'impact allégée (AIPD)

Document de travail pour le dossier, selon la méthode de la CNIL (description, nécessité et proportionnalité, risques, mesures, validation). Il porte sur les deux traitements qui peuvent faire apparaître des **données de santé** : l'assistant IA (traitement 4 du [registre](donnees-personnelles.md)) et le motif facultatif des rendez-vous (traitements 2 et 3). Il **doit être validé par le responsable du traitement** ; il ne constitue pas un avis juridique.

*Version du 16/10/2026.*

## 1. Pourquoi une analyse d'impact

Les critères du G29 réunis : données sensibles (santé potentielle), personnes vulnérables possibles, usage d'une technologie récente (IA générative) et sous-traitant hors Union européenne. D'où cette analyse, volontairement proportionnée à un projet à ce stade de lancement.

## 2. Description des traitements

| | Assistant IA | Motif de rendez-vous |
|---|---|---|
| Finalité | Orienter vers une médecine douce et proposer des praticiens proches | Permettre au praticien de préparer la séance |
| Données | Messages libres de l'utilisateur, pouvant mentionner symptômes ou situations de santé | Texte facultatif de 500 caractères au plus |
| Personnes | Utilisateurs de l'assistant (visiteurs ou patients) | Patients et invités (réservation sans compte) |
| Où | Mémoire du navigateur ; transit par la route serveur puis Google (Gemini) | Base de l'API (France) |
| Conservation | **Aucune** côté site : la conversation disparaît à la fermeture de l'onglet | Selon l'API ; effaçable par l'invité (lien secret) ou par suppression du compte |
| Destinataires | Google, en tant que sous-traitant | Le praticien concerné |

Cycle de vie de l'assistant : saisie, envoi du message et de l'historique à la route serveur, appel à Gemini, réponse affichée en continu, rien d'enregistré. Voir le diagramme dans [sequences.md](sequences.md).

## 3. Nécessité et proportionnalité

- **Finalité légitime et précise** : orienter, pas diagnostiquer. L'assistant le dit et renvoie vers le 15 en cas d'urgence.
- **Minimisation** : aucun champ de santé obligatoire ; le motif est facultatif et limité ; le site ne stocke pas la conversation ; la position envoyée est arrondie à 1 km et n'est pas transmise à l'assistant.
- **Base légale** : consentement explicite pour l'assistant (avertissement avant saisie) ; consentement distinct `consentHealthData` pour le motif d'une réservation sans compte.
- **Information** : politique de confidentialité, mention « assistant IA », avertissement avant la première saisie.
- **Droits** : export et suppression des données dans « Mon compte » ; effacement par lien secret pour un invité ; opposition aux statistiques.
- **Sous-traitant** : Google (Gemini) ; fonctions du site désormais à Paris. Transfert hors UE à encadrer (voir plan d'action).

## 4. Risques pour les personnes

Échelle : 1 négligeable, 2 limité, 3 important, 4 maximal.

| Risque | Sources et scénarios | Gravité | Vraisemblance | Mesures existantes | Résiduel |
|---|---|---|---|---|---|
| **Accès illégitime** à des messages ou motifs | Compromission d'un compte ; fuite chez le sous-traitant ; lien secret d'invité partagé | 3 | 1 à 2 | Pas de stockage des messages ; jeton `httpOnly` ; liste blanche de routes et validation ; lien invité de 43 caractères non devinable ; clé Gemini côté serveur uniquement ; aucun journal du contenu | **Faible** |
| **Réutilisation par le sous-traitant** (entraînement du modèle) | Conditions d'usage de l'API | 3 | 2 | Appel via l'API (non le grand public) ; à confirmer par écrit : pas d'entraînement sur les données de l'API | **Moyen** tant que non confirmé |
| **Mauvaise orientation** (réponse erronée de l'IA) | Hallucination ; usager qui prend la réponse pour un avis médical | 3 | 2 | Pas de diagnostic ; avertissement ; renvoi vers le 15 ; détection de mots d'urgence ; suggestions limitées aux médecines du site | **Moyen** (risque d'usage, pas de données) |
| **Modification non désirée** | Altération d'un rendez-vous ou d'un motif | 2 | 1 | Authentification ; contrôle d'appartenance côté API ; validation stricte | **Faible** |
| **Disparition des données** | Panne ou perte côté API | 2 | 1 | Hébergement dédié en France ; sauvegardes à confirmer côté API | **Faible** |
| **Attaque sur la mise en forme de la réponse** (injection de HTML) | Réponse de l'IA contenant du script | 3 | 1 | Rendu Markdown assaini (liste blanche de balises) ; tests unitaires dédiés | **Faible** |

## 5. Mesures complémentaires (plan d'action)

| # | Action | Responsable | État |
|---|---|---|---|
| 1 | Obtenir la confirmation écrite (conditions de l'API Gemini) : pas d'entraînement sur les contenus ; encadrement du transfert hors UE (clauses types) | Équipe | À faire |
| 2 | Compléter la politique de confidentialité : notifications push, lien d'agenda, réservation sans compte | Équipe | À faire |
| 3 | Confirmer côté API les durées de conservation (rendez-vous, invités, abonnements push) et les sauvegardes | Équipe API | À faire |
| 4 | Vérifier après déploiement que les fonctions s'exécutent à Paris (`cdg1`) | Équipe | À vérifier |
| 5 | Relire les réponses de l'assistant sur un échantillon de situations sensibles (douleur aiguë, détresse psychique, enfant) | Équipe | À faire |
| 6 | Réévaluer cette analyse à chaque évolution (stockage des conversations, nouvelle donnée de santé, changement de fournisseur d'IA) | Équipe | Permanent |

## 6. Conclusion

Les mesures en place limitent fortement les risques : l'absence de stockage des conversations est la mesure la plus protectrice. Deux points restent à fermer avant de considérer le risque comme acceptable : la **confirmation de non-réutilisation des messages par le sous-traitant** et l'**encadrement du transfert hors UE**. Après ces actions, le risque résiduel est jugé **acceptable** sous réserve de validation par le responsable du traitement.

| Validation | |
|---|---|
| Responsable du traitement | Nom, date, signature à compléter |
| Conseil (DPO, enseignant référent ou juriste) | À compléter |
