// Couche d'adaptation : la forme exacte des réponses de l'API (créneaux, types de consultation)
// n'est pas documentée. Ces fonctions acceptent plusieurs formes plausibles.
export interface ConsultationType {
  id: number
  name: string
  durationMin: number
  price?: number | null
  mode?: 'cabinet' | 'visio' | string
}

export const PARIS_TZ = 'Europe/Paris'

export function normalizeTypes(raw: any): ConsultationType[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? []
  return list
    .filter((t: any) => t && t.id != null && t.isActive !== false && t.active !== false)
    .map((t: any) => ({
      id: Number(t.id),
      name: String(t.name ?? 'Consultation'),
      durationMin: Number(t.durationMin ?? t.duration ?? 0),
      price: t.price ?? null,
      mode: t.mode,
    }))
}

function slotStart(item: any): string | undefined {
  if (typeof item === 'string') return item
  return item?.startAt ?? item?.start ?? item?.startTime ?? item?.from ?? item?.datetime ?? undefined
}

/** Renvoie la liste des débuts de créneaux (chaînes ISO 8601 telles que fournies par l'API). */
export function normalizeSlots(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    const out: string[] = []
    for (const item of raw) {
      const nested = item?.slots ?? item?.times ?? item?.availableSlots
      if (Array.isArray(nested)) out.push(...normalizeSlots(nested).map(s => (s.includes('T') ? s : `${item.date ?? item.day}T${s}`)))
      else {
        const s = slotStart(item)
        if (s) out.push(s)
      }
    }
    return out
  }
  if (raw.slots || raw.data || raw.days) return normalizeSlots(raw.slots ?? raw.data ?? raw.days)
  if (typeof raw === 'object') {
    // { "2026-10-20": ["09:00", ...] } ou { "2026-10-20": [{startAt}] }
    return Object.entries(raw).flatMap(([day, values]) =>
      Array.isArray(values)
        ? normalizeSlots(values).map(s => (s.includes('T') ? s : `${day}T${s}`))
        : [],
    )
  }
  return []
}

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: PARIS_TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
export const dayKey = (iso: string) => dayKeyFmt.format(new Date(iso))

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

export const formatDayLabel = (key: string) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${key}T12:00:00Z`))

export const formatLongDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

/** Groupe les créneaux par jour (heure de Paris) et les trie. */
export function groupByDay(slots: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const s of [...slots].sort()) (out[dayKey(s)] ||= []).push(s)
  return out
}

export const addDays = (key: string, n: number) => {
  const d = new Date(`${key}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
export const todayKey = () => dayKeyFmt.format(new Date())

/** Nombre de jours entre deux jours « YYYY-MM-DD ». */
export const dayDiff = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 864e5)

/** Le backend stocke le code postal en nombre : on restitue le zéro initial (6000 → 06000). */
export const formatPostalCode = (value: unknown) => String(value ?? '').replace(/\D/g, '').padStart(5, '0').slice(-5)
