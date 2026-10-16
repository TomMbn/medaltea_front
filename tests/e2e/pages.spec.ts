import { test, expect } from '@playwright/test'

// Pages publiques : titre, un seul <h1>, adresse canonique, aucune erreur JavaScript.
const PAGES: [string, RegExp][] = [
  ['/', /Léya/],
  ['/medecines', /médecines/i],
  ['/medecines/sophrologie', /sophrolog/i],
  ['/medecines/osteopathie', /ostéopath/i],
  ['/trouver-un-praticien', /praticien/i],
  ['/praticiens-pro', /praticien/i],
  ['/cgu', /utilisation/i],
  ['/mentions-legales', /mentions/i],
  ['/politique-de-confidentialite', /confidentialité/i],
]

for (const [path, title] of PAGES) {
  test(`page ${path} : balises de base et aucune erreur JavaScript`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(path)
    await expect(page).toHaveTitle(title)
    await expect(page.locator('h1')).toHaveCount(1)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe(`https://leya-sante.fr${path === '/' ? '' : path}`)
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy()
    expect(errors).toEqual([])
  })
}

test('robots.txt et sitemap : pages privées exclues, pages publiques listées', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  for (const p of ['/pro', '/admin', '/demo', '/api/', '/mon-compte']) expect(robots).toContain(`Disallow: ${p}`)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)
  expect(locs).toEqual(expect.arrayContaining(['/', '/medecines', '/medecines/sophrologie', '/trouver-un-praticien']))
  for (const priv of ['/pro', '/demo', '/admin', '/login', '/mon-compte', '/chatbot']) expect(locs).not.toContain(priv)
})

test('page introuvable : vraie 404 avec liens de retour', async ({ page }) => {
  const response = await page.goto('/cette-page-n-existe-pas')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /introuvable/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /Retour à l’accueil/ })).toBeVisible()
})

test('le manifeste PWA et le service worker sont servis', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.name).toBe('Léya')
  expect(manifest.icons.map((i: any) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']))
  const sw = await request.get('/sw.js')
  expect(sw.status()).toBe(200)
  expect(await sw.text()).not.toContain("addEventListener('fetch'") // aucune mise en cache des pages privées
})

test('en-têtes de sécurité', async ({ request }) => {
  const res = await request.get('/')
  const h = res.headers()
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['x-frame-options']).toBe('DENY')
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  // Bloquante sur le site construit, en « rapport seul » sous le serveur de développement
  expect(h['content-security-policy'] ?? h['content-security-policy-report-only']).toContain("object-src 'none'")
})
