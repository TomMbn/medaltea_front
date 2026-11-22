<template>
  <p v-if="links.length" class="mt-8 text-[16px] text-neutre-600" data-testid="analysis-links">
    Analyse détaillée :
    <template v-for="(l, i) in links" :key="l.href">
      <span v-if="i"> · </span>
      <a :href="l.href" target="_blank" rel="noopener noreferrer" class="underline hover:text-vert-600">{{ l.label }}<span class="sr-only"> (nouvel onglet)</span></a>
    </template>
  </p>
</template>

<script setup>
// Grafana et Umami restent les outils d'analyse détaillée : le cockpit n'en montre que la synthèse
const { adminLinks } = useRuntimeConfig().public
const links = [
  { href: safeExternalLink(adminLinks?.grafana), label: 'tableaux de bord Grafana' },
  { href: safeExternalLink(adminLinks?.umami), label: 'mesure d’audience Umami' },
].filter(l => l.href)
</script>
