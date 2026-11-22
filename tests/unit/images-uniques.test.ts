// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { medecines } from '~/data/medecines'

// Règle éditoriale : une photo des pages /medecines n'apparaît nulle part ailleurs sur le site,
// ni sous le même chemin, ni sous un autre nom (même photo, autre fichier).
const SLOTS = ['heroImage', 'definitionImage', 'mosaicImage1', 'mosaicImage2', 'mosaicImage3'] as const
// Distance de Hamming (sur 256 bits) en dessous de laquelle deux images sont la même photo
const SEUIL_MEME_PHOTO = 40

const pagePhotos = medecines.flatMap(m => SLOTS.map(slot => ({ where: `${m.slug}.${slot}`, path: m[slot] })))

const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? sourceFiles(p) : /\.(vue|ts)$/.test(f) ? [p] : []
})
// Photos affichées ailleurs (accueil, bandeaux, page Praticiens…) ; les masques CSS ne sont pas des photos
const otherPhotos = [...new Set(sourceFiles(resolve('app'))
  .filter(f => !f.endsWith(join('data', 'medecines.ts')))
  .flatMap(f => [...readFileSync(f, 'utf8').matchAll(/\/images\/[\w/.-]+\.(?:jpe?g|webp|png)/g)].map(m => m[0])))]
  .filter(p => !/\/masque-[\w-]+\.webp$/.test(p) && !/mascotte|panda/.test(p))

async function dHash(path: string): Promise<string> {
  const px = await sharp(resolve('public' + path)).grayscale().resize(17, 16, { fit: 'fill' }).raw().toBuffer()
  let bits = ''
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) bits += px[y * 17 + x]! > px[y * 17 + x + 1]! ? '1' : '0'
  return bits
}
const distance = (a: string, b: string) => [...a].filter((c, i) => c !== b[i]).length

describe('photos uniques sur tout le site', () => {
  it('aucun chemin de photo n\'est partagé entre deux emplacements des pages médecines', () => {
    const seen = new Map<string, string>()
    for (const { where, path } of pagePhotos) {
      expect(seen.get(path), `${path} : ${where} et ${seen.get(path)}`).toBeUndefined()
      seen.set(path, where)
    }
  })

  it('aucune photo des pages médecines n\'est affichée ailleurs sur le site', () => {
    for (const { where, path } of pagePhotos) expect(otherPhotos, `${where} (${path})`).not.toContain(path)
  })

  it('aucune photo des pages médecines n\'est la même photo qu\'une autre, sous un autre nom', async () => {
    const all = [...pagePhotos, ...otherPhotos.map(path => ({ where: path, path }))]
    const hashes = await Promise.all(all.map(p => dHash(p.path)))
    const doublons: string[] = []
    for (let i = 0; i < pagePhotos.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const d = distance(hashes[i]!, hashes[j]!)
        if (d <= SEUIL_MEME_PHOTO) doublons.push(`${all[i]!.where} ≈ ${all[j]!.where} (distance ${d})`)
      }
    }
    expect(doublons).toEqual([])
  }, 30_000)
})
