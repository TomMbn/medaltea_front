/* Service worker de Léya : notifications push uniquement.
 * Aucune mise en cache (pas de gestionnaire « fetch ») : les pages privées ne sont jamais conservées hors ligne. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// Le contenu est neutre (titre, texte court, adresse relative du site) : il s'affiche sur l'écran verrouillé.
self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { data = {} }
  const title = typeof data.title === 'string' && data.title ? data.title.slice(0, 80) : 'Léya'
  const body = typeof data.body === 'string' ? data.body.slice(0, 160) : ''
  const url = typeof data.url === 'string' && data.url.startsWith('/') && !data.url.startsWith('//') ? data.url : '/'
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url },
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of all) {
      if (new URL(c.url).origin === self.location.origin) { await c.focus(); if ('navigate' in c) return c.navigate(target); return }
    }
    return self.clients.openWindow(target)
  })())
})
