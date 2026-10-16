# Guide d'installation

## Prérequis
- **Node.js 22 ou plus** et npm
- Git
- (facultatif) une clé d'API Google Gemini, obtenue sur <https://aistudio.google.com/>, pour l'assistant IA

## Installation locale
```bash
git clone <adresse-du-dépôt> leya-front
cd leya-front
npm install
cp .env.example .env      # renseigner NUXT_GEMINI_API_KEY
npm run dev               # http://localhost:3000
```

Sans clé Gemini, tout fonctionne sauf les réponses de l'assistant. Sans configuration, le site interroge l'API de production (lecture de l'annuaire) : **les comptes et rendez-vous créés en local sont réels**. Pour isoler l'environnement, renseigner `NUXT_API_BASE` avec une API de test.

## Variables d'environnement
Voir le tableau du [README](../README.md#variables-denvironnement). Les secrets restent dans `.env` (ignoré par git).

## Tests
```bash
npm run test:unit                    # tests unitaires
npx playwright install chromium      # une seule fois
npm run test:e2e                     # tests de bout en bout
npm run test:report                  # tout lancer et régénérer tests/RAPPORT-EXECUTION.md
```

## Mise en production (Vercel)
1. Importer le dépôt dans Vercel (framework détecté : Nuxt).
2. Définir les variables d'environnement du projet (Gemini, `NUXT_API_BASE` si besoin, Turnstile, Umami).
3. La branche `main` est déployée automatiquement ; `develop` est la branche de travail, fusionnée dans `main` après contrôle.
4. Le domaine `leya-sante.fr` pointe vers Vercel (HTTPS automatique).

Construction manuelle :
```bash
npm run build
node .output/server/index.mjs
```

## Dépannage
| Symptôme | Cause probable |
|---|---|
| L'assistant ne répond pas | Clé Gemini absente ou invalide |
| « Liste indisponible » dans la recherche | API injoignable (vérifier `NUXT_API_BASE`) |
| Notifications push absentes | Site non installé (iOS) ou permission refusée dans le navigateur |
| Tests e2e : navigateur introuvable | Lancer `npx playwright install chromium` |
