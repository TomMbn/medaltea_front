<template>
  <div>
    <!-- Progression -->
    <div class="mb-6" role="group" aria-label="Progression de l'inscription">
      <p class="text-sm font-semibold">Étape {{ step }} sur {{ STEPS.length }} · {{ STEPS[step - 1] }}</p>
      <div class="flex gap-2 mt-2" aria-hidden="true">
        <span v-for="i in STEPS.length" :key="i" class="h-1.5 flex-1 rounded-full transition-colors" :class="i <= step ? 'bg-[#156F71]' : 'bg-gray-200'" />
      </div>
      <p class="text-xs text-[#012828]/60 mt-2">Environ 2 minutes. Vos réponses sont enregistrées sur cet appareil, sans le mot de passe.</p>
    </div>

    <p v-if="restored" class="text-sm bg-white border border-[#156F71]/30 rounded-xl px-4 py-3 mb-4" role="status">
      Nous avons retrouvé votre inscription en cours.
      <button type="button" class="underline font-semibold text-[#156F71] ml-1" @click="restart">Recommencer à zéro</button>
    </p>

    <form class="bg-white rounded-[20px] shadow-sm p-6 sm:p-8 grid gap-6" novalidate @submit.prevent="next">
      <h2 ref="titleRef" tabindex="-1" class="font-unbounded font-bold text-xl outline-none">{{ TITLES[step - 1] }}</h2>

      <!-- Étape 1 : compte -->
      <div v-if="step === 1" class="grid gap-4">
        <div>
          <label for="s-mail" class="label">Adresse email</label>
          <input id="s-mail" v-model.trim="form.mail" type="email" autocomplete="email" inputmode="email" class="field" :aria-invalid="!!errors.mail" aria-describedby="err-mail" @input="errors.mail = ''" />
          <p id="err-mail" class="err" role="alert">{{ errors.mail }}</p>
        </div>
        <div>
          <label for="s-pass" class="label">Mot de passe <span class="hint">(6 caractères minimum)</span></label>
          <div class="relative">
            <input id="s-pass" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" class="field pr-24" :aria-invalid="!!errors.password" aria-describedby="err-password" @input="errors.password = ''" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#156F71] px-2 py-1 rounded hover:bg-gray-100" :aria-pressed="showPassword" @click="showPassword = !showPassword">
              {{ showPassword ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
          <p id="err-password" class="err" role="alert">{{ errors.password }}</p>
        </div>
        <ul class="text-sm text-[#012828]/70 grid gap-1.5">
          <li class="flex gap-2"><span class="text-[#156F71]" aria-hidden="true">✓</span> Votre fiche visible par les patients de votre ville</li>
          <li class="flex gap-2"><span class="text-[#156F71]" aria-hidden="true">✓</span> Un agenda en ligne et la gestion des demandes</li>
        </ul>
      </div>

      <!-- Étape 2 : activité -->
      <div v-else-if="step === 2" class="grid gap-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="s-first" class="label">Prénom</label>
            <input id="s-first" v-model.trim="form.firstName" autocomplete="given-name" class="field" :aria-invalid="!!errors.firstName" aria-describedby="err-first" @input="errors.firstName = ''" />
            <p id="err-first" class="err" role="alert">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="s-last" class="label">Nom</label>
            <input id="s-last" v-model.trim="form.lastName" autocomplete="family-name" class="field" :aria-invalid="!!errors.lastName" aria-describedby="err-last" @input="errors.lastName = ''" />
            <p id="err-last" class="err" role="alert">{{ errors.lastName }}</p>
          </div>
        </div>
        <fieldset>
          <legend class="label">Vos spécialités <span class="hint">(au moins une)</span></legend>
          <p v-if="!specialities.length" class="text-sm text-gray-500">Liste momentanément indisponible. Rechargez la page.</p>
          <div class="flex flex-wrap gap-2" aria-describedby="err-specialities">
            <label
              v-for="s in specialities"
              :key="s.id"
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors"
              :class="form.specialityIds.includes(s.id) ? 'border-[#156F71] bg-[#e0ecf2]' : 'border-gray-300 hover:border-[#156F71]'"
            >
              <input v-model="form.specialityIds" type="checkbox" :value="s.id" class="accent-[#156F71]" @change="errors.specialityIds = ''" />
              {{ s.name }}
            </label>
          </div>
          <p id="err-specialities" class="err" role="alert">{{ errors.specialityIds }}</p>
        </fieldset>
      </div>

      <!-- Étape 3 : cabinet -->
      <div v-else-if="step === 3" class="grid gap-4">
        <div v-if="!manualAddress" class="relative">
          <label for="s-address" class="label">Adresse du cabinet</label>
          <input
            id="s-address"
            v-model="addressQuery"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="suggestions.length > 0 && suggestionsOpen"
            aria-controls="address-listbox"
            :aria-activedescendant="activeIndex >= 0 ? `addr-${activeIndex}` : undefined"
            autocomplete="off"
            class="field"
            placeholder="Ex. : 9 quai de la Fosse, Nantes"
            :aria-invalid="!!errors.address"
            aria-describedby="err-address"
            @input="onAddressInput"
            @keydown.down.prevent="moveActive(1)"
            @keydown.up.prevent="moveActive(-1)"
            @keydown.enter="onAddressEnter"
            @keydown.esc="suggestionsOpen = false"
            @blur="onAddressBlur"
          />
          <ul v-if="suggestions.length && suggestionsOpen" id="address-listbox" role="listbox" class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <li v-for="(a, i) in suggestions" :id="`addr-${i}`" :key="a.label" role="option" :aria-selected="i === activeIndex">
              <button type="button" class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#e0ecf2]" :class="i === activeIndex ? 'bg-[#e0ecf2]' : ''" @mousedown.prevent="pickAddress(a)">
                {{ a.label }}
              </button>
            </li>
          </ul>
          <p id="err-address" class="err" role="alert">{{ errors.address }}</p>
          <p v-if="form.address && form.city" class="text-xs text-emerald-700 mt-2">
            ✓ {{ form.address }}, {{ form.postalCode }} {{ form.city }}
          </p>
          <button type="button" class="text-xs underline text-[#156F71] mt-2" @click="manualAddress = true">Saisir l'adresse manuellement</button>
        </div>

        <div v-else class="grid gap-4">
          <div>
            <label for="s-street" class="label">Adresse du cabinet</label>
            <input id="s-street" v-model.trim="form.address" autocomplete="street-address" class="field" :aria-invalid="!!errors.address" aria-describedby="err-address" @input="errors.address = ''" />
            <p id="err-address" class="err" role="alert">{{ errors.address }}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label for="s-cp" class="label">Code postal</label>
              <input id="s-cp" v-model.trim="form.postalCode" inputmode="numeric" maxlength="5" autocomplete="postal-code" class="field" :aria-invalid="!!errors.postalCode" aria-describedby="err-cp" @input="errors.postalCode = ''" />
              <p id="err-cp" class="err" role="alert">{{ errors.postalCode }}</p>
            </div>
            <div class="sm:col-span-2">
              <label for="s-city" class="label">Ville</label>
              <input id="s-city" v-model.trim="form.city" autocomplete="address-level2" class="field" :aria-invalid="!!errors.city" aria-describedby="err-city" @input="errors.city = ''" />
              <p id="err-city" class="err" role="alert">{{ errors.city }}</p>
            </div>
          </div>
          <button type="button" class="text-xs underline text-[#156F71] justify-self-start" @click="manualAddress = false">Utiliser la recherche d'adresse</button>
        </div>

        <div>
          <label for="s-phone" class="label">Téléphone professionnel</label>
          <input id="s-phone" v-model.trim="form.phone" type="tel" inputmode="tel" autocomplete="tel" class="field" placeholder="06 12 34 56 78" :aria-invalid="!!errors.phone" aria-describedby="err-phone" @input="errors.phone = ''" />
          <p id="err-phone" class="err" role="alert">{{ errors.phone }}</p>
          <p class="text-xs text-[#012828]/60 mt-1">Affiché sur votre fiche publique : indiquez un numéro professionnel.</p>
        </div>
      </div>

      <!-- Étape 4 : agenda -->
      <div v-else class="grid gap-5">
        <label class="flex items-start gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3">
          <input v-model="agenda.enabled" type="checkbox" class="mt-1 accent-[#156F71]" />
          <span>
            <span class="block text-sm font-semibold">Préparer mon agenda maintenant</span>
            <span class="block text-xs text-[#012828]/60">Vos patients pourront réserver dès la fin de l'inscription. Tout reste modifiable ensuite.</span>
          </span>
        </label>

        <template v-if="agenda.enabled">
          <fieldset>
            <legend class="label">Mes horaires</legend>
            <div class="grid gap-2" role="radiogroup">
              <label v-for="p in PRESETS" :key="p.id" class="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors" :class="agenda.preset === p.id ? 'border-[#156F71] bg-[#e0ecf2]/50' : 'border-gray-200 hover:border-gray-300'">
                <input v-model="agenda.preset" type="radio" name="preset" :value="p.id" class="accent-[#156F71]" />
                {{ p.label }}
              </label>
            </div>
          </fieldset>

          <fieldset class="grid gap-4 sm:grid-cols-2">
            <legend class="label">Ma première prestation</legend>
            <div class="sm:col-span-2">
              <label for="s-sname" class="sr-only">Nom de la prestation</label>
              <input id="s-sname" v-model="agenda.service.name" maxlength="80" class="field" placeholder="Première séance" :aria-invalid="!!errors.serviceName" aria-describedby="err-sname" @input="errors.serviceName = ''" />
              <p id="err-sname" class="err" role="alert">{{ errors.serviceName }}</p>
            </div>
            <div>
              <label for="s-sdur" class="label">Durée</label>
              <select id="s-sdur" v-model.number="agenda.service.durationMin" class="field">
                <option v-for="d in [30, 45, 60, 75, 90]" :key="d" :value="d">{{ d }} min</option>
              </select>
            </div>
            <div>
              <label for="s-sprice" class="label">Prix (€) <span class="hint">(facultatif)</span></label>
              <input id="s-sprice" v-model.number="agenda.service.price" type="number" min="0" step="1" inputmode="numeric" class="field" :aria-invalid="!!errors.servicePrice" aria-describedby="err-sprice" @input="errors.servicePrice = ''" />
              <p id="err-sprice" class="err" role="alert">{{ errors.servicePrice }}</p>
            </div>
            <div class="sm:col-span-2">
              <span class="label">Lieu</span>
              <div class="flex gap-2">
                <label v-for="m in [{ v: 'cabinet', l: 'Au cabinet' }, { v: 'visio', l: 'En visio' }]" :key="m.v" class="flex-1 text-center rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-colors" :class="agenda.service.mode === m.v ? 'border-[#156F71] bg-[#e0ecf2]/50 font-semibold' : 'border-gray-200'">
                  <input v-model="agenda.service.mode" type="radio" name="mode" :value="m.v" class="sr-only" />
                  {{ m.l }}
                </label>
              </div>
            </div>
          </fieldset>
        </template>

        <div class="border-t border-gray-100 pt-5 grid gap-2">
          <label class="flex items-start gap-3 text-sm cursor-pointer">
            <input v-model="accepted" type="checkbox" class="mt-1 shrink-0 accent-[#156F71]" :aria-invalid="!!errors.accepted" aria-describedby="err-accepted" @change="errors.accepted = ''" />
            <span>
              Je certifie exercer en conformité avec la réglementation et que ces informations sont exactes, et j'accepte les
              <NuxtLink to="/cgu-pro" target="_blank" class="underline">conditions générales des praticiens</NuxtLink> et la
              <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>.
            </span>
          </label>
          <p id="err-accepted" class="err" role="alert">{{ errors.accepted }}</p>
        </div>
      </div>

      <p v-if="submitError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">{{ submitError }}</p>

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <button v-if="step > 1" type="button" class="text-sm font-semibold px-5 py-3 rounded-[12px] border border-gray-300 hover:bg-gray-50 disabled:opacity-50" :disabled="submitting" @click="back">Retour</button>
        <span v-else />
        <div class="flex flex-wrap items-center gap-3">
          <button v-if="step === STEPS.length && agenda.enabled" type="button" class="text-sm underline text-[#012828]/70 disabled:opacity-50" :disabled="submitting" @click="skipAgenda">Passer cette étape</button>
          <button type="submit" class="bg-[#012828] text-white font-bold text-sm px-8 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50" :disabled="submitting">
            {{ submitting ? 'Création de votre espace…' : step === STEPS.length ? 'Terminer mon inscription' : 'Continuer' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'

const STEPS = ['Votre compte', 'Votre activité', 'Votre cabinet', 'Votre agenda']
const TITLES = ['Créez votre compte', 'Parlez-nous de votre activité', 'Où recevez-vous vos patients ?', 'Préparez votre agenda']
const DRAFT_KEY = 'leya:pro-signup:v1'

const { specialities } = await useSpecialities()

const step = ref(1)
const titleRef = ref(null)
const restored = ref(false)
const showPassword = ref(false)
const submitting = ref(false)
const submitError = ref('')
const accepted = ref(false)

const blankForm = () => ({ mail: '', password: '', firstName: '', lastName: '', specialityIds: [], address: '', postalCode: '', city: '', phone: '' })
const blankAgenda = () => ({ enabled: true, preset: 'weekday-lunch', service: { name: 'Première séance', durationMin: 60, price: null, mode: 'cabinet' } })
const form = reactive(blankForm())
const agenda = reactive(blankAgenda())
const errors = reactive({})

// ---------- Brouillon enregistré sur l'appareil (jamais le mot de passe)
function saveDraft() {
  try {
    const { password, ...rest } = form
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step: step.value, form: rest, agenda, manualAddress: manualAddress.value }))
  } catch { /* stockage indisponible : pas de brouillon */ }
}
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY) } catch {} }

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      Object.assign(form, blankForm(), d.form, { password: '' })
      Object.assign(agenda, blankAgenda(), d.agenda)
      manualAddress.value = !!d.manualAddress
      step.value = Math.min(Math.max(Number(d.step) || 1, 1), STEPS.length)
      addressQuery.value = form.address ? `${form.address}, ${form.postalCode} ${form.city}` : ''
      restored.value = !!(d.form?.mail || d.form?.firstName || d.form?.address)
    }
  } catch { /* brouillon illisible : on repart de zéro */ }
  trackEvent('pro-signup-step', { step: step.value })
})

function restart() {
  clearDraft()
  Object.assign(form, blankForm())
  Object.assign(agenda, blankAgenda())
  for (const k of Object.keys(errors)) delete errors[k]
  addressQuery.value = ''
  manualAddress.value = false
  accepted.value = false
  restored.value = false
  step.value = 1
}

// ---------- Adresse : saisie assistée (Base Adresse Nationale via notre serveur)
const manualAddress = ref(false)
const addressQuery = ref('')
const suggestions = ref([])
const suggestionsOpen = ref(false)
const activeIndex = ref(-1)
let timer = null
let addressToken = 0

// Enregistre le brouillon à chaque modification (déclaré après les états qu'il observe).
watch([form, agenda, step, () => manualAddress.value], saveDraft, { deep: true })

function onAddressInput() {
  // Toute modification invalide l'adresse précédemment choisie.
  form.address = ''; form.postalCode = ''; form.city = ''
  errors.address = ''
  clearTimeout(timer)
  const q = addressQuery.value.trim()
  if (q.length < 3) { suggestions.value = []; return }
  const current = ++addressToken
  timer = setTimeout(async () => {
    try {
      const res = await $fetch('/api/address', { query: { q } })
      if (current !== addressToken) return
      suggestions.value = Array.isArray(res) ? res : []
      suggestionsOpen.value = true
      activeIndex.value = -1
    } catch { suggestions.value = [] }
  }, 250)
}
function pickAddress(a) {
  form.address = a.street
  form.postalCode = String(a.postalCode)
  form.city = a.city
  addressQuery.value = a.label
  suggestionsOpen.value = false
  suggestions.value = []
  activeIndex.value = -1
  errors.address = ''
}
function moveActive(d) {
  if (!suggestions.value.length) return
  suggestionsOpen.value = true
  activeIndex.value = (activeIndex.value + d + suggestions.value.length) % suggestions.value.length
}
function onAddressEnter(e) {
  if (suggestionsOpen.value && activeIndex.value >= 0) { e.preventDefault(); pickAddress(suggestions.value[activeIndex.value]) }
}
function onAddressBlur() { setTimeout(() => { suggestionsOpen.value = false }, 120) }

// ---------- Validation par étape
const phoneDigits = (v) => String(v).replace(/[\s.\-()]/g, '')
const validators = {
  1() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.mail)) errors.mail = 'Saisissez une adresse email valide.'
    if (form.password.length < 6) errors.password = 'Le mot de passe doit contenir au moins 6 caractères.'
  },
  2() {
    if (!form.firstName) errors.firstName = 'Indiquez votre prénom.'
    if (!form.lastName) errors.lastName = 'Indiquez votre nom.'
    if (!form.specialityIds.length) errors.specialityIds = 'Choisissez au moins une spécialité.'
  },
  3() {
    if (manualAddress.value) {
      if (!form.address) errors.address = 'Indiquez l\'adresse du cabinet.'
      if (!/^\d{5}$/.test(form.postalCode)) errors.postalCode = 'Code postal à 5 chiffres.'
      if (!form.city) errors.city = 'Indiquez la ville.'
    } else if (!form.address || !form.city) {
      errors.address = 'Choisissez votre adresse dans la liste, ou saisissez-la manuellement.'
    }
    if (!/^(?:0|\+33)[1-9]\d{8}$/.test(phoneDigits(form.phone))) errors.phone = 'Saisissez un numéro français valide (ex. 06 12 34 56 78).'
  },
  4() {
    if (agenda.enabled) {
      if (!agenda.service.name.trim()) errors.serviceName = 'Donnez un nom à la prestation.'
      const price = agenda.service.price
      if (price !== null && price !== '' && (Number.isNaN(Number(price)) || Number(price) < 0)) errors.servicePrice = 'Prix invalide.'
    }
    if (!accepted.value) errors.accepted = 'Cette acceptation est nécessaire pour créer votre compte.'
  },
}

function validate(n) {
  for (const k of Object.keys(errors)) delete errors[k]
  validators[n]()
  return Object.keys(errors).length === 0
}

async function focusFirstError() {
  await nextTick()
  document.querySelector('[aria-invalid="true"]')?.focus()
}
async function goTo(n) {
  step.value = n
  submitError.value = ''
  trackEvent('pro-signup-step', { step: n })
  await nextTick()
  titleRef.value?.focus()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function next() {
  if (submitting.value) return
  if (!validate(step.value)) { await focusFirstError(); trackEvent('pro-signup-invalid', { step: step.value }); return }
  if (step.value < STEPS.length) return goTo(step.value + 1)
  await finish()
}
function back() { if (step.value > 1) goTo(step.value - 1) }
async function skipAgenda() {
  agenda.enabled = false
  if (validate(STEPS.length)) await finish()
  else await focusFirstError()
}

// ---------- Création du compte, puis de l'agenda
const welcome = useState('pro-welcome', () => null)

async function setupAgenda() {
  const warnings = []
  const s = agenda.service
  try {
    await $fetch('/api/backend/praticiens/me/consultation-types', {
      method: 'POST',
      body: {
        name: s.name.trim(),
        durationMin: s.durationMin,
        price: s.price === null || s.price === '' ? undefined : Number(s.price),
        mode: s.mode,
      },
    })
  } catch { warnings.push('prestation') }

  const week = (PRESETS.find(p => p.id === agenda.preset) ?? PRESETS[0]).build()
  for (const d of DAYS) {
    for (const r of week[d.n]) {
      try {
        await $fetch('/api/backend/praticiens/me/availabilities', { method: 'POST', body: { dayOfWeek: d.n, startTime: r.start, endTime: r.end } })
      } catch { if (!warnings.includes('horaires')) warnings.push('horaires') }
    }
  }
  return warnings
}

async function finish() {
  // Brouillon restauré : le mot de passe n'est jamais conservé, il faut le ressaisir.
  if (form.password.length < 6) {
    await goTo(1)
    errors.password = 'Saisissez votre mot de passe pour finaliser votre inscription.'
    await focusFirstError()
    return
  }
  submitting.value = true
  submitError.value = ''
  trackEvent('pro-signup-submit', { agenda: agenda.enabled })
  try {
    const price = agenda.enabled && agenda.service.price !== null && agenda.service.price !== '' ? Number(agenda.service.price) : undefined
    const result = await $fetch('/api/register-pro', {
      method: 'POST',
      body: {
        mail: form.mail,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        city: form.city,
        postalCode: Number(form.postalCode),
        country: 'France',
        phoneNumber: phoneDigits(form.phone),
        price,
        specialityIds: form.specialityIds,
      },
    })
    refreshCookie('leya_session')
    refreshCookie('leya_role')
    refreshCookie('leya_praticien')

    // Le backend n'a pas ouvert de session : le compte est créé, on renvoie vers la connexion.
    if (!result?.authenticated) {
      clearDraft()
      trackEvent('pro-signup-success', { session: false })
      return navigateTo({ path: '/login', query: { espace: 'pro', redirect: '/pro/bienvenue' } })
    }

    const warnings = agenda.enabled ? await setupAgenda() : []
    welcome.value = { firstName: form.firstName, agendaRequested: agenda.enabled, warnings }
    clearDraft()
    trackEvent('pro-signup-success', { session: true, agenda: agenda.enabled && !warnings.length })
    await navigateTo('/pro/bienvenue')
  } catch (e) {
    trackEvent('pro-signup-error', { status: apiStatus(e) ?? 0 })
    if (apiStatus(e) === 409) {
      await goTo(1)
      errors.mail = 'Un compte existe déjà avec cette adresse email. Connectez-vous pour accéder à votre espace.'
      await focusFirstError()
    } else {
      submitError.value = apiErrorMessage(e, 'La création du compte a échoué. Vérifiez les informations saisies et réessayez.')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; }
.hint { font-weight: 400; color: #6b7280; }
.field { width: 100%; border-radius: 0.75rem; border: 1px solid #d1d5db; padding: 0.7rem 0.85rem; font-size: 0.9rem; background: #fff; }
.field:focus { outline: none; border-color: #156F71; box-shadow: 0 0 0 3px rgb(21 111 113 / 0.12); }
.field[aria-invalid='true'] { border-color: #dc2626; }
.err { min-height: 0; font-size: 0.75rem; color: #b91c1c; margin-top: 0.25rem; }
.err:empty { display: none; }
</style>
