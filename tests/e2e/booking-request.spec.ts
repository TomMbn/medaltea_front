import { test, expect, type APIRequestContext } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Demande de rendez-vous sur une fiche non revendiquée. Lecture seule : aucune requête d'écriture vers l'API.

async function unclaimedSlug(request: APIRequestContext): Promise<string> {
  const res = await request.get('/api/backend/praticiens?claimed=false&limit=1')
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  const first = (Array.isArray(body) ? body : body?.data ?? [])[0]
  const slug = first?.slug ?? (first?.id ? String(first.id) : '')
  expect(slug, 'aucune fiche non revendiquée dans l\'API configurée').toBeTruthy()
  return slug
}

test('fiche non revendiquée : demande non confirmée annoncée, connexion avec retour sur la fiche', async ({ page, request }) => {
  const slug = await unclaimedSlug(request)
  await page.goto(`/praticiens/${slug}`)
  await expect(page.getByText('elle n\'est pas confirmée')).toBeVisible()
  await expect(page.getByText('Réservation indisponible')).toHaveCount(0)
  const login = page.getByRole('link', { name: 'Se connecter pour envoyer une demande' })
  await expect(login).toHaveAttribute('href', /^\/login\?redirect=/)
})

test('fiche non revendiquée : accessibilité du formulaire de demande', async ({ page, request }) => {
  const slug = await unclaimedSlug(request)
  await page.goto(`/praticiens/${slug}`)
  await page.waitForLoadState('networkidle')
  const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  // Contrastes non bloquants, comme dans a11y.spec.ts (charte en cours de validation)
  const blocking = results.violations.filter(v => (v.impact === 'critical' || v.impact === 'serious') && v.id !== 'color-contrast')
  const summary = blocking.map(v => `${v.id} (${v.impact}) × ${v.nodes.length} : ${v.help} — ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)
  expect(summary, summary.join('\n')).toEqual([])
})

// Patient simulé par les seuls témoins d'interface (sans jeton) : le formulaire s'affiche, rien n'est envoyé.
test('fiche non revendiquée : formulaire du patient (1 à 3 disponibilités, consentement si motif), sans envoi', async ({ page, request, context, baseURL }) => {
  const slug = await unclaimedSlug(request)
  await context.addCookies(['leya_session', 'leya_role'].map((name, i) => ({ name, value: i ? 'patient' : '1', url: baseURL! })))
  await page.goto(`/praticiens/${slug}`)
  await page.waitForLoadState('networkidle') // page hydratée : les boutons réagissent
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeVisible()
  const add = page.getByRole('button', { name: 'Ajouter une disponibilité' })
  await add.click()
  await add.click()
  await expect(page.getByRole('group', { name: /^Disponibilité \d$/ })).toHaveCount(3)
  await expect(add).toHaveCount(0)
  await expect(page.getByRole('checkbox')).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Motif (facultatif)' }).fill('Tensions dans le dos')
  await expect(page.getByRole('checkbox')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeDisabled()
  const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const blocking = results.violations.filter(v => (v.impact === 'critical' || v.impact === 'serious') && v.id !== 'color-contrast')
  expect(blocking.map(v => `${v.id} : ${v.help}`)).toEqual([])
})

test('lien de l\'e-mail au praticien (?revendiquer=1) : la page défile jusqu\'au bloc de revendication', async ({ page, request }) => {
  const slug = await unclaimedSlug(request)
  // Téléphone : la colonne latérale est sous la présentation, hors de l'écran au chargement
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto(`/praticiens/${slug}`)
  const claim = page.getByRole('heading', { name: 'Vous êtes ce praticien ?' })
  await expect(claim).not.toBeInViewport()
  await page.goto(`/praticiens/${slug}?revendiquer=1`)
  await expect(claim).toBeInViewport()
})
