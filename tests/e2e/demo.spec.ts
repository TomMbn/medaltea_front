import { test, expect } from '@playwright/test'

// Démonstration de l'espace praticien : entièrement dans le navigateur (aucun appel au backend).
test.describe('démo praticien', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo')
    await expect(page).toHaveURL(/\/pro$/)
    await expect(page.getByText('Mode démonstration.')).toBeVisible()
  })

  test('le tableau de bord montre des rendez-vous et des demandes fictifs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Bonjour Claire/ })).toBeVisible()
    await expect(page.getByText(/demandes? à confirmer/).first()).toBeVisible()
  })

  test('confirmer une demande la fait passer en « confirmé »', async ({ page }) => {
    await page.goto('/pro/rendez-vous')
    const tab = page.getByRole('tab', { name: /^Demandes \(/ })
    await expect(tab).toBeVisible()
    await expect(tab).not.toContainText('(0)') // les données de la démo sont chargées
    const before = Number((await tab.textContent())!.match(/\((\d+)\)/)![1])
    await tab.click()
    await page.getByRole('button', { name: /Lucas Bernard/ }).click()
    await page.getByRole('button', { name: 'Confirmer', exact: true }).click()
    await expect(page.getByRole('tab', { name: /^Demandes \(/ })).toContainText(`(${before - 1})`)
  })

  test('« Simuler une demande » ajoute une demande, « Réinitialiser » la retire', async ({ page }) => {
    await page.goto('/pro/rendez-vous')
    const tab = () => page.getByRole('tab', { name: /^Demandes \(/ })
    const count = async () => Number((await tab().textContent())!.match(/\((\d+)\)/)![1])
    await expect(tab()).not.toContainText('(0)')
    const initial = await count()
    await page.getByRole('button', { name: 'Simuler une demande' }).click()
    await expect.poll(count).toBe(initial + 1)
    await page.getByRole('button', { name: 'Réinitialiser' }).click()
    await expect.poll(count).toBe(initial)
  })

  test('une modification de la fiche est enregistrée pendant la visite', async ({ page }) => {
    await page.goto('/pro/fiche')
    // La présentation est dans un volet repliable : on l'ouvre d'abord
    await page.locator('button[aria-controls="panel-presentation"]').click()
    const bio = page.locator('#f-bio')
    await expect(bio).toBeVisible()
    await bio.fill('Texte de présentation modifié pendant le test, assez long pour être valide.')
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(page.getByText('Fiche enregistrée.')).toBeVisible()
  })

  test('les fonctions qui exigent le vrai serveur sont refusées proprement', async ({ page }) => {
    const res = await page.evaluate(async () => (await fetch('/api/backend/users/me', { method: 'DELETE' })).status)
    expect(res).toBe(403)
  })

  test('« Quitter la démo » ferme l\'espace et ramène à la page Praticiens', async ({ page }) => {
    await page.getByRole('button', { name: 'Quitter la démo' }).click()
    await expect(page).toHaveURL(/praticiens-pro/)
    await page.goto('/pro')
    await expect(page).toHaveURL(/login/)
  })
})
