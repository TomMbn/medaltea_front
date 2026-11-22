// Cockpit d'administration : mise en forme des indicateurs renvoyés par GET /api/backend/admin/stats/*.
// Fonctions pures (tests : tests/unit/adminStats.test.ts). L'API renvoie null quand un indicateur n'est pas calculable.

/** Affiché à la place d'une valeur absente (source indisponible, division par zéro) */
export const EMPTY_VALUE = '–'

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
