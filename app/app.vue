<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

useHead(() => ({
  htmlAttrs: { lang: 'fr' },
  link: [{ rel: 'canonical', href: `https://leya-sante.fr${route.path === '/' ? '' : route.path.replace(/\/$/, '')}` }],
}))
</script>
