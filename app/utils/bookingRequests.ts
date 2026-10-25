// Demandes de rendez-vous auprès d'un praticien non réservable : libellés et bornes du formulaire.
import { PARIS_TZ } from './slots'

export type DayPeriod = 'morning' | 'afternoon' | 'evening'
export type BookingRequestStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled'

export interface PreferredSlot {
  date: string
  period: DayPeriod | string
}

export const PERIODS: { value: DayPeriod; label: string }[] = [
  { value: 'morning', label: 'Matin' },
  { value: 'afternoon', label: 'Après-midi' },
  { value: 'evening', label: 'Soir' },
]

/** Nombre maximal de disponibilités par demande (même limite que le backend). */
export const MAX_PREFERRED_SLOTS = 3

/** Dernier jour proposable, compté depuis aujourd'hui (même limite que le backend). */
export const PREFERRED_DATE_MAX_DAYS = 60

const STATUS_LABELS: Record<BookingRequestStatus, string> = {
  pending: 'En attente du praticien',
  accepted: 'Acceptée',
  declined: 'Refusée',
  expired: 'Expirée : le praticien n\'a pas répondu',
  cancelled: 'Annulée',
}

/** Libellé du statut pour le patient ; un statut inconnu est renvoyé tel quel. */
export const requestStatusLabel = (status: string): string =>
  STATUS_LABELS[status as BookingRequestStatus] ?? status

// Jour calendaire « YYYY-MM-DD » : formaté à midi UTC pour ne jamais changer de jour
const slotDayFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })

/** « mardi 4 novembre, matin » ; sans moment connu, la date seule. */
export function slotLabel(slot: PreferredSlot): string {
  const day = slotDayFmt.format(new Date(`${slot.date}T12:00:00Z`))
  const period = PERIODS.find(p => p.value === slot.period)
  return period ? `${day}, ${period.label.toLowerCase()}` : day
}

const parisDayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: PARIS_TZ, year: 'numeric', month: '2-digit', day: '2-digit' })

const addDays = (day: string, days: number) => {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Dates proposables : de demain à J+60, jours de Paris au format « YYYY-MM-DD ». */
export function dateBounds(now: Date = new Date()): { min: string; max: string } {
  const today = parisDayFmt.format(now)
  return { min: addDays(today, 1), max: addDays(today, PREFERRED_DATE_MAX_DAYS) }
}
