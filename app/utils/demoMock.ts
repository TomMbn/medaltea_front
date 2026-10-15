// Faux serveur de la démonstration : répond aux routes de l'espace praticien avec des données fictives.
// Tout vit dans le navigateur (sessionStorage) : rien n'est envoyé au backend, tout disparaît à la fermeture de l'onglet.
import { DEMO_ID, demoFiche, demoDiplomas, demoTypes, demoHours, demoSlots } from './demoData'

export const DEMO_STORAGE_KEY = 'leya-demo-state'

export class DemoError extends Error {
  statusCode: number
  status: number
  data: { message: string }
  response: { status: number }
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = this.status = statusCode
    this.data = { message }
    this.response = { status: statusCode }
  }
}

const at = (h: number, m = 0, dd = 0) => { const d = new Date(); d.setDate(d.getDate() + dd); d.setHours(h, m, 0, 0); return d.toISOString() }
const plus = (iso: string, min: number) => new Date(new Date(iso).getTime() + min * 60000).toISOString()

const PATIENTS = [['Paul', 'Martin'], ['Marie', 'Laurent'], ['Patrick', 'Durand'], ['Lucas', 'Bernard'], ['Inès', 'Roux'], ['Sophie', 'Tessier'], ['Hugo', 'Petit'], ['Léa', 'Moreau'], ['Nina', 'Garnier'], ['Thomas', 'Lefèvre']]
const FIRST = { id: 9001, name: 'Première séance', kind: 'first_visit', durationMin: 60, price: 70, mode: 'cabinet' }
const FOLLOW = { id: 9002, name: 'Séance de suivi', durationMin: 45, price: 55, mode: 'cabinet' }
const VISIO = { id: 9003, name: 'Séance en visio', durationMin: 45, price: 50, mode: 'visio' }

function seed() {
  let n = 1
  const appt = (status: string, start: string, type: any, who: number, extra: any = {}) => ({
    id: n++,
    status,
    startAt: start,
    endAt: plus(start, type.durationMin),
    createdAt: at(10, 0, -((n * 3) % 20)),
    patient: { id: who + 1, firstName: PATIENTS[who][0], lastName: PATIENTS[who][1] },
    consultationType: type,
    userNote: null,
    cancelReason: null,
    proposal: null,
    isGuest: false,
    ...extra,
  })
  const appts = [
    appt('confirmed', at(9), FOLLOW, 0),
    appt('pending', at(10, 30), FIRST, 1, { userNote: 'Je dors mal depuis quelques semaines.' }),
    appt('confirmed', at(14), FOLLOW, 2),
    appt('confirmed', at(16, 30), VISIO, 4),
    appt('pending', at(11, 0, 1), FIRST, 3),
    appt('confirmed', at(9, 45, 1), FOLLOW, 6),
    appt('pending', at(15, 0, 2), FIRST, 5, { isGuest: true, userNote: 'Stress au travail, première approche de la sophrologie.', patient: { id: 6, firstName: 'Sophie', lastName: 'Tessier', email: 'sophie@exemple.fr', phoneNumber: '0611223344' } }),
    appt('confirmed', at(10, 30, 3), FIRST, 7),
    appt('confirmed', at(14, 45, 4), FOLLOW, 8),
    appt('confirmed', at(9, 0, 7), FOLLOW, 9),
    appt('confirmed', at(11, 15, -1), FOLLOW, 0),
    appt('completed', at(16, 0, -2), FIRST, 4),
    appt('completed', at(9, 30, -3), FOLLOW, 3),
    appt('completed', at(15, 0, -3), FIRST, 7),
    appt('completed', at(11, 0, -6), FOLLOW, 9),
    appt('completed', at(10, 0, -4), FOLLOW, 2),
    appt('completed', at(14, 0, -7), FOLLOW, 6),
    appt('cancelled_by_user', at(9, 0, -5), FOLLOW, 8, { cancelReason: 'Empêchement' }),
  ]
  return {
    next: 100,
    apptNext: n,
    settings: { autoConfirm: false, guestBookingMode: 'manual' },
    fiche: { ...demoFiche },
    diplomas: demoDiplomas.map(d => ({ ...d })),
    types: demoTypes.map(t => ({ ...t })),
    hours: demoHours.map(h => ({ ...h })),
    abs: [{ id: 1, startAt: at(14, 0, 5), endAt: at(18, 0, 5), reason: 'Formation' }],
    appts,
  }
}

let state: any = null
function load() {
  if (state) return state
  try { const raw = sessionStorage.getItem(DEMO_STORAGE_KEY); if (raw) state = JSON.parse(raw) } catch { /* stockage indisponible : l'état reste en mémoire */ }
  return state ?? (state = seed())
}
function save() { try { sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state)) } catch { /* idem */ } }

export function resetDemo() { state = seed(); save() }
export function forgetDemo() { state = null; try { sessionStorage.removeItem(DEMO_STORAGE_KEY) } catch { /* idem */ } }

/** Ajoute une demande de rendez-vous « reçue » à l'instant, pour montrer le parcours de confirmation. */
export function simulateRequest() {
  const st = load()
  const who = Math.floor(Math.random() * PATIENTS.length)
  const day = 1 + Math.floor(Math.random() * 6)
  const hour = [9, 10, 11, 14, 15, 16][Math.floor(Math.random() * 6)]
  const type = Math.random() < 0.6 ? FIRST : FOLLOW
  const start = at(hour, 0, day)
  st.appts.unshift({
    id: st.apptNext++, status: 'pending', startAt: start, endAt: plus(start, type.durationMin), createdAt: new Date().toISOString(),
    patient: { id: 200 + who, firstName: PATIENTS[who][0], lastName: PATIENTS[who][1] },
    consultationType: type, userNote: null, cancelReason: null, proposal: null, isGuest: false,
  })
  save()
}

const unavailable = () => new DemoError(403, 'Indisponible dans la démonstration : créez votre compte pour utiliser cette fonction.')

/** Répond à une requête `/api/backend/<path>` ; `undefined` = laisser passer vers le vrai serveur (fiches publiques). */
export function demoRequest(path: string, method: string, query: Record<string, any>, body: any): { data: any } | undefined {
  const st = load()
  const m = method.toUpperCase()
  const num = (re: RegExp) => { const r = re.exec(path); return r ? Number(r[1]) : null }
  const ok = (data: any = { ok: true }) => { save(); return { data } }
  let id: number | null

  if (path === 'users/me') {
    if (m === 'GET') return ok({ id: 9, mail: 'demo@leya-sante.fr', role: 'pro', firstName: st.fiche.firstName, lastName: st.fiche.lastName, praticien: { id: DEMO_ID, autoConfirm: st.settings.autoConfirm } })
    if (m === 'PATCH') return ok({ ...body })
    throw unavailable()
  }
  if (path === 'praticiens/me' && m === 'GET') return ok({ ...st.fiche, diplomas: st.diplomas, guestBookingMode: st.settings.guestBookingMode, autoConfirm: st.settings.autoConfirm })
  if (new RegExp(`^praticiens/${DEMO_ID}$`).test(path) && m === 'PUT') { const { specialityIds, ...rest } = body ?? {}; Object.assign(st.fiche, rest); return ok(st.fiche) }
  if (path === 'praticiens/me/settings' && m === 'PATCH') { Object.assign(st.settings, body); return ok(st.settings) }
  if (path === 'praticiens/me/claim-requests') return ok([])
  if (path === 'tracking/preferences') return ok({ trackingEnabled: false, optOut: true })

  // Prestations
  if (path === 'praticiens/me/consultation-types') {
    if (m === 'GET') return ok(st.types)
    if (m === 'POST') { const t = { id: st.next++, isActive: true, mode: 'cabinet', ...body }; st.types.push(t); return ok(t) }
  }
  if ((id = num(/^praticiens\/me\/consultation-types\/(\d+)$/))) {
    const t = st.types.find((x: any) => x.id === id)
    if (m === 'PATCH') { if (t) Object.assign(t, body); return ok(t) }
    if (m === 'DELETE') { if (t) t.isActive = false; return ok() }
  }
  // Horaires
  if (path === 'praticiens/me/availabilities') {
    if (m === 'GET') return ok(st.hours)
    if (m === 'POST') { const h = { id: st.next++, ...body }; st.hours.push(h); return ok(h) }
  }
  if ((id = num(/^praticiens\/me\/availabilities\/(\d+)$/)) && m === 'DELETE') { st.hours = st.hours.filter((x: any) => x.id !== id); return ok() }
  // Absences
  if (path === 'praticiens/me/unavailabilities') {
    if (m === 'GET') return ok(st.abs)
    if (m === 'POST') { const a = { id: st.next++, ...body }; st.abs.push(a); return ok(a) }
  }
  if ((id = num(/^praticiens\/me\/unavailabilities\/(\d+)$/)) && m === 'DELETE') { st.abs = st.abs.filter((x: any) => x.id !== id); return ok() }
  // Diplômes
  if (path === 'praticiens/me/diplomas' && m === 'POST') { const d = { id: st.next++, ...body }; st.diplomas.push(d); return ok(d) }
  if ((id = num(/^praticiens\/me\/diplomas\/(\d+)$/)) && m === 'DELETE') { st.diplomas = st.diplomas.filter((x: any) => x.id !== id); return ok() }

  // Lien d'abonnement à l'agenda : adresse fictive (non fonctionnelle)
  if (path === 'praticiens/me/calendar-token') return m === 'POST' ? ok({ url: 'https://example.org/calendar/lien-de-demonstration-non-fonctionnel.ics' }) : ok()

  // Rendez-vous
  if (path === 'praticiens/me/appointments' && m === 'GET') return ok(st.appts)
  if ((id = num(/^appointments\/(\d+)\/status$/)) && m === 'PATCH') {
    const a = st.appts.find((x: any) => x.id === id)
    if (a) { a.status = body.status; a.cancelReason = body.reason ?? null; if (a.status === 'confirmed') a.proposal = null }
    return ok(a)
  }
  if ((id = num(/^appointments\/(\d+)\/proposal$/)) && m === 'POST') {
    const a = st.appts.find((x: any) => x.id === id)
    if (a && a.status === 'pending') {
      const start = new Date(body.startAt)
      const dur = new Date(a.endAt).getTime() - new Date(a.startAt).getTime()
      a.proposal = { startAt: start.toISOString(), endAt: new Date(start.getTime() + dur).toISOString(), expiresAt: new Date(Date.now() + 48 * 3600000).toISOString() }
    }
    return ok(a)
  }
  // Créneaux proposés pour « autre horaire »
  if (new RegExp(`^praticiens/${DEMO_ID}/slots$`).test(path)) {
    const from = String(query.from || new Date().toISOString().slice(0, 10))
    return ok(demoSlots(from, String(query.to || from)))
  }
  // Statistiques : vues de la fiche (courbe plausible, sans lien avec de vrais visiteurs)
  if (path === 'praticiens/me/stats' && m === 'GET') {
    const to = query.to ? new Date(`${query.to}T12:00:00`) : new Date()
    const from = query.from ? new Date(`${query.from}T12:00:00`) : new Date(to.getTime() - 29 * 86400000)
    const daily: { date: string; views: number }[] = []
    for (let d = new Date(from); d <= to; d = new Date(d.getTime() + 86400000)) {
      const seedN = d.getDate() * 7 + d.getMonth() * 3
      daily.push({ date: d.toISOString().slice(0, 10), views: 12 + (seedN % 23) + (d.getDay() === 2 ? 15 : 0) })
    }
    return ok({ total: daily.reduce((n, x) => n + x.views, 0), daily })
  }

  // Données publiques (annuaire, fiches, créneaux, réservation sans compte) : servies normalement par la passerelle
  const isPrivate = /^(praticiens\/me|users\/|appointments\/(me|\d)|tracking\/|push\/|admin\/)/.test(path)
  if (m === 'GET' && !isPrivate) return undefined
  if (/^(appointments\/guest|praticiens\/\d+\/view$)/.test(path)) return undefined
  if (m === 'GET') throw new DemoError(404, 'Introuvable dans la démonstration.')
  // Toute autre écriture (photo, suppression de compte, notifications…) : refusée proprement
  throw unavailable()
}
