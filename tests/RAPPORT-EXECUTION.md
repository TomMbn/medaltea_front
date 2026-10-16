# Rapport d'exécution des tests

Généré le 16/10/2026 09:52:09 par `npm run test:report`.

**92 réussis, 0 en échec, 0 ignorés** (durée cumulée 58.6 s).

| Niveau | Fichier | Scénario | Résultat |
|---|---|---|---|
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) normalise un rendez-vous complet | ✅ |
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) pour un invité, le contact est l'e-mail et le téléphone | ✅ |
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) lit une proposition d'autre créneau | ✅ |
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) ignore les éléments sans identifiant et accepte {data} ou {items} | ✅ |
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) distingue les statuts actifs | ✅ |
| Unitaire | unit/appointments.test.ts | rendez-vous (utils/appointments) extrait un message d'erreur lisible | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) fournit des rendez-vous fictifs, dont des demandes à confirmer | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) confirme une demande et conserve le changement | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) refuse une demande avec un motif | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) « Simuler une demande » ajoute une demande en attente ; « Réinitialiser » remet l'état de départ | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) enregistre une modification de la fiche et une nouvelle prestation | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) refuse proprement ce qui exige le vrai serveur (photo, suppression de compte, notifications) | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) laisse passer les routes publiques vers la passerelle (annuaire, fiches, réservation sans compte) | ✅ |
| Unitaire | unit/demo.test.ts | démonstration praticien (faux serveur) génère un lien d'agenda fictif et non fonctionnel | ✅ |
| Unitaire | unit/demo.test.ts | fiche publique de démonstration (servie par la passerelle) répond uniquement pour le praticien fictif | ✅ |
| Unitaire | unit/demo.test.ts | fiche publique de démonstration (servie par la passerelle) ne propose que des créneaux à venir | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes relaie les routes publiques attendues, sans authentification | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes exige l'authentification pour l'espace connecté, praticien et administrateur | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes refuse tout ce qui n'est pas listé (création, suppression, listes d'utilisateurs…) | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes refuse les chemins truqués (remontée, encodage, retour à la ligne, majuscules) | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes ancre chaque règle (^…$) pour éviter les correspondances partielles | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : liste blanche des routes ne met en cache partagé que des routes publiques ; les champs privés ne sortent que pour le propriétaire | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : données privées retire les champs privés, y compris dans les objets imbriqués et les listes | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : données privées ne garde que les champs autorisés du corps de requête | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation de la recherche accepte une recherche valide | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation de la recherche refuse les valeurs hors limites ou inconnues | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation de la recherche refuse une zone de carte invalide ou combinée à un rayon | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation de la recherche refuse les tentatives d'injection dans les paramètres | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation des écritures rendez-vous : identifiants entiers, motif de 500 caractères au plus | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation des écritures fiche praticien : formats stricts et champs inconnus ignorés | ✅ |
| Unitaire | unit/gateway.test.ts | passerelle : validation des écritures préférences du patient : valeurs connues uniquement | ✅ |
| Unitaire | unit/markdown.test.ts | rendu Markdown du chat (anti-XSS) met en forme le Markdown courant | ✅ |
| Unitaire | unit/markdown.test.ts | rendu Markdown du chat (anti-XSS) supprime les scripts et les gestionnaires d'événements | ✅ |
| Unitaire | unit/markdown.test.ts | rendu Markdown du chat (anti-XSS) neutralise les liens javascript: et ouvre les autres liens sans accès à la page | ✅ |
| Unitaire | unit/markdown.test.ts | rendu Markdown du chat (anti-XSS) retire les cadres et les styles | ✅ |
| Unitaire | unit/schedule.test.ts | horaires (utils/schedule) construit la semaine depuis les plages du serveur, triées | ✅ |
| Unitaire | unit/schedule.test.ts | horaires (utils/schedule) détecte une fin avant le début, un chevauchement et une plage incomplète | ✅ |
| Unitaire | unit/schedule.test.ts | horaires (utils/schedule) n'envoie que les différences avec le serveur | ✅ |
| Unitaire | unit/schedule.test.ts | horaires (utils/schedule) totalise et formate les durées | ✅ |
| Unitaire | unit/schedule.test.ts | horaires (utils/schedule) convertit une heure de Paris en instant avec le bon décalage (été et hiver) | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) accepte plusieurs formes de réponse de l'API (liste de chaînes, objets, jours) | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) renvoie une liste vide pour une réponse absente ou invalide | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) groupe les créneaux par jour à l'heure de Paris et les trie | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) compte le jour à l'heure de Paris (23 h 30 UTC = lendemain à Paris) | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) calcule les dates relatives | ✅ |
| Unitaire | unit/slots.test.ts | créneaux (utils/slots) restitue le zéro initial des codes postaux stockés en nombre | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de / | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /medecines | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /medecines/sophrologie | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /trouver-un-praticien | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /praticiens-pro | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /login | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /register | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /cgu | ✅ |
| Bout en bout | a11y.spec.ts | accessibilité de /praticiens/demo-claire-fictive | ✅ |
| Bout en bout | auth.spec.ts | comptes : formulaires › inscription : le mot de passe doit faire 8 caractères avec un chiffre, et les conditions sont obligatoires | ✅ |
| Bout en bout | auth.spec.ts | comptes : formulaires › connexion : des identifiants faux affichent une erreur sans ouvrir de session | ✅ |
| Bout en bout | auth.spec.ts | comptes : formulaires › les pages privées renvoient vers la connexion | ✅ |
| Bout en bout | auth.spec.ts | comptes : formulaires › l'administration est inaccessible sans compte administrateur | ✅ |
| Bout en bout | auth.spec.ts | comptes : formulaires › la passerelle refuse les routes non prévues | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › le tableau de bord montre des rendez-vous et des demandes fictifs | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › confirmer une demande la fait passer en « confirmé » | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › « Simuler une demande » ajoute une demande, « Réinitialiser » la retire | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › une modification de la fiche est enregistrée pendant la visite | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › les fonctions qui exigent le vrai serveur sont refusées proprement | ✅ |
| Bout en bout | demo.spec.ts | démo praticien › « Quitter la démo » ferme l'espace et ramène à la page Praticiens | ✅ |
| Bout en bout | pages.spec.ts | page / : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /medecines : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /medecines/sophrologie : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /medecines/osteopathie : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /trouver-un-praticien : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /praticiens-pro : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /cgu : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /mentions-legales : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | page /politique-de-confidentialite : balises de base et aucune erreur JavaScript | ✅ |
| Bout en bout | pages.spec.ts | robots.txt et sitemap : pages privées exclues, pages publiques listées | ✅ |
| Bout en bout | pages.spec.ts | page introuvable : vraie 404 avec liens de retour | ✅ |
| Bout en bout | pages.spec.ts | le manifeste PWA et le service worker sont servis | ✅ |
| Bout en bout | pages.spec.ts | en-têtes de sécurité | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 320 × 568 | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 375 × 812 | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 768 × 1024 | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 1024 × 768 | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 1366 × 768 | ✅ |
| Bout en bout | responsive.spec.ts | pas de défilement horizontal à 1920 × 1080 | ✅ |
| Bout en bout | responsive.spec.ts | la carte « Demander à Léya » reste visible sans défiler sur un portable courant (1366 × 768) | ✅ |
| Bout en bout | responsive.spec.ts | le formulaire de connexion tient dans un écran de portable peu haut (1280 × 620) | ✅ |
| Bout en bout | search.spec.ts | recherche de praticiens › une ville est cherchée dans un rayon de 15 km, triée par distance | ✅ |
| Bout en bout | search.spec.ts | recherche de praticiens › un nom reste une recherche par nom | ✅ |
| Bout en bout | search.spec.ts | recherche de praticiens › « Chercher plutôt un praticien nommé » bascule vers la recherche par nom | ✅ |
| Bout en bout | search.spec.ts | recherche de praticiens › la vue Carte affiche la carte et la liste des praticiens de la zone | ✅ |
| Bout en bout | search.spec.ts | recherche de praticiens › la page d'une médecine mène à la recherche filtrée | ✅ |

## Contrastes de couleurs à corriger (suivis, non bloquants)

Relevés par axe-core (WCAG AA) sur les pages publiques. Les corriger demande de valider des changements de couleurs de la charte.

- 1 éléments sur /medecines
- 11 éléments sur /medecines/sophrologie
- 14 éléments sur /trouver-un-praticien
- 6 éléments sur /praticiens-pro
- 1 éléments sur /login
- 1 éléments sur /register
- 5 éléments sur /cgu
