# Choix technologiques et justification

Ce document justifie la pile retenue au regard des alternatives, du contexte du projet (projet étudiant, sans budget, données de santé sensibles, besoin de référencement) et des mesures réalisées. Les chiffres viennent de mesures faites sur ce projet (indiquées) ; les autres éléments sont des arguments de conception à compléter par votre propre veille.

## Contexte et critères

| Critère | Pourquoi |
|---|---|
| Référencement (SEO) | L'annuaire et les pages de médecine doivent être trouvées sur Google → rendu côté serveur |
| Coût | Aucun budget : offres gratuites ou auto-hébergement |
| Sécurité et vie privée | Données de santé : minimiser, héberger en Europe, pas de suivi tiers |
| Productivité | Petite équipe : outils standards, bien documentés, tests faciles |
| Performance et sobriété | Mobile avant tout, 4G lente, poids des pages |
| Accessibilité | Obligation pour un service public ou à vocation générale : RGAA / WCAG |

## Tableau des choix

| Domaine | Choix | Alternatives examinées | Raisons |
|---|---|---|---|
| Framework | **Nuxt 4** (Vue 3, TypeScript) | Next.js (React), SPA Vue seule, Astro | Rendu serveur natif pour le SEO ; routes serveur intégrées (la passerelle) ; Vue très lisible pour des équipes qui débutent ; un SPA aurait dégradé le référencement |
| Style | **Tailwind CSS** | CSS à la main, Bootstrap, UnoCSS | Fidélité pixel aux maquettes Figma avec des jetons de couleurs ; pas de CSS inutilisé en production |
| Hébergement du site | **Vercel** | VPS (Nginx + Node), Netlify, Cloudflare Pages | Déploiement automatique à chaque push, CDN et HTTPS inclus, optimisation d'images, gratuit au départ. **Inconvénients** : fournisseur américain, région d'exécution à confirmer (voir [deploiement-ci-cd.md](deploiement-ci-cd.md)) |
| API et base | **NestJS + PostgreSQL** sur un serveur dédié en France | Supabase, Firebase | Maîtrise des données de santé sensibles hébergées en France ; pas de verrou fournisseur |
| Accès à l'API | **Passerelle serveur** (liste blanche) | Appels directs depuis le navigateur | Cache le jeton (cookie `httpOnly`), un point de contrôle unique, validation avant l'API, testable |
| Carte | **Leaflet + OpenStreetMap** | MapLibre GL + OpenFreeMap, Google Maps, Mapbox | **Comparé en réel** : MapLibre ≈ 211 Ko gzip contre ≈ 51 Ko ; il exige WebGL et a échoué dans le Chrome de l'utilisateur (carte vide) ; Google et Mapbox demandent une clé et un compte, avec collecte de données. Leaflet gagne sur la sobriété et la robustesse |
| Assistant IA | **Google Gemini** | OpenAI, Mistral, modèle auto-hébergé | Accès simple par clé (Google AI Studio), réponses en français, flux continu. Voir le bilan IA Act et RGPD (sous-traitant hors UE) ; un modèle européen reste une piste |
| Rendu du texte de l'IA | **marked + DOMPurify** | `v-html` direct, Markdown maison | La sortie du modèle est non fiable : liste blanche de balises, test XSS automatisé |
| Mesure d'audience | **Umami auto-hébergé** | Google Analytics, Matomo | Sans cookie ni consentement, données non transmises à un tiers, IP non conservée ; GA exigerait un bandeau de consentement |
| Anti-robot | **Cloudflare Turnstile** | reCAPTCHA, hCaptcha | Sans pistage publicitaire, discret pour l'utilisateur ; vérifié côté API |
| Adresses | **Géoplateforme IGN** | Google Places, Nominatim | Gratuit, français, appelé depuis le serveur (le navigateur ne contacte pas de service tiers) |
| Notifications | **Web Push + service worker** (PWA) | E-mail, SMS, applications natives | Gratuit, sans fournisseur d'e-mail (indisponible), contenu neutre ; installable sans magasin d'applications |
| Tests unitaires | **Vitest** | Jest | Même moteur que le bundler (Vite), rapide, TypeScript sans configuration |
| Tests de bout en bout | **Playwright** | Cypress, Selenium | Navigateur réel, pas de configuration, API de requêtes HTTP incluse, rapports et traces, intégration axe-core |
| Accessibilité automatisée | **axe-core** | Lighthouse seul, pa11y | Moteur de référence, règles WCAG étiquetées, utilisable dans les tests |
| Intégration continue | **GitHub Actions** | GitLab CI, CircleCI | Le dépôt est déjà sur GitHub ; gratuit pour ce volume |

## Éco-conception

| Pratique | Mise en œuvre |
|---|---|
| Images légères | `@nuxt/image` : formats modernes (WebP/AVIF), tailles adaptées à l'écran, chargement différé ; `favicon.png` ramené de 342 Ko à 19 Ko |
| Peu de JavaScript | Carte chargée uniquement sur les pages qui l'affichent ; Leaflet (51 Ko) plutôt qu'une bibliothèque WebGL (211 Ko) |
| Pas de suivi tiers | Aucun script publicitaire ni de réseau social ; mesure d'audience auto-hébergée |
| Cache | Pages et données publiques servies par le CDN ; réponses privées jamais mises en cache |
| Animations réduites | Respect de « réduire les animations » du système |
| À mesurer | Poids de l'accueil mobile (1,2 Mo le 13/10), score EcoIndex / GreenIT, consommation du serveur dédié : non mesurés à ce jour |

## Veille technologique (à compléter avec vos propres lectures)

Sources de référence à citer et à dater dans le dossier :
- Documentation officielle de Nuxt, Vue, Nitro et Tailwind ; notes de version de Nuxt 4.
- RGAA 4.1 et WCAG 2.2 (accessibilité) ; référentiel d'éco-conception de services numériques.
- Règlement (UE) 2024/1689 (IA Act) ; fiches de la CNIL sur l'IA, les cookies et la mesure d'audience exemptée de consentement ; guide du développeur RGPD.
- Documentation de Playwright, Vitest et axe-core.

Pour chaque choix majeur, joindre la date de consultation et ce qu'elle a changé dans la décision (par exemple, le test réel de MapLibre a conduit à rester sur Leaflet).
