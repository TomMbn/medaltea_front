import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { medecines, getMedecineBySlug } from '~/data/medecines'
import { mentionedMedicineSlugs } from '~/utils/mentions'

// Vitest tourne à la racine du dépôt
const publicDir = resolve('public')
const credits = readFileSync(resolve('documentation/credits-images.md'), 'utf8')

// Slugs renvoyés par GET /specialites en production le 25/10/2026 (table alternativemedicine)
const DISCIPLINES_EN_BASE = [
  'osteopathie', 'naturopathie', 'sophrologie', 'acupuncture', 'hypnotherapie', 'massage',
  'chiropraxie', 'reflexologie', 'shiatsu', 'medecine-traditionnelle-chinoise', 'kinesiologie', 'etiopathie',
]
// Pages ajoutées avec des images libres de droits (une photo par emplacement, créditée)
const NOUVELLES = DISCIPLINES_EN_BASE.slice(6)
const images = (m: (typeof medecines)[number]) => [m.heroImage, m.definitionImage, m.mosaicImage1, m.mosaicImage2, m.mosaicImage3]

describe('pages des médecines', () => {
  it('chaque discipline présente en base a sa page, sans doublon', () => {
    for (const slug of DISCIPLINES_EN_BASE) expect(getMedecineBySlug(slug), slug).toBeDefined()
    expect(new Set(medecines.map(m => m.slug)).size).toBe(medecines.length)
  })

  it.each(medecines.map(m => [m.slug, m] as const))('%s : contenu complet au format des pages existantes', (_, m) => {
    for (const key of ['name', 'nameWithArticle', 'ctaLabel', 'shortDescription', 'heroTagline', 'duration', 'mosaicImage2Tagline'] as const) {
      expect(m[key].trim(), key).not.toBe('')
    }
    expect(m.definitionText.length).toBeGreaterThanOrEqual(2)
    expect(m.conditions.length).toBeGreaterThanOrEqual(6)
    expect(m.steps).toHaveLength(4)
    expect(m.benefits.length).toBeGreaterThanOrEqual(4)
    expect(m.benefits.length).toBeLessThanOrEqual(6)
    expect(m.seo.title).toMatch(/\| Léya$/)
    expect(m.seo.title.length).toBeLessThanOrEqual(65)
    expect(m.seo.description.length).toBeLessThanOrEqual(190)
  })

  it.each(medecines.map(m => [m.slug, m] as const))('%s : l\'icône et les images existent dans public/', (_, m) => {
    for (const path of [m.icon, ...images(m)]) expect(existsSync(`${publicDir}${path}`), path).toBe(true)
  })

  it.each(NOUVELLES)('%s : 5 images rangées dans le dossier de la page', (slug) => {
    for (const path of images(getMedecineBySlug(slug)!)) expect(path.startsWith(`/images/medecines/${slug}/`), path).toBe(true)
  })

  // Les photos libres de droits sont rangées par médecine ; chacune doit être créditée
  it.each(medecines.map(m => [m.slug, m] as const))('%s : chaque photo libre de droits est créditée (source et licence)', (slug, m) => {
    for (const path of images(m).filter(p => p.startsWith(`/images/medecines/${slug}/`))) {
      const row = credits.split('\n').find(l => l.includes(`public${path}`))
      expect(row, `crédit manquant pour ${path}`).toBeDefined()
      expect(row).toMatch(/https:\/\/\S+/)
    }
  })
})

describe('médecines citées par l\'assistant', () => {
  it.each([
    ['La réflexologie plantaire peut vous détendre.', 'reflexologie'],
    ['Un kinésiologue pourra vous accompagner.', 'kinesiologie'],
    ['Le shiatsu travaille par pressions.', 'shiatsu'],
    ['Consultez un chiropracteur pour votre dos.', 'chiropraxie'],
    ['La chiropraxie agit sur la colonne.', 'chiropraxie'],
    ['Un étiopathe peut être consulté.', 'etiopathie'],
    ['La médecine traditionnelle chinoise (MTC) propose…', 'medecine-traditionnelle-chinoise'],
    ['Pensez à la sophrologie.', 'sophrologie'],
  ])('« %s » → %s', (text, slug) => {
    expect(mentionedMedicineSlugs(text)).toContain(slug)
  })

  it('ne confond pas kinésithérapie et kinésiologie, ni la médecine en général avec la MTC', () => {
    expect(mentionedMedicineSlugs('Voyez votre kinésithérapeute et votre médecine du travail.')).toEqual([])
  })

  it('reconnaît le nom de chaque médecine qui a une page', () => {
    const found = mentionedMedicineSlugs(medecines.map(m => m.name).join(', '))
    expect([...found].sort()).toEqual(medecines.map(m => m.slug).sort())
  })
})
