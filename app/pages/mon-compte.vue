<template>
  <div>
  <!-- Une seule racine : plusieurs racines (commentaire compris) cassent la transition entre pages -->
  <!-- Compte praticien : habillage actuel (repris avec l'espace praticien) -->
  <template v-if="isPro">
    <div class="bg-[#e0ecf2]" :class="isPro ? '' : 'min-h-screen overflow-x-hidden'">
      <div :class="isPro ? '' : 'w-11/12 max-w-[760px] mx-auto pt-32 pb-8'" class="text-[#012828]">
        <h1 class="font-unbounded font-bold text-2xl lg:text-3xl mb-1">Mon compte</h1>
        <p class="text-sm text-[#012828]/60 mb-6">Vos informations, vos données et la suppression de votre compte.</p>

        <p v-if="loadError" class="text-sm text-red-700 bg-red-50 rounded-xl p-3 mb-6" role="alert">Impossible de charger votre compte pour le moment. Réessayez dans un instant.</p>

        <!-- Informations -->
        <section class="card mb-6" aria-labelledby="info-title">
          <h2 id="info-title" class="card-title">Mes informations</h2>
          <form class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="saveProfile">
            <div class="sm:col-span-2">
              <p class="label">Adresse email</p>
              <p class="text-sm">{{ me?.mail || '—' }}</p>
              <p class="help">L'adresse email ne peut pas être modifiée ici.</p>
            </div>
            <div>
              <label for="a-first" class="label">Prénom</label>
              <input id="a-first" v-model="form.firstName" maxlength="80" autocomplete="given-name" class="field" />
            </div>
            <div>
              <label for="a-last" class="label">Nom</label>
              <input id="a-last" v-model="form.lastName" maxlength="80" autocomplete="family-name" class="field" />
            </div>
            <div>
              <label for="a-phone" class="label">Téléphone</label>
              <input id="a-phone" v-model="form.phoneNumber" inputmode="tel" maxlength="20" autocomplete="tel" class="field" :aria-invalid="!!phoneError" aria-describedby="a-phone-err" />
              <p id="a-phone-err" class="err" role="alert">{{ phoneError }}</p>
            </div>
            <div class="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button type="submit" class="bg-[#012828] text-white text-sm font-bold px-6 py-2.5 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50" :disabled="saving || !profileDirty">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
              <p v-if="profileSaved" class="text-sm text-emerald-700" role="status">Informations enregistrées.</p>
              <p v-if="profileError" class="text-sm text-red-700" role="alert">{{ profileError }}</p>
            </div>
          </form>
        </section>

        <!-- Données -->
        <section class="card mb-6" aria-labelledby="data-title">
          <h2 id="data-title" class="card-title">Mes données</h2>
          <p class="text-sm text-[#012828]/80 mb-4">
            Téléchargez une copie de vos données : votre profil, vos rendez-vous (avec leurs motifs)<template v-if="isPro"> et votre fiche praticien</template>. Le fichier est au format JSON.
          </p>
          <button type="button" class="border border-[#012828] text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#012828] hover:text-white transition-colors disabled:opacity-50" :disabled="exporting" @click="exportData">
            {{ exporting ? 'Préparation…' : 'Télécharger mes données' }}
          </button>
          <p v-if="exportError" class="text-sm text-red-700 mt-3" role="alert">{{ exportError }}</p>
        </section>

        <!-- Statistiques d'usage (droit d'opposition) -->
        <section v-if="usage.available" class="card mb-6" aria-labelledby="usage-title">
          <h2 id="usage-title" class="card-title">Statistiques d'usage</h2>
          <p class="text-sm text-[#012828]/80 mb-4">
            Pour améliorer Léya, nous comptons certaines actions de votre compte (connexion, rendez-vous, messages envoyés à l'assistant),
            sous un identifiant pseudonymisé et sans jamais leur contenu.
            <NuxtLink to="/politique-de-confidentialite" class="underline">En savoir plus</NuxtLink>
          </p>
          <label class="flex items-start gap-3 text-sm cursor-pointer">
            <input v-model="usage.optOut" type="checkbox" class="mt-0.5 h-4 w-4 accent-[#156F71]" :disabled="usage.saving" @change="saveUsage">
            <span>Ne pas utiliser mon compte pour ces statistiques (les données déjà enregistrées sont effacées)</span>
          </label>
          <p v-if="usage.saved" class="text-sm text-[#156F71] mt-3" role="status">Préférence enregistrée.</p>
          <p v-if="usage.error" class="text-sm text-red-700 mt-3" role="alert">{{ usage.error }}</p>
        </section>

        <!-- Suppression -->
        <section class="card border border-red-200" aria-labelledby="del-title">
          <h2 id="del-title" class="card-title text-red-800">Supprimer mon compte</h2>
          <p class="text-sm text-[#012828]/80 mb-3">Cette action est définitive.</p>
          <ul class="text-sm text-[#012828]/80 list-disc pl-5 grid gap-1 mb-4">
            <li>Vos rendez-vous à venir sont annulés.</li>
            <li>Vos rendez-vous passés sont conservés sans le motif de consultation.</li>
            <li v-if="isPro">Votre fiche praticien est supprimée de l'annuaire.</li>
          </ul>
          <button v-if="!deleting" type="button" class="border border-red-700 text-red-800 text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-red-50 transition-colors" @click="deleting = true">Supprimer mon compte…</button>
          <form v-else class="grid gap-3 max-w-[420px]" novalidate @submit.prevent="deleteAccount">
            <div>
              <label for="del-pass" class="label">Confirmez avec votre mot de passe</label>
              <input id="del-pass" v-model="password" type="password" autocomplete="current-password" maxlength="200" class="field" />
            </div>
            <label class="inline-flex items-start gap-2 text-sm">
              <input v-model="confirmed" type="checkbox" class="mt-1 accent-red-700" />
              Je comprends que mon compte et mes données seront supprimés définitivement.
            </label>
            <p v-if="deleteError" class="text-sm text-red-700" role="alert">{{ deleteError }}</p>
            <div class="flex gap-3">
              <button type="submit" class="bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-[12px] hover:bg-red-800 transition-colors disabled:opacity-50" :disabled="removing || !password || !confirmed">{{ removing ? 'Suppression…' : 'Supprimer définitivement' }}</button>
              <button type="button" class="border border-gray-300 text-sm px-5 py-2.5 rounded-[12px]" :disabled="removing" @click="cancelDelete">Annuler</button>
            </div>
          </form>
        </section>

      </div>
    </div>
  </template>

  <!-- Compte patient : « Mon profil » -->
  <div v-else class="relative overflow-x-hidden bg-bleu-50 min-h-screen text-vert-900">
    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pt-28 lg:pt-[160px] pb-20 lg:pb-[96px]">
      <h1 class="font-unbounded font-normal text-[28px] sm:text-[32px] leading-[normal]">Mon profil</h1>
      <p class="mt-2 text-[18px] leading-[normal] text-neutre-600">Vos informations, vos préférences et vos données, au même endroit.</p>

      <p v-if="loadError" class="mt-6 rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">Impossible de charger votre compte pour le moment. Réessayez dans un instant.</p>

      <div class="mt-8 flex flex-col xl:flex-row gap-8">
        <!-- Colonne gauche : identité et menu -->
        <PatientSidebar active="profil" :me="me" />

        <!-- Colonne droite -->
        <div class="flex-1 min-w-0 flex flex-col gap-6">
          <!-- Informations personnelles -->
          <section id="profil" class="scroll-mt-28 rounded-[30px] bg-white p-6 sm:p-8 shadow-[0_12px_32px_rgba(1,40,40,0.08)] flex flex-col gap-5" aria-labelledby="info-title">
            <div>
              <h2 id="info-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Informations personnelles</h2>
              <p class="mt-[6px] text-[16px] leading-[normal] text-neutre-600">Ces informations servent uniquement à vos rendez-vous.</p>
            </div>
            <form class="flex flex-col gap-5" novalidate @submit.prevent="saveProfile">
              <div class="grid sm:grid-cols-2 gap-5">
                <div class="flex flex-col gap-2">
                  <label for="a-first" class="v5-label">Prénom</label>
                  <input id="a-first" v-model="form.firstName" maxlength="80" autocomplete="given-name" class="v5-field" />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="a-last" class="v5-label">Nom</label>
                  <input id="a-last" v-model="form.lastName" maxlength="80" autocomplete="family-name" class="v5-field" />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="a-mail" class="v5-label">Adresse e-mail</label>
                  <input id="a-mail" :value="me?.mail || ''" type="email" readonly class="v5-field bg-bleu-50 text-neutre-600" aria-describedby="a-mail-help" />
                  <p id="a-mail-help" class="text-[16px] leading-[normal] text-neutre-600">L'adresse e-mail ne peut pas être modifiée ici.</p>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="a-phone" class="v5-label">Téléphone <span class="font-normal text-neutre-600">(transmis au praticien lors d'une réservation)</span></label>
                  <input id="a-phone" v-model="form.phoneNumber" inputmode="tel" maxlength="20" autocomplete="tel" class="v5-field" :aria-invalid="!!phoneError" aria-describedby="a-phone-err" />
                  <p id="a-phone-err" class="v5-err" role="alert">{{ phoneError }}</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-3">
                <button type="submit" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-50" :disabled="saving || !profileDirty">
                  {{ saving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
                  <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
                </button>
                <button type="button" class="inline-flex items-center gap-2 px-2 py-1 text-[18px] font-semibold text-vert-900 hover:underline" @click="resetProfile">Annuler <ArrowUpRight :size="18" aria-hidden="true" /></button>
                <p v-if="profileSaved" class="text-[16px] text-vert-600" role="status">Informations enregistrées.</p>
                <p v-if="profileError" class="text-[16px] text-corail-700" role="alert">{{ profileError }}</p>
              </div>
            </form>
          </section>

          <!-- Préférences de recherche -->
          <section class="rounded-[30px] bg-bleu-100 p-6 sm:p-8 flex flex-col gap-5" aria-labelledby="prefs-title">
            <div>
              <h2 id="prefs-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Préférences de recherche</h2>
              <p class="mt-[6px] text-[16px] leading-[normal] text-neutre-600">Ville, distance, budget et type de consultation. Dans la recherche, votre ville est proposée, l'option « Selon mes préférences » filtre par ville et distance, et le budget s'affiche sur les fiches (« Dans votre budget »). Le type de consultation sera pris en compte dès que des praticiens inscrits le proposeront. Aucune information de santé n'est demandée.</p>
            </div>

            <div class="flex flex-col gap-[10px]">
              <p id="pref-modes" class="text-[16px] font-medium leading-[normal]">Consultation</p>
              <div class="flex flex-wrap gap-2" role="group" aria-labelledby="pref-modes">
                <button v-for="m in MODES" :key="m.v" type="button" class="chip" :class="prefs.modes.includes(m.v) ? 'chip-on' : 'chip-off'" :aria-pressed="prefs.modes.includes(m.v)" @click="toggleMode(m.v)">{{ m.l }}</button>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-5 items-end">
              <div class="flex flex-col gap-2">
                <label for="pref-city" class="v5-label">Ville</label>
                <input id="pref-city" v-model="prefs.city" maxlength="100" autocomplete="address-level2" class="v5-field" placeholder="Angers" aria-describedby="pref-city-help" />
                <p v-if="prefs.city.trim()" id="pref-city-help" class="text-[16px] leading-[normal] text-neutre-600">{{ prefsDirty && prefs.city.trim() !== JSON.parse(prefsInitial).city.trim() ? 'La ville sera localisée à l\'enregistrement.' : cityLocated ? 'Ville localisée : la distance maximale s\'applique.' : 'Ville non localisée : indiquez le nom d\'une commune pour utiliser la distance.' }}</p>
              </div>
              <div class="flex flex-col gap-[10px]">
                <p id="pref-radius" class="text-[16px] font-medium leading-[normal]">Distance maximale</p>
                <div class="flex flex-wrap gap-2" role="group" aria-labelledby="pref-radius">
                  <button v-for="r in RADII" :key="String(r.v)" type="button" class="chip" :class="prefs.radiusKm === r.v ? 'chip-on' : 'chip-off'" :aria-pressed="prefs.radiusKm === r.v" @click="prefs.radiusKm = r.v">{{ r.l }}</button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-[10px]">
              <p id="pref-budget" class="text-[16px] font-medium leading-[normal]">Budget par séance</p>
              <div class="flex flex-wrap gap-2" role="group" aria-labelledby="pref-budget">
                <button v-for="b in BUDGETS" :key="String(b.v)" type="button" class="chip" :class="prefs.budgetBand === b.v ? 'chip-on' : 'chip-off'" :aria-pressed="prefs.budgetBand === b.v" @click="prefs.budgetBand = b.v">{{ b.l }}</button>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
              <button type="button" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-50" :disabled="prefsSaving || !prefsDirty" @click="savePrefs">
                {{ prefsSaving ? 'Enregistrement…' : 'Enregistrer mes préférences' }}
                <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
              </button>
              <p v-if="prefsSaved" class="text-[16px] text-vert-600" role="status">Préférences enregistrées.</p>
              <p v-if="prefsError" class="text-[16px] text-corail-700" role="alert">{{ prefsError }}</p>
            </div>
          </section>

          <!-- Confidentialité et données -->
          <section id="confidentialite" class="scroll-mt-28 rounded-[30px] bg-white p-6 sm:p-8 shadow-[0_12px_32px_rgba(1,40,40,0.08)] flex flex-col gap-5" aria-labelledby="data-title">
            <h2 id="data-title" class="font-unbounded font-normal text-[20px] leading-[normal]">Confidentialité et données</h2>

            <label v-if="usage.available" class="flex items-start gap-3 text-[16px] lg:text-[18px] leading-snug cursor-pointer">
              <input v-model="usage.optOut" type="checkbox" class="peer sr-only" :disabled="usage.saving" @change="saveUsage" />
              <span class="box" aria-hidden="true"><Check :size="16" /></span>
              <span>Ne pas utiliser mon compte pour les statistiques d'usage (les données déjà enregistrées sont effacées). <NuxtLink to="/politique-de-confidentialite" class="underline">En savoir plus</NuxtLink></span>
            </label>
            <p v-if="usage.saved" class="text-[16px] text-vert-600" role="status">Préférence enregistrée.</p>
            <p v-if="usage.error" class="text-[16px] text-corail-700" role="alert">{{ usage.error }}</p>

            <p class="text-[16px] leading-snug text-neutre-600">Téléchargez une copie de vos données : votre profil et vos rendez-vous (avec leurs motifs), au format JSON.</p>
            <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="button" class="inline-flex items-center gap-[14px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-[2.5px] py-[2.5px] hover:bg-bleu-50 transition-colors disabled:opacity-50" :disabled="exporting" @click="exportData">
                {{ exporting ? 'Préparation…' : 'Télécharger mes données' }}
                <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
              </button>
              <button v-if="!deleting" type="button" class="inline-flex items-center gap-2 py-1 text-[18px] font-semibold text-[#e05353] hover:underline" @click="deleting = true">Supprimer mon compte <ArrowUpRight :size="18" aria-hidden="true" /></button>
            </div>
            <p v-if="exportError" class="text-[16px] text-corail-700" role="alert">{{ exportError }}</p>

            <!-- Suppression du compte -->
            <form v-if="deleting" class="rounded-[20px] border border-[#e05353]/40 bg-bleu-50 p-5 flex flex-col gap-4 max-w-[520px]" novalidate @submit.prevent="deleteAccount">
              <p class="text-[18px] font-semibold leading-[normal]">Supprimer mon compte</p>
              <ul class="list-disc pl-5 flex flex-col gap-1 text-[16px] leading-snug text-neutre-600">
                <li>Cette action est définitive.</li>
                <li>Vos rendez-vous à venir sont annulés.</li>
                <li>Vos rendez-vous passés sont conservés sans le motif de consultation.</li>
              </ul>
              <div class="flex flex-col gap-2">
                <label for="del-pass" class="v5-label">Confirmez avec votre mot de passe</label>
                <input id="del-pass" v-model="password" type="password" autocomplete="current-password" maxlength="200" class="v5-field" />
              </div>
              <label class="flex items-start gap-3 text-[16px] leading-snug cursor-pointer">
                <input v-model="confirmed" type="checkbox" class="peer sr-only" />
                <span class="box" aria-hidden="true"><Check :size="16" /></span>
                <span>Je comprends que mon compte et mes données seront supprimés définitivement.</span>
              </label>
              <p v-if="deleteError" class="text-[16px] text-corail-700" role="alert">{{ deleteError }}</p>
              <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button type="submit" class="rounded-full bg-[#e05353] px-6 py-[11px] text-[16px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50" :disabled="removing || !password || !confirmed">{{ removing ? 'Suppression…' : 'Supprimer définitivement' }}</button>
                <button type="button" class="text-[16px] font-medium text-vert-600 hover:underline" :disabled="removing" @click="cancelDelete">Annuler</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ArrowUpRight, Check } from 'lucide-vue-next'
import { usePreferences } from '~/composables/usePreferences'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'Mon compte — Léya', robots: 'noindex, nofollow' })

const { isPro, logout } = useSession()
// Le compte praticien s'affiche dans la coque de l'espace praticien ; le patient garde la mise en page du site
if (isPro.value) setPageLayout('pro')

const { data: me, error: loadError, refresh } = await useAsyncData('account-me', () => $fetch('/api/backend/users/me'), { server: false })

const form = reactive({ firstName: '', lastName: '', phoneNumber: '' })
const initial = ref({ firstName: '', lastName: '', phoneNumber: '' })
watch(me, (m) => {
  if (!m) return
  const values = { firstName: m.firstName ?? '', lastName: m.lastName ?? '', phoneNumber: m.phoneNumber ?? '' }
  Object.assign(form, values)
  initial.value = { ...values }
}, { immediate: true })
const profileDirty = computed(() => Object.keys(initial.value).some(k => form[k] !== initial.value[k]))

const resetProfile = () => { Object.assign(form, initial.value); phoneError.value = ''; profileError.value = '' }

// --- Préférences de recherche (ville, distance, budget, modes) : aucune donnée de santé
const MODES = [{ v: 'cabinet', l: 'Au cabinet' }, { v: 'visio', l: 'En visio' }, { v: 'domicile', l: 'À domicile' }]
const RADII = [{ v: 5, l: '5 km' }, { v: 10, l: '10 km' }, { v: 20, l: '20 km' }, { v: null, l: 'Peu importe' }]
const BUDGETS = [{ v: 'lt50', l: 'Moins de 50 €' }, { v: '50_70', l: '50 à 70 €' }, { v: 'gt70', l: 'Plus de 70 €' }, { v: null, l: 'Je préfère ne pas répondre' }]
const prefs = reactive({ city: '', radiusKm: null, budgetBand: null, modes: [] })
const { prefs: sharedPrefs } = usePreferences()
// Coordonnées de la ville (communes uniquement) : nécessaires pour filtrer les résultats par distance
const geo = ref({ latitude: null, longitude: null })
const cityLocated = computed(() => geo.value.latitude != null && geo.value.longitude != null)
const norm = (v) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
async function locateCity(city) {
  if (!city) return { latitude: null, longitude: null }
  try {
    const list = await $fetch('/api/address', { query: { q: city } })
    // La commune elle-même (son nom sert d'adresse), pas une rue qui porte le même nom
    const hit = (Array.isArray(list) ? list : []).find(a => norm(a.street) === norm(a.city) && norm(a.city) === norm(city.replace(/\s*\(?\d{5}\)?\s*$/, '')))
    return hit ? { latitude: hit.latitude, longitude: hit.longitude } : { latitude: null, longitude: null }
  } catch {
    return { latitude: null, longitude: null }
  }
}
const prefsInitial = ref(JSON.stringify(prefs))
const prefsDirty = computed(() => JSON.stringify(prefs) !== prefsInitial.value)
const prefsSaving = ref(false)
const prefsSaved = ref(false)
const prefsError = ref('')
function applyPrefs(p) {
  Object.assign(prefs, { city: p?.city ?? '', radiusKm: p?.radiusKm ?? null, budgetBand: p?.budgetBand ?? null, modes: Array.isArray(p?.modes) ? [...p.modes] : [] })
  geo.value = { latitude: p?.latitude ?? null, longitude: p?.longitude ?? null }
  prefsInitial.value = JSON.stringify(prefs)
  sharedPrefs.value = p ? { ...p } : null
}
const toggleMode = (m) => { prefs.modes = prefs.modes.includes(m) ? prefs.modes.filter(x => x !== m) : [...prefs.modes, m] }
onMounted(async () => {
  if (isPro.value) return
  try { applyPrefs(await $fetch('/api/backend/users/me/preferences')) } catch { /* préférences indisponibles : formulaire vide */ }
})
async function savePrefs() {
  prefsSaved.value = false
  prefsError.value = ''
  prefsSaving.value = true
  try {
    const city = prefs.city.trim()
    const cityChanged = JSON.parse(prefsInitial.value).city.trim() !== city
    const where = cityChanged || (city && !cityLocated.value) ? await locateCity(city) : geo.value
    const saved = await $fetch('/api/backend/users/me/preferences', {
      method: 'PUT',
      body: { city: city || null, ...where, radiusKm: prefs.radiusKm, budgetBand: prefs.budgetBand, modes: prefs.modes },
    })
    applyPrefs(saved)
    prefsSaved.value = true
  } catch (e) {
    prefsError.value = apiErrorMessage(e, 'Impossible d\'enregistrer vos préférences.')
  } finally {
    prefsSaving.value = false
  }
}

const saving = ref(false)
const profileSaved = ref(false)
const profileError = ref('')
const phoneError = ref('')

async function saveProfile() {
  profileSaved.value = false
  profileError.value = ''
  phoneError.value = ''
  const phone = form.phoneNumber.replace(/[\s.]/g, '')
  if (phone && !/^\+?\d{10,15}$/.test(phone)) { phoneError.value = 'Numéro invalide (10 chiffres, ou format international).'; return }
  // Seules les informations modifiées sont envoyées ; un champ vidé est effacé (null)
  const body = {}
  for (const key of ['firstName', 'lastName']) if (form[key] !== initial.value[key]) body[key] = form[key].trim() || null
  if (form.phoneNumber !== initial.value.phoneNumber) body.phoneNumber = phone || null
  saving.value = true
  try {
    await $fetch('/api/backend/users/me', { method: 'PATCH', body })
    await refresh()
    profileSaved.value = true
  } catch (e) {
    profileError.value = apiErrorMessage(e, 'Impossible d\'enregistrer vos informations.')
  } finally {
    saving.value = false
  }
}

// --- Statistiques d'usage (droit d'opposition) : section masquée si le suivi est désactivé côté serveur
const usage = reactive({ available: false, optOut: false, saving: false, saved: false, error: '' })
onMounted(async () => {
  try {
    const pref = await $fetch('/api/backend/tracking/preferences')
    usage.available = pref.trackingEnabled
    usage.optOut = pref.optOut
  } catch { /* préférence indisponible : la section reste masquée */ }
})
async function saveUsage() {
  usage.saved = false
  usage.error = ''
  usage.saving = true
  try {
    const pref = await $fetch('/api/backend/tracking/preferences', { method: 'PUT', body: { optOut: usage.optOut } })
    usage.optOut = pref.optOut
    usage.saved = true
  } catch (e) {
    usage.optOut = !usage.optOut
    usage.error = apiErrorMessage(e, 'Impossible d\'enregistrer votre préférence. Réessayez plus tard.')
  } finally {
    usage.saving = false
  }
}

// --- Export
const exporting = ref(false)
const exportError = ref('')
async function exportData() {
  exportError.value = ''
  exporting.value = true
  try {
    const data = await $fetch('/api/backend/users/me/export')
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leya-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    exportError.value = apiErrorMessage(e, 'Impossible de préparer vos données pour le moment.')
  } finally {
    exporting.value = false
  }
}

// --- Suppression
const deleting = ref(false)
const password = ref('')
const confirmed = ref(false)
const removing = ref(false)
const deleteError = ref('')
function cancelDelete() { deleting.value = false; password.value = ''; confirmed.value = false; deleteError.value = '' }

async function deleteAccount() {
  deleteError.value = ''
  removing.value = true
  try {
    await $fetch('/api/backend/users/me', { method: 'DELETE', body: { password: password.value } })
    password.value = ''
    try { localStorage.removeItem('leya_chat_usage') } catch { /* stockage indisponible */ }
    await logout()
    await navigateTo('/compte-supprime')
  } catch (e) {
    const status = e?.statusCode ?? e?.response?.status
    deleteError.value = status === 403 ? 'Mot de passe incorrect.' : apiErrorMessage(e, 'Impossible de supprimer le compte pour le moment.')
  } finally {
    removing.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
@media (min-width: 640px) { .card { padding: 2rem; } }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
.label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem; }
.field { width: 100%; border: 1px solid #d1d5db; border-radius: 12px; padding: 0.625rem 0.75rem; font-size: 0.875rem; background: #fff; }
.field[aria-invalid='true'] { border-color: #b91c1c; }
.err { color: #b91c1c; font-size: 0.75rem; margin-top: 0.25rem; }
.help { font-size: 0.75rem; color: rgb(1 40 40 / 0.7); margin-top: 0.25rem; }

/* Compte patient V5 */
.v5-label { font-size: 16px; font-weight: 500; line-height: normal; }
.v5-field { width: 100%; height: 52px; border-radius: 12px; border: 1px solid #c8c8c8; padding: 0 16px; font-size: 16px; background: #fff; color: #012828; transition: box-shadow 0.15s; }
.v5-field::placeholder { color: #959595; }
.v5-field:focus { outline: none; border: 2px solid #156f71; padding: 0 15px; box-shadow: 0 0 0 4px #cde4df; }
.v5-field[aria-invalid='true'] { border-color: #ec7f7a; }
.v5-field[readonly] { cursor: default; }
.v5-err { font-size: 16px; line-height: normal; color: #b5534e; }
.v5-err:empty { display: none; }
.chip { border-radius: 9999px; padding: 10px 18px; font-size: 16px; font-weight: 500; line-height: normal; transition: background-color 0.15s, color 0.15s; }
.chip:focus-visible { outline: none; box-shadow: 0 0 0 4px #cde4df; }
.chip-on { background: #156f71; color: #fff; }
.chip-off { background: #fff; color: #012828; border: 1px solid #d9d9d9; }
.chip-off:hover { background: rgb(255 255 255 / 0.7); }
.box { margin-top: 2px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0; border-radius: 6px; border: 2px solid #156f71; background: #fff; color: #fff; }
.box > svg { opacity: 0; }
:is(input:checked) + .box { background: #156f71; }
:is(input:checked) + .box > svg { opacity: 1; }
:is(input:focus-visible) + .box { box-shadow: 0 0 0 4px #cde4df; }
</style>
