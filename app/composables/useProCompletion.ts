// Complétude de la fiche praticien, partagée par la barre latérale, le tableau de bord et la page d'accueil.
// Clés d'asynchrone partagées avec les pages Prestations et Horaires : chaque donnée n'est chargée qu'une fois.
export const useProCompletion = () => {
  const { data: types } = useAsyncData('pro-types', () => $fetch<any[]>('/api/backend/praticiens/me/consultation-types'), { server: false, lazy: true, default: () => [] })
  const { data: hours } = useAsyncData('pro-hours', () => $fetch<any[]>('/api/backend/praticiens/me/availabilities'), { server: false, lazy: true, default: () => [] })
  // Fiche du praticien (champs privés compris) : jalons de complétude, lien public, spécialité
  const { data: fiche } = useAsyncData('pro-fiche-slug', () => $fetch<any>('/api/backend/praticiens/me'), { server: false, lazy: true, default: () => null })

  const hasTypes = computed(() => (Array.isArray(types.value) ? types.value : []).some((t: any) => t.isActive !== false))
  const hasHours = computed(() => Array.isArray(hours.value) && hours.value.length > 0)
  const bookable = computed(() => hasTypes.value && hasHours.value)
  const bioOk = computed(() => (fiche.value?.bio ?? '').trim().length >= 50)
  const infosOk = computed(() => !!(fiche.value && (fiche.value.languages?.length || fiche.value.publicTypes?.length || fiche.value.paymentMethods?.length)))

  const checklist = computed(() => [
    { label: 'Compte créé', done: true },
    { label: 'Fiche et spécialités renseignées', done: true },
    { label: 'Présentation rédigée', done: bioOk.value, to: '/pro/fiche#presentation', cta: 'Rédiger' },
    { label: 'Informations pratiques', done: infosOk.value, to: '/pro/fiche#pratique', cta: 'Compléter' },
    { label: 'Prestation ajoutée', done: hasTypes.value, to: '/pro/prestations', cta: 'Ajouter' },
    { label: 'Horaires définis', done: hasHours.value, to: '/pro/horaires', cta: 'Définir' },
  ])
  // Six jalons : compte et fiche (créés à l'inscription), présentation, informations pratiques, prestation, horaires.
  const percent = computed(() => Math.round((checklist.value.filter(c => c.done).length / checklist.value.length) * 100))
  const missing = computed(() => checklist.value.filter(c => !c.done))

  return { types, hours, fiche, hasTypes, hasHours, bookable, bioOk, infosOk, checklist, percent, missing }
}
