<template>
  <div class="flex-1 flex flex-col min-h-0">
    <h1 class="sr-only">Assistant Léya</h1>
    <ChatbotInterface />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Assistant IA — Léya', robots: 'noindex, nofollow' })
</script>
