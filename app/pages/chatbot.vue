<template>
  <div class="flex-1 flex flex-col min-h-0">
    <ChatbotInterface />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useSeoMeta({ robots: 'noindex, nofollow' })
</script>
