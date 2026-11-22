import { test, expect } from '@playwright/test'

// Aucun défilement horizontal, du petit téléphone au grand écran.
const SIZES = [[320, 568], [375, 812], [768, 1024], [1024, 768], [1366, 768], [1920, 1080]] as const
const PAGES = ['/', '/medecines', '/medecines/sophrologie', '/medecines/medecine-traditionnelle-chinoise', '/trouver-un-praticien', '/praticiens-pro', '/login', '/register', '/praticiens/demo-claire-fictive']

for (const [w, h] of SIZES) {
  test(`pas de défilement horizontal à ${w} × ${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    for (const path of PAGES) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} à ${w} px`).toBeLessThanOrEqual(1)
    }
  })
}

test('la carte « Demander à Léya » reste visible sans défiler sur un portable courant (1366 × 768)', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('/')
  const box = await page.locator('.search-bar-wrapper').boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(768)
})

test('le formulaire de connexion tient dans un écran de portable peu haut (1280 × 620)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 620 })
  for (const path of ['/login', '/register']) {
    await page.goto(path)
    const scrollable = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
    expect(scrollable, path).toBeLessThanOrEqual(1)
  }
})
