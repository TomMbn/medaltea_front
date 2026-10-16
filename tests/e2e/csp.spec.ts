import { test, expect } from '@playwright/test'

// Politique de sécurité des contenus : aucune ressource ni script refusé sur les pages et parcours principaux.
// À lancer sur le site construit (la politique de production n'est pas appliquée par le serveur de développement) :
//   npm run build && CI=1 PORT=3100 npx playwright test tests/e2e/csp.spec.ts
test.skip(!process.env.CI, 'La politique de production n’est appliquée que sur le site construit (CI=1)')

const PAGES = ['/', '/medecines', '/medecines/osteopathie', '/trouver-un-praticien', '/trouver-un-praticien?q=Nantes&vue=carte', '/praticiens-pro', '/praticiens/demo-claire-fictive', '/login', '/register', '/inscription-pro', '/cgu', '/chatbot', '/demo']

test('la politique de sécurité est bien envoyée en mode bloquant', async ({ request }) => {
  const res = await request.get('/')
  const csp = res.headers()['content-security-policy']
  expect(csp, 'en-tête bloquant attendu').toContain("default-src 'self'")
  expect(csp).toContain("object-src 'none'")
  expect(csp).toContain("frame-ancestors 'none'")
  expect(res.headers()['content-security-policy-report-only']).toBeUndefined()
})

test('aucune violation de la politique sur les pages principales', async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as any).__csp = []
    document.addEventListener('securitypolicyviolation', e => (window as any).__csp.push(`${e.violatedDirective} ${e.blockedURI}`))
  })
  const violations: string[] = []
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    for (const v of await page.evaluate(() => (window as any).__csp)) violations.push(`${path} : ${v}`)
  }
  expect(violations, violations.join('\n')).toEqual([])
})
