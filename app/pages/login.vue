<template>
  <div class="auth-page-v2">
    <!-- Left Pane: Illustration -->
    <div class="pane-left">
      <AuthIllustration />
    </div>

    <!-- Right Pane: Form -->
    <div class="pane-right">
      <div class="form-container">
        <!-- Logo Header -->
        <div class="header-section">
          <NuxtLink to="/">
            <img 
              src="/images/logo.svg" 
              alt="Medaltea" 
              class="logo-img"
            />
          </NuxtLink>
          <h1 class="auth-title mb-4">
            Bon retour !
          </h1>
          <p class="auth-subtitle">
            Ravi de vous revoir. Connectez-vous pour continuer.
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="field-group">
            <label class="input-label">Adresse mail</label>
            <input 
              v-model="mail"
              type="email" 
              class="form-input"
              required
              placeholder="votre@email.com"
              :disabled="isLoading"
            />
          </div>

          <div class="field-group">
            <div class="flex justify-between items-center mb-1">
              <label class="input-label mb-0">Mot de passe</label>
              <NuxtLink to="/forgot-password" class="text-sm font-semibold text-[#012828] hover:underline opacity-60">
                Oublié ?
              </NuxtLink>
            </div>
            <input 
              v-model="password"
              type="password" 
              class="form-input"
              required
              placeholder="••••••••"
              :disabled="isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="error-box">
            {{ errorMsg }}
          </div>

          <!-- Submit Button -->
          <div class="submit-wrapper">
            <button 
              type="submit"
              class="btn-submit"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Se connecter</span>
              <span v-else class="loading-state">
                <Loader2 class="spinner" :size="20" />
                Connexion...
              </span>
            </button>
          </div>
        </form>

        <!-- Separator -->
        <div class="separator-group">
          <div class="line"></div>
          <div class="label-or">ou</div>
        </div>

        <!-- Social Login -->
        <div class="social-row mb-8">
          <button class="social-btn" :disabled="isLoading">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="logo-icon">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="currentColor"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="currentColor"/>
            </svg>
          </button>
          <button class="social-btn" :disabled="isLoading">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="22" height="22" class="apple-icon">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <p class="text-center font-semibold mb-0 font-futura text-[#012828]">
          Pas encore de compte ? 
          <NuxtLink to="/register" class="text-rose-500 hover:underline">S'inscrire</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useRouter } from '#app'

const router = useRouter()
const mail = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (isLoading.value) return
  
  isLoading.value = true
  errorMsg.value = ''

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

    // On success
    console.log('Login successful, response:', response)
    const tokenValue = response?.token || response?.accessToken || response?.access_token || response?.data?.token
    
    if (tokenValue) {
      const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
      const accessTokenCookie = useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7, path: '/' })
      tokenCookie.value = tokenValue
      accessTokenCookie.value = tokenValue
      console.log('Token stored in cookies')
    }
    
    router.push('/chatbot')

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

<style scoped>
.auth-page-v2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #e0ecf2;
  color: #012828;
}

.pane-left {
  display: none;
}

.pane-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.form-container {
  width: 100%;
  max-width: 440px;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .auth-page-v2 {
    flex-direction: row;
  }
  
  .pane-left {
    display: block;
    width: 50%;
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 16px;
  }
  
  .pane-right {
    width: 50%;
    height: 100vh;
    padding: 32px;
    overflow-y: auto;
  }
}

.header-section {
  margin-bottom: 30px;
}

.logo-img {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
}

.auth-title {
  font-family: 'Unbounded', cursive;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.05;
}

.auth-subtitle {
  font-family: 'Futura PT', sans-serif;
  font-size: 18px;
  color: rgba(1, 40, 40, 0.6);
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-family: 'Futura PT', sans-serif;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  height: 58px;
  padding: 0 24px;
  border-radius: 18px;
  border: 1px solid #90BAD1;
  background-color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  font-family: 'Futura PT', sans-serif;
}

.form-input:focus {
  border-color: #012828;
  box-shadow: 0 0 0 4px rgba(1, 40, 40, 0.05);
}

.btn-submit {
  width: 100%;
  height: 58px;
  background-color: #012828;
  color: white;
  font-weight: 700;
  font-size: 17px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(1, 40, 40, 0.2);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Futura PT', sans-serif;
}

.btn-submit:hover:not(:disabled) {
  background-color: #023a3a;
  transform: translateY(-1px);
}

.btn-submit:active {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.8;
  cursor: wait;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-box {
  background-color: #fff5f5;
  color: #c53030;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #fed7d7;
}

.separator-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.separator-group .line {
  width: 100%;
  height: 1px;
  background-color: #E5E5E5;
}

.separator-group .label-or {
  position: absolute;
  background-color: #e0ecf2;
  padding: 0 20px;
  color: rgba(1, 40, 40, 0.3);
  font-size: 15px;
  font-weight: 600;
  font-family: 'Futura PT', sans-serif;
}

.social-row {
  display: flex;
  gap: 16px;
}

.social-btn {
  flex: 1;
  height: 58px;
  background-color: white;
  border: 1px solid #E5E5E5;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.social-btn .logo-icon,
.social-btn .apple-icon {
  color: #000;
  transition: transform 0.2s;
}

.social-btn:hover .logo-icon,
.social-btn:hover .apple-icon {
  transform: scale(1.1);
}

.font-futura {
  font-family: 'Futura PT', sans-serif;
}
</style>
