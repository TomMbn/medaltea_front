<template>
  <div class="min-h-screen bg-bleu-50 font-sans text-vert-900">
    <header class="bg-vert-600 text-white">
      <div class="mx-auto flex w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <img src="/images/footer/logo-blanc.svg" alt="Léya" class="h-8 w-auto" style="animation: none;" />
          <span class="rounded-full bg-corail-500 px-3 py-[2px] text-[14px] font-semibold text-vert-900">Administration</span>
        </NuxtLink>
        <nav class="flex flex-1 flex-wrap items-center gap-2" aria-label="Administration">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-full px-4 py-2 text-[16px] font-medium hover:bg-white/15 transition-colors" active-class="bg-white !text-vert-900 hover:!bg-white">{{ l.label }}</NuxtLink>
        </nav>
        <NuxtLink to="/" class="text-[16px] underline-offset-2 hover:underline">Voir le site</NuxtLink>
        <button type="button" class="rounded-full border border-white/60 px-4 py-2 text-[16px] font-medium hover:bg-white/15 transition-colors" @click="leave">Déconnexion</button>
      </div>
    </header>
    <main class="mx-auto w-[calc(100%-2rem)] lg:w-[90%] max-w-[1328px] py-8 lg:py-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { logout } = useSession()
const links = [
  { to: '/admin/revendications', label: 'Revendications' },
  { to: '/admin/fiches', label: 'Fiches' },
]
async function leave() {
  await logout()
  await navigateTo('/')
}
</script>
