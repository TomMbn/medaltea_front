// Prospection des praticiens (onglet admin) : libellés et dates. Codes identiques au backend
// (src/domains/prospects/prospect.constants.ts). Fonctions pures, testées dans tests/unit/prospects.test.ts.

export const PROSPECT_STATUS_ORDER = [
  'to_contact',
  'contacted',
  'interested',
  'meeting_planned',
  'registered',
  'signed',
  'not_interested',
  'unreachable',
  'do_not_contact',
] as const
export type ProspectStatus = (typeof PROSPECT_STATUS_ORDER)[number]

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
  to_contact: 'À contacter',
  contacted: 'Contacté',
  interested: 'Intéressé',
  meeting_planned: 'Présentation planifiée',
  registered: 'Inscrit',
  signed: 'Collaboration signée',
  not_interested: 'Pas intéressé',
  unreachable: 'Injoignable',
  do_not_contact: 'Ne pas contacter',
}

const OPEN_STATUSES: readonly ProspectStatus[] = ['to_contact', 'contacted', 'interested', 'meeting_planned', 'registered']

export const isOpenProspect = (status: ProspectStatus) => OPEN_STATUSES.includes(status)

const EVENT_LABELS: Record<string, string> = {
  request: 'Demande d’un patient',
  call: 'Appel',
  email: 'E-mail',
  meeting: 'Rendez-vous',
  note: 'Note',
}

/** Libellé d'une entrée du journal : type d'action, ou changement de statut */
export function prospectEventLabel(event: { kind: string; fromStatus?: ProspectStatus | null; toStatus?: ProspectStatus | null }): string {
  if (event.kind !== 'status') return EVENT_LABELS[event.kind] ?? event.kind
  const to = event.toStatus ? PROSPECT_STATUS_LABELS[event.toStatus] : ''
  return event.fromStatus ? `Statut : ${PROSPECT_STATUS_LABELS[event.fromStatus]} → ${to}` : `Statut : ${to}`
}

const PARIS = 'Europe/Paris'
// Heure de la relance : début de matinée, heure de Paris
const NEXT_ACTION_HOUR = '09:00:00'
const DAY = /^\d{4}-\d{2}-\d{2}$/

/** Décalage de Paris ce jour-là, au format « +01:00 » (heure d'hiver) ou « +02:00 » (heure d'été) */
function parisOffset(day: string): string {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: PARIS, timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${day}T12:00:00Z`))
    .find(part => part.type === 'timeZoneName')?.value ?? 'GMT+01:00'
  return name === 'GMT' ? '+00:00' : name.replace('GMT', '')
}

/** « 2026-11-25 » → instant de relance ISO 8601 à 9 h, heure de Paris */
export function nextActionIso(day: string): string {
  if (!DAY.test(day)) throw new Error('Jour attendu au format AAAA-MM-JJ')
  return `${day}T${NEXT_ACTION_HOUR}${parisOffset(day)}`
}

/** Instant de relance → jour de Paris pour un champ date ; chaîne vide sans relance */
export function nextActionDay(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-CA', { timeZone: PARIS }).format(new Date(iso))
}
