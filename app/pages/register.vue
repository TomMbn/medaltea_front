<template>
  <div class="registration-page-v2">
    <!-- Left Pane: Illustration -->
    <div class="pane-left">
      <AuthIllustration />
    </div>

    <!-- Right Pane: Form -->
    <div class="pane-right">
      <div class="form-container">
        <!-- Logo Header -->
        <div class="header-section">
          <img 
            src="/images/logo.svg" 
            alt="Medaltea" 
            class="logo-img"
          />
          <h1 class="auth-title mb-4">
            Créer un compte
          </h1>
          <p class="auth-subtitle">
            Etiam eu turpis molestie, dictum est a, mattis tellus.
          </p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="field-group">
            <label class="input-label">Adresse mail</label>
            <input 
              v-model="mail"
              type="email" 
              class="form-input"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="field-group">
            <label class="input-label">Mot de passe</label>
            <input 
              v-model="password"
              type="password" 
              class="form-input"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="error-box">
            {{ errorMsg }}
          </div>

          <!-- Success Message -->
          <div v-if="successMsg" class="success-box">
            {{ successMsg }}
          </div>

          <!-- Submit Button -->
          <div class="submit-wrapper">
            <button 
              type="submit"
              class="btn-submit"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Créer un compte</span>
              <span v-else class="loading-state">
                <Loader2 class="spinner" :size="20" />
                Création...
              </span>
            </button>
          </div>
        </form>

        <!-- Separator -->
        <div class="separator-group">
          <div class="line"></div>
          <div class="label-or">ou</div>
        </div>

        <div class="social-row">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Apple, Loader2 } from 'lucide-vue-next'
import { useRouter } from '#app'

const router = useRouter()
const mail = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  if (isLoading.value) return
  
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

    // On success
    successMsg.value = 'Compte créé avec succès !'
    
    // Smooth redirect after a delay
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    if (error.status === 400) {
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

<style scoped>
.registration-page-v2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #2596be;
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
  .registration-page-v2 {
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
    min-height: 100vh;
    padding: 48px;
  }
}

.header-section {
  margin-bottom: 68px;
}

.logo-img {
  width: 140px;
  height: auto;
}

.auth-title {
  font-family: 'Unbounded', cursive;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.05;
  margin-top: 33px;
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
  gap: 24px;
  margin-bottom: 48px;
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
  height: 65px;
  padding: 0 24px;
  border-radius: 20px;
  border: 1px solid #90BAD1;
  background-color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  font-family: 'Futura PT', sans-serif;
}

.form-input:focus {
  border-color: #012828;
}

.btn-submit {
  width: 100%;
  height: 65px;
  background-color: #012828;
  color: white;
  font-weight: 700;
  font-size: 18px;
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

.success-box {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #c6f6d5;
}

.separator-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
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
  font-family: 'Inter', sans-serif;
}

.social-row {
  display: flex;
  gap: 16px;
}

.social-btn {
  flex: 1;
  height: 65px;
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
</style>
