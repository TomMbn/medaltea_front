<template>
  <div class="auth-root min-h-screen bg-bleu-50 text-vert-900 lg:flex lg:gap-10 xl:gap-20 lg:p-10">
    <!-- Panneau d'illustration -->
    <div class="auth-ill hidden lg:block lg:w-[42vw] xl:w-[36vw] max-w-[620px] shrink-0 lg:sticky lg:top-10 lg:h-[calc(100vh-80px)]">
      <AuthIllustration logo :message="isProContext ? 'Votre agenda et vos patients, en toute simplicité.' : 'Expliquez-nous ce que vous ressentez, on vous guide.'" />
    </div>

    <!-- Formulaire -->
    <div class="auth-col flex-1 min-w-0 flex flex-col lg:justify-center px-5 sm:px-8 py-8 lg:p-0 lg:min-h-[calc(100vh-80px)]">
      <NuxtLink to="/" class="lg:hidden self-start" aria-label="Léya, retour à l'accueil">
        <img src="/images/logo.svg" alt="Léya" width="120" height="54" class="w-[100px] h-auto" style="animation: none;" />
      </NuxtLink>

      <AuthAudienceSwitch class="auth-switch mt-6 lg:mt-0 mb-6 lg:mb-8" page="login" :current="isProContext ? 'pro' : 'patient'" :redirect="isProContext ? '' : String(route.query.redirect ?? '')" />

      <div>
        <h1 class="font-unbounded font-normal text-[30px] sm:text-[34px] lg:text-[40px] leading-[normal] text-vert-900">
          {{ isProContext ? 'Connexion praticien' : 'Bon retour !' }}
        </h1>
        <p class="mt-[10px] text-[18px] lg:text-[20px] leading-[normal] text-neutre-600 max-w-[820px]">
          {{ isProContext ? 'Connectez-vous pour gérer vos rendez-vous et votre agenda.' : 'Ravi de vous revoir. Connectez-vous pour continuer.' }}
        </p>
      </div>

      <form class="mt-8 lg:mt-[40px] flex flex-col" @submit.prevent="handleLogin">
        <div class="flex flex-col gap-5 max-w-[380px]">
          <div class="flex flex-col gap-2">
            <label for="login-mail" class="text-[16px] font-medium leading-[normal]">Adresse e-mail</label>
            <div class="relative">
              <input
                id="login-mail"
                v-model="mail"
                type="email"
                autocomplete="username"
                inputmode="email"
                required
                maxlength="150"
                placeholder="votre@email.com"
                :disabled="isLoading"
                class="h-[52px] w-full rounded-[12px] border border-[#c8c8c8] bg-white pl-4 pr-11 text-[16px] text-vert-900 placeholder:text-neutre-500 focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df] transition-shadow"
              />
              <Check v-if="mailLooksValid" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="login-password" class="text-[16px] font-medium leading-[normal]">Mot de passe</label>
            <!-- Pas de « Mot de passe oublié » : la réinitialisation passe par un e-mail, aujourd'hui bloqué -->
            <input
              id="login-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              maxlength="200"
              placeholder="••••••••"
              :disabled="isLoading"
              class="h-[52px] w-full rounded-[12px] border border-[#c8c8c8] bg-white px-4 text-[16px] text-vert-900 placeholder:text-neutre-500 focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df] transition-shadow"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="mt-6 max-w-[380px] rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ errorMsg }}</div>

        <!-- Connexion réussie, mais avec un compte patient depuis l'entrée praticien -->
        <div v-if="wrongRole" class="mt-6 max-w-[380px] rounded-[12px] border border-[#fcd34d] bg-[#fffbeb] p-4 text-[14px] text-[#78350f]" role="status">
          <p class="font-semibold mb-1">Ce compte est un compte patient.</p>
          <p class="mb-2">Il n'a pas accès à l'espace praticien. Utilisez un compte praticien, ou créez-en un avec une autre adresse e-mail.</p>
          <p class="flex flex-wrap gap-x-4 gap-y-1">
            <NuxtLink to="/mes-rendez-vous" class="underline">Aller à mon compte patient</NuxtLink>
            <NuxtLink to="/inscription-pro" class="underline">Créer un compte praticien</NuxtLink>
          </p>
        </div>

        <div class="auth-actions mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
          <button type="submit" :disabled="isLoading" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-80 disabled:cursor-wait">
            <template v-if="!isLoading">Se connecter</template>
            <span v-else class="inline-flex items-center gap-2"><Loader2 class="animate-spin" :size="20" aria-hidden="true" /> Connexion…</span>
            <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </button>
        </div>

        <!-- Entrée praticien -->
        <div v-if="isProContext" class="mt-8 pb-2 flex flex-col gap-1 text-[16px]">
          <p>
            Pas encore inscrit ?
            <NuxtLink to="/inscription-pro" class="font-semibold text-corail-700 hover:underline">Créer mon compte praticien</NuxtLink>
          </p>
        </div>

        <!-- Entrée patient -->
        <div v-else class="mt-8 pb-2 flex flex-col gap-1 text-[16px]">
          <p>
            Pas encore de compte ?
            <NuxtLink :to="{ path: '/register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }" class="font-semibold text-corail-700 hover:underline">S'inscrire</NuxtLink>
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
useSeoMeta({ title: 'Connexion — Léya', robots: 'noindex, nofollow' })
import { useRouter } from '#app'

const router = useRouter()
const route = useRoute()
const mail = ref('')
const mailLooksValid = computed(() => /^\S+@\S+\.\S{2,}$/.test(mail.value.trim()))
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const wrongRole = ref(false)

// Entrée « praticien » : lien « Se connecter » de la page pro, ou redirection vers l'espace pro.
const isProContext = computed(() => route.query.espace === 'pro' || String(route.query.redirect ?? '').startsWith('/pro'))

async function handleLogin() {
  if (isLoading.value) return
  
  isLoading.value = true
  errorMsg.value = ''
  wrongRole.value = false

  try {
    // Note: Assuming /api/login endpoint exists or will be implemented
    // In a real scenario, this would authenticate with Supabase or another provider
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: {
        mail: mail.value,
        password: password.value
      }
    })
    
    refreshCookie('leya_session')
    refreshCookie('leya_role')
    refreshCookie('leya_praticien')

    // Connexion depuis l'entrée praticien avec un compte patient : on l'explique au lieu de rediriger vers une page qui boucle.
    if (isProContext.value && response?.role !== 'pro') {
      wrongRole.value = true
      return
    }

    const target = String(route.query.redirect ?? '')
    // Redirection interne uniquement (évite les redirections ouvertes vers un site externe)
    const safeTarget = target.startsWith('/') && !target.startsWith('//') ? target : ''
    // Sans destination demandée : un praticien arrive dans son espace, un patient sur le chatbot.
    router.push(safeTarget || (response?.role === 'pro' ? '/pro' : response?.role === 'admin' ? '/admin' : '/chatbot'))

  } catch (error) {
    if (error.status === 401) {
      errorMsg.value = 'Identifiants incorrects.'
    } else {
      errorMsg.value = 'Une erreur est survenue lors de la connexion.'
    }
    console.error('Login Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
