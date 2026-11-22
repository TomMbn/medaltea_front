import { describe, it, expect, vi, afterEach } from 'vitest'
import { RULES, stripPrivate, validateListQuery, validateAppointment, validatePraticienUpdate, validatePreferences, validateClaim, validateStatsQuery, pick, validateBookingRequest, validateBookingAccept, validateBookingDecline, validateUnsubscribe } from '../../server/api/backend/[...path]'
import unsubscribeOneClick from '../../server/api/desinscription-praticien.post'

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
      ['GET', 'praticiens/me/duplicates'], ['POST', 'praticiens/me/duplicates/dismiss'], ['POST', 'praticiens/4/claim-requests'],
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

  it('fiche praticien : l\'e-mail de la fiche (renseigné par l\'admin) est relayé au bon format, jamais renvoyé', () => {
    const rule = find('PUT', 'praticiens/12')
    expect(rule?.body).toContain('mail')
    expect(rule?.own, 'la réponse reste sans champs privés').toBeFalsy()
    expect(validatePraticienUpdate({ mail: ' contact@cabinet.fr ' })).toEqual({ mail: 'contact@cabinet.fr' })
    expect(validatePraticienUpdate({ mail: '' }), '« » efface, comme les autres champs facultatifs').toEqual({ mail: '' })
    for (const bad of [{ mail: 'pas-un-email' }, { mail: 'a@b' }, { mail: 'contact @cabinet.fr' }, { mail: 42 }, { mail: null }, { mail: `${'a'.repeat(250)}@cabinet.fr` }]) {
      expect(() => validatePraticienUpdate(bad as any), JSON.stringify(bad)).toThrow()
    }
  })

  it('préférences du patient : valeurs connues uniquement', () => {
    expect(() => validatePreferences({ budgetBand: 'gratuit' })).toThrow()
    expect(() => validatePreferences({ modes: ['cabinet', 'ovni'] })).toThrow()
  })
})

describe('passerelle : demandes de rendez-vous (praticien non réservable)', () => {
  const routes: { method: string; path: string; auth: boolean; body?: string[]; own?: boolean }[] = [
    { method: 'POST', path: 'booking-requests', auth: true, body: ['praticienId', 'preferredSlots', 'userNote', 'consentHealthData'] },
    { method: 'GET', path: 'booking-requests/me', auth: true },
    { method: 'POST', path: 'booking-requests/12/cancel', auth: true },
    { method: 'GET', path: 'praticiens/me/booking-requests', auth: true },
    { method: 'POST', path: 'praticiens/me/booking-requests/12/accept', auth: true, body: ['startAt', 'durationMin', 'consultationTypeId'] },
    { method: 'POST', path: 'praticiens/me/booking-requests/12/decline', auth: true, body: ['reason'] },
    { method: 'POST', path: 'listing-outreach/unsubscribe', auth: false, body: ['praticienId', 'token'] },
    { method: 'GET', path: 'admin/booking-requests/uncontacted', auth: true, own: true },
  ]

  it('relaie chaque route avec le bon verbe, l\'authentification et la liste blanche attendues', () => {
    for (const { method, path, auth, body, own } of routes) {
      const rule = find(method, path)
      expect(rule, `${method} ${path}`).toBeTruthy()
      expect(rule!.auth, `${method} ${path}`).toBe(auth)
      expect(rule!.body, `${method} ${path}`).toEqual(body)
      expect(rule!.own === true, `${method} ${path}`).toBe(own === true)
    }
  })

  it('refuse chaque route avec un autre verbe', () => {
    for (const { method, path } of routes) {
      for (const other of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(m => m !== method)) {
        expect(find(other, path), `${other} ${path}`).toBeUndefined()
      }
    }
  })

  it('refuse les identifiants non numériques et les chemins voisins', () => {
    for (const [method, path] of [
      ['POST', 'booking-requests/abc/cancel'], ['POST', 'booking-requests/12'], ['GET', 'booking-requests'], ['GET', 'booking-requests/12'],
      ['POST', 'praticiens/me/booking-requests/x/accept'], ['POST', 'praticiens/12/booking-requests/3/accept'], ['GET', 'praticiens/12/booking-requests'],
      ['GET', 'admin/booking-requests'], ['POST', 'listing-outreach/unsubscribe/1'],
    ]) expect(find(method, path), `${method} ${path}`).toBeUndefined()
  })

  it('retire les champs hors liste blanche du corps', () => {
    const rule = find('POST', 'booking-requests')!
    const raw = { praticienId: 5, preferredSlots: [{ date: '2026-11-04', period: 'morning' }], userId: 99, status: 'accepted' }
    const body = validateBookingRequest(pick(raw, rule.body!))
    expect(body).toEqual({ praticienId: 5, preferredSlots: [{ date: '2026-11-04', period: 'morning' }] })
    // Champs inconnus dans une disponibilité : retirés aussi
    expect(validateBookingRequest({ praticienId: 5, preferredSlots: [{ date: '2026-11-04', period: 'evening', hour: '9' }] }).preferredSlots).toEqual([{ date: '2026-11-04', period: 'evening' }])
    expect(pick({ reason: 'Complet', status: 'accepted' }, find('POST', 'praticiens/me/booking-requests/1/decline')!.body!)).toEqual({ reason: 'Complet' })
  })

  it('demande : 1 à 3 disponibilités au format attendu, motif de 500 caractères au plus', () => {
    const slot = (date: string, period: string) => ({ date, period })
    const ok = { praticienId: '7', preferredSlots: [slot('2026-11-04', 'morning'), slot('2026-11-05', 'afternoon'), slot('2026-11-06', 'evening')], userNote: 'x'.repeat(500), consentHealthData: true }
    expect(validateBookingRequest(ok)).toEqual({ ...ok, praticienId: 7 })
    const status = (body: Record<string, any>) => {
      try { validateBookingRequest(body); return 200 } catch (error: any) { return error.statusCode }
    }
    expect(status({ ...ok, preferredSlots: [...ok.preferredSlots, slot('2026-11-07', 'morning')] })).toBe(400)
    expect(status({ ...ok, preferredSlots: [] })).toBe(400)
    expect(status({ ...ok, preferredSlots: 'demain' })).toBe(400)
    expect(status({ ...ok, preferredSlots: [slot('04/11/2026', 'morning')] })).toBe(400)
    expect(status({ ...ok, preferredSlots: [slot('2026-11-04', 'night')] })).toBe(400)
    expect(status({ ...ok, preferredSlots: [null] })).toBe(400)
    expect(status({ ...ok, userNote: 'x'.repeat(501) })).toBe(400)
    expect(status({ ...ok, userNote: 42 })).toBe(400)
    expect(status({ ...ok, praticienId: 'abc' })).toBe(400)
    expect(status({ ...ok, consentHealthData: 'oui' })).toBe(400)
  })

  it('acceptation : instant, durée de 15 à 240 minutes, prestation facultative', () => {
    expect(validateBookingAccept({ startAt: '2026-11-04T09:00:00+01:00', durationMin: 60 })).toEqual({ startAt: '2026-11-04T09:00:00+01:00', durationMin: 60 })
    expect(validateBookingAccept({ startAt: '2026-11-04T09:00:00+01:00', durationMin: 15, consultationTypeId: '3' })).toEqual({ startAt: '2026-11-04T09:00:00+01:00', durationMin: 15, consultationTypeId: 3 })
    for (const bad of [{ startAt: 'demain', durationMin: 60 }, { durationMin: 60 }, { startAt: '2026-11-04T09:00:00Z', durationMin: 14 }, { startAt: '2026-11-04T09:00:00Z', durationMin: 241 }, { startAt: '2026-11-04T09:00:00Z', durationMin: 30.5 }, { startAt: '2026-11-04T09:00:00Z', durationMin: 60, consultationTypeId: 'x' }]) {
      expect(() => validateBookingAccept(bad), JSON.stringify(bad)).toThrow()
    }
  })

  it('refus : motif facultatif de 255 caractères au plus', () => {
    expect(validateBookingDecline({})).toEqual({})
    expect(validateBookingDecline({ reason: 'Je ne prends plus de patients' })).toEqual({ reason: 'Je ne prends plus de patients' })
    expect(() => validateBookingDecline({ reason: 'x'.repeat(256) })).toThrow()
    expect(() => validateBookingDecline({ reason: 3 })).toThrow()
  })

  it('désinscription : identifiant entier et jeton base64url', () => {
    const token = 'A'.repeat(42) + '_'
    expect(validateUnsubscribe({ praticienId: '12', token })).toEqual({ praticienId: 12, token })
    for (const bad of [{ praticienId: 'x', token }, { praticienId: 12 }, { praticienId: 12, token: 'a b' }, { praticienId: 12, token: 'a'.repeat(65) }]) {
      expect(() => validateUnsubscribe(bad), JSON.stringify(bad)).toThrow()
    }
  })
})

describe('passerelle : doublons de fiches', () => {
  it('relaie le choix reprendre / remplacer de la revendication, et rien d’autre', () => {
    expect(find('POST', 'praticiens/4/claim-requests')!.body).toContain('mode')
    expect(validateClaim({ mode: 'takeover' })).toEqual({ mode: 'takeover' })
    expect(validateClaim({ mode: 'replace', message: 'm' })).toEqual({ mode: 'replace', message: 'm' })
    expect(validateClaim({})).toEqual({})
    expect(() => validateClaim({ mode: 'delete' })).toThrow()
  })
})

describe('passerelle : statistiques d\'administration', () => {
  const STATS = ['admin/stats/overview', 'admin/stats/signups', 'admin/stats/bookings', 'admin/stats/requests', 'admin/stats/economy']

  it('relaie les cinq routes en lecture, avec authentification, sans cache partagé ni champs privés', () => {
    for (const path of STATS) {
      const rule = find('GET', path)
      expect(rule?.auth, path).toBe(true)
      expect(rule?.cacheable, path).toBeFalsy()
      expect(rule?.own, path).toBeFalsy()
      expect(rule?.body, path).toBeUndefined()
    }
  })

  it('ne transmet que la période, et aucun paramètre pour economy', () => {
    for (const path of STATS.slice(0, 4)) expect(find('GET', path)?.query, path).toEqual(['days'])
    expect(find('GET', 'admin/stats/economy')?.query).toBeUndefined()
  })

  it('refuse les autres chemins et les autres méthodes', () => {
    for (const path of ['admin/stats', 'admin/stats/', 'admin/stats/users', 'admin/stats/overview/x', 'admin/stats/../praticiens', 'admin/stats/Overview']) {
      expect(find('GET', path), path).toBeUndefined()
    }
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) expect(find(method, 'admin/stats/overview'), method).toBeUndefined()
  })

  it('accepte 7, 30 ou 90 jours, ou aucune période', () => {
    for (const query of [{ days: '7' }, { days: '30' }, { days: '90' }, {}, undefined]) {
      expect(() => validateStatsQuery(query), JSON.stringify(query)).not.toThrow()
    }
  })

  it('refuse toute autre période avec une erreur 400', () => {
    for (const days of ['15', '7abc', '', '-7', '7.0', ['7', '30'], 7.5, null]) {
      let error: any
      try { validateStatsQuery({ days }) } catch (e) { error = e }
      expect(error?.statusCode, JSON.stringify(days)).toBe(400)
    }
  })
})

describe('désinscription en un clic (RFC 8058)', () => {
  const run = async (query: Record<string, string>, fetchImpl: (...args: any[]) => any) => {
    const fetchRaw = vi.fn(fetchImpl)
    vi.stubGlobal('getQuery', () => query)
    vi.stubGlobal('$fetch', { raw: fetchRaw })
    vi.stubGlobal('sendNoContent', (_event: unknown, code = 204) => code)
    vi.stubGlobal('setHeader', () => undefined)
    const result = await (unsubscribeOneClick as any)({})
    return { result, fetchRaw }
  }
  afterEach(() => { vi.unstubAllGlobals() })

  it('relaie l\'identifiant et le jeton au backend, puis répond 204', async () => {
    const token = 'b'.repeat(43)
    const { result, fetchRaw } = await run({ f: '12', t: token }, async () => ({ status: 204 }))
    expect(result).toBe(204)
    expect(fetchRaw).toHaveBeenCalledWith('https://backend.test/listing-outreach/unsubscribe', expect.objectContaining({ method: 'POST', body: { praticienId: 12, token } }))
  })

  it('répond 204 sans appeler le backend si le lien est invalide', async () => {
    for (const query of [{}, { f: 'abc', t: 'b'.repeat(43) }, { f: '12', t: 'a b' }]) {
      const { result, fetchRaw } = await run(query as Record<string, string>, async () => ({ status: 204 }))
      expect(result).toBe(204)
      expect(fetchRaw).not.toHaveBeenCalled()
    }
  })

  it('répond 204 même si le backend est injoignable', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { result } = await run({ f: '12', t: 'b'.repeat(43) }, async () => { throw new Error('ECONNREFUSED') })
    expect(result).toBe(204)
    expect(error).toHaveBeenCalledTimes(1)
    expect(String(error.mock.calls[0])).not.toContain('b'.repeat(43))
    error.mockRestore()
  })
})
