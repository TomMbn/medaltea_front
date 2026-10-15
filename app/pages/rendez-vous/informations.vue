<template>
  <div class="relative overflow-x-clip bg-bleu-50">
    <!-- Décors -->
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden xl:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/landing/med-hypnotherapie.svg" alt="" aria-hidden="true" class="hidden xl:block absolute right-[-3%] top-[714px] w-[37%] max-w-[650px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pt-28 lg:pt-[140px] pb-20 lg:pb-[120px]">
      <NuxtLink :to="ficheLink" class="inline-flex items-center bg-white rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900 hover:bg-white/70 transition-colors">
        ← Retour à la fiche de {{ fullName }}
      </NuxtLink>

      <!-- Étapes -->
      <ol class="mt-8 lg:mt-[36px] flex gap-3 lg:gap-4 max-w-[752px]" aria-label="Étapes de la réservation">
        <li v-for="(step, i) in steps" :key="step" class="flex-1 min-w-0 flex flex-col gap-2" :aria-current="i === currentStep ? 'step' : undefined">
          <span class="h-[6px] rounded-[3px]" :class="i <= currentStep ? 'bg-vert-600' : 'bg-bleu-100'" />
          <span class="text-[14px] lg:text-[16px] font-medium leading-tight" :class="i <= currentStep ? 'text-vert-600' : 'text-neutre-600'">{{ i + 1 }}. {{ step }}</span>
        </li>
      </ol>

      <div class="mt-10 lg:mt-[47px] xl:grid xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-x-[72px]">
        <!-- Récapitulatif -->
        <aside class="relative xl:order-2 mb-10 xl:mb-0 xl:mt-0 max-w-[560px] xl:max-w-none" aria-label="Récapitulatif du rendez-vous">
          <img src="/images/landing/mascotte-panda.webp" alt="" aria-hidden="true" width="223" height="193" class="hidden xl:block absolute left-[249px] top-[-166px] w-[223px] h-auto -scale-x-100 pointer-events-none select-none" style="animation: none;" />
          <div class="relative bg-white rounded-[32px] shadow-[0_12px_32px_rgba(1,40,40,0.08)] p-6 sm:p-8 flex flex-col gap-[18px]">
            <p class="font-unbounded font-normal text-[20px] leading-[normal] text-vert-900">Récapitulatif</p>
            <div class="flex items-center gap-[14px]">
              <img v-if="photo && !photoFailed" :src="photo" alt="" width="56" height="56" referrerpolicy="no-referrer" class="w-14 h-14 rounded-full object-cover shrink-0 bg-bleu-50" style="animation: none;" @error="photoFailed = true" />
              <span v-else class="w-14 h-14 rounded-full bg-vert-600 text-white flex items-center justify-center font-unbounded text-[20px] shrink-0" aria-hidden="true">{{ initials }}</span>
              <div class="min-w-0 flex flex-col gap-1 items-start leading-[normal]">
                <p class="text-[18px] font-semibold text-vert-900">{{ fullName }}</p>
                <p v-if="speciality" class="bg-bleu-50 rounded-full px-4 py-[9px] text-[16px] font-medium text-vert-600">{{ speciality }}</p>
              </div>
            </div>
            <p class="flex items-center gap-3 text-[18px] leading-[normal]">
              <span class="w-9 h-9 rounded-full bg-bleu-50 text-vert-600 flex items-center justify-center shrink-0"><CalendarDays :size="16" aria-hidden="true" /></span>
              {{ whenLabel }}
            </p>
            <p class="flex items-center gap-3 text-[18px] leading-[normal]">
              <span class="w-9 h-9 rounded-full bg-bleu-50 text-vert-600 flex items-center justify-center shrink-0"><MapPin :size="16" aria-hidden="true" /></span>
              {{ whereLabel }}
            </p>
            <p class="flex items-center gap-3 text-[18px] leading-[normal]">
              <span class="w-9 h-9 rounded-full bg-bleu-50 text-vert-600 flex items-center justify-center shrink-0"><Info :size="16" aria-hidden="true" /></span>
              {{ typeLabel }}
            </p>
          </div>
        </aside>

        <!-- Formulaire -->
        <div class="xl:order-1 min-w-0">
          <template v-if="!sent">
            <h1 class="font-unbounded font-normal text-[28px] sm:text-[32px] leading-[normal] text-vert-900">Vos informations</h1>
            <p class="mt-3 lg:mt-[14px] text-[18px] leading-[normal] text-neutre-600 max-w-[760px]">Pas besoin de compte : ces informations servent uniquement à votre rendez-vous.</p>

            <form class="mt-8 lg:mt-[36px]" novalidate @submit.prevent="submit">
              <!-- Champ « piège » : invisible et hors parcours clavier ; un robot qui le remplit est ignoré par le backend -->
              <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label for="g-website">Ne pas remplir</label>
                <input id="g-website" v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" />
              </div>
              <div class="grid sm:grid-cols-2 gap-x-4 gap-y-8 lg:gap-y-[49px] max-w-[776px]">
                <div class="flex flex-col gap-2">
                  <label for="g-name" class="text-[16px] font-medium leading-[normal]">Prénom et nom</label>
                  <div class="relative">
                    <input id="g-name" v-model="name" type="text" autocomplete="name" maxlength="160" :disabled="submitting" :aria-invalid="!!errors.name" :class="inputClass(errors.name)" placeholder="Marie Laurent" />
                    <Check v-if="nameOk" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
                  </div>
                  <p v-if="errors.name" class="text-[16px] leading-[normal] text-corail-700" role="alert">{{ errors.name }}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="g-email" class="text-[16px] font-medium leading-[normal]">E-mail</label>
                  <div class="relative">
                    <input id="g-email" v-model="email" type="email" autocomplete="email" inputmode="email" maxlength="150" :disabled="submitting" :aria-invalid="!!errors.email" :class="inputClass(errors.email)" placeholder="marie.laurent@mail.fr" />
                    <Check v-if="emailOk" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
                  </div>
                  <p v-if="errors.email" class="text-[16px] leading-[normal] text-corail-700" role="alert">{{ errors.email }}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="g-phone" class="text-[16px] font-medium leading-[normal]">Téléphone <span class="font-normal text-neutre-600">(transmis au praticien)</span></label>
                  <div class="relative">
                    <input id="g-phone" v-model="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" :disabled="submitting" :aria-invalid="!!errors.phone" :class="inputClass(errors.phone)" placeholder="06 12 34 56 78" />
                    <Check v-if="phoneOk" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
                  </div>
                  <p v-if="errors.phone" class="text-[16px] leading-[normal] text-corail-700" role="alert">{{ errors.phone }}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="g-note" class="text-[16px] font-medium leading-[normal]">Motif de consultation <span class="font-normal text-neutre-600">(facultatif)</span></label>
                  <input id="g-note" v-model="note" type="text" maxlength="500" :disabled="submitting" :class="inputClass(false)" placeholder="Douleurs au bas du dos" />
                </div>
              </div>

              <div class="mt-8 lg:mt-[67px] flex flex-col gap-5">
                <label v-if="note.trim()" class="flex items-start gap-3 text-[16px] lg:text-[18px] leading-snug cursor-pointer">
                  <input v-model="consentHealth" type="checkbox" :disabled="submitting" class="peer sr-only" />
                  <span :class="boxClass"><Check :size="16" /></span>
                  <span>J’accepte que mon motif, qui peut concerner ma santé, soit transmis à ce praticien pour préparer le rendez-vous (voir la <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>).</span>
                </label>
                <label class="flex items-start gap-3 text-[16px] lg:text-[18px] leading-snug cursor-pointer">
                  <input v-model="consentContact" type="checkbox" :disabled="submitting" class="peer sr-only" />
                  <span :class="boxClass"><Check :size="16" /></span>
                  <span>J’accepte que ces informations soient transmises à ce praticien.</span>
                </label>
                <p v-if="errors.consent" class="text-[16px] leading-[normal] text-corail-700" role="alert">{{ errors.consent }}</p>
              </div>

              <TurnstileWidget v-if="siteKey" ref="turnstile" v-model="captchaToken" :site-key="siteKey" class="mt-6" />
              <p v-if="errors.captcha" class="mt-2 text-[16px] leading-[normal] text-corail-700" role="alert">{{ errors.captcha }}</p>

              <p v-if="submitError" class="mt-6 max-w-[776px] rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ submitError }}</p>

              <button type="submit" :disabled="submitting" class="mt-8 lg:mt-[44px] inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-80 disabled:cursor-wait">
                <template v-if="!submitting">Confirmer le rendez-vous</template>
                <span v-else class="inline-flex items-center gap-2"><Loader2 class="animate-spin" :size="20" aria-hidden="true" /> Envoi…</span>
                <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
              </button>
              <p class="mt-4 text-[16px] text-neutre-600 leading-snug max-w-[520px]">
                Vous avez un compte ? <NuxtLink :to="{ path: '/login', query: { redirect: ficheUrl } }" class="underline text-vert-600">Connectez-vous</NuxtLink> pour réserver plus vite.
              </p>
            </form>
          </template>

          <!-- Demande envoyée -->
          <div v-else role="status">
            <span class="w-20 h-20 rounded-full bg-vert-600 text-white flex items-center justify-center" aria-hidden="true"><Check class="w-9 h-9" :stroke-width="1.5" /></span>
            <h1 class="mt-6 font-unbounded font-normal text-[28px] sm:text-[32px] leading-[normal] text-vert-900">{{ confirmed ? 'C’est confirmé !' : 'Demande envoyée !' }}</h1>
            <p class="mt-3 text-[18px] leading-snug text-neutre-600 max-w-[620px]">
              <template v-if="confirmed">Votre rendez-vous est enregistré.</template>
              <template v-else>Le praticien doit encore confirmer votre rendez-vous. Sans réponse de sa part, la demande expire automatiquement et le créneau est libéré.</template>
            </p>

            <!-- Lien de gestion : renvoyé une seule fois par le backend, aucun e-mail ne le renvoie -->
            <div v-if="manageUrl" class="mt-8 max-w-[620px] rounded-[20px] bg-white p-5 lg:p-6 shadow-douce">
              <p class="text-[18px] font-semibold leading-[normal]">Conservez ce lien</p>
              <p class="mt-2 text-[16px] leading-snug text-neutre-600">C’est le seul moyen de suivre la réponse du praticien, d’ajouter le rendez-vous à votre agenda ou de l’annuler. Il ne sera plus affiché : enregistrez-le ou copiez-le maintenant.</p>
              <p class="mt-3 break-all rounded-[12px] bg-bleu-50 px-4 py-3 text-[14px] text-vert-900 select-all">{{ manageUrl }}</p>
              <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button type="button" class="inline-flex items-center gap-2 rounded-full bg-vert-900 px-5 py-[10px] text-[16px] font-semibold text-white hover:shadow-douce transition-shadow" @click="copyLink">
                  <Copy :size="16" aria-hidden="true" /> {{ copied ? 'Lien copié' : 'Copier le lien' }}
                </button>
                <NuxtLink :to="managePath" class="text-[16px] font-medium text-vert-600 hover:underline">Ouvrir mon rendez-vous →</NuxtLink>
              </div>
            </div>

            <NuxtLink :to="ficheLink" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
              Retour à la fiche
              <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ArrowUpRight, CalendarDays, Check, Copy, Info, Loader2, MapPin } from 'lucide-vue-next'

useSeoMeta({ title: 'Vos informations — Léya', robots: 'noindex, nofollow' })

const config = useRuntimeConfig()
// Désactivée tant que le backend (lot 2) n'est pas en production ; toujours disponible en développement.
if (!(config.public.guestBooking || import.meta.dev)) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })

const route = useRoute()
const { isLoggedIn } = useSession()
const siteKey = config.public.turnstileSiteKey

const slug = String(route.query.praticien ?? '')
const typeId = Number(route.query.type)
const slot = String(route.query.slot ?? '')
const ficheLink = computed(() => (slug
  ? { path: `/praticiens/${slug}`, query: { ...(typeId ? { type: String(typeId) } : {}), ...(slot ? { slot } : {}) } }
  : { path: '/trouver-un-praticien' }))

const ficheUrl = useRouter().resolve(ficheLink.value).fullPath

// Connecté : le parcours habituel de la fiche suffit (nom, e-mail et téléphone sont déjà connus).
if (isLoggedIn.value) await navigateTo(ficheLink.value, { replace: true })

const valid = /^[a-z0-9-]{1,120}$/.test(slug) && Number.isInteger(typeId) && typeId > 0 && !Number.isNaN(Date.parse(slot)) && Date.parse(slot) > Date.now()
if (!valid) await navigateTo(ficheLink.value, { replace: true })

const { data: praticien } = await useAsyncData(`guest-praticien-${slug}`, () => (valid ? $fetch(`/api/backend/praticiens/slug/${slug}`).catch(() => null) : null))
const { data: rawTypes } = await useAsyncData(`guest-types-${slug}`, () => (praticien.value?.id ? $fetch(`/api/backend/praticiens/${praticien.value.id}/consultation-types`).catch(() => []) : []))
const type = computed(() => normalizeTypes(rawTypes.value).find(t => t.id === typeId))
if (valid && (!praticien.value || praticien.value.bookable === false || praticien.value.guestBookingMode === 'disabled' || !type.value)) await navigateTo(ficheLink.value, { replace: true })

const fullName = computed(() => `${praticien.value?.firstName ?? ''} ${praticien.value?.lastName ?? ''}`.trim())
const initials = computed(() => `${(praticien.value?.firstName || '?')[0]}${(praticien.value?.lastName || '')[0] || ''}`.toUpperCase())
const speciality = computed(() => praticien.value?.specialities?.[0]?.name ?? '')
const photoFailed = ref(false)
const photo = computed(() => { try { const u = praticien.value?.photoThumbUrl || praticien.value?.photoUrl; return new URL(u).protocol === 'https:' ? u : '' } catch { return '' } })

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const whenLabel = computed(() => {
  const d = new Date(slot)
  const day = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  return `${capitalize(day)} · ${formatTime(slot)}`
})
const whereLabel = computed(() => {
  if (type.value?.mode === 'visio') return 'En visio'
  const p = praticien.value ?? {}
  return [p.address, p.city].filter(Boolean).join(', ') || p.city || ''
})
const typeLabel = computed(() => {
  const t = type.value
  if (!t) return ''
  const d = t.durationMin ? (t.durationMin >= 60 && t.durationMin % 60 === 0 ? `${t.durationMin / 60} h` : `${t.durationMin} min`) : ''
  return [t.name, d, t.price != null ? `${t.price} €` : ''].filter(Boolean).join(' · ')
})

// ---------- Formulaire
const steps = ['Créneau', 'Vos informations', 'Confirmation']
const sent = ref(false)
const confirmed = ref(false)
const manageToken = ref('')
const copied = ref(false)
const managePath = computed(() => `/rendez-vous/invite/${manageToken.value}`)
const manageUrl = computed(() => (manageToken.value && import.meta.client ? `${window.location.origin}${managePath.value}` : ''))
const currentStep = computed(() => (sent.value ? 2 : 1))

const name = ref('')
const email = ref('')
const phone = ref('')
const note = ref('')
const consentContact = ref(false)
const consentHealth = ref(false)
const captchaToken = ref('')
const honeypot = ref('')
const turnstile = ref(null)
const submitting = ref(false)
const submitError = ref('')
const errors = reactive({ name: '', email: '', phone: '', consent: '', captcha: '' })

const splitName = (v) => {
  const parts = v.trim().split(/\s+/).filter(Boolean)
  return parts.length >= 2 ? { firstName: parts[0], lastName: parts.slice(1).join(' ') } : null
}
const nameOk = computed(() => !!splitName(name.value) && name.value.length <= 160)
const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) && email.value.length <= 150)
const phoneOk = computed(() => /^\+?\d{10,15}$/.test(phone.value.replace(/[\s.]/g, '')))

const inputClass = (invalid) => [
  'h-[52px] w-full rounded-[12px] border bg-white pl-4 pr-11 text-[16px] text-vert-900 placeholder:text-neutre-500 focus:outline-none focus:border-2 focus:border-vert-600 focus:shadow-[0_0_0_4px_#cde4df] transition-shadow',
  invalid ? 'border-corail-500' : 'border-[#c8c8c8]',
]
const boxClass = 'mt-0.5 w-6 h-6 shrink-0 rounded-[6px] border-2 border-vert-600 bg-white text-white flex items-center justify-center peer-checked:bg-vert-600 peer-focus-visible:shadow-[0_0_0_4px_#cde4df] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100'

function validate() {
  errors.name = nameOk.value ? '' : 'Indiquez votre prénom et votre nom.'
  errors.email = emailOk.value ? '' : 'Indiquez une adresse e-mail valide.'
  errors.phone = phoneOk.value ? '' : 'Indiquez un numéro de téléphone valide (10 chiffres).'
  errors.consent = !consentContact.value || (note.value.trim() && !consentHealth.value) ? 'Votre accord est nécessaire pour transmettre vos informations.' : ''
  errors.captcha = !siteKey || captchaToken.value ? '' : 'Validez la vérification de sécurité.'
  return !errors.name && !errors.email && !errors.phone && !errors.consent && !errors.captcha
}

async function copyLink() {
  try { await navigator.clipboard.writeText(manageUrl.value); copied.value = true; setTimeout(() => { copied.value = false }, 2500) } catch { /* le lien reste sélectionnable à l'écran */ }
}

async function submit() {
  if (submitting.value || !validate()) return
  submitting.value = true
  submitError.value = ''
  const names = splitName(name.value)
  try {
    const res = await $fetch('/api/backend/appointments/guest', {
      method: 'POST',
      body: {
        praticienId: praticien.value.id,
        consultationTypeId: typeId,
        startAt: slot,
        ...names,
        email: email.value.trim(),
        phoneNumber: phone.value,
        ...(note.value.trim() ? { userNote: note.value.trim(), consentHealthData: true } : {}),
        consentContact: true,
        captchaToken: captchaToken.value,
        ...(honeypot.value ? { website: honeypot.value } : {}),
      },
    })
    confirmed.value = res?.status === 'confirmed'
    manageToken.value = typeof res?.manageToken === 'string' ? res.manageToken : ''
    sent.value = true
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    const status = apiStatus(e)
    const code = e?.data?.code ?? e?.response?._data?.code
    if (status === 409 && code === 'GUEST_LIMIT') submitError.value = 'Vous avez déjà deux rendez-vous en cours avec cette adresse e-mail ou ce numéro de téléphone. Attendez qu’ils soient passés ou annulés pour en demander un autre.'
    else if (status === 409) submitError.value = 'Ce créneau n’est plus disponible (déjà pris, ou trop proche : il faut réserver au moins 2 h à l’avance). Choisissez un autre créneau sur la fiche du praticien.'
    else if (status === 403) submitError.value = 'La vérification de sécurité a échoué. Réessayez.'
    else if (status === 503) submitError.value = 'La réservation sans compte est momentanément indisponible. Réessayez plus tard ou connectez-vous.'
    else if (status === 429) submitError.value = 'Trop de tentatives. Patientez quelques minutes puis réessayez.'
    else submitError.value = apiErrorMessage(e, 'La réservation a échoué. Réessayez dans un instant.')
  } finally {
    // Un jeton ne sert qu'une fois
    turnstile.value?.reset()
    submitting.value = false
  }
}
</script>
