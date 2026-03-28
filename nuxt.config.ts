// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  image: {
    provider: 'vercel',
    format: ['webp', 'avif', 'jpeg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  },
  runtimeConfig: {
    geminiApiKey: '' // Overridden by NUXT_GEMINI_API_KEY env var
  },
  app: {
    head: {
      title: 'Medaltea - Votre expert en santé naturelle',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Medaltea vous accompagne dans votre parcours de santé naturelle avec des conseils d\'experts et un chatbot intelligent.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Favicon.svg' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})