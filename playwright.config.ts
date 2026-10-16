import { defineConfig, devices } from '@playwright/test'

// Tests de bout en bout : un vrai navigateur parcourt le site.
// En local : `npm run dev` est réutilisé s'il tourne déjà. En intégration continue : le site construit est lancé.
const PORT = Number(process.env.PORT || 3000)
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { outputFolder: 'tests/reports/e2e', open: 'never' }], ['json', { outputFile: 'tests/reports/e2e/results.json' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    // Pas d'animations : les mesures (contrastes, positions) sont stables
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: process.env.CI ? 'node .output/server/index.mjs' : 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { PORT: String(PORT), NITRO_PORT: String(PORT) },
  },
})
