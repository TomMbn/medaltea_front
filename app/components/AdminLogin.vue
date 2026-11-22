<template>
  <div class="min-h-screen bg-bleu-50 font-sans text-vert-900">
    <header class="bg-vert-600 text-white">
      <div class="mx-auto flex w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] flex-wrap items-center justify-between gap-3 py-4">
        <div class="flex items-center gap-3">
          <img src="/images/footer/logo-blanc.svg" alt="Léya" class="h-8 w-auto" style="animation: none;" />
          <span class="rounded-full bg-corail-500 px-3 py-[2px] text-[14px] font-semibold text-vert-900">Administration</span>
        </div>
        <NuxtLink to="/" class="text-[16px] underline-offset-2 hover:underline">Voir le site</NuxtLink>
      </div>
    </header>

    <main class="mx-auto w-[calc(100%-2rem)] max-w-[480px] py-12 lg:py-16">
      <div class="rounded-[28px] bg-white p-6 sm:p-8">
        <h1 class="font-unbounded font-normal text-[26px] leading-[normal]">Connexion à l’administration</h1>
        <p class="mt-2 text-[16px] text-neutre-600">Espace réservé à l’équipe Léya.</p>

        <form class="mt-6 flex flex-col gap-4" novalidate @submit.prevent="submit">
          <div class="flex flex-col gap-1">
            <label for="admin-mail" class="text-[16px] font-medium">Adresse e-mail</label>
            <input id="admin-mail" v-model="mail" type="email" autocomplete="username" required class="min-h-[48px] rounded-[12px] border border-neutre-300 bg-white px-4 text-[16px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="admin-password" class="text-[16px] font-medium">Mot de passe</label>
            <input id="admin-password" v-model="password" type="password" autocomplete="current-password" required class="min-h-[48px] rounded-[12px] border border-neutre-300 bg-white px-4 text-[16px]" />
          </div>
          <p v-if="error" class="rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ error }}</p>
          <button type="submit" class="mt-2 min-h-[48px] rounded-full bg-vert-900 px-6 text-[16px] font-semibold text-white hover:bg-vert-600 transition-colors disabled:opacity-60" :disabled="busy" :aria-busy="busy">Se connecter</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Connexion de l'équipe Léya. Même route serveur que la connexion publique (/api/login) ; seul un compte
// administrateur reste connecté ici. Le backend contrôle de toute façon chaque route d'administration.
const route = useRoute()
const { refresh, logout } = useSession()

const mail = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

const MESSAGES = {
  missing: 'Saisissez votre adresse e-mail et votre mot de passe.',
  credentials: 'Identifiants incorrects.',
  notAdmin: 'Ce compte n’a pas accès à l’administration.',
  tooMany: 'Trop de tentatives. Réessayez dans quelques minutes.',
  other: 'La connexion a échoué. Réessayez dans un instant.',
}

// Retour vers la page de l'administration demandée avant la connexion, jamais vers un autre site
function destination() {
  const target = String(route.query.redirect ?? '')
  return target.startsWith('/admin/') && !target.includes('//') ? target : null
}

async function submit() {
  if (busy.value) return
  error.value = ''
  if (!mail.value.trim() || !password.value) {
    error.value = MESSAGES.missing
    return
  }
  busy.value = true
  try {
    const session = await $fetch('/api/login', { method: 'POST', body: { mail: mail.value.trim(), password: password.value } })
    refresh()
    if (session?.role !== 'admin') {
      // Compte patient ou praticien : on ne le laisse pas connecté sur l'entrée de l'administration
      await logout()
      error.value = MESSAGES.notAdmin
      return
    }
    const target = destination()
    if (target) await navigateTo(target)
    else await navigateTo({ path: '/admin', query: {} }, { replace: true })
  } catch (e) {
    const status = e?.statusCode ?? e?.response?.status
    error.value = status === 401 || status === 400 ? MESSAGES.credentials : status === 429 ? MESSAGES.tooMany : MESSAGES.other
  } finally {
    password.value = ''
    busy.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
