# Tests de Léya (front)

Ce document décrit la **stratégie de tests**, les **scénarios** et la manière de les **exécuter et de les tracer**. Les résultats de la dernière exécution sont dans [RAPPORT-EXECUTION.md](RAPPORT-EXECUTION.md).

## Objectifs

1. **Protéger les règles qui comptent le plus** : sécurité de la passerelle (rien d'autre que les routes prévues n'atteint l'API), assainissement du HTML de l'assistant, exactitude des horaires et des rendez-vous.
2. **Vérifier les parcours réels** dans un navigateur : recherche, démonstration praticien, connexion, pages privées, SEO, responsive, accessibilité.
3. **Éviter les régressions** : tout se relance à chaque push (GitHub Actions) et avant chaque fusion dans `main`.

## Pyramide de tests

| Niveau | Outil | Ce qui est vérifié | Où |
|---|---|---|---|
| Unitaire | Vitest (+ jsdom pour le HTML) | Fonctions pures et logique de la passerelle, sans lancer Nuxt | `tests/unit/` |
| Intégration (passerelle) | Vitest et Playwright (requêtes HTTP) | Liste blanche des routes, validations, réponses 401/404 réelles | `tests/unit/gateway.test.ts`, `tests/e2e/auth.spec.ts` |
| Système (bout en bout) | Playwright (Chromium) | Parcours complets dans un vrai navigateur sur le site construit | `tests/e2e/` |
| Accessibilité | axe-core via Playwright | Anomalies WCAG 2.1 A et AA critiques ou sérieuses | `tests/e2e/a11y.spec.ts` |
| Charge | autocannon, faux backend local | Débit et temps de réponse du rendu serveur et de la passerelle (10, 50 et 100 connexions) | `tests/load/run.mjs`, [résultats](../documentation/test-de-charge.md) |

## Scénarios

### Tests unitaires (46)

| Fichier | Scénarios |
|---|---|
| `slots.test.ts` | Formes de réponse de l'API pour les créneaux ; réponses vides ; groupement par jour à l'heure de Paris ; jours relatifs ; code postal à zéro initial |
| `appointments.test.ts` | Normalisation d'un rendez-vous ; contact d'un invité ; proposition d'un autre créneau ; éléments sans identifiant ; statuts actifs ; messages d'erreur |
| `schedule.test.ts` | Semaine depuis le serveur ; erreurs (fin avant début, chevauchement, plage incomplète) ; envoi des seules différences ; totaux ; heure de Paris été et hiver |
| `markdown.test.ts` | Mise en forme ; suppression des scripts et gestionnaires d'événements ; liens `javascript:` neutralisés ; liens externes sans accès à la page ; cadres et styles retirés |
| `gateway.test.ts` | Routes publiques ; routes protégées ; routes refusées (création, suppression, listes d'utilisateurs) ; chemins truqués (`..`, encodage, retour à la ligne) ; règles ancrées ; cache et champs privés ; validation des recherches, des rendez-vous, des fiches (formats, `https`) et des préférences |
| `demo.test.ts` | Démo praticien : rendez-vous fictifs, confirmation, refus avec motif, simulation et réinitialisation, enregistrement d'une fiche, refus des fonctions réservées au vrai serveur, passage des routes publiques, lien d'agenda fictif ; fiche publique de démonstration limitée au praticien fictif |

### Tests de bout en bout (46)

| Fichier | Scénarios |
|---|---|
| `pages.spec.ts` | 9 pages publiques (titre, un seul `h1`, adresse canonique, description, aucune erreur JavaScript) ; `robots.txt` et sitemap (pages privées exclues) ; page 404 ; manifeste PWA et service worker sans mise en cache ; en-têtes de sécurité |
| `search.spec.ts` | Recherche par ville (rayon de 15 km) ; recherche par nom ; bascule ville ↔ nom ; vue Carte ; de la page d'une médecine vers la recherche |
| `demo.spec.ts` | Entrée dans la démo ; tableau de bord ; confirmation d'une demande ; simulation et réinitialisation ; modification de la fiche ; refus des fonctions réservées ; sortie de la démo |
| `auth.spec.ts` | Règles du mot de passe à l'inscription ; connexion avec de faux identifiants (erreur, aucune session) ; pages privées redirigées vers la connexion ; administration inaccessible ; passerelle : routes non prévues refusées, 401 sans jeton |
| `responsive.spec.ts` | Aucun défilement horizontal à 320, 375, 768, 1024, 1366 et 1920 px sur 8 pages ; carte « Demander à Léya » visible à 1366 × 768 ; formulaires de connexion et d'inscription sans défilement à 1280 × 620 |
| `a11y.spec.ts` | axe-core (WCAG 2.1 A et AA) sur 9 pages : aucune anomalie critique ou sérieuse hors contrastes ; contrastes relevés dans le rapport |

## Cas limites couverts

Entrées invalides et hostiles (injection dans les paramètres, chemins truqués, XSS dans le Markdown, schémas `javascript:`), valeurs aux bornes (limites de pagination, 500 caractères du motif, notes de 1 à 5), réponses d'API de formes différentes, changement d'heure (heure d'été et d'hiver), pages privées sans session, appareil peu haut ou étroit.

## Exécuter les tests

```bash
npm install
npx playwright install chromium     # une seule fois

npm run test:unit                   # tests unitaires (rapides, sans réseau)
npm run test:e2e                    # bout en bout (réutilise `npm run dev` s'il tourne, sinon le lance)
npm run test:report                 # tout + écrit tests/RAPPORT-EXECUTION.md
npm run build && npm run test:load  # test de charge (≈ 4 minutes, sur le site construit)

# Comme en intégration continue (site construit) :
npm run build && CI=1 PORT=3100 npx playwright test
```

Les rapports détaillés (HTML, captures et traces des échecs) sont dans `tests/reports/e2e/` et `test-results/` (non versionnés ; publiés comme artefacts de l'intégration continue).

## Intégration continue

`.github/workflows/ci.yml` : à chaque push sur `main` ou `develop` et chaque demande de fusion, deux tâches s'exécutent — **tests unitaires**, puis **construction du site et tests de bout en bout** sur le site construit. Les rapports sont conservés 14 jours. Vercel déploie `main` de son côté.

## Limites connues (honnêtes)

- Les tests de recherche et de connexion interrogent **l'API de production en lecture** (et tentent une connexion avec de faux identifiants) : un test peut échouer si l'API est indisponible, ce qui est le comportement voulu pour un contrôle de bout en bout.
- La **réservation d'un vrai rendez-vous** et la confirmation par un praticien réel ne sont pas automatisées (elles créeraient des données réelles) ; elles sont couvertes en démo et à la main avant chaque livraison.
- Le **test de charge** mesure un seul processus sur un ordinateur de développement, avec un faux backend : il ne remplace pas un essai sur l'hébergement réel (voir [test-de-charge.md](../documentation/test-de-charge.md)). Pas de test sur de vrais appareils (iOS Safari, Android) ; le responsive est vérifié dans Chromium à plusieurs tailles.
- Les **contrastes de couleurs** de certaines pages ne passent pas encore le seuil AA : relevés dans le rapport, correction soumise à validation de la charte.
- Les tests du backend (API) sont dans son propre dépôt.

## Correspondance avec la grille d'évaluation (tests et déploiement)

| Critère | Éléments |
|---|---|
| Stratégie et scénarios de tests | Ce document : niveaux, scénarios, cas limites, limites |
| Exécution des tests | 92 tests exécutés, résultats tracés dans le rapport et les artefacts de l'intégration continue, non-régression à chaque push |
| Déploiement en continu | Vercel (production) + GitHub Actions (contrôles avant et pendant la fusion) |
