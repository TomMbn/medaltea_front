import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Accessibilité (WCAG 2.1 A et AA, moteur axe-core) : aucune anomalie critique ou sérieuse.
const PAGES = ['/', '/medecines', '/medecines/sophrologie', '/trouver-un-praticien', '/praticiens-pro', '/login', '/register', '/cgu', '/praticiens/demo-claire-fictive']

for (const path of PAGES) {
  test(`accessibilité de ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    // Le cadre des outils de développement de Nuxt n'existe qu'en développement : hors périmètre
    const results = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const serious = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    // Contrastes : suivis dans le rapport mais non bloquants tant que les couleurs n'ont pas été validées (changement de charte)
    for (const v of serious.filter(v => v.id === 'color-contrast')) test.info().annotations.push({ type: 'contraste', description: `${v.nodes.length} éléments sur ${path}` })
    const blocking = serious.filter(v => v.id !== 'color-contrast')
    const summary = blocking.map(v => `${v.id} (${v.impact}) × ${v.nodes.length} : ${v.help} — ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)
    expect(summary, summary.join('\n')).toEqual([])
  })
}
