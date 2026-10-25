import { test, expect } from '@playwright/test'

// Pages des médecines ajoutées le 25/10/2026 (disciplines présentes en base sans page jusque-là).
// Les effectifs viennent de l'annuaire réel (lecture seule) : chaque discipline y compte des praticiens.
const NOUVELLES = [
  ['reflexologie', 'Réflexologie'],
  ['kinesiologie', 'Kinésiologie'],
  ['shiatsu', 'Shiatsu'],
  ['chiropraxie', 'Chiropraxie'],
  ['etiopathie', 'Étiopathie'],
  ['medecine-traditionnelle-chinoise', 'Médecine traditionnelle chinoise'],
] as const

test('la liste des médecines affiche les 12 disciplines, avec leur nombre de praticiens', async ({ page }) => {
  await page.goto('/medecines')
  await expect(page.getByRole('status')).toContainText('12 médecines')
  for (const [slug, name] of NOUVELLES) {
    const card = page.locator(`main a[href="/medecines/${slug}"]`)
    await expect(card.getByRole('heading', { name })).toBeVisible()
    await expect(card).toContainText(/\d+ praticiens?/)
  }
})

test('la recherche de la liste trouve une nouvelle médecine par son nom', async ({ page }) => {
  await page.goto('/medecines')
  await expect(async () => {
    await page.getByRole('searchbox', { name: 'Rechercher une médecine' }).fill('shiatsu')
    await expect(page.getByRole('status')).toContainText('1 médecine', { timeout: 2_000 })
  }).toPass({ timeout: 20_000 })
  await expect(page.locator('main a[href="/medecines/shiatsu"]')).toBeVisible()
})

for (const [slug, name] of NOUVELLES) {
  test(`page ${slug} : images, nombre de praticiens et lien vers la recherche filtrée`, async ({ page }) => {
    await page.goto(`/medecines/${slug}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(name.toLowerCase())
    // Nombre réel de praticiens (GET /disciplines), affiché dans le hero
    await expect(page.getByText(`praticiens référencés en ${name.toLowerCase()}`)).toBeVisible()
    // Photos et pictogramme : la page les référence et le site les sert. Sur le site construit, les photos passent
    // par /_vercel/image (optimiseur présent seulement chez Vercel) : on vérifie donc le fichier source, pas le rendu.
    const files = ['hero', 'definition', 'mosaique-1', 'mosaique-2', 'mosaique-3'].map(n => `/images/medecines/${slug}/${n}.webp`)
    const srcs = (await page.locator('main img').evaluateAll(els => els.map(e => decodeURIComponent(e.getAttribute('src') ?? '')))).join(' ')
    for (const file of [...files, `/icons/${slug}.svg`]) {
      expect(srcs, file).toContain(file)
      const res = await page.request.get(file)
      expect(res.status(), file).toBe(200)
      expect(res.headers()['content-type'], file).toMatch(/^image\//)
    }
    const link = page.getByRole('link', { name: 'Voir la liste' })
    await expect(link).toHaveAttribute('href', `/trouver-un-praticien?specialite=${slug}#resultats`)
  })
}

// La page coupe tout débordement horizontal (overflow-x-clip) : on vérifie donc la position des éléments, pas le défilement
test('le titre et le compteur d\'une médecine au nom long tiennent sur un petit téléphone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/medecines/medecine-traditionnelle-chinoise')
  for (const el of [...await page.locator('h1, h1 *').all(), page.getByText('praticiens référencés en médecine traditionnelle chinoise')]) {
    const box = await el.boundingBox()
    expect(box!.x + box!.width).toBeLessThanOrEqual(320)
  }
})

test('l\'accueil et le pied de page mènent aux nouvelles médecines', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Voir les 12 médecines' })).toBeVisible()
  const footer = page.getByRole('navigation', { name: 'Nos médecines' })
  for (const [slug, name] of NOUVELLES) {
    await expect(page.locator('.landing-medicines').getByRole('button', { name })).toBeVisible()
    await expect(footer.getByRole('link', { name })).toHaveAttribute('href', `/medecines/${slug}`)
  }
})

test('la recherche de praticiens filtre sur une nouvelle médecine', async ({ page }) => {
  await page.goto('/trouver-un-praticien?specialite=reflexologie')
  await expect(page.locator('#praticien-results-title')).toContainText('en réflexologie')
  await expect(page.locator('main a[href^="/praticiens/"]').first()).toBeVisible()
})
