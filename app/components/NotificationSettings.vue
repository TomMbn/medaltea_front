<template>
  <div>
    <h2 class="font-unbounded font-normal text-[20px] leading-[normal]">Notifications</h2>
    <p class="mt-[6px] text-[16px] leading-[normal] text-neutre-600">{{ intro }}</p>

    <p v-if="state === 'home'" class="mt-4 rounded-[16px] bg-bleu-50 px-4 py-3 text-[16px] leading-[normal]">Sur iPhone et iPad, ajoutez d’abord Léya à l’écran d’accueil (bouton Partager, puis « Sur l’écran d’accueil »), puis ouvrez-la depuis l’écran d’accueil pour activer les notifications.</p>
    <p v-else-if="state === 'unsupported'" class="mt-4 text-[16px] leading-[normal] text-neutre-600">Ce navigateur ne permet pas les notifications.</p>
    <p v-else-if="state === 'denied'" class="mt-4 text-[16px] leading-[normal] text-neutre-600">Les notifications sont bloquées pour ce site. Autorisez-les dans les réglages de votre navigateur, puis revenez ici.</p>

    <template v-else-if="state === 'on'">
      <fieldset class="mt-4 flex flex-col gap-3" :disabled="saving">
        <legend class="sr-only">Notifications à recevoir</legend>
        <label v-for="o in options" :key="o.key" class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" class="mt-1 h-5 w-5 accent-vert-600" :checked="prefs?.[o.key] !== false" @change="setPref(o.key, $event.target.checked)" />
          <span class="text-[16px] leading-snug">{{ o.label }}</span>
        </label>
      </fieldset>
      <p class="mt-3 text-[14px] leading-[normal] text-neutre-600">Les notifications restent neutres : elles ne mentionnent ni nom, ni spécialité, ni motif.</p>
      <button type="button" class="mt-4 inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-vert-900 px-5 text-[16px] font-semibold text-vert-900 hover:bg-bleu-50 transition-colors disabled:opacity-50" :disabled="busy" @click="turnOff">Désactiver sur cet appareil</button>
    </template>

    <button v-else-if="state === 'off'" type="button" class="mt-4 inline-flex min-h-[48px] items-center gap-[14px] rounded-full bg-vert-900 pl-6 pr-1 py-1 text-[18px] font-semibold text-white hover:shadow-douce transition-shadow disabled:opacity-50" :disabled="busy" @click="turnOn">
      {{ busy ? 'Activation…' : 'Activer les notifications' }}
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-corail-500 text-vert-900"><Bell :size="20" aria-hidden="true" /></span>
    </button>

    <p v-if="error" class="mt-3 text-[16px] text-corail-700" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell } from 'lucide-vue-next'

const { isPro } = useSession()

// loading | off | on | denied | home | unsupported
const state = ref('loading')
const busy = ref(false)
const saving = ref(false)
const error = ref('')
const prefs = ref(null)

const intro = computed(() => (isPro.value
  ? 'Soyez prévenu d’une nouvelle demande de rendez-vous, même quand le site est fermé.'
  : 'Soyez prévenu quand votre rendez-vous est confirmé ou annulé, qu’un autre horaire vous est proposé, et la veille du rendez-vous.'))
const options = computed(() => (isPro.value
  ? [{ key: 'appointmentRequest', label: 'Nouvelle demande de rendez-vous' }]
  : [
      { key: 'appointmentDecision', label: 'Rendez-vous confirmé ou annulé' },
      { key: 'proposal', label: 'Un autre horaire m’est proposé' },
      { key: 'reminderDayBefore', label: 'Rappel la veille du rendez-vous' },
    ]))

async function loadPrefs() {
  try { prefs.value = await $fetch('/api/backend/users/me/notification-preferences') } catch { prefs.value = null }
}

onMounted(async () => {
  if (needsHomeScreen()) { state.value = 'home'; return }
  if (!pushSupported()) { state.value = 'unsupported'; return }
  if (Notification.permission === 'denied') { state.value = 'denied'; return }
  const sub = Notification.permission === 'granted' ? await currentSubscription().catch(() => null) : null
  if (sub) {
    state.value = 'on'
    // Rattache de nouveau cet appareil au compte connecté (sans effet s'il l'est déjà)
    linkSubscription(sub).catch(() => {})
    loadPrefs()
  } else {
    state.value = 'off'
  }
})

async function turnOn() {
  busy.value = true
  error.value = ''
  const result = await enablePush()
  busy.value = false
  if (result === 'ok') { state.value = 'on'; loadPrefs() }
  else if (result === 'denied') state.value = Notification.permission === 'denied' ? 'denied' : 'off'
  else error.value = 'Les notifications ne sont pas disponibles pour le moment. Réessayez plus tard.'
}

async function turnOff() {
  busy.value = true
  await disablePush()
  busy.value = false
  state.value = 'off'
}

async function setPref(key, value) {
  saving.value = true
  error.value = ''
  try {
    prefs.value = await $fetch('/api/backend/users/me/notification-preferences', { method: 'PATCH', body: { [key]: value } })
  } catch {
    error.value = 'Réglage non enregistré. Réessayez.'
    await loadPrefs()
  } finally {
    saving.value = false
  }
}
</script>
