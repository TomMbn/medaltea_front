// Fonctions « auto-importées » par Nuxt/Nitro, simulées pour pouvoir importer la passerelle et les utilitaires hors de Nuxt
import { vi } from 'vitest'

const g = globalThis as any
g.defineEventHandler = (handler: unknown) => handler
g.createError = (o: { statusCode?: number; statusMessage?: string }) => Object.assign(new Error(o?.statusMessage ?? 'Erreur'), o)
g.useRuntimeConfig = () => ({ apiBase: 'https://backend.test' })
g.PARIS_TZ = 'Europe/Paris'
vi.stubGlobal('defineNuxtPlugin', (fn: unknown) => fn)
