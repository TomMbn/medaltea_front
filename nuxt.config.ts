import { medecines } from './app/data/medecines'

// https://nuxt.com/docs/api/configuration/nuxt-config
const buildDate = new Date().toISOString().slice(0, 10)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/sitemap', '@nuxt/fonts', '@vercel/analytics'],

  site: {
    url: 'https://leya-sante.fr',
    name: 'Léya'
  },

  sitemap: {
    excludeAppSources: true,
    // Fiches praticiens indexables (revendiquées et complètes), lues dans l'annuaire
    sources: ['/api/__sitemap__/praticiens'],
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: buildDate },
      { loc: '/medecines', priority: 0.9, changefreq: 'weekly', lastmod: buildDate },
      { loc: '/trouver-un-praticien', priority: 0.8, changefreq: 'monthly', lastmod: buildDate },
      { loc: '/mentions-legales', priority: 0.2, changefreq: 'yearly', lastmod: buildDate },
      { loc: '/politique-de-confidentialite', priority: 0.2, changefreq: 'yearly', lastmod: buildDate },
      { loc: '/cgu', priority: 0.2, changefreq: 'yearly', lastmod: buildDate },
      { loc: '/cgu-pro', priority: 0.2, changefreq: 'yearly', lastmod: buildDate },
      { loc: '/praticiens-pro', priority: 0.7, changefreq: 'monthly', lastmod: buildDate },
      // Une entrée par médecine, générée depuis app/data/medecines.ts
      ...medecines.map(m => ({ loc: `/medecines/${m.slug}`, priority: 0.8, changefreq: 'monthly' as const, lastmod: buildDate })),
    ]
  },
  fonts: {
    families: [
      { name: 'Unbounded', provider: 'google', weights: [300, 400, 500, 600, 700], styles: ['normal'] },
      { name: 'Jost', provider: 'google', weights: [300, 400, 500, 600, 700], styles: ['normal'] },
    ],
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
      '2xl': 1536,
      '3xl': 1920
    }
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
        'Cross-Origin-Opener-Policy': 'same-origin',
        // Politique de sécurité des contenus en mode « rapport seul » : elle ne bloque rien, les écarts sont journalisés
        // (voir server/api/csp-report.post.ts) avant de passer en mode bloquant.
        'Content-Security-Policy-Report-Only': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://gateway.umami.is https://cloud.umami.is; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report",
      },
    },
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    // Modèle Gemini (surchargeable avec NUXT_GEMINI_MODEL, ex. gemini-3.5-flash-lite)
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    // URL du backend (surchargeable avec NUXT_API_BASE)
    apiBase: process.env.NUXT_API_BASE || 'https://vps123922.serveur-vps.net'
  },
  app: {
    head: {
      title: 'Léya — La médecine alternative, intelligente et accessible',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'google-site-verification', content: '6ptMFJEjzSqdeWEAtJY4t7a79p5OQ6816u0Is4HT1_4' },
        { name: 'description', content: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.' },
        { name: 'theme-color', content: '#177070' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Léya' },
        { property: 'og:title', content: 'Léya — La médecine alternative, intelligente et accessible' },
        { property: 'og:description', content: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.' },
        { property: 'og:url', content: 'https://leya-sante.fr' },
        { property: 'og:image', content: 'https://leya-sante.fr/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Léya — La médecine alternative, intelligente et accessible' },
        { name: 'twitter:description', content: 'Léya connecte patients et praticiens en médecines alternatives. Chatbot IA, prise de rendez-vous et thérapies naturelles adaptées à vos besoins.' },
        { name: 'twitter:image', content: 'https://leya-sante.fr/og-image.jpg' },
      ],
      script: [
        { src: 'https://cloud.umami.is/script.js', defer: true, 'data-website-id': '29f997b8-9b18-4030-a4c6-1aad46f13570' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/Favicon.svg', color: '#177070' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})