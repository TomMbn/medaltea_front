import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Tests unitaires : fonctions pures de l'application et de la passerelle (sans lancer Nuxt)
export default defineConfig({
  resolve: { alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) } },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    setupFiles: ['tests/unit/setup.ts'],
    reporters: ['default'],
  },
})
