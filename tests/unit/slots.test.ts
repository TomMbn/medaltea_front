import { describe, it, expect } from 'vitest'
import { normalizeSlots, groupByDay, dayKey, addDays, dayDiff, formatPostalCode, formatTime } from '~/utils/slots'

describe('créneaux (utils/slots)', () => {
  it('accepte plusieurs formes de réponse de l\'API (liste de chaînes, objets, jours)', () => {
    expect(normalizeSlots(['2026-10-20T09:00:00+02:00'])).toEqual(['2026-10-20T09:00:00+02:00'])
    expect(normalizeSlots([{ startAt: '2026-10-20T09:00:00+02:00' }])).toEqual(['2026-10-20T09:00:00+02:00'])
    expect(normalizeSlots({ '2026-10-20': ['09:00', '10:30'] })).toEqual(['2026-10-20T09:00', '2026-10-20T10:30'])
    expect(normalizeSlots({ slots: [{ date: '2026-10-21', slots: ['14:00'] }] })).toEqual(['2026-10-21T14:00'])
  })

  it('renvoie une liste vide pour une réponse absente ou invalide', () => {
    expect(normalizeSlots(null)).toEqual([])
    expect(normalizeSlots(undefined)).toEqual([])
    expect(normalizeSlots('n\'importe quoi')).toEqual([])
  })

  it('groupe les créneaux par jour à l\'heure de Paris et les trie', () => {
    const grouped = groupByDay(['2026-10-21T09:00:00+02:00', '2026-10-20T15:00:00+02:00', '2026-10-20T09:00:00+02:00'])
    expect(Object.keys(grouped)).toEqual(['2026-10-20', '2026-10-21'])
    expect(grouped['2026-10-20']).toEqual(['2026-10-20T09:00:00+02:00', '2026-10-20T15:00:00+02:00'])
  })

  it('compte le jour à l\'heure de Paris (23 h 30 UTC = lendemain à Paris)', () => {
    expect(dayKey('2026-10-20T22:30:00Z')).toBe('2026-10-21')
    expect(formatTime('2026-10-20T07:30:00Z')).toBe('09:30')
  })

  it('calcule les dates relatives', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(dayDiff('2026-10-20', '2026-10-27')).toBe(7)
  })

  it('restitue le zéro initial des codes postaux stockés en nombre', () => {
    expect(formatPostalCode(6000)).toBe('06000')
    expect(formatPostalCode('49000')).toBe('49000')
    expect(formatPostalCode(null)).toBe('00000')
  })
})
