// Notifications push : abonnement du navigateur (clé publique VAPID du backend) et désabonnement.
// Le service worker (public/sw.js) ne met rien en cache : il affiche seulement les notifications reçues.

export type PushResult = 'ok' | 'denied' | 'unavailable'

export const pushSupported = () => import.meta.client && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

/** iPhone / iPad : les notifications n'existent que pour le site ajouté à l'écran d'accueil. */
export const needsHomeScreen = () => {
  if (!import.meta.client) return false
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const installed = (navigator as any).standalone === true || window.matchMedia?.('(display-mode: standalone)').matches
  return ios && !installed
}

function keyToBytes(base64url: string): Uint8Array {
  const pad = '='.repeat((4 - (base64url.length % 4)) % 4)
  const raw = atob((base64url + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}

async function registration() {
  return navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(() => navigator.serviceWorker.ready)
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null
  const reg = await navigator.serviceWorker.getRegistration('/')
  return reg ? reg.pushManager.getSubscription() : null
}

/** Associe l'abonnement du navigateur au compte connecté (le backend met à jour un abonnement déjà connu). */
export async function linkSubscription(sub: PushSubscription) {
  const json = sub.toJSON()
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) throw new Error('abonnement incomplet')
  await $fetch('/api/backend/push/subscriptions', { method: 'POST', body: { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } } })
}

export async function enablePush(): Promise<PushResult> {
  if (!pushSupported()) return 'unavailable'
  try {
    // La permission est demandée sur un geste de l'utilisateur (clic sur le bouton)
    if ((await Notification.requestPermission()) !== 'granted') return 'denied'
    const reg = await registration()
    const { publicKey } = await $fetch<{ publicKey: string }>('/api/backend/push/public-key')
    let sub = await reg.pushManager.getSubscription()
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) })
    await linkSubscription(sub)
    return 'ok'
  } catch {
    return 'unavailable'
  }
}

/** Retire l'abonnement du compte puis celui du navigateur (aussi appelé à la déconnexion, appareil partagé). */
export async function disablePush() {
  try {
    const sub = await currentSubscription()
    if (!sub) return
    await $fetch('/api/backend/push/subscriptions', { method: 'DELETE', body: { endpoint: sub.endpoint } }).catch(() => {})
    await sub.unsubscribe()
  } catch { /* sans effet : le backend nettoie les abonnements expirés */ }
}
