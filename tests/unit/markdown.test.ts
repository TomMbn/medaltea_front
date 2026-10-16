// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '~/utils/markdown'

// La réponse du modèle est affichée avec v-html : le rendu doit neutraliser tout contenu actif.
describe('rendu Markdown du chat (anti-XSS)', () => {
  it('met en forme le Markdown courant', () => {
    const html = renderMarkdown('**gras** et une liste :\n\n- un\n- deux')
    expect(html).toContain('<strong>gras</strong>')
    expect(html).toContain('<li>un</li>')
  })

  it('supprime les scripts et les gestionnaires d\'événements', () => {
    const html = renderMarkdown('<script>alert(1)</script><img src=x onerror=alert(1)><p onclick="x()">ok</p>')
    expect(html).not.toMatch(/<script/i)
    expect(html).not.toMatch(/onerror|onclick/i)
    expect(html).not.toMatch(/<img/i)
    expect(html).toContain('ok')
  })

  it('neutralise les liens javascript: et ouvre les autres liens sans accès à la page', () => {
    const bad = renderMarkdown('[clic](javascript:alert(1))')
    expect(bad).not.toMatch(/javascript:/i)
    const good = renderMarkdown('[site](https://exemple.fr)')
    expect(good).toContain('href="https://exemple.fr"')
    expect(good).toContain('rel="noopener noreferrer nofollow"')
    expect(good).toContain('target="_blank"')
  })

  it('retire les cadres et les styles', () => {
    const html = renderMarkdown('<iframe src="https://evil.test"></iframe><style>body{display:none}</style>texte')
    expect(html).not.toMatch(/<iframe|<style/i)
    expect(html).toContain('texte')
  })
})
