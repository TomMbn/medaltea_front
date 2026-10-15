<template>
  <section id="photo" class="card scroll-mt-24" aria-labelledby="f-photo">
    <h2 id="f-photo" class="card-title">Photo de profil</h2>
    <div class="flex flex-wrap items-center gap-5">
      <div class="w-24 h-24 shrink-0 rounded-full overflow-hidden bg-bleu-50 flex items-center justify-center text-vert-600 font-bold text-xl" :class="busy ? 'opacity-60' : ''">
        <img v-if="shown && !broken" :src="shown" alt="Votre photo de profil actuelle" width="96" height="96" class="w-full h-full object-cover" @error="broken = true" />
        <span v-else aria-hidden="true">{{ initials }}</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-3">
          <label class="inline-flex items-center border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full cursor-pointer hover:bg-vert-900 hover:text-white transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-vert-600" :class="busy ? 'opacity-50 pointer-events-none' : ''">
            <input ref="input" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" :disabled="!!busy" aria-describedby="photo-help" @change="onPick" />
            {{ photoUrl ? 'Remplacer la photo' : 'Ajouter une photo' }}
          </label>
          <button v-if="photoUrl" type="button" class="text-[16px] px-5 min-h-[44px] rounded-full border border-neutre-300 hover:bg-bleu-50 disabled:opacity-50" :disabled="!!busy" @click="remove">Supprimer</button>
        </div>
        <p id="photo-help" class="help">JPEG, PNG ou WebP, 2 Mo maximum, au moins 400 × 400 pixels. Votre photo est recadrée en carré et ses métadonnées (lieu, appareil) sont retirées.</p>
        <p v-if="busy" class="help" role="status">{{ busy === 'upload' ? 'Envoi en cours…' : 'Suppression…' }}</p>
        <p v-else-if="done" class="text-[14px] text-emerald-700 mt-1.5" role="status">{{ done }}</p>
        <p v-if="error" class="err" role="alert">{{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  photoUrl: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
})
const emit = defineEmits(['update'])

const MAX_BYTES = 2 * 1024 * 1024
const MIN_SIDE = 400
const TYPES = ['image/jpeg', 'image/png', 'image/webp']

const photoUrl = ref(props.photoUrl)
const preview = ref('')
const broken = ref(false)
const busy = ref('')
const error = ref('')
const done = ref('')
const input = ref(null)

const shown = computed(() => preview.value || photoUrl.value)
const initials = computed(() => `${(props.firstName || '?')[0]}${(props.lastName || '')[0] || ''}`.toUpperCase())

function setPreview(url) {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = url
}
onBeforeUnmount(() => setPreview(''))

/** Dimensions de l'image choisie (vérification avant envoi, le backend contrôle de toute façon). */
function readSize(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')) }
    img.src = url
  })
}

async function onPick(e) {
  const file = e.target.files?.[0]
  if (input.value) input.value.value = ''
  if (!file) return
  error.value = ''
  done.value = ''
  if (!TYPES.includes(file.type)) { error.value = 'Format non pris en charge : choisissez une image JPEG, PNG ou WebP.'; return }
  if (file.size > MAX_BYTES) { error.value = 'Fichier trop lourd : 2 Mo maximum.'; return }
  try {
    const { w, h } = await readSize(file)
    if (w < MIN_SIDE || h < MIN_SIDE) { error.value = `Image trop petite (${w} × ${h}) : ${MIN_SIDE} × ${MIN_SIDE} pixels minimum.`; return }
  } catch {
    error.value = 'Cette image est illisible. Essayez un autre fichier.'
    return
  }

  setPreview(URL.createObjectURL(file))
  broken.value = false
  busy.value = 'upload'
  try {
    const body = new FormData()
    body.append('file', file)
    const res = await $fetch('/api/backend/praticiens/me/photo', { method: 'POST', body })
    photoUrl.value = res.photoUrl || ''
    setPreview('')
    emit('update', res)
    done.value = 'Photo enregistrée.'
  } catch (err) {
    setPreview('')
    const wait = Number(err?.response?.headers?.get?.('retry-after'))
    error.value = apiErrorMessage(err, 'Impossible d\'envoyer la photo pour le moment.')
      + (apiStatus(err) === 429 && wait > 0 ? ` Vous pourrez réessayer dans ${wait >= 3600 ? 'environ ' + Math.ceil(wait / 3600) + ' h' : Math.ceil(wait / 60) + ' min'}.` : '')
  } finally { busy.value = '' }
}

async function remove() {
  if (!window.confirm('Supprimer votre photo de profil ?')) return
  error.value = ''
  done.value = ''
  busy.value = 'delete'
  try {
    await $fetch('/api/backend/praticiens/me/photo', { method: 'DELETE' })
    photoUrl.value = ''
    emit('update', { photoUrl: '', photoThumbUrl: '' })
    done.value = 'Photo supprimée.'
  } catch (err) {
    error.value = apiErrorMessage(err, 'Impossible de supprimer la photo pour le moment.')
  } finally { busy.value = '' }
}
</script>

<style scoped>
.card { background: #fff; border-radius: 20px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); padding: 1.5rem; }
@media (min-width: 640px) { .card { padding: 2rem; } }
.card-title { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
.err { color: #b91c1c; font-size: 0.75rem; margin-top: 0.375rem; }
.help { font-size: 0.75rem; color: rgb(1 40 40 / 0.7); margin-top: 0.375rem; }
</style>
