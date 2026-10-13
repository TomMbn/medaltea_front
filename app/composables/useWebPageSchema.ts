/**
 * Balisage Schema.org d'une page : la page elle-même (WebPage, CollectionPage…) et son fil d'Ariane.
 * Le fil d'Ariane commence toujours par l'accueil.
 */
export function useWebPageSchema(options: {
  name: string
  description?: string
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage'
  breadcrumbs?: { name: string, path: string }[]
}) {
  const route = useRoute()
  const base = 'https://leya-sante.fr'
  const path = route.path === '/' ? '' : route.path.replace(/\/$/, '')
  const url = `${base}${path}`

  const graph: Record<string, any>[] = [{
    '@type': options.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: options.name,
    ...(options.description ? { description: options.description } : {}),
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${base}/#website` },
  }]

  if (options.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Accueil', path: '' }, ...options.breadcrumbs].map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${base}${crumb.path}`,
      })),
    })
  }

  useHead({
    script: [{ key: 'ld-webpage', type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }],
  })
}
