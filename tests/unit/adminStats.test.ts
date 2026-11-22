import { describe, it, expect } from 'vitest'
import { EMPTY_VALUE, formatCount, formatRate, formatEuros, formatDays, formatHours, trendLabel, stackBars } from '~/utils/adminStats'

// Intl sépare les milliers par une espace fine insécable : on la ramène à une espace simple pour comparer
const plain = (s: string) => s.replace(/\s/g, ' ')

describe('cockpit admin : formatage des indicateurs (utils/adminStats)', () => {
  it('affiche un tiret quand la valeur est absente, jamais « null » ni « NaN »', () => {
    for (const format of [formatCount, formatRate, formatEuros, formatDays, formatHours]) {
      expect(format(null)).toBe(EMPTY_VALUE)
      expect(format(undefined)).toBe(EMPTY_VALUE)
      expect(format(Number.NaN)).toBe(EMPTY_VALUE)
    }
  })

  it('formate les nombres à la française', () => {
    expect(plain(formatCount(1234))).toBe('1 234')
    expect(formatCount(0)).toBe('0')
  })

  it('formate un taux (fraction de 0 à 1) en pourcentage, une décimale au plus', () => {
    expect(plain(formatRate(0.256))).toBe('25,6 %')
    expect(plain(formatRate(1 / 3))).toBe('33,3 %')
    expect(plain(formatRate(0.5))).toBe('50 %')
    expect(plain(formatRate(0))).toBe('0 %')
  })

  it('formate les montants en euros', () => {
    expect(plain(formatEuros(990))).toBe('990 €')
    expect(plain(formatEuros(3465))).toBe('3 465 €')
    expect(plain(formatEuros(250.5))).toBe('250,5 €')
  })

  it('formate les durées, au singulier en dessous de 2', () => {
    expect(plain(formatDays(3))).toBe('3 jours')
    expect(plain(formatDays(1))).toBe('1 jour')
    expect(plain(formatDays(1.5))).toBe('1,5 jour')
    expect(plain(formatDays(0))).toBe('0 jour')
    expect(plain(formatHours(6))).toBe('6 h')
  })
})

describe('cockpit admin : évolution par rapport à la période précédente', () => {
  it('donne la variation en pourcentage, avec son signe', () => {
    expect(plain(trendLabel(12, 8))).toBe('+50 %')
    expect(plain(trendLabel(8, 10))).toBe('−20 %')
    expect(trendLabel(5, 5)).toBe('Stable')
  })

  it('ne divise pas par zéro', () => {
    expect(trendLabel(3, 0)).toBe('Nouveau')
    expect(trendLabel(0, 0)).toBe('Stable')
  })

  it('signale l\'absence de comparaison', () => {
    expect(trendLabel(3, null)).toBe('Pas de comparaison')
    expect(trendLabel(null, 3)).toBe('Pas de comparaison')
  })
})

describe('cockpit admin : barres empilées', () => {
  it('empile les séries de bas en haut, à l\'échelle de la plus grande barre', () => {
    const [first, second] = stackBars([{ a: 1, b: 3 }, { a: 0, b: 0 }], ['a', 'b'], 100)
    expect(first).toEqual([{ key: 'a', y: 75, height: 25 }, { key: 'b', y: 0, height: 75 }])
    expect(second).toEqual([{ key: 'a', y: 100, height: 0 }, { key: 'b', y: 100, height: 0 }])
  })

  it('ne produit aucun NaN quand tout est à zéro, ni quand une valeur manque', () => {
    const bars = stackBars([{ a: 0, b: 0 }, { a: 0 }], ['a', 'b'], 100)
    for (const segment of bars.flat()) {
      expect(Number.isFinite(segment.y)).toBe(true)
      expect(segment.height).toBe(0)
    }
  })

  it('renvoie une liste vide sans données', () => {
    expect(stackBars([], ['a'], 100)).toEqual([])
  })
})
