// Fiches praticiens indexables, lues dans l'annuaire à la génération du sitemap.
export default defineEventHandler(async () => {
  const { apiBase } = useRuntimeConfig()
  const urls: { loc: string, changefreq: 'weekly', priority: number }[] = []
  try {
    for (let offset = 0; offset < 1000; offset += 50) {
      const page = await $fetch<any[]>(`${apiBase}/praticiens`, {
        query: { claimed: true, bookable: true, limit: 50, offset },
        timeout: 10000,
      })
      for (const p of page) {
        if (isIndexablePraticien(p) && p.slug) urls.push({ loc: `/praticiens/${p.slug}`, changefreq: 'weekly', priority: 0.6 })
      }
      if (page.length < 50) break
    }
  } catch (error: any) {
    console.error('Sitemap praticiens indisponible:', error?.message || error)
  }
  return urls
})
