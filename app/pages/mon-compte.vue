<template>
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

<script setup>
import { computed, reactive, ref, watch } from 'vue'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'Mon compte — Léya', robots: 'noindex, nofollow' })

const { isPro, logout } = useSession()
setPageLayout(isPro.value ? 'pro' : 'default')

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
</style>
