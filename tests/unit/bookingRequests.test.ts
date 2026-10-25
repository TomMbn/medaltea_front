import { describe, it, expect } from 'vitest'
import { PERIODS, requestStatusLabel, slotLabel, dateBounds } from '~/utils/bookingRequests'

describe('demandes de rendez-vous (utils/bookingRequests)', () => {
  it('propose les trois moments de la journée', () => {
    expect(PERIODS).toEqual([
      { value: 'morning', label: 'Matin' },
      { value: 'afternoon', label: 'Après-midi' },
      { value: 'evening', label: 'Soir' },
    ])
  })

  it('traduit chaque statut pour le patient', () => {
    expect(requestStatusLabel('pending')).toBe('En attente du praticien')
    expect(requestStatusLabel('accepted')).toBe('Acceptée')
    expect(requestStatusLabel('declined')).toBe('Refusée')
    expect(requestStatusLabel('expired')).toBe('Expirée : le praticien n\'a pas répondu')
    expect(requestStatusLabel('cancelled')).toBe('Annulée')
  })

  it('décrit une disponibilité : jour, date et moment', () => {
    expect(slotLabel({ date: '2025-11-04', period: 'morning' })).toBe('mardi 4 novembre, matin')
    expect(slotLabel({ date: '2026-11-04', period: 'afternoon' })).toBe('mercredi 4 novembre, après-midi')
    expect(slotLabel({ date: '2026-01-01', period: 'evening' })).toBe('jeudi 1 janvier, soir')
  })

  it('borne les dates de demain à J+60 (heure de Paris)', () => {
    // 23 h 30 à Paris le 25 octobre (heure d'hiver) : on est encore le 25
    expect(dateBounds(new Date('2026-10-25T22:30:00Z'))).toEqual({ min: '2026-10-26', max: '2026-12-24' })
    // 0 h 30 à Paris le 26 octobre, alors qu'il est encore le 25 en UTC
    expect(dateBounds(new Date('2026-10-25T23:30:00Z'))).toEqual({ min: '2026-10-27', max: '2026-12-25' })
    // Heure d'été : 0 h 30 à Paris le 15 juillet, 22 h 30 UTC le 14
    expect(dateBounds(new Date('2026-07-14T22:30:00Z'))).toEqual({ min: '2026-07-16', max: '2026-09-13' })
    // Fin d'année
    expect(dateBounds(new Date('2026-12-31T12:00:00Z'))).toEqual({ min: '2027-01-01', max: '2027-03-01' })
  })
})
