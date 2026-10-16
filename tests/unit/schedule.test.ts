import { describe, it, expect } from 'vitest'
import { emptyWeek, weekFromServer, validateWeek, diffWeek, weekTotalMinutes, formatDuration, parisISO, toMinutes } from '~/utils/schedule'

describe('horaires (utils/schedule)', () => {
  it('construit la semaine depuis les plages du serveur, triées', () => {
    const week = weekFromServer([
      { id: 2, dayOfWeek: 1, startTime: '14:00:00', endTime: '18:00:00' },
      { id: 1, dayOfWeek: 1, startTime: '09:00:00', endTime: '12:00:00' },
    ])
    expect(week[1]).toEqual([{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }])
    expect(week[2]).toEqual([])
  })

  it('détecte une fin avant le début, un chevauchement et une plage incomplète', () => {
    const w = emptyWeek()
    w[1] = [{ start: '10:00', end: '09:00' }]
    w[2] = [{ start: '09:00', end: '12:00' }, { start: '11:00', end: '13:00' }]
    w[3] = [{ start: '', end: '12:00' }]
    w[4] = [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }]
    const errors = validateWeek(w)
    expect(errors[1]).toMatch(/fin doit être après/)
    expect(errors[2]).toMatch(/chevauchent/)
    expect(errors[3]).toMatch(/Renseignez/)
    expect(errors[4]).toBeUndefined()
  })

  it('n\'envoie que les différences avec le serveur', () => {
    const server = [{ id: 1, dayOfWeek: 1, startTime: '09:00:00', endTime: '12:00:00' }, { id: 2, dayOfWeek: 2, startTime: '09:00:00', endTime: '12:00:00' }]
    const w = emptyWeek()
    w[1] = [{ start: '09:00', end: '12:00' }]
    w[3] = [{ start: '10:00', end: '11:00' }]
    const { toDelete, toAdd } = diffWeek(server, w)
    expect(toDelete.map(s => s.id)).toEqual([2])
    expect(toAdd).toEqual([{ dayOfWeek: 3, startTime: '10:00', endTime: '11:00' }])
  })

  it('totalise et formate les durées', () => {
    const w = emptyWeek()
    w[1] = [{ start: '09:00', end: '12:30' }]
    expect(weekTotalMinutes(w)).toBe(210)
    expect(formatDuration(210)).toBe('3 h 30')
    expect(formatDuration(120)).toBe('2 h')
    expect(toMinutes('09:30')).toBe(570)
  })

  it('convertit une heure de Paris en instant avec le bon décalage (été et hiver)', () => {
    expect(parisISO('2026-07-14', '09:30')).toBe('2026-07-14T09:30:00+02:00')
    expect(parisISO('2026-12-14', '09:30')).toBe('2026-12-14T09:30:00+01:00')
  })
})
