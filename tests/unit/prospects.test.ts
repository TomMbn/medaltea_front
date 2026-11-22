import { describe, it, expect } from 'vitest'
import { PROSPECT_STATUS_LABELS, PROSPECT_STATUS_ORDER, isOpenProspect, prospectEventLabel, nextActionIso, nextActionDay } from '~/utils/prospects'

describe('prospection : statuts et journal (utils/prospects)', () => {
  it('donne un libellé à chacun des 9 statuts, dans l’ordre du parcours', () => {
    expect(PROSPECT_STATUS_ORDER).toEqual(['to_contact', 'contacted', 'interested', 'meeting_planned', 'registered', 'signed', 'not_interested', 'unreachable', 'do_not_contact'])
    expect(PROSPECT_STATUS_LABELS.meeting_planned).toBe('Présentation planifiée')
    expect(PROSPECT_STATUS_LABELS.signed).toBe('Collaboration signée')
    expect(PROSPECT_STATUS_ORDER.every(s => PROSPECT_STATUS_LABELS[s])).toBe(true)
  })

  it('distingue les suivis en cours des suivis clos', () => {
    expect(isOpenProspect('registered')).toBe(true)
    expect(isOpenProspect('signed')).toBe(false)
    expect(isOpenProspect('do_not_contact')).toBe(false)
  })

  it('décrit chaque entrée du journal', () => {
    expect(prospectEventLabel({ kind: 'request' })).toBe('Demande d’un patient')
    expect(prospectEventLabel({ kind: 'call' })).toBe('Appel')
    expect(prospectEventLabel({ kind: 'status', fromStatus: 'to_contact', toStatus: 'contacted' })).toBe('Statut : À contacter → Contacté')
    expect(prospectEventLabel({ kind: 'status', fromStatus: null, toStatus: 'do_not_contact' })).toBe('Statut : Ne pas contacter')
  })
})

describe('prospection : date de relance (heure de Paris)', () => {
  it('fixe la relance à 9 h, heure de Paris, été comme hiver', () => {
    expect(nextActionIso('2026-11-25')).toBe('2026-11-25T09:00:00+01:00')
    expect(nextActionIso('2027-07-01')).toBe('2027-07-01T09:00:00+02:00')
  })

  it('rend le jour de Paris d’une relance pour le champ date, vide sans relance', () => {
    expect(nextActionDay('2026-11-25T08:00:00.000Z')).toBe('2026-11-25')
    expect(nextActionDay('2026-11-25T23:30:00.000Z')).toBe('2026-11-26')
    expect(nextActionDay(null)).toBe('')
  })

  it('refuse un jour mal formé', () => {
    expect(() => nextActionIso('25/11/2026')).toThrow()
  })
})
