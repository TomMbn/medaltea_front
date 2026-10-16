// Outils pour l'édition des horaires hebdomadaires et des absences.

export interface DayDef { n: number; label: string; short: string }
export const DAYS: DayDef[] = [
  { n: 1, label: 'Lundi', short: 'Lun' }, { n: 2, label: 'Mardi', short: 'Mar' }, { n: 3, label: 'Mercredi', short: 'Mer' },
  { n: 4, label: 'Jeudi', short: 'Jeu' }, { n: 5, label: 'Vendredi', short: 'Ven' }, { n: 6, label: 'Samedi', short: 'Sam' },
  { n: 7, label: 'Dimanche', short: 'Dim' },
]

export interface Range { start: string; end: string }          // « HH:MM »
export type Week = Record<number, Range[]>
export interface ServerRange { id: number; dayOfWeek: number; startTime: string; endTime: string }

export const hhmm = (t: unknown) => String(t ?? '').slice(0, 5)
export const toMinutes = (t: string) => { const [h = 0, m = 0] = t.split(':').map(Number); return h * 60 + m }
export const emptyWeek = (): Week => ({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] })
export const cloneWeek = (w: Week): Week => Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v.map(r => ({ ...r }))])) as unknown as Week

export function weekFromServer(list: ServerRange[]): Week {
  const week = emptyWeek()
  for (const r of Array.isArray(list) ? list : []) {
    week[r.dayOfWeek]?.push({ start: hhmm(r.startTime), end: hhmm(r.endTime) })
  }
  for (const d of DAYS) (week[d.n] ?? []).sort((a, b) => a.start.localeCompare(b.start))
  return week
}

/** Erreurs de saisie par jour (fin avant début, plages qui se chevauchent). */
export function validateWeek(week: Week): Record<number, string> {
  const errors: Record<number, string> = {}
  for (const d of DAYS) {
    const ranges = [...(week[d.n] ?? [])].sort((a, b) => a.start.localeCompare(b.start))
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i]!
      if (!r.start || !r.end) { errors[d.n] = 'Renseignez une heure de début et de fin.'; break }
      if (toMinutes(r.end) <= toMinutes(r.start)) { errors[d.n] = "L'heure de fin doit être après l'heure de début."; break }
      if (i > 0 && toMinutes(r.start) < toMinutes(ranges[i - 1]!.end)) { errors[d.n] = 'Deux plages se chevauchent.'; break }
    }
  }
  return errors
}

const key = (day: number, r: Range) => `${day}|${r.start}|${r.end}`

/** Compare la semaine saisie à l'état du serveur : seules les différences sont envoyées. */
export function diffWeek(server: ServerRange[], week: Week) {
  const wanted = new Map<string, { dayOfWeek: number; startTime: string; endTime: string }>()
  for (const d of DAYS) for (const r of week[d.n] ?? []) wanted.set(key(d.n, r), { dayOfWeek: d.n, startTime: r.start, endTime: r.end })

  const existing = new Map<string, ServerRange>()
  for (const s of Array.isArray(server) ? server : []) existing.set(key(s.dayOfWeek, { start: hhmm(s.startTime), end: hhmm(s.endTime) }), s)

  const toDelete = [...existing.entries()].filter(([k]) => !wanted.has(k)).map(([, s]) => s)
  const toAdd = [...wanted.entries()].filter(([k]) => !existing.has(k)).map(([, v]) => v)
  return { toDelete, toAdd }
}

export function weekTotalMinutes(week: Week): number {
  let total = 0
  for (const d of DAYS) for (const r of week[d.n] ?? []) if (r.start && r.end && toMinutes(r.end) > toMinutes(r.start)) total += toMinutes(r.end) - toMinutes(r.start)
  return total
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

export const PRESETS: { id: string; label: string; build: () => Week }[] = [
  {
    id: 'weekday-day',
    label: 'Lun–Ven, 9h–18h',
    build: () => { const w = emptyWeek(); for (const n of [1, 2, 3, 4, 5]) w[n] = [{ start: '09:00', end: '18:00' }]; return w },
  },
  {
    id: 'weekday-lunch',
    label: 'Lun–Ven, avec pause déjeuner',
    build: () => { const w = emptyWeek(); for (const n of [1, 2, 3, 4, 5]) w[n] = [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }]; return w },
  },
  {
    id: 'weekday-sat',
    label: 'Lun–Ven + samedi matin',
    build: () => {
      const w = emptyWeek()
      for (const n of [1, 2, 3, 4, 5]) w[n] = [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }]
      w[6] = [{ start: '09:00', end: '12:00' }]
      return w
    },
  },
]

// ---- Dates (jours calendaires « YYYY-MM-DD », fuseau Europe/Paris pour les instants)

export const pad = (n: number) => String(n).padStart(2, '0')
export const toKey = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`
export const parseKey = (k: string) => { const [y, m, d] = k.split('-').map(Number); return { y, m, d } }

/** Convertit « 2026-10-20 » + « 09:30 » (heure de Paris) en instant ISO 8601 avec décalage. */
export function parisISO(day: string, time: string): string {
  const utcGuess = new Date(`${day}T${time}:00Z`)
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: PARIS_TZ, timeZoneName: 'longOffset' }).formatToParts(utcGuess)
  const offset = parts.find(p => p.type === 'timeZoneName')?.value.replace('GMT', '') || '+00:00'
  const sign = offset.startsWith('-') ? '-' : '+'
  const [oh, om = '00'] = offset.replace(/^[+-]/, '').split(':')
  return `${day}T${time}:00${sign}${pad(Number(oh))}:${om}`
}

export const formatDay = (key: string, withYear = false) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) }).format(new Date(`${key}T12:00:00Z`))

export const monthLabel = (y: number, m: number) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(Date.UTC(y, m - 1, 1, 12)))

export const ABSENCE_REASONS = ['Congés', 'Formation', 'Maladie', 'Autre'] as const
