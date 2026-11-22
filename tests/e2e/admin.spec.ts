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
    for (const path of ['/admin', '/admin/inscriptions', '/admin/reservations', '/admin/demandes', '/admin/economie']) {
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

  test('changer de période : indicateur de mise à jour, puis nouveaux chiffres et nouvelles dates', async ({ page }) => {
    const WEEK = {
      ...OVERVIEW,
      period: { days: 7, from: '2026-11-16', to: '2026-11-22' },
      tiles: { ...OVERVIEW.tiles, appointmentsBooked: { value: 4, previous: 8 } },
    }
    await page.route('**/api/backend/admin/stats/overview**', async (route) => {
      const week = new URL(route.request().url()).searchParams.get('days') === '7'
      // La réponse des 7 jours tarde : les chiffres des 30 jours restent visibles pendant ce temps
      if (week) await new Promise(resolve => setTimeout(resolve, 800))
      await route.fulfill({ json: week ? WEEK : OVERVIEW })
    })
    await page.goto('/admin')
    const content = page.getByTestId('stats-content')
    await expect(page.getByTestId('tile-appointmentsBooked')).toContainText('12')
    await expect(content).toHaveAttribute('aria-busy', 'false')
    await expect(content).toContainText('Du 24 octobre 2026 au 22 novembre 2026')

    const group = page.getByRole('group', { name: 'Période' })
    await expect(group.getByRole('button', { name: '30 jours' })).toHaveAttribute('aria-pressed', 'true')
    await group.getByRole('button', { name: '7 jours' }).click()
    await expect(group.getByRole('button', { name: '7 jours' })).toHaveAttribute('aria-pressed', 'true')
    await expect(content).toHaveAttribute('aria-busy', 'true')

    await expect(page.getByTestId('tile-appointmentsBooked')).toContainText('4')
    await expect(page.getByTestId('tile-appointmentsBooked')).toContainText('−50 %')
    await expect(content).toContainText('Du 16 novembre 2026 au 22 novembre 2026')
    await expect(content).toHaveAttribute('aria-busy', 'false')
  })

  test('erreur du serveur : message d\'alerte, pas de page blanche', async ({ page }) => {
    await stats(page, 'overview', { statusCode: 500, message: 'Erreur' }, 500)
    await page.goto('/admin')
    await expect(page.getByRole('alert')).toContainText('Impossible de charger les indicateurs')
    await expect(page.getByRole('heading', { level: 1, name: 'Vue d’ensemble' })).toBeVisible()
  })
})

const PERIOD = { days: 30, from: '2026-10-24', to: '2026-11-22' }

const SIGNUPS = {
  period: PERIOD,
  newAccounts: { patients: 3, pros: 1 },
  accountsDeleted: 1,
  activeUsers: { all: 40, patients: 34, pros: 6 },
  weekly: [{ week: '2026-11-09', patients: 1, pros: 0 }, { week: '2026-11-16', patients: 2, pros: 1 }],
  patientActivation: { signedUp: 3, bookedRate: 0.3333, medianDays: 2 },
  proActivation: { signedUp: 1, completeRate: 0, medianDays: null },
  retention: [{ week: '2026-11-09', accounts: 12, week1: 0.5, week2: 0.25, week4: 0 }],
}

const BOOKINGS = {
  period: PERIOD,
  booked: 6,
  honoured: 2,
  cancellationRate: 0.3333,
  noShowRate: 0.25,
  praticiensWithBooking: 1,
  leadTime: { medianDays: 4.5, under48hRate: 0.2 },
  confirmationDelay: { medianHours: 6, confirmations: 4 },
  weekly: [
    { week: '2026-11-09', completed: 2, confirmed: 0, pending: 0, noShow: 1, cancelledByUser: 1, cancelledByPraticien: 0 },
    { week: '2026-11-16', completed: 0, confirmed: 1, pending: 0, noShow: 0, cancelledByUser: 0, cancelledByPraticien: 1 },
  ],
  fillRateWeekly: [{ week: '2026-11-09', rate: 0.12 }, { week: '2026-11-16', rate: null }],
  supply: {
    managed: 35,
    bookable: 20,
    unclaimed: 1400,
    bySpeciality: [{ name: 'Naturopathie', visible: 42, bookable: 6 }],
    byCity: [{ city: 'Angers', visible: 120, bookable: 9 }],
  },
}

const REQUESTS = {
  period: PERIOD,
  pending: 1,
  received: 3,
  approvalRate: 0.5,
  avgProcessingDays: 3,
  weekly: [{ week: '2026-11-02', approved: 1, rejected: 1, pending: 0 }, { week: '2026-11-16', approved: 0, rejected: 0, pending: 1 }],
}

const ECONOMY = {
  windowWeeks: 26,
  assumptions: { subscriptionPrice: 99, monthlyMarketingBudget: null },
  managedListings: 35,
  theoreticalMonthlyRevenue: 3465,
  newClients: 12,
  monthlyChurn: 0.1,
  churnByMonth: [{ month: '2026-10', rate: 0.1 }],
  cac: null,
  ltv: 990,
  roas: null,
}

test.describe('cockpit admin : pages d\'indicateurs', () => {
  test.beforeEach(async ({ page, baseURL }) => { await asAdmin(page, baseURL) })
  const tile = (page: Page, id: string) => page.getByTestId(`tile-${id}`)

  test('inscriptions : comptes créés, activation et tableau de rétention', async ({ page }) => {
    await stats(page, 'signups', SIGNUPS)
    await page.goto('/admin/inscriptions')
    await expect(page.getByRole('heading', { level: 1, name: 'Inscriptions' })).toBeVisible()
    await expect(tile(page, 'newPatients')).toContainText('3')
    await expect(tile(page, 'newPros')).toContainText('1')
    await expect(tile(page, 'patientActivation')).toContainText('33,3 %')
    await expect(tile(page, 'proActivation')).toContainText('0 %')
    await expect(tile(page, 'proActivation')).toContainText('Sur 1 inscrit')
    await expect(tile(page, 'proActivation')).not.toContainText('1 inscrits')
    await expect(tile(page, 'patientActivation')).toContainText('Sur 3 inscrits')
    const retention = page.getByRole('table', { name: /Rétention/ })
    await expect(retention.getByRole('row')).toHaveCount(2)
    await expect(retention).toContainText('9 novembre 2026')
    await expect(retention).toContainText('50 %')
    await expect(page.getByRole('figure', { name: /Comptes créés par semaine/ })).toBeVisible()
    await expectAccessible(page)
  })

  test('inscriptions : message clair quand la base de tracking est indisponible (503)', async ({ page }) => {
    await stats(page, 'signups', { statusCode: 503, message: 'Statistiques indisponibles' }, 503)
    await page.goto('/admin/inscriptions')
    await expect(page.getByRole('alert')).toContainText('Les statistiques d’inscription sont indisponibles')
  })

  test('réservations : taux, graphique hebdomadaire avec ses données, offre', async ({ page }) => {
    await stats(page, 'bookings', BOOKINGS)
    await page.goto('/admin/reservations')
    await expect(page.getByRole('heading', { level: 1, name: 'Réservations' })).toBeVisible()
    await expect(tile(page, 'booked')).toContainText('6')
    await expect(tile(page, 'cancellationRate')).toContainText('33,3 %')
    await expect(tile(page, 'confirmationDelay')).toContainText('6 h')
    const chart = page.getByRole('figure', { name: /RDV pris par semaine/ })
    await expect(chart).toBeVisible()
    await chart.getByText('Voir les données').click()
    await expect(chart.getByRole('table')).toContainText('Annulés')
    await expect(chart.getByRole('table').getByRole('row')).toHaveCount(3)
    await expect(page.getByRole('table', { name: /Offre par spécialité/ })).toContainText('Naturopathie')
    await expect(page.getByRole('table', { name: /Offre par ville/ })).toContainText('Angers')
    await expectAccessible(page)
  })

  test('réservations : séries vides et valeurs absentes sans erreur', async ({ page }) => {
    await stats(page, 'bookings', {
      ...BOOKINGS,
      booked: 0,
      cancellationRate: null,
      confirmationDelay: null,
      weekly: [],
      fillRateWeekly: [],
      supply: { managed: 0, bookable: 0, unclaimed: 0, bySpeciality: [], byCity: [] },
    })
    await page.goto('/admin/reservations')
    await expect(tile(page, 'cancellationRate')).toContainText('–')
    await expect(tile(page, 'confirmationDelay')).toContainText('–')
    await expect(page.getByRole('figure', { name: /RDV pris par semaine/ })).toContainText('Aucune donnée sur la période')
  })

  test('demandes : indicateurs et liens vers les pages de traitement', async ({ page }) => {
    await stats(page, 'requests', REQUESTS)
    await page.goto('/admin/demandes')
    await expect(page.getByRole('heading', { level: 1, name: 'Demandes des praticiens' })).toBeVisible()
    await expect(tile(page, 'pending')).toContainText('1')
    await expect(tile(page, 'approvalRate')).toContainText('50 %')
    await expect(tile(page, 'avgProcessingDays')).toContainText('3 jours')
    await expect(page.getByRole('link', { name: 'Traiter les revendications' })).toHaveAttribute('href', '/admin/revendications')
    await expect(page.getByRole('link', { name: 'Vérifier les fiches' })).toHaveAttribute('href', '/admin/fiches')
    // La semaine du 9 novembre, sans demande, apparaît à zéro entre les deux autres
    const chart = page.getByRole('figure', { name: /Demandes de revendication par semaine/ })
    await chart.getByText('Voir les données').click()
    await expect(chart.getByRole('table').getByRole('row')).toHaveCount(4)
    await expect(chart.getByRole('table')).toContainText('9 novembre 2026')
    await expectAccessible(page)
  })

  test('économie : estimations affichées avec leurs hypothèses, tiret sans budget', async ({ page }) => {
    await stats(page, 'economy', ECONOMY)
    await page.goto('/admin/economie')
    await expect(page.getByRole('heading', { level: 1, name: 'Économie' })).toBeVisible()
    await expect(page.getByTestId('assumptions')).toContainText('Estimations')
    await expect(page.getByTestId('assumptions')).toContainText('99 €')
    await expect(page.getByTestId('assumptions')).toContainText('non renseigné')
    await expect(tile(page, 'revenue')).toContainText(/3\s465 €/)
    await expect(tile(page, 'ltv')).toContainText('990 €')
    await expect(tile(page, 'cac')).toContainText('–')
    await expect(tile(page, 'churn')).toContainText('10 %')
    await expectAccessible(page)
  })

  test('économie : erreur du serveur signalée', async ({ page }) => {
    await stats(page, 'economy', { statusCode: 500, message: 'Erreur' }, 500)
    await page.goto('/admin/economie')
    await expect(page.getByRole('alert')).toContainText('Impossible de charger les indicateurs')
  })
})

