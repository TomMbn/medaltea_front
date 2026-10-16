// Génère tests/RAPPORT-EXECUTION.md à partir des résultats Vitest (unitaires) et Playwright (bout en bout).
import { readFileSync, existsSync, writeFileSync } from 'node:fs'

const read = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null)
const unit = read('tests/reports/unit.json')
const e2e = read('tests/reports/e2e/results.json')

function* walk(suite, path = []) {
  const here = suite.title ? [...path, suite.title] : path
  for (const spec of suite.specs ?? []) yield { file: suite.file ?? path[0], title: spec.title, suite: here, tests: spec.tests }
  for (const child of suite.suites ?? []) yield* walk(child, here)
}

const rows = []
let pass = 0, fail = 0, skip = 0, duration = 0
const contrast = []

if (unit) {
  for (const f of unit.testResults) {
    for (const t of f.assertionResults) {
      const ok = t.status === 'passed'
      ok ? pass++ : t.status === 'failed' ? fail++ : skip++
      duration += t.duration ?? 0
      rows.push(['Unitaire', f.name.split('/tests/')[1], t.fullName, t.status === 'passed' ? '✅' : t.status === 'failed' ? '❌' : '⏭'])
    }
  }
}
if (e2e) {
  for (const top of e2e.suites) {
    for (const s of walk(top)) {
      for (const t of s.tests) {
        const r = t.results.at(-1)
        const ok = r?.status === 'passed'
        t.status === 'skipped' ? skip++ : ok ? pass++ : fail++
        duration += r?.duration ?? 0
        rows.push(['Bout en bout', s.file, [...s.suite.slice(1), s.title].join(' › '), t.status === 'skipped' ? '⏭' : ok ? '✅' : '❌'])
        for (const a of t.annotations ?? []) if (a.type === 'contraste') contrast.push(`- ${a.description}`)
      }
    }
  }
}

const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
const out = [
  '# Rapport d\'exécution des tests',
  '',
  `Généré le ${date} par \`npm run test:report\`.`,
  '',
  `**${pass} réussis, ${fail} en échec, ${skip} ignorés** (durée cumulée ${(duration / 1000).toFixed(1)} s).`,
  '',
  '| Niveau | Fichier | Scénario | Résultat |',
  '|---|---|---|---|',
  ...rows.map(r => `| ${r.join(' | ')} |`),
  '',
  contrast.length ? '## Contrastes de couleurs à corriger (suivis, non bloquants)\n\nRelevés par axe-core (WCAG AA) sur les pages publiques. Les corriger demande de valider des changements de couleurs de la charte.\n\n' + contrast.join('\n') : '',
  '',
].join('\n')

writeFileSync('tests/RAPPORT-EXECUTION.md', out)
console.log(`Rapport écrit : ${pass} réussis, ${fail} en échec, ${skip} ignorés`)
