import { test, expect } from '@playwright/test'

test.describe('comptes : formulaires', () => {
  test('inscription : le mot de passe doit faire 8 caractères avec un chiffre, et les conditions sont obligatoires', async ({ page }) => {
    await page.goto('/register')
    await page.locator('#register-mail').fill('test@exemple.fr')
    await page.locator('#register-password').fill('abcdefgh')
    const invalid = await page.locator('#register-password').evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(invalid).toBe(true)
    await page.locator('#register-password').fill('abcdefg1')
    expect(await page.locator('#register-password').evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(true)
    // Conditions d'utilisation non cochées : le formulaire ne part pas
    await page.getByRole('button', { name: /Créer mon compte/ }).click()
    await expect(page).toHaveURL(/register/)
  })

  test('connexion : des identifiants faux affichent une erreur sans ouvrir de session', async ({ page }) => {
    await page.goto('/login')
    await expect(async () => {
      // On remplit à chaque essai : avant l'hydratation de la page, les champs sont remis à zéro
      await page.locator('input[type="email"]').fill('inconnu@exemple.fr')
      await page.locator('input[type="password"]').fill('MauvaisMotDePasse1')
      await expect(page.locator('input[type="email"]')).toHaveValue('inconnu@exemple.fr', { timeout: 1_000 })
      await page.getByRole('button', { name: /Se connecter/ }).click()
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 4_000 })
    }).toPass({ timeout: 25_000 })
    await expect(page).toHaveURL(/login/)
    const cookies = await page.context().cookies()
    expect(cookies.find(c => c.name === 'token')).toBeUndefined()
  })

  test('les pages privées renvoient vers la connexion', async ({ page }) => {
    for (const path of ['/mon-compte', '/mes-rendez-vous', '/pro', '/chatbot']) {
      await page.goto(path)
      await expect(page, path).toHaveURL(/login/)
    }
  })

  test('l\'administration est inaccessible sans compte administrateur', async ({ page }) => {
    await page.goto('/admin/revendications')
    await expect(page).toHaveURL(/login/)
  })

  test('la passerelle refuse les routes non prévues', async ({ request }) => {
    for (const path of ['/api/backend/users', '/api/backend/praticiens/../users/me', '/api/backend/db-test']) {
      expect((await request.get(path)).status(), path).toBeGreaterThanOrEqual(400)
    }
    expect((await request.get('/api/backend/users/me')).status()).toBe(401)
    expect((await request.post('/api/backend/praticiens', { data: {} })).status()).toBeGreaterThanOrEqual(400)
  })
})
