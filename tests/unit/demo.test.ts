import { describe, it, expect, beforeEach } from 'vitest'
import { demoRequest, resetDemo, forgetDemo, simulateRequest, DemoError } from '~/utils/demoMock'
import { demoPublic, DEMO_ID, DEMO_SLUG } from '~/utils/demoData'

// Faux serveur de la démonstration praticien : tout reste dans le navigateur, rien n'est envoyé au backend.
const call = (path: string, method = 'GET', body?: any, query: Record<string, any> = {}) => demoRequest(path, method, query, body)?.data

beforeEach(() => { forgetDemo(); resetDemo() })

describe('démonstration praticien (faux serveur)', () => {
  it('fournit des rendez-vous fictifs, dont des demandes à confirmer', () => {
    const appts = call('praticiens/me/appointments')
    expect(appts.length).toBeGreaterThan(8)
    expect(appts.some((a: any) => a.status === 'pending')).toBe(true)
  })

  it('confirme une demande et conserve le changement', () => {
    const pending = call('praticiens/me/appointments').find((a: any) => a.status === 'pending')
    call(`appointments/${pending.id}/status`, 'PATCH', { status: 'confirmed' })
    expect(call('praticiens/me/appointments').find((a: any) => a.id === pending.id).status).toBe('confirmed')
  })

  it('refuse une demande avec un motif', () => {
    const pending = call('praticiens/me/appointments').find((a: any) => a.status === 'pending')
    call(`appointments/${pending.id}/status`, 'PATCH', { status: 'cancelled_by_praticien', reason: 'Indisponible' })
    const after = call('praticiens/me/appointments').find((a: any) => a.id === pending.id)
    expect(after.status).toBe('cancelled_by_praticien')
    expect(after.cancelReason).toBe('Indisponible')
  })

  it('« Simuler une demande » ajoute une demande en attente ; « Réinitialiser » remet l\'état de départ', () => {
    const before = call('praticiens/me/appointments').filter((a: any) => a.status === 'pending').length
    simulateRequest()
    expect(call('praticiens/me/appointments').filter((a: any) => a.status === 'pending').length).toBe(before + 1)
    resetDemo()
    expect(call('praticiens/me/appointments').filter((a: any) => a.status === 'pending').length).toBe(before)
  })

  it('enregistre une modification de la fiche et une nouvelle prestation', () => {
    call(`praticiens/${DEMO_ID}`, 'PUT', { tagline: 'Nouvelle accroche' })
    expect(call('praticiens/me').tagline).toBe('Nouvelle accroche')
    const before = call('praticiens/me/consultation-types').length
    call('praticiens/me/consultation-types', 'POST', { name: 'Séance courte', durationMin: 30, price: 40 })
    expect(call('praticiens/me/consultation-types')).toHaveLength(before + 1)
  })

  it('refuse proprement ce qui exige le vrai serveur (photo, suppression de compte, notifications)', () => {
    for (const [path, method] of [['praticiens/me/photo', 'POST'], ['users/me', 'DELETE'], ['push/subscriptions', 'POST']] as const) {
      expect(() => demoRequest(path, method, {}, {}), `${method} ${path}`).toThrow(DemoError)
    }
  })

  it('laisse passer les routes publiques vers la passerelle (annuaire, fiches, réservation sans compte)', () => {
    expect(demoRequest('praticiens', 'GET', {}, undefined)).toBeUndefined()
    expect(demoRequest('specialites', 'GET', {}, undefined)).toBeUndefined()
    expect(demoRequest('appointments/guest', 'POST', {}, {})).toBeUndefined()
  })

  it('la démo liste une demande', () => {
    const requests = call('praticiens/me/booking-requests')
    expect(requests).toHaveLength(1)
    expect(requests[0]).toMatchObject({ status: 'pending', patient: { firstName: expect.any(String), lastName: expect.any(String) } })
    expect(requests[0].preferredSlots.length).toBeGreaterThan(0)
    expect(Date.parse(requests[0].expiresAt)).toBeGreaterThan(Date.now())
  })

  it('accepter en démo la retire et ajoute un RDV confirmé', () => {
    const [request] = call('praticiens/me/booking-requests')
    const startAt = new Date(Date.now() + 20 * 864e5).toISOString()
    const appt = call(`praticiens/me/booking-requests/${request.id}/accept`, 'POST', { startAt, durationMin: 30, consultationTypeId: 9002 })
    expect(call('praticiens/me/booking-requests')).toHaveLength(0)
    const created = call('praticiens/me/appointments').find((a: any) => a.id === appt.id)
    expect(created).toMatchObject({ status: 'confirmed', startAt, patient: request.patient, consultationType: { id: 9002 } })
    expect(Date.parse(created.endAt) - Date.parse(startAt)).toBe(30 * 60000)
  })

  it('accepter en démo sur un créneau occupé répond 409 et garde la demande', () => {
    const [request] = call('praticiens/me/booking-requests')
    const busy = call('praticiens/me/appointments').find((a: any) => a.status === 'confirmed' && Date.parse(a.startAt) > Date.now())
    expect(() => call(`praticiens/me/booking-requests/${request.id}/accept`, 'POST', { startAt: busy.startAt, durationMin: 60 })).toThrow(DemoError)
    expect(call('praticiens/me/booking-requests')).toHaveLength(1)
  })

  it('refuser en démo la retire', () => {
    const [request] = call('praticiens/me/booking-requests')
    call(`praticiens/me/booking-requests/${request.id}/decline`, 'POST', { reason: 'Je ne prends plus de nouveaux patients' })
    expect(call('praticiens/me/booking-requests')).toHaveLength(0)
  })

  it('génère un lien d\'agenda fictif et non fonctionnel', () => {
    expect(call('praticiens/me/calendar-token', 'POST').url).toMatch(/^https:\/\/example\.org\/.+\.ics$/)
  })
})

describe('fiche publique de démonstration (servie par la passerelle)', () => {
  it('répond uniquement pour le praticien fictif', () => {
    expect(demoPublic(`slug/${DEMO_SLUG}`)).toMatchObject({ id: DEMO_ID, slug: DEMO_SLUG })
    expect(demoPublic(String(DEMO_ID))).toBeTruthy()
    expect(demoPublic('12')).toBeUndefined()
    expect(demoPublic('slug/un-vrai-praticien')).toBeUndefined()
  })

  it('ne propose que des créneaux à venir', () => {
    const day = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)
    const slots = demoPublic(`${DEMO_ID}/slots`, { from: day, to: day }) as string[]
    for (const s of slots) expect(Date.parse(s)).toBeGreaterThan(Date.now())
  })
})
