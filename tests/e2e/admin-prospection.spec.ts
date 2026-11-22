import { test, expect, type Page, type Request } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Onglet Prospection de l'admin. Session admin simulée par les témoins d'interface, API simulée : aucun appel au
// backend, données fictives.

const JEANNE = {
  praticien: { id: 12, slug: 'jeanne-martin-angers', firstName: 'Jeanne', lastName: 'Martin', city: 'Angers', phoneNumber: '0241000000', mail: 'jeanne@exemple.fr', claimed: false },
  status: 'to_contact',
  nextActionAt: null,
  alert: true,
  requests: { pending: 2, total: 3, lastAt: '2026-11-21T10:00:00.000Z', nextExpiresAt: '2026-11-29T10:00:00.000Z' },
  lastContactAt: null,
  emailsSent: 1,
  optedOut: false,
  updatedAt: '2026-11-21T10:00:00.000Z',
}
const PAUL = {
  ...JEANNE,
  praticien: { ...JEANNE.praticien, id: 13, slug: 'paul-durand-nantes', firstName: 'Paul', lastName: 'Durand', city: 'Nantes', mail: null },
  status: 'do_not_contact',
  alert: false,
  requests: { pending: 0, total: 1, lastAt: '2026-11-01T10:00:00.000Z', nextExpiresAt: null },
  optedOut: true,
}
const SUMMARY = {
  byStatus: { to_contact: 1, contacted: 2, interested: 0, meeting_planned: 1, registered: 0, signed: 1, not_interested: 0, unreachable: 0, do_not_contact: 1 },
  alerts: 3,
  toContact: 1,
  followUpsDue: 2,
}
const EVENTS = [
  { id: 2, kind: 'call', fromStatus: null, toStatus: null, note: 'Messagerie, rappeler jeudi', adminName: 'Léo', createdAt: '2026-11-22T09:00:00.000Z' },
  { id: 1, kind: 'request', fromStatus: null, toStatus: null, note: null, adminName: null, createdAt: '2026-11-21T10:00:00.000Z' },
]

async function asAdmin(page: Page, baseURL: string | undefined) {
  await page.context().addCookies([
    { name: 'leya_session', value: '1', url: baseURL! },
    { name: 'leya_role', value: 'admin', url: baseURL! },
  ])
}

/** API simulée ; renvoie les requêtes reçues pour vérifier ce que la page envoie */
async function mockApi(page: Page, { list = [JEANNE, PAUL], listStatus = 200 } = {}) {
  const calls: Request[] = []
  await page.route('**/api/backend/admin/prospects**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname.replace('/api/backend/', '')
    calls.push(request)
    if (path === 'admin/prospects/summary') return route.fulfill({ json: SUMMARY })
    if (path === 'admin/prospects' && request.method() === 'GET') {
      return listStatus === 200 ? route.fulfill({ json: list }) : route.fulfill({ status: listStatus, json: { statusCode: listStatus } })
    }
    if (/^admin\/prospects\/\d+\/events$/.test(path) && request.method() === 'GET') return route.fulfill({ json: EVENTS })
    if (/^admin\/prospects\/\d+\/events$/.test(path) && request.method() === 'POST') {
      const body = request.postDataJSON()
      return route.fulfill({ status: 201, json: { id: 3, kind: body.kind, fromStatus: null, toStatus: null, note: body.note ?? null, adminName: 'Léo', createdAt: '2026-11-22T10:00:00.000Z' } })
    }
    if (/^admin\/prospects\/\d+$/.test(path) && request.method() === 'PATCH') {
      const body = request.postDataJSON()
      return route.fulfill({ json: { ...JEANNE, ...('status' in body ? { status: body.status, alert: body.status === 'to_contact' } : {}), ...('nextActionAt' in body ? { nextActionAt: body.nextActionAt } : {}) } })
    }
    return route.fulfill({ status: 404, json: {} })
  })
  return calls
}

const card = (page: Page, name: string) => page.getByRole('article').filter({ hasText: name })

test.describe('admin : onglet Prospection', () => {
  test.beforeEach(async ({ page, baseURL }) => { await asAdmin(page, baseURL) })

  test('liste : alerte, demandes de patients, contacts, statut ; pastille d’alertes dans la navigation', async ({ page }) => {
    await mockApi(page)
    await page.goto('/admin/prospection')
    await expect(page.getByRole('heading', { level: 1, name: 'Prospection' })).toBeVisible()

    const jeanne = card(page, 'Jeanne Martin')
    await expect(jeanne).toContainText('Angers')
    await expect(jeanne).toContainText('À traiter')
    await expect(jeanne).toContainText('2 demandes de patients en attente')
    await expect(jeanne).toContainText('29 novembre')
    await expect(jeanne).toContainText('1 e-mail d’invitation envoyé')
    await expect(jeanne.getByRole('link', { name: '02 41 00 00 00' })).toHaveAttribute('href', 'tel:0241000000')
    await expect(jeanne.getByRole('link', { name: 'jeanne@exemple.fr' })).toHaveAttribute('href', 'mailto:jeanne@exemple.fr')
    await expect(jeanne.getByRole('link', { name: 'Voir la fiche' })).toHaveAttribute('href', '/praticiens/jeanne-martin-angers')
    await expect(jeanne.getByLabel('Statut')).toHaveValue('to_contact')

    const nav = page.getByRole('navigation', { name: 'Administration' })
    await expect(nav.getByRole('link', { name: /Prospection/ })).toContainText('3')

    // Compteurs par statut
    await expect(page.getByTestId('status-counts')).toContainText('Contacté 2')
    await expect(page.getByTestId('status-counts')).toContainText('Collaboration signée 1')
  })

  test('filtre : « Alertes » relance la liste avec status=alerts', async ({ page }) => {
    const calls = await mockApi(page)
    await page.goto('/admin/prospection')
    await expect(card(page, 'Jeanne Martin')).toBeVisible()
    const request = page.waitForRequest(r => r.url().includes('/api/backend/admin/prospects?') && r.url().includes('status=alerts'))
    await page.getByRole('group', { name: 'Filtre' }).getByRole('button', { name: /Alertes/ }).click()
    await request
    expect(calls.some(r => r.url().includes('status=alerts'))).toBe(true)
  })

  test('changer le statut envoie un PATCH et met la carte à jour', async ({ page }) => {
    const calls = await mockApi(page)
    await page.goto('/admin/prospection')
    const jeanne = card(page, 'Jeanne Martin')
    await jeanne.getByLabel('Statut').selectOption('contacted')
    await expect.poll(() => calls.find(r => r.method() === 'PATCH')?.postDataJSON()).toEqual({ status: 'contacted' })
    await expect(jeanne.getByLabel('Statut')).toHaveValue('contacted')
    await expect(jeanne).not.toContainText('À traiter')
  })

  test('noter un appel avec une note, puis l’historique', async ({ page }) => {
    const calls = await mockApi(page)
    await page.goto('/admin/prospection')
    const jeanne = card(page, 'Jeanne Martin')
    await jeanne.getByLabel('Note').fill('Messagerie, rappeler jeudi')
    await jeanne.getByRole('button', { name: 'Noter un appel' }).click()
    await expect.poll(() => calls.find(r => r.method() === 'POST')?.postDataJSON()).toEqual({ kind: 'call', note: 'Messagerie, rappeler jeudi' })
    await expect(jeanne.getByRole('status')).toContainText('Appel noté')
    await expect(jeanne.getByLabel('Note')).toHaveValue('')

    await jeanne.getByText('Historique').click()
    const history = jeanne.getByRole('list', { name: 'Historique' })
    await expect(history).toContainText('Appel')
    await expect(history).toContainText('Messagerie, rappeler jeudi')
    await expect(history).toContainText('Demande d’un patient')
  })

  test('prochaine relance : 9 h heure de Paris, puis effacée', async ({ page }) => {
    const calls = await mockApi(page)
    await page.goto('/admin/prospection')
    const jeanne = card(page, 'Jeanne Martin')
    await jeanne.getByLabel('Prochaine relance').fill('2026-11-25')
    await jeanne.getByRole('button', { name: 'Enregistrer la relance' }).click()
    await expect.poll(() => calls.filter(r => r.method() === 'PATCH').at(-1)?.postDataJSON()).toEqual({ nextActionAt: '2026-11-25T09:00:00+01:00' })
    await jeanne.getByRole('button', { name: 'Effacer la relance' }).click()
    await expect.poll(() => calls.filter(r => r.method() === 'PATCH').at(-1)?.postDataJSON()).toEqual({ nextActionAt: null })
  })

  test('praticien désinscrit : statut et contacts bloqués, explication affichée', async ({ page }) => {
    await mockApi(page)
    await page.goto('/admin/prospection')
    const paul = card(page, 'Paul Durand')
    await expect(paul.getByLabel('Statut')).toBeDisabled()
    await expect(paul).toContainText('S’est désinscrit des e-mails de Léya : ne plus le solliciter.')
    await expect(paul.getByRole('button', { name: 'Noter un appel' })).toHaveCount(0)
    await expect(paul.getByRole('button', { name: 'Ajouter une note' })).toBeVisible()
  })

  test('liste vide et erreur du serveur', async ({ page }) => {
    await mockApi(page, { list: [] })
    await page.goto('/admin/prospection')
    await expect(page.getByText('Aucun praticien à suivre')).toBeVisible()
    await page.unrouteAll()
    await mockApi(page, { listStatus: 500 })
    await page.reload()
    await expect(page.getByRole('alert')).toContainText('Impossible de charger la prospection')
  })

  test('accessibilité', async ({ page }) => {
    await mockApi(page)
    await page.goto('/admin/prospection')
    await expect(card(page, 'Jeanne Martin')).toBeVisible()
    const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const blocking = results.violations.filter(v => (v.impact === 'critical' || v.impact === 'serious') && v.id !== 'color-contrast')
    expect(blocking.map(v => `${v.id} : ${v.help} — ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)).toEqual([])
  })

  test('vue d’ensemble : praticiens à contacter et relances dues, avec lien vers la prospection', async ({ page }) => {
    await mockApi(page)
    await page.route('**/api/backend/admin/stats/overview**', r => r.fulfill({ json: {
      period: { days: 30, from: '2026-10-24', to: '2026-11-22' },
      trackingAvailable: true,
      tiles: Object.fromEntries(['newPatients', 'newPros', 'chatMessages', 'appointmentsBooked', 'praticiensWithBooking'].map(k => [k, { value: 1, previous: 1 }])),
      toHandle: { pendingClaims: 0, oldestPendingClaimDays: null, chatQuotaReached: 0, prospectsToContact: 2, prospectFollowUpsDue: 1 },
    } }))
    await page.goto('/admin')
    const toHandle = page.getByTestId('to-handle')
    await expect(toHandle).toContainText('2 praticiens demandés par des patients à contacter')
    await expect(toHandle).toContainText('1 relance de prospection due')
    await expect(toHandle.getByRole('link', { name: 'Ouvrir la prospection' }).first()).toHaveAttribute('href', '/admin/prospection')
  })
})
