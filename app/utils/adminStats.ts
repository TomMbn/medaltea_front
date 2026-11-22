// Cockpit d'administration : mise en forme des indicateurs renvoyés par GET /api/backend/admin/stats/*.
// Fonctions pures (tests : tests/unit/adminStats.test.ts). L'API renvoie null quand un indicateur n'est pas calculable.

/** Affiché à la place d'une valeur absente (source indisponible, division par zéro) */
export const EMPTY_VALUE = '–'

/**
 * Couleurs des séries des graphiques, prises dans la charte Léya (vert 600, bleu 300, corail 700, corail 500), dans cet
 * ordre fixe. Jeu vérifié pour le daltonisme ; le bleu et le corail clair contrastent peu avec le fond blanc, d'où la
 * légende et le tableau de données toujours présents à côté du graphique.
 */
export const ADMIN_SERIES_COLORS = ['#156f71', '#90bad1', '#a64a45', '#ec7f7a'] as const

type Value = number | null | undefined

const isMissing = (value: Value): value is null | undefined => value == null || !Number.isFinite(value)
const number = (value: number, maximumFractionDigits = 0) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits }).format(value)

export function formatCount(value: Value): string {
  return isMissing(value) ? EMPTY_VALUE : number(value)
}

/** Taux reçu en fraction (0 à 1), affiché en pourcentage avec une décimale au plus */
export function formatRate(rate: Value): string {
  return isMissing(rate) ? EMPTY_VALUE : `${number(rate * 100, 1)} %`
}

export function formatEuros(value: Value): string {
  return isMissing(value) ? EMPTY_VALUE : `${number(value, 2)} €`
}

export function formatDays(value: Value): string {
  return isMissing(value) ? EMPTY_VALUE : `${number(value, 1)} ${value >= 2 ? 'jours' : 'jour'}`
}

export function formatHours(value: Value): string {
  return isMissing(value) ? EMPTY_VALUE : `${number(value, 1)} h`
}

/** Ratio sans unité (ROAS), deux décimales au plus */
export function formatRatio(value: Value): string {
  return isMissing(value) ? EMPTY_VALUE : number(value, 2)
}

// Les jours et les mois arrivent en texte (YYYY-MM-DD, YYYY-MM), déjà calés sur Europe/Paris par l'API :
// on les lit en UTC pour que le fuseau du navigateur ne décale jamais la date affichée.
function formatDate(text: string, pattern: RegExp, options: Intl.DateTimeFormatOptions): string {
  if (!pattern.test(text)) return text
  const date = new Date(`${text.length === 7 ? `${text}-01` : text}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? text : new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'UTC' }).format(date)
}
const DAY = /^\d{4}-\d{2}-\d{2}$/
const MONTH = /^\d{4}-\d{2}$/

/** « 2026-11-09 » → « 9 novembre 2026 » */
export const formatStatsDay = (day: string) => formatDate(day, DAY, { day: 'numeric', month: 'long', year: 'numeric' })
/** « 2026-11-09 » → « 9 nov. » (étiquette d'axe) */
export const formatStatsShortDay = (day: string) => formatDate(day, DAY, { day: 'numeric', month: 'short' })
/** « 2026-10 » → « octobre 2026 » */
export const formatStatsMonth = (month: string) => formatDate(month, MONTH, { month: 'long', year: 'numeric' })

/** Évolution par rapport à la période précédente, de même durée */
export function trendLabel(value: Value, previous: Value): string {
  if (isMissing(value) || isMissing(previous)) return 'Pas de comparaison'
  if (previous === 0) return value > 0 ? 'Nouveau' : 'Stable'
  const change = Math.round(((value - previous) / previous) * 100)
  if (change === 0) return 'Stable'
  return `${change > 0 ? '+' : '−'}${number(Math.abs(change))} %`
}

export type BarSegment = { key: string; y: number; height: number }

/**
 * Géométrie de barres empilées : une barre par ligne, un segment par série, empilés de bas en haut.
 * Les hauteurs sont à l'échelle de la plus grande barre ; une valeur absente compte pour zéro.
 */
export function stackBars(rows: Record<string, unknown>[], keys: string[], height: number): BarSegment[][] {
  const valueOf = (row: Record<string, unknown>, key: string) => (Number.isFinite(row[key]) ? Math.max(0, row[key] as number) : 0)
  const max = Math.max(0, ...rows.map(row => keys.reduce((total, key) => total + valueOf(row, key), 0)))
  return rows.map((row) => {
    let top = height
    return keys.map((key) => {
      const segment = max > 0 ? (valueOf(row, key) / max) * height : 0
      top -= segment
      return { key, y: top, height: segment }
    })
  })
}
