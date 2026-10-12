// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/sitemap'],

  site: {
    url: 'https://leya-sante.fr',
    name: 'Léya'
  },

  sitemap: {
    excludeAppSources: true,
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/medecines', priority: 0.9, changefreq: 'weekly' },
      { loc: '/medecines/osteopathie', priority: 0.8, changefreq: 'monthly' },
      { loc: '/medecines/naturopathie', priority: 0.8, changefreq: 'monthly' },
      { loc: '/medecines/sophrologie', priority: 0.8, changefreq: 'monthly' },
      { loc: '/medecines/acupuncture', priority: 0.8, changefreq: 'monthly' },
      { loc: '/medecines/hypnotherapie', priority: 0.8, changefreq: 'monthly' },
      { loc: '/medecines/massage', priority: 0.8, changefreq: 'monthly' },
    ]
  },
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
    geminiApiKey: process.env.GEMINI_API_KEY || ''
  },
  app: {
    head: {
      title: 'Léya — La médecine alternative, intelligente et accessible',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Léya' },
        { property: 'og:title', content: 'Léya — La médecine alternative, intelligente et accessible' },
        { property: 'og:description', content: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.' },
        { property: 'og:url', content: 'https://leya-sante.fr' },
        { property: 'og:image', content: 'https://leya-sante.fr/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Léya — La médecine alternative, intelligente et accessible' },
        { name: 'twitter:description', content: 'Léya connecte patients et praticiens en médecines alternatives. Prenez rendez-vous, consultez notre chatbot IA et trouvez la thérapie naturelle qui vous correspond.' },
        { name: 'twitter:image', content: 'https://leya-sante.fr/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'mask-icon', href: '/Favicon.svg', color: '#177070' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})