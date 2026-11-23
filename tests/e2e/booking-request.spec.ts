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

// Lien « Ne plus recevoir ces e-mails » : un simple chargement (ou le préchargement par un antivirus) ne désinscrit pas
test('page de désinscription : bouton de confirmation, aucun appel à l\'API avant le clic', async ({ page }) => {
  const calls: string[] = []
  page.on('request', r => { if (/unsubscribe|desinscription-praticien/.test(r.url())) calls.push(`${r.method()} ${r.url()}`) })
  await page.goto('/praticiens/desinscription?f=1&t=x')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('button', { name: 'Confirmer : ne plus recevoir ces e-mails' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  expect(calls).toEqual([])
})

// « Demandes sans contact » : l'admin retrouve la fiche, puis renseigne son e-mail (édition existante PUT praticiens/<id>).
// Rôle simulé par les témoins d'interface. Toute requête vers la passerelle est servie par le test, le reste est
// coupé : rien n'atteint l'API (aucune écriture). Service worker bloqué pour que l'interception soit certaine.
test.describe('administration (API simulée dans le navigateur)', () => {
  test.use({ serviceWorkers: 'block' })

  test('demandes sans contact : l\'admin retrouve la fiche et renseigne son e-mail', async ({ page, context, baseURL }) => {
    const fiche = { id: 987654, slug: 'claire-essai-angers', firstName: 'Claire', lastName: 'Essai', city: 'Angers', phoneNumber: '02 41 00 00 00', claimed: false, isVerified: false, mail: null }
    const searches: (string | null)[] = []
    const writes: string[] = []
    const unexpected: string[] = []
    await page.route(/\/api\/backend\//, (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const call = `${request.method()} ${url.pathname.replace('/api/backend/', '')}`
      if (call === 'GET admin/claim-requests') return route.fulfill({ json: [] })
      // Pastille de l'onglet Prospection, demandée par le menu de l'admin à chaque page
      if (call === 'GET admin/prospects/summary') return route.fulfill({ json: { alerts: 0 } })
      if (call === 'GET admin/booking-requests/uncontacted') {
        return route.fulfill({ json: [{ praticien: fiche, pendingCount: 2, oldestExpiresAt: '2026-11-01T09:00:00.000Z', reason: 'no_email' }] })
      }
      if (call === 'GET admin/praticiens') {
        searches.push(url.searchParams.get('q'))
        return route.fulfill({ json: [fiche], headers: { 'X-Total-Count': '1' } })
      }
      if (call === `PUT praticiens/${fiche.id}`) {
        writes.push(request.postData() ?? '')
        return route.fulfill({ json: { id: fiche.id } })
      }
      unexpected.push(call)
      return route.abort()
    })
    await context.addCookies(['leya_session', 'leya_role'].map((name, i) => ({ name, value: i ? 'admin' : '1', url: baseURL! })))

    await page.goto('/admin/revendications')
    await expect(page.getByText('Pas d’e-mail connu')).toBeVisible()
    await page.getByRole('link', { name: 'Retrouver la fiche pour renseigner l’e-mail' }).click()
    await expect(page.getByRole('searchbox', { name: 'Recherche' })).toHaveValue('Claire Essai')
    await expect(page.getByText('Aucun e-mail connu')).toBeVisible()
    expect(searches).toEqual(['Claire Essai'])

    await page.getByRole('button', { name: 'Renseigner l’e-mail' }).click()
    const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const blocking = results.violations.filter(v => (v.impact === 'critical' || v.impact === 'serious') && v.id !== 'color-contrast')
    expect(blocking.map(v => `${v.id} : ${v.help}`)).toEqual([])
    await page.getByRole('textbox', { name: 'E-mail professionnel de la fiche' }).fill('contact@cabinet-essai.fr')
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page.getByText('E-mail enregistré pour Claire Essai.')).toBeVisible()
    await expect(page.getByText('E-mail : contact@cabinet-essai.fr')).toBeVisible()
    expect(writes.map(w => JSON.parse(w))).toEqual([{ mail: 'contact@cabinet-essai.fr' }])

    // Téléphone : le formulaire rouvert reprend l'e-mail enregistré, sans défilement horizontal
    await page.setViewportSize({ width: 320, height: 700 })
    await page.getByRole('button', { name: 'Modifier l’e-mail' }).click()
    await expect(page.getByRole('textbox', { name: 'E-mail professionnel de la fiche' })).toHaveValue('contact@cabinet-essai.fr')
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
    expect(unexpected).toEqual([])
  })
})
