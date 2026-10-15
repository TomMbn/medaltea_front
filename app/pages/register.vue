<template>
  <div class="auth-root min-h-screen bg-bleu-50 text-vert-900 lg:flex lg:gap-10 xl:gap-20 lg:p-10">
    <!-- Panneau d'illustration -->
    <div class="auth-ill hidden lg:block lg:w-[42vw] xl:w-[36vw] max-w-[620px] shrink-0 lg:sticky lg:top-10 lg:h-[calc(100vh-80px)]">
      <AuthIllustration logo message="Expliquez-nous ce que vous ressentez, on vous guide." />
    </div>

    <!-- Formulaire -->
    <div class="auth-col flex-1 min-w-0 flex flex-col lg:justify-center px-5 sm:px-8 py-8 lg:p-0 lg:min-h-[calc(100vh-80px)]">
      <NuxtLink to="/" class="lg:hidden self-start" aria-label="Léya, retour à l'accueil">
        <img src="/images/logo.svg" alt="Léya" width="120" height="54" class="w-[100px] h-auto" style="animation: none;" />
      </NuxtLink>

      <AuthAudienceSwitch class="auth-switch mt-6 lg:mt-0 mb-6 lg:mb-8" page="register" current="patient" :redirect="String(route.query.redirect ?? '')" />

      <div>
        <h1 class="font-unbounded font-normal text-[30px] sm:text-[34px] lg:text-[40px] leading-[normal] text-vert-900">Créez votre compte</h1>
        <p class="mt-[10px] text-[18px] lg:text-[20px] leading-[normal] text-neutre-600 max-w-[820px]">
          Retrouvez vos médecines et praticiens favoris. Vos conversations avec Léya, elles, ne sont jamais enregistrées.
        </p>
      </div>

      <form class="mt-8 lg:mt-[40px] flex flex-col" @submit.prevent="handleRegister">
        <div class="flex flex-col gap-5 max-w-[380px]">
          <div class="flex flex-col gap-2">
            <label for="register-mail" class="text-[16px] font-medium leading-[normal]">Adresse e-mail</label>
            <div class="relative">
            <input
              id="register-mail"
              v-model="mail"
              type="email"
              autocomplete="email"
              inputmode="email"
              required
              maxlength="150"
              placeholder="votre@email.com"
              :disabled="isLoading"
              class="h-[52px] w-full rounded-[12px] border border-[#c8c8c8] bg-white pl-4 pr-11 text-[16px] text-vert-900 placeholder:text-neutre-500 focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df] transition-shadow"
            />
            <Check v-if="mailLooksValid" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
            </div>
            <p class="text-[16px] leading-[normal] text-neutre-600">Nous ne partageons jamais votre e-mail.</p>
          </div>
          <div class="flex flex-col gap-2">
            <label for="register-password" class="text-[16px] font-medium leading-[normal]">Mot de passe</label>
            <input
              id="register-password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              minlength="8"
              maxlength="200"
              pattern=".*[0-9].*"
              title="8 caractères minimum, dont un chiffre."
              required
              placeholder="••••••••"
              :disabled="isLoading"
              aria-describedby="register-password-hint"
              class="h-[52px] w-full rounded-[12px] border border-[#c8c8c8] bg-white px-4 text-[16px] text-vert-900 placeholder:text-neutre-500 focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df] transition-shadow"
            />
            <p id="register-password-hint" class="text-[16px] leading-[normal] text-neutre-600">8 caractères minimum, dont un chiffre.</p>
          </div>
        </div>

        <label class="auth-accept mt-6 flex items-start gap-3 text-[16px] lg:text-[18px] leading-snug cursor-pointer">
          <input v-model="accepted" type="checkbox" required :disabled="isLoading" class="peer sr-only" />
          <span class="mt-0.5 w-6 h-6 shrink-0 rounded-[6px] border-2 border-vert-600 bg-white text-white flex items-center justify-center peer-checked:bg-vert-600 peer-focus-visible:shadow-[0_0_0_4px_#cde4df] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100" aria-hidden="true"><Check :size="16" /></span>
          <span>
            J’accepte les <NuxtLink to="/cgu" target="_blank" class="underline">conditions d’utilisation</NuxtLink>
            et la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>.
          </span>
        </label>

        <div v-if="errorMsg" class="mt-6 max-w-[380px] rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ errorMsg }}</div>
        <div v-if="successMsg" class="mt-6 max-w-[380px] rounded-[12px] border border-[#c6f6d5] bg-[#f0fff4] p-4 text-[14px] font-semibold text-[#2f855a]" role="status">{{ successMsg }}</div>

        <div class="auth-actions mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
          <button type="submit" :disabled="isLoading" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-80 disabled:cursor-wait">
            <template v-if="!isLoading">Créer mon compte</template>
            <span v-else class="inline-flex items-center gap-2"><Loader2 class="animate-spin" :size="20" aria-hidden="true" /> Création…</span>
            <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </button>
          <NuxtLink to="/trouver-un-praticien" class="text-[16px] font-medium text-vert-600 hover:underline">Continuer sans compte →</NuxtLink>
        </div>

        <div class="auth-foot mt-8 pb-2 flex flex-col gap-1 text-[16px]">
          <p>
            Déjà un compte ?
            <NuxtLink :to="{ path: '/login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }" class="font-semibold text-corail-700 hover:underline">Se connecter</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpRight, Check, Loader2 } from 'lucide-vue-next'

definePageMeta({ middleware: 'guest' })
useSeoMeta({ title: 'Créer un compte — Léya', robots: 'noindex, nofollow' })
import { useRouter } from '#app'

const router = useRouter()
const route = useRoute()
const mail = ref('')
const password = ref('')
const accepted = ref(false)
const mailLooksValid = computed(() => /^\S+@\S+\.\S{2,}$/.test(mail.value.trim()))
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  if (isLoading.value || !accepted.value) return
  
  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: {
        mail: mail.value,
        password: password.value
      }
    })
    refreshCookie('leya_session')
    refreshCookie('leya_role')
    // Redirection interne uniquement (évite les redirections ouvertes vers un site externe)
    const target = String(route.query.redirect ?? '')
    const destination = target.startsWith('/') && !target.startsWith('//') ? target : '/'

    if (response?.authenticated) {
      successMsg.value = 'Compte créé, vous êtes connecté !'
      setTimeout(() => { router.push(destination) }, 800)
    } else {
      // Compte créé mais connexion automatique impossible : on envoie vers la connexion.
      successMsg.value = 'Compte créé avec succès ! Connectez-vous pour continuer.'
      setTimeout(() => { router.push({ path: '/login', query: { redirect: destination } }) }, 1200)
    }

  } catch (error) {
    if (error.status === 409) {
      errorMsg.value = 'Un compte existe déjà avec cette adresse email. Connectez-vous.'
    } else if (error.status === 400) {
      errorMsg.value = 'Données invalides. Veuillez vérifier vos informations.'
    } else {
      errorMsg.value = 'Une erreur est survenue lors de la connexion au serveur.'
    }
    console.error('Registration Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
