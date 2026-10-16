// Test de charge du site (front) : construction de production + faux backend local.
// L'API réelle n'est jamais sollicitée : on mesure la capacité du rendu serveur (SSR) et de la passerelle.
// Usage : npm run build && npm run test:load   (durée ≈ 2 minutes ; résultat dans tests/reports/load.json)
import { spawn } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs'
import autocannon from 'autocannon'

const SITE = 3400
const STUB = 3401
const DURATION = Number(process.env.LOAD_DURATION || 15)
const LEVELS = (process.env.LOAD_LEVELS || '10,50,100').split(',').map(Number)
const PAGES = ['/', '/medecines', '/medecines/osteopathie', '/trouver-un-praticien', '/praticiens-pro', '/api/backend/praticiens?limit=12']

// Faux backend : liste vide, réponse immédiate (isole le coût du site lui-même)
const stub = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json', 'x-total-count': '0' })
  res.end(req.url.startsWith('/praticiens') ? '[]' : '{}')
}).listen(STUB)

const server = spawn('node', ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(SITE), NITRO_PORT: String(SITE), NUXT_API_BASE: `http://localhost:${STUB}` },
  stdio: 'ignore',
})

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://localhost:${SITE}/`); if (r.ok) return } catch { /* pas encore prêt */ }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('Le serveur ne démarre pas (lancer d’abord npm run build).')
}

const results = []
try {
  await waitUp()
  for (const path of PAGES) for (const connections of LEVELS) {
    const r = await autocannon({ url: `http://localhost:${SITE}${path}`, connections, duration: DURATION, timeout: 10 })
    const row = {
      path, connections,
      rps: Math.round(r.requests.average),
      p50: r.latency.p50, p97: r.latency.p97_5, p99: r.latency.p99, max: r.latency.max,
      errors: r.errors + r.timeouts, non2xx: r.non2xx,
      mbps: +(r.throughput.average / 1e6).toFixed(1),
    }
    results.push(row)
    console.log(`${path.padEnd(36)} ${String(connections).padStart(3)} conn : ${row.rps} req/s · p50 ${row.p50} ms · p99 ${row.p99} ms · erreurs ${row.errors + row.non2xx}`)
  }
} finally {
  server.kill()
  stub.close()
}
fs.mkdirSync('tests/reports', { recursive: true })
fs.writeFileSync('tests/reports/load.json', JSON.stringify({ date: new Date().toISOString(), duration: DURATION, results }, null, 2))
