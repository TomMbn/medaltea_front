// Cockpit d'administration : charge GET /api/backend/admin/stats/<route> dans le navigateur.
// La passerelle ajoute le jeton, le backend vérifie le rôle admin ; rien n'est rendu côté serveur.

/** Période affichée à l'ouverture d'une page (l'API accepte 7, 30 ou 90 jours) */
export const ADMIN_STATS_DEFAULT_DAYS = 30

/**
 * @param route overview, signups, bookings, requests ou economy
 * @param withPeriod false pour une route sans paramètre de période (economy)
 * @returns `days` (à lier au sélecteur de période), `stats` (null pendant le chargement) et `error`
 */
export function useAdminStats(route: string, withPeriod = true) {
  const days = ref(ADMIN_STATS_DEFAULT_DAYS)
  const { data: stats, error } = useAsyncData<any>(
    `admin-stats-${route}`,
    () => $fetch(`/api/backend/admin/stats/${route}`, { query: withPeriod ? { days: days.value } : undefined }),
    { server: false, lazy: true, watch: withPeriod ? [days] : [], default: () => null },
  )
  return { days, stats, error }
}
