# Règlement européen sur l'IA (IA Act) : analyse du site

Analyse interne pour le dossier, **à faire valider** ; ce n'est pas un avis juridique. Version du 16/10/2026.

## Système d'IA concerné

| Élément | Description |
|---|---|
| Système | « Léya », assistant conversationnel intégré au site (page `/chatbot`) |
| Modèle | Google Gemini (modèle d'IA à usage général fourni par Google, appelé par l'API Gemini) |
| Destination prévue | **Orienter** une personne vers une médecine douce et un type de praticien à partir de ce qu'elle décrit, avec des pistes de bien-être. **Ni diagnostic, ni traitement, ni décision médicale.** |
| Utilisateurs | Grand public adulte, comptes connectés |
| Entrées / sorties | Texte libre de l'utilisateur et historique de la session → texte (Markdown), puis pastilles de médecines et praticiens proches calculés par le site à partir de l'annuaire |
| Rôles | Léya : fournisseur du système (assistant) et déployeur ; Google : fournisseur du modèle à usage général |

## Classification du risque

| Question | Réponse | Justification |
|---|---|---|
| Pratique interdite (art. 5) ? | Non | Pas de manipulation subliminale, de notation sociale, de reconnaissance des émotions ni d'exploitation de vulnérabilités |
| Système à haut risque (annexe III) ? | Non | Pas d'usage listé (emploi, éducation, accès à des services essentiels publics, etc.) |
| Dispositif médical logiciel (donc haut risque via l'annexe I) ? | **Non, à condition de rester dans la destination prévue** | L'assistant n'établit pas de diagnostic et n'oriente pas de décision thérapeutique ; les consignes (prompt, avertissements) l'interdisent. Une évolution vers « quel traitement dois-je prendre ? » changerait la qualification |
| Obligations de transparence (art. 50) ? | **Oui : risque limité** | Système destiné à interagir avec des personnes : elles doivent savoir qu'elles parlent à une IA |

**Conclusion : risque limité**, avec obligation d'information. La qualification dépend du maintien de la destination prévue (orientation, pas de diagnostic).

## Mesures en place

| Exigence | Mesure | Où |
|---|---|---|
| Information de l'utilisateur (art. 50) | « assistant IA » annoncé (accueil, titre de la page du chat), message « Léya ne pose pas de diagnostic et ne remplace pas un avis médical » | `ChatbotInterface.vue`, accueil |
| Limitation du domaine | Consignes système : uniquement bien-être et médecines douces ; refus formulé pour tout autre sujet | `server/api/chat.post.ts` |
| Urgences | Consigne : recommander d'appeler le 15 avant tout conseil ; le site masque alors pastilles et praticiens | `chat.post.ts`, `ChatbotInterface.vue` |
| Résistance au détournement | Rôles `system` refusés côté serveur (historique limité à `user`/`model`), consigne de refuser les changements de rôle, longueur bornée | `chat.post.ts` |
| Surveillance humaine | Rien n'est décidé par l'IA : l'utilisateur choisit un praticien et un créneau ; les praticiens affichés viennent de l'annuaire, pas du modèle | Conception |
| Protection des données | Messages non conservés par le site ; consentement explicite ; conversation uniquement en mémoire de l'onglet ; recommandation de ne pas saisir d'informations identifiantes | `politique-de-confidentialite`, `ChatbotInterface.vue` |
| Robustesse | Authentification vérifiée, quota par compte et par adresse IP, rendu du texte assaini (aucun HTML actif) | `auth.ts`, `markdown.ts`, tests unitaires |
| Honnêteté des contenus | Aucune « source » ni note inventée n'est affichée ; les médecines proposées sont reconnues dans le texte et limitées à celles du site | Conception |
| Maîtrise des compétences en IA (art. 4) | Équipe informée des limites du modèle (hallucinations, biais) ; usage de l'IA de développement déclaré dans le dossier | Dossier |

## Risques résiduels et pistes

| Risque | Gravité | Traitement actuel | Piste |
|---|---|---|---|
| Réponse inexacte ou rassurante à tort sur un symptôme grave | Élevée | Avertissement permanent ; consigne « 15 » pour les urgences ; pas de diagnostic | Jeu d'essai de questions sensibles (douleur thoracique, idées suicidaires, enfant, grossesse) exécuté à chaque changement de modèle ou de consigne |
| Urgence non reconnue par le modèle | Élevée | Consigne dans le prompt | Détection côté site de mots d'alerte avant l'appel au modèle, avec réponse fixe orientant vers le 15 |
| Détournement (injection d'instructions) | Moyenne | Consignes et filtrage des rôles | Tests de détournement documentés |
| Données de santé transmises à Google | Moyenne | Consentement, avertissement | Contrat de sous-traitance, option « zéro conservation » du fournisseur, mention dans l'AIPD |
| Biais ou propos inadaptés | Moyenne | Ton neutre et inclusif demandé | Relecture d'un échantillon par un professionnel de santé |
| Dépendance à un fournisseur | Faible | Accès isolé dans une route serveur | Interface unique permettant de changer de modèle |

## À faire

1. Faire valider la qualification « risque limité » et la destination prévue par un juriste ou le délégué à la protection des données.
2. Créer le jeu d'essai des questions sensibles et conserver ses résultats (traçabilité).
3. Ajouter la détection d'alerte côté site pour les urgences.
4. Mentionner Gemini et ses conditions dans l'analyse d'impact (voir [donnees-personnelles.md](donnees-personnelles.md)).
