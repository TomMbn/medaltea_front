<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[760px] mx-auto pt-32 pb-8">
      <h1 class="font-unbounded font-bold text-2xl lg:text-3xl text-[#012828] mb-2">Rejoindre Léya en tant que praticien</h1>
      <p class="text-[#012828]/70 font-sans mb-8">Créez votre compte professionnel et votre fiche, puis ouvrez la prise de rendez-vous en ligne.</p>

      <form class="bg-white rounded-[20px] shadow-sm p-6 sm:p-8 text-[#012828] font-sans grid gap-8" @submit.prevent="submit">
        <fieldset class="grid gap-4 sm:grid-cols-2">
          <legend class="font-unbounded font-bold text-base mb-3">Votre compte</legend>
          <div class="sm:col-span-2">
            <label for="p-mail" class="block text-sm font-semibold mb-1">Adresse email</label>
            <input id="p-mail" v-model="form.mail" type="email" required autocomplete="email" class="field" />
          </div>
          <div class="sm:col-span-2">
            <label for="p-pass" class="block text-sm font-semibold mb-1">Mot de passe <span class="font-normal text-gray-500">(6 caractères minimum)</span></label>
            <input id="p-pass" v-model="form.password" type="password" required minlength="6" autocomplete="new-password" class="field" />
          </div>
        </fieldset>

        <fieldset class="grid gap-4 sm:grid-cols-2">
          <legend class="font-unbounded font-bold text-base mb-3">Votre fiche praticien</legend>
          <div>
            <label for="p-first" class="block text-sm font-semibold mb-1">Prénom</label>
            <input id="p-first" v-model="form.firstName" required autocomplete="given-name" class="field" />
          </div>
          <div>
            <label for="p-last" class="block text-sm font-semibold mb-1">Nom</label>
            <input id="p-last" v-model="form.lastName" required autocomplete="family-name" class="field" />
          </div>
          <div class="sm:col-span-2">
            <label for="p-address" class="block text-sm font-semibold mb-1">Adresse du cabinet</label>
            <input id="p-address" v-model="form.address" required autocomplete="street-address" class="field" />
          </div>
          <div>
            <label for="p-cp" class="block text-sm font-semibold mb-1">Code postal</label>
            <input id="p-cp" v-model="form.postalCode" required inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="postal-code" class="field" />
          </div>
          <div>
            <label for="p-city" class="block text-sm font-semibold mb-1">Ville</label>
            <input id="p-city" v-model="form.city" required autocomplete="address-level2" class="field" />
          </div>
          <div>
            <label for="p-phone" class="block text-sm font-semibold mb-1">Téléphone professionnel</label>
            <input id="p-phone" v-model="form.phoneNumber" type="tel" required autocomplete="tel" class="field" />
          </div>
          <div>
            <label for="p-price" class="block text-sm font-semibold mb-1">Prix moyen d'une séance (€) <span class="font-normal text-gray-500">(facultatif)</span></label>
            <input id="p-price" v-model.number="form.price" type="number" min="0" step="1" class="field" />
          </div>
          <div class="sm:col-span-2">
            <label for="p-schedules" class="block text-sm font-semibold mb-1">Horaires affichés sur votre fiche <span class="font-normal text-gray-500">(facultatif)</span></label>
            <input id="p-schedules" v-model="form.schedules" maxlength="120" class="field" placeholder="Lun-Ven 9h-18h" />
            <p class="text-xs text-gray-500 mt-1">Vos créneaux réservables se règlent ensuite dans l'espace praticien.</p>
          </div>
        </fieldset>

        <fieldset>
          <legend class="font-unbounded font-bold text-base mb-3">Vos spécialités</legend>
          <p v-if="!specialities.length" class="text-sm text-gray-500">Liste des spécialités momentanément indisponible. Rechargez la page.</p>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="s in specialities"
              :key="s.id"
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors"
              :class="form.specialityIds.includes(s.id) ? 'border-[#156F71] bg-[#e0ecf2]' : 'border-gray-300 hover:border-[#156F71]'"
            >
              <input v-model="form.specialityIds" type="checkbox" :value="s.id" class="accent-[#156F71]" />
              {{ s.name }}
            </label>
          </div>
        </fieldset>

        <div class="grid gap-3 text-sm">
          <label class="flex items-start gap-3 cursor-pointer">
            <input v-model="certify" type="checkbox" required class="mt-1 shrink-0" />
            <span>Je certifie exercer ma ou mes activités en conformité avec la réglementation en vigueur et que les informations saisies sont exactes.</span>
          </label>
          <label class="flex items-start gap-3 cursor-pointer">
            <input v-model="accepted" type="checkbox" required class="mt-1 shrink-0" />
            <span>
              J'ai lu et j'accepte les <NuxtLink to="/cgu-pro" target="_blank" class="underline">conditions générales des praticiens</NuxtLink>
              et la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>.
            </span>
          </label>
        </div>

        <p v-if="errorMsg" class="text-sm text-red-700 bg-red-50 rounded-xl p-3" role="alert">{{ errorMsg }}</p>

        <div class="flex flex-wrap items-center gap-4">
          <button class="bg-[#012828] text-white font-bold text-sm px-8 py-3 rounded-[12px] hover:bg-[#156F71] transition-colors disabled:opacity-50" :disabled="submitting || !form.specialityIds.length">
            {{ submitting ? 'Création…' : 'Créer mon compte praticien' }}
          </button>
          <p class="text-sm">Déjà inscrit ? <NuxtLink :to="{ path: '/login', query: { redirect: '/pro' } }" class="underline text-[#156F71]">Se connecter</NuxtLink></p>
        </div>
      </form>

      <TheFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useSeoMeta({
  title: 'Devenir praticien — Léya',
  description: 'Créez votre fiche praticien sur Léya et ouvrez la prise de rendez-vous en ligne pour vos patients.',
})

const { specialities } = await useSpecialities()

const form = ref({
  mail: '', password: '', firstName: '', lastName: '', address: '', postalCode: '', city: '',
  phoneNumber: '', price: null, schedules: '', specialityIds: [],
})
const certify = ref(false)
const accepted = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

async function submit() {
  if (submitting.value || !form.value.specialityIds.length) return
  submitting.value = true
  errorMsg.value = ''
  try {
    const f = form.value
    const result = await $fetch('/api/register-pro', {
      method: 'POST',
      body: {
        mail: f.mail.trim(),
        password: f.password,
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        address: f.address.trim(),
        city: f.city.trim(),
        postalCode: Number(f.postalCode),
        country: 'France',
        phoneNumber: f.phoneNumber.trim(),
        price: f.price === null || f.price === '' ? undefined : f.price,
        schedules: f.schedules.trim() || undefined,
        specialityIds: f.specialityIds,
      },
    })
    // Le backend peut ne pas ouvrir de session à l'inscription : on renvoie alors vers la connexion.
    if (result?.authenticated) await navigateTo('/pro')
    else await navigateTo({ path: '/login', query: { redirect: '/pro' } })
  } catch (e) {
    const code = apiStatus(e)
    errorMsg.value = code === 409
      ? 'Un compte existe déjà avec cette adresse email. Connectez-vous pour accéder à votre espace.'
      : apiErrorMessage(e, "La création du compte a échoué. Vérifiez les informations saisies.")
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.field { width: 100%; border-radius: 0.75rem; border: 1px solid #d1d5db; padding: 0.625rem 0.75rem; font-size: 0.875rem; }
.field:focus { outline: none; border-color: #156F71; }
</style>
