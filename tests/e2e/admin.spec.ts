import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Cockpit d'administration. Aucun compte réel ni appel au backend : la session admin est simulée par les témoins
// d'interface (le backend reste seul juge des accès) et les statistiques sont des données fictives.

const OVERVIEW = {
  period: { days: 30, from: '2026-10-24', to: '2026-11-22' },
  trackingAvailable: true,
  tiles: {
    newPatients: { value: 24, previous: 16 },
    newPros: { value: 3, previous: 3 },
    chatMessages: { value: 140, previous: 0 },
    appointmentsBooked: { value: 12, previous: 8 },
    praticiensWithBooking: { value: 5, previous: 4 },
  },
  toHandle: { pendingClaims: 2, oldestPendingClaimDays: 3, chatQuotaReached: 1 },
}

async function asAdmin(page: Page, baseURL: string | undefined) {
  await page.context().addCookies([
    { name: 'leya_session', value: '1', url: baseURL! },
    { name: 'leya_role', value: 'admin', url: baseURL! },
  ])
}

const stats = (page: Page, route: string, json: unknown, status = 200) =>
  page.route(`**/api/backend/admin/stats/${route}**`, r => r.fulfill({ status, json }))

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const blocking = results.violations.filter(v => (v.impact === 'critical' || v.impact === 'serious') && v.id !== 'color-contrast')
  const summary = blocking.map(v => `${v.id} (${v.impact}) × ${v.nodes.length} : ${v.help} — ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)
  expect(summary, summary.join('\n')).toEqual([])
}

test.describe('cockpit admin : accès', () => {
  test('sans session, les pages du cockpit renvoient vers la connexion', async ({ page }) => {
    for (const path of ['/admin']) {
      await page.goto(path)
      await expect(page, path).toHaveURL(/login/)
    }
  })

  test('un compte patient est renvoyé vers l\'accueil', async ({ page, baseURL }) => {
    await page.context().addCookies([
      { name: 'leya_session', value: '1', url: baseURL! },
      { name: 'leya_role', value: 'patient', url: baseURL! },
    ])
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe('cockpit admin : vue d\'ensemble', () => {
  test.beforeEach(async ({ page, baseURL }) => { await asAdmin(page, baseURL) })

  test('six tuiles avec leur évolution, éléments à traiter et navigation', async ({ page }) => {
    await stats(page, 'overview', OVERVIEW)
    await page.goto('/admin')
    await expect(page.getByRole('heading', { level: 1, name: 'Vue d’ensemble' })).toBeVisible()

    const tile = (id: string) => page.getByTestId(`tile-${id}`)
    await expect(tile('appointmentsBooked')).toContainText('RDV pris')
    await expect(tile('appointmentsBooked')).toContainText('12')
    await expect(tile('appointmentsBooked')).toContainText('+50 %')
    await expect(tile('newPatients')).toContainText('24')
    await expect(tile('newPros')).toContainText('Stable')
    await expect(tile('chatMessages')).toContainText('Nouveau')
    await expect(tile('praticiensWithBooking')).toContainText('5')
    await expect(tile('pendingClaims')).toContainText('2')
    await expect(page.getByTestId('tiles').getByRole('listitem')).toHaveCount(6)

    const toHandle = page.getByTestId('to-handle')
    await expect(toHandle).toContainText('2 demandes de revendication en attente')
    await expect(toHandle).toContainText('depuis 3 jours')
    await expect(toHandle.getByRole('link', { name: /Traiter/ })).toHaveAttribute('href', '/admin/revendications')
    await expect(toHandle).toContainText('Quota de l’assistant atteint 1 fois')

    const nav = page.getByRole('navigation', { name: 'Administration' })
    for (const name of ['Vue d’ensemble', 'Inscriptions', 'Réservations', 'Demandes', 'Économie', 'Revendications', 'Fiches']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
    }
    await expectAccessible(page)
  })

  test('base de tracking indisponible : tirets et message, les autres tuiles restent affichées', async ({ page }) => {
    const unavailable = { value: null, previous: null }
    await stats(page, 'overview', {
      ...OVERVIEW,
      trackingAvailable: false,
      tiles: { ...OVERVIEW.tiles, newPatients: unavailable, newPros: unavailable, chatMessages: unavailable },
      toHandle: { pendingClaims: 0, oldestPendingClaimDays: null, chatQuotaReached: null },
    })
    await page.goto('/admin')
    await expect(page.getByTestId('tile-newPatients')).toContainText('–')
    await expect(page.getByTestId('tile-appointmentsBooked')).toContainText('12')
    await expect(page.getByRole('status').filter({ hasText: 'Suivi des comptes indisponible' })).toBeVisible()
    await expect(page.getByTestId('to-handle')).toContainText('Rien à traiter')
  })

  test('changer de période relance la requête avec days=7', async ({ page }) => {
    await stats(page, 'overview', OVERVIEW)
    await page.goto('/admin')
    await expect(page.getByTestId('tile-appointmentsBooked')).toContainText('12')
    const group = page.getByRole('group', { name: 'Période' })
    await expect(group.getByRole('button', { name: '30 jours' })).toHaveAttribute('aria-pressed', 'true')
    const request = page.waitForRequest(r => r.url().includes('/api/backend/admin/stats/overview') && r.url().includes('days=7'))
    await group.getByRole('button', { name: '7 jours' }).click()
    await request
    await expect(group.getByRole('button', { name: '7 jours' })).toHaveAttribute('aria-pressed', 'true')
  })

  test('erreur du serveur : message d\'alerte, pas de page blanche', async ({ page }) => {
    await stats(page, 'overview', { statusCode: 500, message: 'Erreur' }, 500)
    await page.goto('/admin')
    await expect(page.getByRole('alert')).toContainText('Impossible de charger les indicateurs')
    await expect(page.getByRole('heading', { level: 1, name: 'Vue d’ensemble' })).toBeVisible()
  })
})
