// Démonstration : pendant qu'elle est active, les appels de l'espace praticien sont servis par le faux serveur (app/utils/demoMock.ts).
// On intercepte `fetch` (que `$fetch` appelle à chaque requête) : `$fetch` lui-même est importé par chaque composant et ne peut pas être remplacé.
import { DemoError } from '~/utils/demoMock'

export default defineNuxtPlugin(() => {
  const original = globalThis.fetch.bind(globalThis)
  // useCookie écrit les valeurs en JSON : leya_demo="1"
  const inDemo = () => /(?:^|; )leya_demo=(?:%22)?1(?:%22)?(?:;|$)/.test(document.cookie)
  const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (inDemo()) {
      const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const url = new URL(raw, location.origin)
      if (url.origin === location.origin && url.pathname.startsWith('/api/backend/')) {
        let body: any
        try { body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined } catch { body = undefined }
        try {
          const res = demoRequest(url.pathname.slice('/api/backend/'.length), init?.method ?? 'GET', Object.fromEntries(url.searchParams), body)
          if (res) {
            await new Promise(r => setTimeout(r, 120)) // latence d'un vrai serveur : les états de chargement restent visibles
            return json(200, res.data)
          }
        } catch (e) {
          if (e instanceof DemoError) return json(e.statusCode, { statusCode: e.statusCode, message: e.message })
          throw e
        }
      }
    }
    return original(input, init)
  }
})
