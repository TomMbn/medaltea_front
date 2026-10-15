<template>
  <div class="min-h-screen bg-bleu-50 font-sans text-vert-900 lg:fixed lg:inset-0 lg:min-h-0 lg:flex">
    <ProSidebar @logout="handleLogout" />

    <div class="flex-1 min-w-0 lg:h-full lg:overflow-y-auto" data-scroll>
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

// Un compte patient n'a rien à faire ici (sessions anciennes sans rôle comprises).
onMounted(async () => {
  if ((await syncRole()) === 'patient') await navigateTo({ path: '/praticiens-pro', query: { compte: 'patient' } })
})

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>
