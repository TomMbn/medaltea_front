import { describe, it, expect } from 'vitest'
import { normalizeAppointment, normalizeAppointments, isActiveStatus, apiErrorMessage, apiStatus } from '~/utils/appointments'

describe('rendez-vous (utils/appointments)', () => {
  const raw = {
    id: 12, status: 'pending', startAt: '2026-10-20T09:00:00.000Z', endAt: '2026-10-20T10:00:00.000Z',
    consultationType: { id: 3, name: 'Première séance', durationMin: 60, price: 70, mode: 'cabinet', kind: 'first_visit' },
    praticien: { id: 5, firstName: 'Claire', lastName: 'Démo', city: 'Angers', address: '12 rue Saint-Aubin' },
    patient: { id: 8, firstName: 'Marie', lastName: 'Laurent', mail: 'marie@exemple.fr' },
    userNote: 'Je dors mal',
  }

  it('normalise un rendez-vous complet', () => {
    const a = normalizeAppointment(raw)
    expect(a).toMatchObject({ id: 12, status: 'pending', typeName: 'Première séance', durationMin: 60, price: 70, typeId: 3, praticienCity: 'Angers', isGuest: false, proposal: null })
    expect(a.userNote).toBe('Je dors mal')
  })

  it('pour un invité, le contact est l\'e-mail et le téléphone', () => {
    const a = normalizeAppointment({ ...raw, isGuest: true, patient: { firstName: 'Sophie', lastName: 'T', email: 's@e.fr', phoneNumber: '0611223344' } })
    expect(a.isGuest).toBe(true)
    expect(a.patientContact).toBe('s@e.fr · 0611223344')
  })

  it('lit une proposition d\'autre créneau', () => {
    const a = normalizeAppointment({ ...raw, proposal: { startAt: '2026-10-22T09:00:00Z', endAt: '2026-10-22T10:00:00Z', expiresAt: '2026-10-21T09:00:00Z' } })
    expect(a.proposal?.startAt).toBe('2026-10-22T09:00:00Z')
  })

  it('ignore les éléments sans identifiant et accepte {data} ou {items}', () => {
    expect(normalizeAppointments([{ status: 'pending' }, raw])).toHaveLength(1)
    expect(normalizeAppointments({ data: [raw] })).toHaveLength(1)
    expect(normalizeAppointments({ items: [raw] })).toHaveLength(1)
    expect(normalizeAppointments(null)).toEqual([])
  })

  it('distingue les statuts actifs', () => {
    expect(isActiveStatus('pending')).toBe(true)
    expect(isActiveStatus('confirmed')).toBe(true)
    expect(isActiveStatus('cancelled_by_user')).toBe(false)
  })

  it('extrait un message d\'erreur lisible', () => {
    expect(apiErrorMessage({ data: { message: 'Créneau déjà pris' } })).toBe('Créneau déjà pris')
    expect(apiErrorMessage({ data: { message: ['a', 'b'] } })).toBe('a b')
    expect(apiErrorMessage({}, 'repli')).toBe('repli')
    expect(apiStatus({ response: { status: 409 } })).toBe(409)
  })
})
