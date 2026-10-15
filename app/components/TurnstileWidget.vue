<template>
  <div>
    <div ref="box" aria-label="Vérification de sécurité" />
    <p v-if="failed" class="mt-2 text-[16px] text-corail-700 leading-snug" role="alert">
      La vérification de sécurité n'a pas pu se charger. Rechargez la page, ou désactivez votre bloqueur de publicités pour ce site.
    </p>
  </div>
</template>

<script setup>
// Captcha Cloudflare Turnstile : le jeton obtenu est envoyé avec la réservation, le backend le vérifie.
// Le script n'est chargé que sur la page qui en a besoin.
const model = defineModel({ type: String, default: '' })
const props = defineProps({ siteKey: { type: String, required: true } })

const box = ref(null)
const failed = ref(false)
let widgetId = null

function loadScript() {
  if (window.turnstile) return Promise.resolve()
  if (window.__turnstileLoading) return window.__turnstileLoading
  window.__turnstileLoading = new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => { window.__turnstileLoading = null; reject(new Error('turnstile')) }
    document.head.appendChild(el)
  })
  return window.__turnstileLoading
}

onMounted(async () => {
  try {
    await loadScript()
    widgetId = window.turnstile.render(box.value, {
      sitekey: props.siteKey,
      language: 'fr',
      // Rien n'est affiché tant que Cloudflare n'a pas besoin d'une interaction (visiteur suspect)
      appearance: 'interaction-only',
      callback: (token) => { model.value = token; failed.value = false },
      'expired-callback': () => { model.value = '' },
      'error-callback': () => { model.value = ''; failed.value = true },
    })
  } catch {
    failed.value = true
  }
})

onBeforeUnmount(() => { if (widgetId != null) try { window.turnstile?.remove(widgetId) } catch { /* déjà retiré */ } })

// Un jeton ne sert qu'une fois : après un envoi (réussi ou refusé), la page demande un nouveau jeton.
function reset() {
  model.value = ''
  if (widgetId != null) try { window.turnstile?.reset(widgetId) } catch { /* sans effet */ }
}
defineExpose({ reset })
</script>
