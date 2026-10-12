<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[1000px] mx-auto pt-32 pb-8">
      <h1 class="font-unbounded font-bold text-2xl lg:text-3xl text-[#012828] mb-6">Espace praticien</h1>

      <p v-if="access === 'loading'" class="text-sm text-gray-600">Chargement…</p>

      <div v-else-if="access === 'denied'" class="bg-white rounded-[20px] p-8 text-[#012828] font-sans">
        <p class="font-semibold mb-2">Ce compte n'est pas un compte praticien.</p>
        <p class="text-sm text-gray-600 mb-4">Pour proposer des rendez-vous sur Léya, créez un compte professionnel.</p>
        <NuxtLink to="/inscription-pro" class="inline-block bg-[#012828] text-white text-sm font-bold px-6 py-3 rounded-[12px] hover:bg-[#156F71]">Créer un compte praticien</NuxtLink>
      </div>

      <p v-else-if="access === 'error'" class="text-sm text-red-700 bg-red-50 rounded-xl p-4" role="alert">{{ accessError }}</p>

      <template v-else>
        <div class="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Sections de l'espace praticien">
          <button
            v-for="t in tabs"
            :key="t.id"
            role="tab"
            :aria-selected="tab === t.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="tab === t.id ? 'bg-[#012828] text-white' : 'bg-white text-[#012828] hover:bg-white/70'"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="bg-white rounded-[20px] shadow-sm p-5 sm:p-8 text-[#012828] font-sans" role="tabpanel">
          <ProAppointments v-if="tab === 'rdv'" />
          <ProSchedule v-else-if="tab === 'horaires'" />
          <ProServices v-else-if="tab === 'prestations'" :initial="types" />
          <ProSettings v-else />
        </div>
      </template>

      <TheFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Espace praticien — Léya', robots: 'noindex, nofollow' })

const tabs = [
  { id: 'rdv', label: 'Rendez-vous' },
  { id: 'horaires', label: 'Horaires et absences' },
  { id: 'prestations', label: 'Prestations' },
  { id: 'reglages', label: 'Réglages' },
]
const tab = ref('rdv')
const access = ref('loading')
const accessError = ref('')
const types = ref([])

// Un compte praticien est reconnu au fait que l'API de ses prestations lui répond.
onMounted(async () => {
  try {
    types.value = await $fetch('/api/backend/praticiens/me/consultation-types')
    access.value = 'ok'
  } catch (e) {
    const code = apiStatus(e)
    if (code === 401) {
      await useSession().logout()
      return navigateTo({ path: '/login', query: { redirect: '/pro' } })
    }
    if (code === 403 || code === 404) access.value = 'denied'
    else {
      access.value = 'error'
      accessError.value = apiErrorMessage(e, 'Impossible de charger votre espace pour le moment.')
    }
  }
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
