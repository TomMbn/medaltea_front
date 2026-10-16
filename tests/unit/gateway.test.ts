import { describe, it, expect } from 'vitest'
import { RULES, stripPrivate, validateListQuery, validateAppointment, validatePraticienUpdate, validatePreferences, pick } from '../../server/api/backend/[...path]'

// Passerelle front → backend : seules les routes listées sont relayées. Ces tests protègent la liste blanche.
const find = (method: string, path: string) => RULES.find(r => r.method === method && r.pattern.test(path))

describe('passerelle : liste blanche des routes', () => {
  it('relaie les routes publiques attendues, sans authentification', () => {
    for (const path of ['praticiens', 'praticiens/12', 'praticiens/slug/claire-demo-angers', 'praticiens/12/slots', 'specialites', 'disciplines']) {
      const rule = find('GET', path)
      expect(rule, path).toBeTruthy()
      expect(rule!.auth, path).toBe(false)
    }
  })

  it('exige l\'authentification pour l\'espace connecté, praticien et administrateur', () => {
    const protectedRoutes: [string, string][] = [
      ['GET', 'users/me'], ['GET', 'appointments/me'], ['POST', 'appointments'], ['PATCH', 'appointments/5/status'],
      ['GET', 'praticiens/me'], ['GET', 'praticiens/me/appointments'], ['GET', 'praticiens/me/stats'],
      ['POST', 'push/subscriptions'], ['POST', 'praticiens/me/calendar-token'],
      ['GET', 'admin/praticiens'], ['GET', 'admin/claim-requests'], ['PATCH', 'admin/claim-requests/3'], ['PATCH', 'praticiens/4/verification'],
    ]
    for (const [method, path] of protectedRoutes) expect(find(method, path)?.auth, `${method} ${path}`).toBe(true)
  })

  it('refuse tout ce qui n\'est pas listé (création, suppression, listes d\'utilisateurs…)', () => {
    for (const [method, path] of [
      ['POST', 'praticiens'], ['DELETE', 'praticiens/12'], ['PUT', 'praticiens'], ['GET', 'users'], ['GET', 'users/1'],
      ['DELETE', 'appointments/5'], ['PATCH', 'users/me/role'], ['GET', 'db-test'], ['GET', ''], ['GET', 'auth/login'],
    ]) expect(find(method, path), `${method} ${path}`).toBeUndefined()
  })

  it('refuse les chemins truqués (remontée, encodage, retour à la ligne, majuscules)', () => {
    for (const path of ['praticiens/../users/me', 'praticiens/12/../../admin/praticiens', 'praticiens/%2e%2e/users', 'praticiens/12\n', 'praticiens/12/', 'Praticiens', 'praticiens/12abc', 'praticiens/slug/AB', 'praticiens/slug/a/b']) {
      expect(find('GET', path), path).toBeUndefined()
    }
  })

  it('ancre chaque règle (^…$) pour éviter les correspondances partielles', () => {
    for (const r of RULES) {
      expect(r.pattern.source.startsWith('^'), String(r.pattern)).toBe(true)
      expect(r.pattern.source.endsWith('$'), String(r.pattern)).toBe(true)
    }
  })

  it('ne met en cache partagé que des routes publiques ; les champs privés ne sortent que pour le propriétaire', () => {
    for (const r of RULES) {
      if (r.cacheable) expect(r.auth, String(r.pattern)).toBe(false)
      if (r.own) expect(r.auth, String(r.pattern)).toBe(true)
    }
  })
})

describe('passerelle : données privées', () => {
  it('retire les champs privés, y compris dans les objets imbriqués et les listes', () => {
    const out = stripPrivate([{ id: 1, firstName: 'A', mail: 'a@b.fr', rpps: '1', siret: '2', adeli: '3', userId: 9, praticien: { id: 2, mail: 'x@y.fr', city: 'Nantes' } }])
    expect(out[0]).toEqual({ id: 1, firstName: 'A', praticien: { id: 2, city: 'Nantes' } })
  })

  it('ne garde que les champs autorisés du corps de requête', () => {
    expect(pick({ a: 1, b: 2, c: '' }, ['a', 'c'])).toEqual({ a: 1 })
  })
})

describe('passerelle : validation de la recherche', () => {
  const ok = (q: Record<string, any>) => expect(() => validateListQuery(q)).not.toThrow()
  const ko = (q: Record<string, any>) => expect(() => validateListQuery(q)).toThrow()

  it('accepte une recherche valide', () => {
    ok({}); ok({ limit: 100, offset: 20, sort: 'price', mode: 'visio', lat: 47.2, lng: -1.5, radiusKm: 15, minRating: 4, availableWithinDays: 7, bookable: 'true' })
    ok({ bbox: '-1.6,47.1,-1.4,47.3' })
  })

  it('refuse les valeurs hors limites ou inconnues', () => {
    ko({ limit: 0 }); ko({ limit: 101 }); ko({ limit: 'abc' }); ko({ sort: 'prix' }); ko({ mode: 'telephone' })
    ko({ minRating: 0 }); ko({ minRating: 6 }); ko({ availableWithinDays: 31 }); ko({ wheelchairAccessible: 'false' })
    ko({ lat: 91, lng: 0 }); ko({ lat: 47 }); ko({ sort: 'distance' }); ko({ radiusKm: 0, lat: 47, lng: 1 })
  })

  it('refuse une zone de carte invalide ou combinée à un rayon', () => {
    ko({ bbox: '1,2,3' }); ko({ bbox: '200,0,201,1' }); ko({ bbox: 'a,b,c,d' }); ko({ bbox: '-1.6,47.1,-1.4,47.3', radiusKm: 10, lat: 47, lng: -1 })
  })

  it('refuse les tentatives d\'injection dans les paramètres', () => {
    ko({ limit: '1; DROP TABLE' }); ko({ sort: "price' OR 1=1" }); ko({ lat: '47.2<script>', lng: '1' })
  })
})

describe('passerelle : validation des écritures', () => {
  it('rendez-vous : identifiants entiers, motif de 500 caractères au plus', () => {
    expect(validateAppointment({ praticienId: '5', consultationTypeId: 3, startAt: '2026-10-20T09:00:00+02:00' })).toMatchObject({ praticienId: 5, consultationTypeId: 3 })
    expect(() => validateAppointment({ praticienId: 'x', consultationTypeId: 3, startAt: 'a' })).toThrow()
    expect(() => validateAppointment({ praticienId: 1, consultationTypeId: 3, startAt: 5 })).toThrow()
    expect(() => validateAppointment({ praticienId: 1, consultationTypeId: 3, startAt: 'a', userNote: 'x'.repeat(501) })).toThrow()
  })

  it('fiche praticien : formats stricts et champs inconnus ignorés', () => {
    expect(validatePraticienUpdate({ rpps: '12345678901', postalCode: '49000', socialLinks: { facebook: 'https://facebook.com/x' }, role: 'admin' })).toEqual({ rpps: '12345678901', postalCode: '49000', socialLinks: { facebook: 'https://facebook.com/x' } })
    for (const bad of [{ rpps: '123' }, { siret: 'abc' }, { postalCode: '4900' }, { website: 'javascript:alert(1)' }, { socialLinks: { facebook: 'http://x.fr' } }, { socialLinks: { facebook: 'javascript:alert(1)' } }, { latitude: 200 }, { practicingSince: 1800 }, { phoneNumber: '12' }, { isActive: 'oui' }]) {
      expect(() => validatePraticienUpdate(bad as any), JSON.stringify(bad)).toThrow()
    }
  })

  it('préférences du patient : valeurs connues uniquement', () => {
    expect(() => validatePreferences({ budgetBand: 'gratuit' })).toThrow()
    expect(() => validatePreferences({ modes: ['cabinet', 'ovni'] })).toThrow()
  })
})
