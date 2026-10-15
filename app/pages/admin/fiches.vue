<template>
  <div>
    <h1 class="font-unbounded font-normal text-[26px] lg:text-[32px] leading-[normal]">Fiches</h1>
    <p class="mt-2 text-[16px] text-neutre-600 max-w-[720px]">Accordez le badge « Profil vérifié » après avoir contrôlé le RPPS ou l’ADELI, les diplômes et la fiche Google. Il ne concerne que les fiches gérées par un praticien.</p>

    <form class="mt-6 flex flex-wrap items-end gap-3" role="search" @submit.prevent="search">
      <div class="flex flex-col gap-1">
        <label for="f-q" class="text-[16px] font-medium">Recherche</label>
        <input id="f-q" v-model="q" type="search" maxlength="80" placeholder="Prénom, nom, ville" class="min-h-[44px] w-[260px] max-w-full rounded-full border border-neutre-300 bg-white px-5 text-[16px]" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="f-claimed" class="text-[16px] font-medium">Gestion</label>
        <select id="f-claimed" v-model="claimed" class="min-h-[44px] rounded-full border border-neutre-300 bg-white px-4 text-[16px]">
          <option value="">Toutes</option><option value="true">Gérées par un praticien</option><option value="false">Répertoriées</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="f-verified" class="text-[16px] font-medium">Badge</label>
        <select id="f-verified" v-model="verified" class="min-h-[44px] rounded-full border border-neutre-300 bg-white px-4 text-[16px]">
          <option value="">Tous</option><option value="true">Profil vérifié</option><option value="false">Non vérifié</option>
        </select>
      </div>
      <button type="submit" class="min-h-[44px] rounded-full bg-vert-900 px-6 text-[16px] font-semibold text-white hover:bg-vert-600 transition-colors">Rechercher</button>
    </form>

    <p v-if="message" class="mt-5 rounded-[16px] bg-emerald-50 px-4 py-3 text-[16px] text-emerald-800" role="status">{{ message }}</p>
    <p v-if="error" class="mt-5 rounded-[16px] bg-red-50 px-4 py-3 text-[16px] text-red-800" role="alert">{{ error }}</p>
    <p class="mt-6 text-[16px] text-neutre-600" role="status">{{ loading ? 'Chargement…' : `${total} fiche${total > 1 ? 's' : ''}` }}</p>

    <ul class="mt-3 grid gap-3">
      <li v-for="p in items" :key="p.id" class="rounded-[20px] bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-[18px] font-semibold leading-[normal]">{{ p.firstName }} {{ p.lastName }}<span v-if="p.city" class="font-normal text-neutre-600"> · {{ p.city }}</span></p>
          <p class="mt-1 flex flex-wrap items-center gap-2 text-[14px] leading-[normal]">
            <span class="rounded-full px-2.5 py-1 font-semibold" :class="p.claimed ? 'bg-bleu-100 text-vert-900' : 'bg-neutre-200 text-neutre-600'">{{ p.claimed ? 'Gérée par un praticien' : 'Répertoriée' }}</span>
            <span v-if="p.claimed && p.isVerified" class="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-900">Profil vérifié</span>
            <span v-if="p.rpps" class="text-neutre-600">RPPS {{ p.rpps }}</span>
            <span v-if="p.adeli" class="text-neutre-600">ADELI {{ p.adeli }}</span>
            <span v-if="p.siret" class="text-neutre-600">SIRET {{ p.siret }}</span>
            <NuxtLink v-if="p.slug" :to="`/praticiens/${p.slug}`" target="_blank" class="underline text-vert-900 hover:text-vert-600">Fiche publique</NuxtLink>
          </p>
        </div>
        <button v-if="p.claimed" type="button" class="min-h-[44px] rounded-full border-[1.5px] px-5 text-[16px] font-semibold transition-colors disabled:opacity-50" :class="p.isVerified ? 'border-red-700 text-red-800 hover:bg-red-50' : 'border-vert-900 text-vert-900 hover:bg-vert-900 hover:text-white'" :disabled="busy === p.id" @click="toggle(p)">
          {{ busy === p.id ? 'Un instant…' : p.isVerified ? 'Retirer le badge' : 'Accorder le badge' }}
        </button>
      </li>
    </ul>

    <div v-if="total > PAGE" class="mt-6 flex items-center gap-4">
      <button type="button" class="min-h-[44px] rounded-full bg-white px-5 text-[16px] font-medium disabled:opacity-40" :disabled="page <= 1 || loading" @click="go(page - 1)">Précédent</button>
      <span class="text-[16px]">Page {{ page }} / {{ Math.ceil(total / PAGE) }}</span>
      <button type="button" class="min-h-[44px] rounded-full bg-white px-5 text-[16px] font-medium disabled:opacity-40" :disabled="page >= Math.ceil(total / PAGE) || loading" @click="go(page + 1)">Suivant</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
useSeoMeta({ title: 'Fiches — Administration Léya', robots: 'noindex, nofollow' })

const PAGE = 50
const q = ref('')
const claimed = ref('')
const verified = ref('')
const page = ref(1)
const items = ref([])
const total = ref(0)
const loading = ref(true)
const message = ref('')
const error = ref('')
const busy = ref(null)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch.raw('/api/backend/admin/praticiens', {
      query: { limit: PAGE, offset: (page.value - 1) * PAGE, ...(q.value.trim() ? { q: q.value.trim() } : {}), ...(claimed.value ? { claimed: claimed.value } : {}), ...(verified.value ? { isVerified: verified.value } : {}) },
    })
    items.value = Array.isArray(res._data) ? res._data : []
    total.value = Number(res.headers.get('x-total-count')) || items.value.length
  } catch (e) {
    items.value = []
    total.value = 0
    error.value = (e?.statusCode ?? e?.response?.status) === 403 ? 'Cette page est réservée aux administrateurs.' : 'Impossible de charger les fiches pour le moment.'
  } finally {
    loading.value = false
  }
}
onMounted(load)
const search = () => { page.value = 1; message.value = ''; load() }
const go = (n) => { page.value = n; load() }

async function toggle(p) {
  busy.value = p.id
  message.value = ''
  error.value = ''
  const next = !p.isVerified
  try {
    await $fetch(`/api/backend/praticiens/${p.id}/verification`, { method: 'PATCH', body: { isVerified: next } })
    p.isVerified = next
    message.value = next ? `Badge « Profil vérifié » accordé à ${p.firstName} ${p.lastName}.` : `Badge retiré à ${p.firstName} ${p.lastName}.`
  } catch {
    error.value = 'Le badge n’a pas pu être modifié. Réessayez dans un instant.'
  } finally {
    busy.value = null
  }
}
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
