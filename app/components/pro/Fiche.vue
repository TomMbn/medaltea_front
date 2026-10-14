<template>
  <div>
    <p v-if="loadError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">
      Impossible de charger votre fiche pour le moment. Réessayez dans un instant.
    </p>
    <p v-else-if="!form" class="text-sm text-gray-500" role="status">Chargement de votre fiche…</p>

    <template v-else>
      <p v-if="unlocated" class="text-sm bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 mb-6" role="status">
        Votre adresse n'est pas localisée : votre fiche fonctionne normalement mais n'apparaît pas dans la recherche « autour de moi ».
        <a href="#cabinet" class="underline font-semibold">Recherchez votre adresse</a> pour la localiser.
      </p>
      <ProPhotoUpload class="mb-6" :photo-url="fiche.photoUrl || ''" :first-name="form.firstName" :last-name="form.lastName" />
      <form class="grid gap-6" novalidate @submit.prevent="save">
        <!-- Présentation -->
        <section id="presentation" class="card scroll-mt-24" aria-labelledby="f-pres">
          <h2 id="f-pres" class="card-title">Présentation</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="f-first" class="label">Prénom</label>
              <input id="f-first" v-model="form.firstName" maxlength="80" autocomplete="given-name" class="field" :aria-invalid="!!errors.firstName" />
              <p v-if="errors.firstName" class="err" role="alert">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="f-last" class="label">Nom</label>
              <input id="f-last" v-model="form.lastName" maxlength="80" autocomplete="family-name" class="field" :aria-invalid="!!errors.lastName" />
              <p v-if="errors.lastName" class="err" role="alert">{{ errors.lastName }}</p>
            </div>
          </div>

          <fieldset class="mt-5">
            <legend class="label">Spécialités</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="s in specialities" :key="s.id" class="chip" :class="form.specialityIds.includes(s.id) ? 'chip-on' : ''">
                <input v-model="form.specialityIds" type="checkbox" :value="s.id" class="sr-only" />
                {{ s.name }}
              </label>
            </div>
            <p v-if="errors.specialityIds" class="err" role="alert">{{ errors.specialityIds }}</p>
          </fieldset>

          <div class="mt-5">
            <label for="f-bio" class="label">Votre présentation</label>
            <textarea id="f-bio" v-model="form.bio" rows="6" maxlength="2000" class="field" aria-describedby="f-bio-help" placeholder="Votre parcours, votre approche, ce qu'un patient peut attendre d'une séance…"></textarea>
            <p id="f-bio-help" class="help">
              {{ form.bio.length }} / 2000 caractères.
              <template v-if="form.bio.trim().length < 50">Une présentation d'au moins 50 caractères permet à votre fiche d'apparaître sur Google.</template>
              Ne promettez pas de guérison : décrivez votre pratique.
            </p>
          </div>

          <div class="mt-5 max-w-[200px]">
            <label for="f-since" class="label">Exerce depuis (année)</label>
            <input id="f-since" v-model="form.practicingSince" inputmode="numeric" maxlength="4" class="field" :aria-invalid="!!errors.practicingSince" />
            <p v-if="errors.practicingSince" class="err" role="alert">{{ errors.practicingSince }}</p>
          </div>
        </section>

        <!-- Cabinet -->
        <section id="cabinet" class="card scroll-mt-24" aria-labelledby="f-cab">
          <h2 id="f-cab" class="card-title">Cabinet</h2>
          <div class="grid gap-4">
            <div>
              <AddressSuggest id="f-search" v-model="addressSearch" label="Rechercher votre adresse" @select="pickAddress" />
              <p v-if="form.located" class="text-xs text-emerald-700 mt-1">✓ Adresse localisée.</p>
              <p v-else class="help">Choisissez une suggestion pour que votre fiche apparaisse dans la recherche « autour de moi ».</p>
            </div>
            <div>
              <label for="f-address" class="label">Adresse</label>
              <input id="f-address" v-model="form.address" maxlength="200" autocomplete="street-address" class="field" :aria-invalid="!!errors.address" @input="form.located = ''" />
              <p v-if="errors.address" class="err" role="alert">{{ errors.address }}</p>
            </div>
            <div>
              <label for="f-complement" class="label">Complément d'adresse <span class="opt">(facultatif)</span></label>
              <input id="f-complement" v-model="form.addressComplement" maxlength="200" class="field" />
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <label for="f-postal" class="label">Code postal</label>
                <input id="f-postal" v-model="form.postalCode" inputmode="numeric" maxlength="5" autocomplete="postal-code" class="field" :aria-invalid="!!errors.postalCode" @input="form.located = ''" />
                <p v-if="errors.postalCode" class="err" role="alert">{{ errors.postalCode }}</p>
              </div>
              <div class="sm:col-span-2">
                <label for="f-city" class="label">Ville</label>
                <input id="f-city" v-model="form.city" maxlength="100" autocomplete="address-level2" class="field" :aria-invalid="!!errors.city" @input="form.located = ''" />
                <p v-if="errors.city" class="err" role="alert">{{ errors.city }}</p>
              </div>
            </div>
            <div>
              <p class="label">Accessibilité</p>
              <div class="flex flex-wrap gap-4 text-sm">
                <label class="inline-flex items-center gap-2 min-h-[44px]"><input v-model="form.wheelchair" type="radio" value="yes" class="accent-[#156F71]" /> Accessible aux personnes à mobilité réduite</label>
                <label class="inline-flex items-center gap-2 min-h-[44px]"><input v-model="form.wheelchair" type="radio" value="no" class="accent-[#156F71]" /> Non accessible</label>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section class="card" aria-labelledby="f-contact">
          <h2 id="f-contact" class="card-title">Contact et réseaux</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="f-phone" class="label">Téléphone</label>
              <input id="f-phone" v-model="form.phoneNumber" inputmode="tel" maxlength="20" autocomplete="tel" class="field" :aria-invalid="!!errors.phoneNumber" />
              <p v-if="errors.phoneNumber" class="err" role="alert">{{ errors.phoneNumber }}</p>
            </div>
            <div>
              <label for="f-web" class="label">Site web</label>
              <input id="f-web" v-model="form.website" type="url" maxlength="200" placeholder="https://" class="field" :aria-invalid="!!errors.website" />
              <p v-if="errors.website" class="err" role="alert">{{ errors.website }}</p>
            </div>
            <div v-for="n in socials" :key="n.key">
              <label :for="`f-${n.key}`" class="label">{{ n.label }}</label>
              <input :id="`f-${n.key}`" v-model="form.social[n.key]" type="url" maxlength="200" placeholder="https://" class="field" :aria-invalid="!!errors[n.key]" />
              <p v-if="errors[n.key]" class="err" role="alert">{{ errors[n.key] }}</p>
            </div>
          </div>
        </section>

        <!-- Pratique -->
        <section id="pratique" class="card scroll-mt-24" aria-labelledby="f-prat">
          <h2 id="f-prat" class="card-title">Informations pratiques</h2>
          <fieldset>
            <legend class="label">Public accueilli</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="(label, key) in PUBLIC_LABELS" :key="key" class="chip" :class="form.publicTypes.includes(key) ? 'chip-on' : ''">
                <input v-model="form.publicTypes" type="checkbox" :value="key" class="sr-only" /> {{ label }}
              </label>
            </div>
          </fieldset>
          <fieldset class="mt-5">
            <legend class="label">Langues parlées</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="code in languageOptions" :key="code" class="chip" :class="form.languages.includes(code) ? 'chip-on' : ''">
                <input v-model="form.languages" type="checkbox" :value="code" class="sr-only" /> {{ languageName(code) }}
              </label>
            </div>
          </fieldset>
          <fieldset class="mt-5">
            <legend class="label">Moyens de paiement</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="(label, key) in PAYMENT_LABELS" :key="key" class="chip" :class="form.paymentMethods.includes(key) ? 'chip-on' : ''">
                <input v-model="form.paymentMethods" type="checkbox" :value="key" class="sr-only" /> {{ label }}
              </label>
            </div>
          </fieldset>
          <div class="mt-5">
            <label for="f-reimb" class="label">Remboursement <span class="opt">(facultatif)</span></label>
            <textarea id="f-reimb" v-model="form.reimbursementInfo" rows="2" maxlength="500" class="field" placeholder="Ex. : remboursé par certaines mutuelles, feuille de soins sur demande"></textarea>
          </div>
        </section>

        <!-- Identifiants -->
        <section class="card" aria-labelledby="f-ids">
          <h2 id="f-ids" class="card-title">Identifiants professionnels</h2>
          <p class="help mb-4">Ces numéros ne sont jamais affichés sur votre fiche. Ils servent à vérifier votre identité.</p>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label for="f-rpps" class="label">RPPS <span class="opt">(11 chiffres)</span></label>
              <input id="f-rpps" v-model="form.rpps" inputmode="numeric" maxlength="11" class="field" :aria-invalid="!!errors.rpps" />
              <p v-if="errors.rpps" class="err" role="alert">{{ errors.rpps }}</p>
            </div>
            <div>
              <label for="f-adeli" class="label">ADELI <span class="opt">(9 caractères)</span></label>
              <input id="f-adeli" v-model="form.adeli" maxlength="9" class="field" :aria-invalid="!!errors.adeli" />
              <p v-if="errors.adeli" class="err" role="alert">{{ errors.adeli }}</p>
            </div>
            <div>
              <label for="f-siret" class="label">SIRET <span class="opt">(14 chiffres)</span></label>
              <input id="f-siret" v-model="form.siret" inputmode="numeric" maxlength="14" class="field" :aria-invalid="!!errors.siret" />
              <p v-if="errors.siret" class="err" role="alert">{{ errors.siret }}</p>
            </div>
          </div>
        </section>

        <!-- Barre d'enregistrement -->
        <div class="sticky bottom-0 -mx-1 px-1 pb-2 pt-3 bg-gradient-to-t from-[#e0ecf2] via-[#e0ecf2] to-transparent">
          <div class="flex flex-wrap items-center gap-3 bg-white rounded-[16px] shadow-md px-4 py-3">
            <button type="submit" class="bg-[#012828] text-white text-sm font-bold px-6 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50" :disabled="saving || !dirty">
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
            <p v-if="dirty && !saving" class="text-xs text-[#012828]/70">Modifications non enregistrées</p>
            <p v-if="saved" class="text-sm text-emerald-700" role="status">Fiche enregistrée.</p>
            <p v-if="saved && locateWarning" class="text-sm text-amber-800" role="status">{{ locateWarning }}</p>
            <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
          </div>
        </div>
      </form>

      <!-- Diplômes : appels séparés, hors du formulaire -->
      <section id="formation" class="card mt-6 scroll-mt-24" aria-labelledby="f-dip">
        <h2 id="f-dip" class="card-title">Formation et diplômes</h2>
        <ul v-if="diplomas.length" class="grid gap-2 mb-5">
          <li v-for="d in diplomas" :key="d.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <span class="text-sm">
              <span class="font-semibold">{{ d.title }}</span><template v-if="d.organization"> — {{ d.organization }}</template><template v-if="d.year"> ({{ d.year }})</template>
            </span>
            <button type="button" class="text-xs px-3 py-1.5 rounded-[10px] border border-gray-300 hover:bg-gray-50 disabled:opacity-50" :disabled="diplomaBusy" :aria-label="`Supprimer le diplôme ${d.title}`" @click="removeDiploma(d)">Supprimer</button>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500 mb-5">Aucun diplôme renseigné.</p>

        <form class="grid gap-3 sm:grid-cols-6" novalidate @submit.prevent="addDiploma">
          <div class="sm:col-span-3">
            <label for="d-title" class="label">Intitulé</label>
            <input id="d-title" v-model="diploma.title" maxlength="150" class="field" />
          </div>
          <div class="sm:col-span-2">
            <label for="d-org" class="label">Organisme <span class="opt">(facultatif)</span></label>
            <input id="d-org" v-model="diploma.organization" maxlength="150" class="field" />
          </div>
          <div>
            <label for="d-year" class="label">Année</label>
            <input id="d-year" v-model="diploma.year" inputmode="numeric" maxlength="4" class="field" />
          </div>
          <div class="sm:col-span-6 flex flex-wrap items-center gap-3">
            <button type="submit" class="border border-[#012828] text-sm font-bold px-5 py-2 rounded-[12px] hover:bg-[#012828] hover:text-white transition-colors disabled:opacity-50" :disabled="diplomaBusy">Ajouter ce diplôme</button>
            <p v-if="diplomaError" class="text-sm text-red-700" role="alert">{{ diplomaError }}</p>
          </div>
        </form>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const { specialities } = await useSpecialities()
const { data: fiche, error: loadError, refresh } = await useAsyncData('pro-fiche', () => $fetch('/api/backend/praticiens/me'), { server: false })

const socials = [
  { key: 'facebook', label: 'Facebook' }, { key: 'instagram', label: 'Instagram' }, { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' }, { key: 'tiktok', label: 'TikTok' },
]
const COMMON_LANGUAGES = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'nl', 'ru', 'zh']
const languageName = (code) => { try { const n = new Intl.DisplayNames(['fr'], { type: 'language' }).of(code); return n ? n.charAt(0).toUpperCase() + n.slice(1) : code } catch { return code } }
const languageOptions = computed(() => [...new Set([...COMMON_LANGUAGES, ...(form.value?.languages ?? [])])])

const toForm = (f) => ({
  firstName: f.firstName ?? '', lastName: f.lastName ?? '',
  specialityIds: (f.specialities ?? []).map(s => s.id),
  bio: f.bio ?? '', practicingSince: f.practicingSince ? String(f.practicingSince) : '',
  address: f.address ?? '', addressComplement: f.addressComplement ?? '', postalCode: f.postalCode ? String(f.postalCode).padStart(5, '0') : '', city: f.city ?? '',
  wheelchair: f.wheelchairAccessible === true ? 'yes' : f.wheelchairAccessible === false ? 'no' : '',
  phoneNumber: f.phoneNumber ?? '', website: f.website ?? '',
  social: Object.fromEntries(socials.map(s => [s.key, f.socialLinks?.[s.key] ?? ''])),
  publicTypes: [...(f.publicTypes ?? [])], languages: [...(f.languages ?? [])], paymentMethods: [...(f.paymentMethods ?? [])],
  reimbursementInfo: f.reimbursementInfo ?? '',
  rpps: f.rpps ?? '', adeli: f.adeli ?? '', siret: f.siret ?? '',
  // Coordonnées d'une suggestion choisie dans cette session (vide : aucune)
  located: '',
})

const form = ref(null)
const initial = ref('')
const addressSearch = ref('')
let pickedCoords = null
// Fiche sans coordonnées : absente de la recherche « autour de moi »
const unlocated = computed(() => !!fiche.value && (fiche.value.latitude == null || fiche.value.longitude == null))

function pickAddress(a) {
  form.value.address = a.street
  form.value.postalCode = String(a.postalCode)
  form.value.city = a.city
  const ok = Number.isFinite(a.latitude) && Number.isFinite(a.longitude)
  pickedCoords = ok ? { latitude: a.latitude, longitude: a.longitude } : null
  form.value.located = ok ? `${a.latitude},${a.longitude}` : ''
}
const snapshot = (value) => JSON.stringify(value, (k, v) => (Array.isArray(v) ? [...v].sort() : v))
watch(fiche, (f) => {
  if (!f) return
  form.value = reactive(toForm(f))
  initial.value = snapshot(form.value)
}, { immediate: true })

const dirty = computed(() => !!form.value && snapshot(form.value) !== initial.value)

const errors = reactive({})
const saving = ref(false)
const saved = ref(false)
const errorMessage = ref('')
const locateWarning = ref('')

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  const f = form.value
  const digits = (v) => String(v).replace(/[\s.]/g, '')
  if (!f.firstName.trim()) errors.firstName = 'Prénom requis.'
  if (!f.lastName.trim()) errors.lastName = 'Nom requis.'
  if (!f.specialityIds.length) errors.specialityIds = 'Choisissez au moins une spécialité.'
  if (f.practicingSince && !(/^\d{4}$/.test(f.practicingSince) && +f.practicingSince >= 1950 && +f.practicingSince <= new Date().getFullYear())) errors.practicingSince = 'Année invalide.'
  if (!f.address.trim()) errors.address = 'Adresse requise.'
  if (!/^\d{5}$/.test(f.postalCode)) errors.postalCode = 'Code postal à 5 chiffres.'
  if (!f.city.trim()) errors.city = 'Ville requise.'
  if (f.phoneNumber && !/^\+?\d{10,15}$/.test(digits(f.phoneNumber))) errors.phoneNumber = 'Numéro invalide (10 chiffres, ou format international).'
  if (f.website && !/^https?:\/\/\S+$/.test(f.website)) errors.website = 'Adresse invalide (http ou https).'
  for (const s of socials) if (f.social[s.key] && !/^https:\/\/\S+$/.test(f.social[s.key])) errors[s.key] = 'Lien invalide (https requis).'
  if (f.rpps && !/^\d{11}$/.test(f.rpps)) errors.rpps = '11 chiffres.'
  if (f.adeli && !/^[0-9A-Za-z]{9}$/.test(f.adeli)) errors.adeli = '9 caractères.'
  if (f.siret && !/^\d{14}$/.test(f.siret)) errors.siret = '14 chiffres.'
  return Object.keys(errors).length === 0
}

/** Seuls les champs modifiés sont envoyés. */
function changes() {
  const before = toForm(fiche.value)
  const now = form.value
  const out = {}
  const same = (a, b) => snapshot(a) === snapshot(b)
  for (const key of ['firstName', 'lastName', 'bio', 'address', 'addressComplement', 'postalCode', 'city', 'website', 'reimbursementInfo', 'rpps', 'adeli', 'siret']) {
    if (now[key].trim() !== String(before[key]).trim()) out[key] = now[key].trim()
  }
  if (now.phoneNumber !== before.phoneNumber) out.phoneNumber = now.phoneNumber.replace(/[\s.]/g, '')
  if (now.practicingSince !== before.practicingSince && now.practicingSince) out.practicingSince = Number(now.practicingSince)
  for (const key of ['specialityIds', 'publicTypes', 'languages', 'paymentMethods']) if (!same(now[key], before[key])) out[key] = [...now[key]]
  if (now.wheelchair !== before.wheelchair && now.wheelchair) out.wheelchairAccessible = now.wheelchair === 'yes'
  if (!same(now.social, before.social)) out.socialLinks = Object.fromEntries(Object.entries(now.social).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]))
  return out
}

async function save() {
  saved.value = false
  errorMessage.value = ''
  if (!validate()) { errorMessage.value = 'Corrigez les champs signalés.'; return }
  const payload = changes()
  const addressChanged = !!(payload.address || payload.postalCode || payload.city)
  // Une suggestion choisie pour une adresse jusque-là non localisée doit aussi enregistrer ses coordonnées
  const locatesExisting = !!(form.value.located && unlocated.value)
  if (!Object.keys(payload).length && !locatesExisting) return
  saving.value = true
  locateWarning.value = ''
  try {
    // Coordonnées pour la recherche « autour de moi » : suggestion choisie, sinon recherche automatique (Base Adresse Nationale)
    if (addressChanged || locatesExisting) {
      let coords = form.value.located ? pickedCoords : null
      if (!coords) {
        const f = form.value
        const hits = await $fetch('/api/address', { query: { q: `${f.address} ${f.postalCode} ${f.city}` } }).catch(() => [])
        const hit = Array.isArray(hits) ? hits.find(h => String(h.postalCode) === f.postalCode && Number.isFinite(h.latitude) && Number.isFinite(h.longitude)) : null
        if (hit) coords = { latitude: hit.latitude, longitude: hit.longitude }
      }
      if (coords) Object.assign(payload, coords)
      else if (addressChanged) {
        // Adresse changée mais introuvable : on retire les anciennes coordonnées plutôt que de laisser une position fausse
        payload.latitude = null
        payload.longitude = null
        locateWarning.value = 'Nous n\'avons pas pu localiser cette adresse : votre fiche n\'apparaîtra pas dans la recherche « autour de moi ».'
      }
    }
    try {
      await $fetch(`/api/backend/praticiens/${fiche.value.id}`, { method: 'PUT', body: payload })
    } catch (e) {
      // Le backend peut refuser la remise à zéro des coordonnées : on enregistre alors le reste
      const message = String(e?.data?.message ?? e?.statusMessage ?? '')
      if (payload.latitude === null && (e?.statusCode ?? e?.response?.status) === 400 && /latitude|longitude/i.test(message)) {
        delete payload.latitude; delete payload.longitude
        await $fetch(`/api/backend/praticiens/${fiche.value.id}`, { method: 'PUT', body: payload })
      } else throw e
    }
    pickedCoords = null
    addressSearch.value = ''
    await refresh()
    saved.value = true
    trackEvent('pro-fiche-saved')
  } catch (e) {
    errorMessage.value = apiErrorMessage(e, 'Impossible d\'enregistrer votre fiche. Réessayez dans un instant.')
  } finally {
    saving.value = false
  }
}

// --- Diplômes
const diplomas = computed(() => (Array.isArray(fiche.value?.diplomas) ? fiche.value.diplomas : []))
const diploma = reactive({ title: '', organization: '', year: '' })
const diplomaBusy = ref(false)
const diplomaError = ref('')
async function addDiploma() {
  diplomaError.value = ''
  if (!diploma.title.trim()) { diplomaError.value = 'Indiquez l\'intitulé du diplôme.'; return }
  if (diploma.year && !(/^\d{4}$/.test(diploma.year) && +diploma.year >= 1950 && +diploma.year <= new Date().getFullYear())) { diplomaError.value = 'Année invalide.'; return }
  diplomaBusy.value = true
  try {
    const body = { title: diploma.title.trim() }
    if (diploma.organization.trim()) body.organization = diploma.organization.trim()
    if (diploma.year) body.year = Number(diploma.year)
    await $fetch('/api/backend/praticiens/me/diplomas', { method: 'POST', body })
    diploma.title = ''; diploma.organization = ''; diploma.year = ''
    await refresh()
  } catch (e) {
    diplomaError.value = apiErrorMessage(e, 'Impossible d\'ajouter ce diplôme.')
  } finally { diplomaBusy.value = false }
}
async function removeDiploma(d) {
  diplomaBusy.value = true
  diplomaError.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/diplomas/${d.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    diplomaError.value = apiErrorMessage(e, 'Impossible de supprimer ce diplôme.')
  } finally { diplomaBusy.value = false }
}

// --- Quitter avec des modifications non enregistrées
onBeforeRouteLeave(() => (dirty.value && !window.confirm('Quitter sans enregistrer vos modifications ?') ? false : true))
const warnUnload = (e) => { if (dirty.value) { e.preventDefault(); e.returnValue = '' } }
onMounted(() => window.addEventListener('beforeunload', warnUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnload))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
@media (min-width: 640px) { .card { padding: 2rem; } }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
.label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem; }
.opt { font-weight: 400; color: rgb(1 40 40 / 0.6); }
.field { width: 100%; border: 1px solid #d1d5db; border-radius: 12px; padding: 0.625rem 0.75rem; font-size: 0.875rem; background: #fff; }
.field[aria-invalid='true'] { border-color: #b91c1c; }
.err { color: #b91c1c; font-size: 0.75rem; margin-top: 0.25rem; }
.help { font-size: 0.75rem; color: rgb(1 40 40 / 0.7); margin-top: 0.375rem; }
.chip { display: inline-flex; align-items: center; border: 1px solid #d1d5db; border-radius: 999px; padding: 0.4rem 0.9rem; font-size: 0.8125rem; font-weight: 500; cursor: pointer; background: #fff; }
.chip:focus-within { outline: 2px solid #156F71; outline-offset: 2px; }
.chip-on { background: #012828; color: #fff; border-color: #012828; }
</style>
