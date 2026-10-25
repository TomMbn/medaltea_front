import { test, expect, type Page, type APIRequestContext } from '@playwright/test'

// Note Google et badge « Praticien de confiance » sur la fiche. La fiche vient de l'annuaire réel (lecture seule) ;
// la note Google est simulée : aucun appel facturé par Google, et un résultat stable.

async function ficheAvecNoteGoogle(request: APIRequestContext): Promise<string> {
  const list = await (await request.get('/api/backend/praticiens?limit=50')).json()
  const fiche = list.find((p: { hasGoogleRating?: boolean }) => p.hasGoogleRating)
  expect(fiche, 'aucune fiche avec note Google dans l’annuaire').toBeTruthy()
  return fiche.slug
}

async function simulerNote(page: Page, trustedPractitioner: boolean) {
  await page.route('**/api/backend/praticiens/*/google-rating', route => route.fulfill({
    json: { placeId: 'test', rating: 4.9, userRatingCount: 15, googleMapsUri: null, trustedPractitioner, attribution: 'Google Maps' },
  }))
}

test.describe('note Google sur la fiche praticien', () => {
  test('praticien de confiance : badge dans la carte de la note et dans les repères, logo Google Maps', async ({ page, request }) => {
    const slug = await ficheAvecNoteGoogle(request)
    await simulerNote(page, true)
    await page.goto(`/praticiens/${slug}`)

    // Le logo Google Maps suit le nombre d'avis : pas de « avis Google » en doublon
    const carte = page.getByTestId('google-rating-card')
    await expect(carte).toContainText('15 avis')
    await expect(carte).not.toContainText('avis Google')
    await expect(carte.getByAltText('Google Maps')).toBeVisible()
    await expect(carte.getByText('Praticien de confiance')).toBeVisible()

    const reperes = page.getByRole('list', { name: 'Repères' })
    await expect(reperes).toContainText('4,9 · 15 avis')
    await expect(reperes).not.toContainText('avis Google')
    await expect(reperes.getByText('Praticien de confiance')).toBeVisible()
    await expect(page.getByText('d’après les avis Google, 4,5 ou plus sur au moins 10 avis')).toBeVisible()
    await expect(page.getByText('avis · Google Maps')).toHaveCount(0)
  })

  test('praticien sans le badge : la note reste affichée, sans « Praticien de confiance »', async ({ page, request }) => {
    const slug = await ficheAvecNoteGoogle(request)
    await simulerNote(page, false)
    await page.goto(`/praticiens/${slug}`)

    await expect(page.getByTestId('google-rating-card')).toContainText('15 avis')
    await expect(page.getByText('Praticien de confiance')).toHaveCount(0)
  })
})
