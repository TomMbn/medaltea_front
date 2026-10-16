import { test, expect } from '@playwright/test'

// Recherche de praticiens (interroge l'annuaire réel en lecture seule).
test.describe('recherche de praticiens', () => {
  test('une ville est cherchée dans un rayon de 15 km, triée par distance', async ({ page }) => {
    await page.goto('/trouver-un-praticien?q=Cholet')
    const title = page.locator('#praticien-results-title')
    await expect(title).toContainText('à moins de 15 km de Cholet')
    await expect(page.getByText(/Recherche autour de Cholet/)).toBeVisible()
    await expect(page.locator('main a[href^="/praticiens/"]').first()).toBeVisible()
  })

  test('un nom reste une recherche par nom', async ({ page }) => {
    await page.goto('/trouver-un-praticien?q=Morin')
    await expect(page.locator('#praticien-results-title')).toContainText('pour « Morin »')
    await expect(page.getByText(/Recherche autour de/)).toHaveCount(0)
  })

  test('« Chercher plutôt un praticien nommé » bascule vers la recherche par nom', async ({ page }) => {
    await page.goto('/trouver-un-praticien?q=Cholet')
    await expect(page.locator('#praticien-results-title')).toContainText('à moins de 15 km de Cholet')
    // Le clic n'a d'effet qu'une fois la page hydratée : on réessaie jusqu'à ce que le gestionnaire soit prêt
    await expect(async () => {
      await page.getByRole('button', { name: /Chercher plutôt un praticien nommé/ }).click()
      await expect(page).toHaveURL(/nom=1/, { timeout: 2_000 })
    }).toPass({ timeout: 20_000 })
    await expect(page.locator('#praticien-results-title')).toContainText('pour « Cholet »')
  })

  test('la vue Carte affiche la carte et la liste des praticiens de la zone', async ({ page }) => {
    await page.goto('/trouver-un-praticien?q=Angers&vue=carte')
    await expect(page.locator('.leaflet-container')).toBeVisible()
    await expect(page.locator('#zone-title')).toContainText(/praticiens? sur la carte/)
  })

  test('la page d\'une médecine mène à la recherche filtrée', async ({ page }) => {
    await page.goto('/medecines/sophrologie')
    await page.getByRole('link', { name: /Trouver un praticien|Voir (la liste|les praticiens)/i }).first().click()
    await expect(page).toHaveURL(/trouver-un-praticien/)
  })
})
