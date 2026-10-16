# Test de charge

Mesure de la capacité du site (rendu serveur et passerelle) sous plusieurs niveaux de trafic simultané. Script : [tests/load/run.mjs](../tests/load/run.mjs) (`npm run build && npm run test:load`).

*Exécuté le 16/10/2026.*

## Méthode

- **Cible** : la construction de production (`node .output/server/index.mjs`), un seul processus Node.
- **Backend simulé** : un faux serveur local répond immédiatement par une liste vide. L'API réelle et le site en ligne ne sont **jamais sollicités** : on mesure le coût du site lui-même, pas celui de l'API.
- **Outil** : [autocannon](https://github.com/mcollina/autocannon), 12 secondes par palier (15 par défaut dans le script), 10, 50 et 100 connexions simultanées.
- **Machine** : Apple M4 Pro, 14 cœurs, Node 24 (ordinateur de développement, le test et le serveur tournant ensemble).
- **Pages** : accueil, liste des médecines, page de médecine, recherche de praticiens, page Praticiens (toutes rendues côté serveur) et route de la passerelle `/api/backend/praticiens`.

## Résultats

Requêtes par seconde (RPS), latence médiane (p50) et au 99ᵉ centile (p99), durée de 12 s par palier, aucune erreur ni réponse non 2xx.

| Page | Connexions | RPS | p50 | p99 |
|---|---|---|---|---|
| `/` | 10 | 369 | 26 ms | 40 ms |
| | 50 | 388 | 126 ms | 151 ms |
| | 100 | 383 | 249 ms | 1 444 ms |
| `/medecines` | 10 | 499 | 19 ms | 28 ms |
| | 50 | 499 | 98 ms | 123 ms |
| | 100 | 483 | 202 ms | 732 ms |
| `/medecines/osteopathie` | 10 | 403 | 24 ms | 34 ms |
| | 50 | 424 | 114 ms | 156 ms |
| | 100 | 419 | 230 ms | 890 ms |
| `/trouver-un-praticien` | 10 | 407 | 23 ms | 37 ms |
| | 50 | 430 | 112 ms | 166 ms |
| | 100 | 426 | 227 ms | 729 ms |
| `/praticiens-pro` | 10 | 619 | 13 ms | 31 ms |
| | 50 | 621 | 76 ms | 158 ms |
| | 100 | 628 | 139 ms | 534 ms |
| `/api/backend/praticiens?limit=12` | 10 | 6 191 | 1 ms | 3 ms |
| | 50 | 6 121 | 7 ms | 12 ms |
| | 100 | 5 842 | 16 ms | 26 ms |

## Lecture

- **Débit stable** : chaque page se stabilise à environ 380–630 pages par seconde par processus, quel que soit le nombre de connexions. Le débit ne s'effondre pas ; seule la latence augmente (file d'attente) : c'est le signe d'un processus saturé, pas d'un défaut.
- **Aucune erreur** (ni délai dépassé ni réponse en erreur) jusqu'à 100 connexions simultanées.
- **Ordre de grandeur** : 400 pages par seconde correspondent à plus de 1,4 million de pages par heure par processus. Un lancement d'une plateforme régionale de cette taille en est très loin.
- **La passerelle est très légère** (environ 6 000 requêtes par seconde) : elle ne sera jamais le goulot ; le coût vient du rendu des pages.
- **Les pointes de latence p99** à 100 connexions (0,5 à 1,4 s) viennent de la saturation d'un seul processus et du ramasse-miettes.

## Limites (à lire avec les résultats)

1. **Un seul processus sur un ordinateur de développement** : Vercel exécute des fonctions en parallèle (mise à l'échelle horizontale) ; les chiffres sont une base basse du comportement en production, pas une prévision.
2. **Faux backend instantané** : en production, chaque page qui interroge l'API ajoute la latence réelle du serveur d'API (réseau et base de données). La capacité du site est donc inférieure à ces chiffres pour les pages qui l'appellent. Un test de charge de l'API relève de son propre dépôt.
3. **Pas de test sur l'hébergement réel** : il demanderait l'accord de l'hébergeur et risquerait de dégrader le service ou de dépasser les quotas gratuits. À faire en préproduction si elle existe.
4. **Pas de scénario d'écriture** (connexion, réservation) : elles créeraient des données réelles.

## Pistes d'amélioration si le trafic augmente

- Mettre en cache les pages publiques peu dynamiques (accueil, médecines) à la périphérie (CDN), ce qui retire la quasi-totalité de la charge du rendu serveur.
- Surveiller les temps de réponse et les erreurs en production (tableau de bord Vercel), avec une alerte sur les erreurs 5xx.
- Rejouer ce test avant chaque évolution majeure (le script est versionné).
