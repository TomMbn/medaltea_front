<template>
  <div class="min-h-screen bg-bleu-50 font-sans text-vert-900 lg:fixed lg:inset-0 lg:min-h-0 lg:flex">
    <ProSidebar @logout="handleLogout" />

    <div class="flex-1 min-w-0 lg:h-full lg:overflow-y-auto" data-scroll>
      <!-- Démonstration : données fictives, rien n'est enregistré -->
      <div v-if="demo.active.value" class="sticky top-0 z-30 flex flex-wrap items-center gap-x-4 gap-y-2 bg-corail-100 px-4 sm:px-6 lg:px-10 py-3 text-[16px] leading-[normal]" role="status">
        <p class="flex-1 min-w-[240px]"><strong class="font-semibold">Mode démonstration.</strong> Les données sont fictives et rien n’est enregistré. Essayez de confirmer une demande ou de modifier votre fiche.</p>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-full bg-white px-4 py-2 text-[16px] font-medium hover:bg-bleu-50 transition-colors" @click="simulate">Simuler une demande</button>
          <button type="button" class="rounded-full bg-white px-4 py-2 text-[16px] font-medium hover:bg-bleu-50 transition-colors" @click="reset">Réinitialiser</button>
          <button type="button" class="rounded-full border-[1.5px] border-vert-900 px-4 py-2 text-[16px] font-medium hover:bg-white transition-colors" @click="quit">Quitter la démo</button>
          <NuxtLink to="/inscription-pro" class="rounded-full bg-vert-900 px-4 py-2 text-[16px] font-medium text-white hover:bg-vert-600 transition-colors" @click="demo.stop()">Créer mon compte</NuxtLink>
        </div>
      </div>
      <main class="px-4 sm:px-6 lg:px-10 pb-10">
        <slot />
        <p class="text-xs text-vert-900/50 mt-8 text-center">
          <NuxtLink to="/" class="hover:underline">Voir le site</NuxtLink> ·
          <NuxtLink to="/cgu-pro" class="hover:underline">CGU praticiens</NuxtLink> ·
          <NuxtLink to="/politique-de-confidentialite" class="hover:underline">Confidentialité</NuxtLink> ·
          <a :href="`mailto:${legal.contactEmail}`" class="hover:underline">Aide</a>
        </p>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { legal } from '~/data/legal'

const { syncRole, logout } = useSession()
const demo = useDemo()

async function simulate() { demo.simulate(); await refreshNuxtData() }
async function reset() { demo.reset(); await refreshNuxtData() }
async function quit() { demo.stop(); await navigateTo('/praticiens-pro') }

// Un compte patient n'a rien à faire ici (sessions anciennes sans rôle comprises).
onMounted(async () => {
  if ((await syncRole()) === 'patient') await navigateTo({ path: '/praticiens-pro', query: { compte: 'patient' } })
})

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>
