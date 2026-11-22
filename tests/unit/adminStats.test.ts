import { describe, it, expect } from 'vitest'
import { EMPTY_VALUE, formatCount, formatRate, formatEuros, formatDays, formatHours, formatRatio, formatStatsDay, formatStatsShortDay, formatStatsMonth, trendLabel, stackBars, fillWeeks, countLabel, safeExternalLink } from '~/utils/adminStats'

// Intl sépare les milliers par une espace fine insécable : on la ramène à une espace simple pour comparer
const plain = (s: string) => s.replace(/\s/g, ' ')

describe('cockpit admin : formatage des indicateurs (utils/adminStats)', () => {
  it('affiche un tiret quand la valeur est absente, jamais « null » ni « NaN »', () => {
    for (const format of [formatCount, formatRate, formatEuros, formatDays, formatHours, formatRatio]) {
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

describe('cockpit admin : ratios et dates', () => {
  it('formate un ratio avec deux décimales au plus', () => {
    expect(formatRatio(0.55)).toBe('0,55')
    expect(formatRatio(2)).toBe('2')
  })

  it('formate les jours et les mois renvoyés par l\'API (YYYY-MM-DD, YYYY-MM), sans décalage de fuseau', () => {
    expect(formatStatsDay('2026-11-09')).toBe('9 novembre 2026')
    expect(formatStatsDay('2026-01-01')).toBe('1 janvier 2026')
    expect(formatStatsShortDay('2026-11-09')).toBe('9 nov.')
    expect(formatStatsMonth('2026-10')).toBe('octobre 2026')
  })

  it('rend le texte reçu tel quel si ce n\'est pas une date', () => {
    expect(formatStatsDay('bientôt')).toBe('bientôt')
    expect(formatStatsMonth('')).toBe('')
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

describe('cockpit admin : semaines sans donnée', () => {
  it('ajoute à zéro les semaines absentes entre la première et la dernière', () => {
    const rows = fillWeeks([{ week: '2026-11-02', a: 1 }, { week: '2026-11-16', a: 2 }], ['a'])
    expect(rows).toEqual([{ week: '2026-11-02', a: 1 }, { week: '2026-11-09', a: 0 }, { week: '2026-11-16', a: 2 }])
  })

  it('traverse un changement d\'heure et un changement d\'année sans décalage', () => {
    expect(fillWeeks([{ week: '2026-10-19', a: 1 }, { week: '2026-11-02', a: 1 }], ['a']).map(r => r.week)).toEqual(['2026-10-19', '2026-10-26', '2026-11-02'])
    expect(fillWeeks([{ week: '2026-12-28', a: 1 }, { week: '2027-01-11', a: 1 }], ['a']).map(r => r.week)).toEqual(['2026-12-28', '2027-01-04', '2027-01-11'])
  })

  it('laisse intactes une liste vide, une seule semaine ou des semaines déjà consécutives', () => {
    expect(fillWeeks([], ['a'])).toEqual([])
    expect(fillWeeks([{ week: '2026-11-02', a: 3 }], ['a'])).toEqual([{ week: '2026-11-02', a: 3 }])
    const full = [{ week: '2026-11-02', a: 1 }, { week: '2026-11-09', a: 2 }]
    expect(fillWeeks(full, ['a'])).toEqual(full)
  })

  it('ne boucle pas sur une date illisible', () => {
    const rows = [{ week: 'bientôt', a: 1 }, { week: '2026-11-09', a: 2 }]
    expect(fillWeeks(rows, ['a'])).toEqual(rows)
  })
})

describe('cockpit admin : accords et liens', () => {
  it('accorde le nom avec le nombre (singulier en dessous de 2)', () => {
    expect(countLabel(0, 'inscrit', 'inscrits')).toBe('0 inscrit')
    expect(countLabel(1, 'inscrit', 'inscrits')).toBe('1 inscrit')
    expect(countLabel(2, 'inscrit', 'inscrits')).toBe('2 inscrits')
    expect(plain(countLabel(1234, 'patient', 'patients'))).toBe('1 234 patients')
  })

  it('n\'accepte qu\'un lien externe en https', () => {
    expect(safeExternalLink('https://data.exemple.fr/dashboard/')).toBe('https://data.exemple.fr/dashboard/')
    for (const bad of ['http://data.exemple.fr', 'javascript:alert(1)', '//data.exemple.fr', 'data.exemple.fr', '', undefined, null, 42]) {
      expect(safeExternalLink(bad), String(bad)).toBe('')
    }
  })
})

