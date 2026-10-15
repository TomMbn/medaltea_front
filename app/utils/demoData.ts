// Praticien fictif de la démonstration (espace praticien d'essai). Aucune donnée réelle : tout est inventé.
// Partagé entre le navigateur (faux serveur de la démo) et la passerelle (fiche publique de l'aperçu « Ma fiche »).
export const DEMO_ID = 999999
export const DEMO_SLUG = 'demo-claire-fictive'

export const demoFiche = {
  id: DEMO_ID,
  slug: DEMO_SLUG,
  firstName: 'Claire',
  lastName: 'Démo',
  specialities: [{ id: 2, name: 'Sophrologie', slug: 'sophrologie' }],
  tagline: 'Sophrologue à Angers : stress, sommeil et préparation aux moments importants',
  bio: 'Sophrologue à Angers, j’accompagne adultes et adolescents pour mieux gérer le stress, retrouver un sommeil régulier et se préparer aux moments importants. Les séances alternent respiration, détente musculaire et visualisation, à votre rythme.\n\nCeci est une fiche de démonstration : tous les éléments sont fictifs.',
  address: '12 rue Saint-Aubin',
  addressComplement: '',
  postalCode: 49000,
  city: 'Angers',
  latitude: 47.4712,
  longitude: -0.5518,
  accessInfo: 'Tram ligne A, arrêt Saint-Aubin (3 min à pied). Stationnement dans la rue.',
  phoneNumber: '0612345678',
  website: 'https://example.org',
  practicingSince: 2016,
  languages: ['fr', 'en'],
  publicTypes: ['adults', 'teenagers', 'seniors'],
  paymentMethods: ['card', 'cash', 'check'],
  wheelchairAccessible: true,
  reimbursementInfo: 'Facture fournie pour votre mutuelle',
  isVerified: false,
  claimed: true,
  bookable: true,
  isActive: true,
  priceFrom: 55,
}

export const demoDiplomas = [
  { id: 1, title: 'Diplôme de sophrologue', organization: 'École de sophrologie (fictive)', year: 2016 },
  { id: 2, title: 'Relaxation et gestion du stress', organization: 'Organisme de formation (fictif)', year: 2019 },
]

export const demoTypes = [
  { id: 9001, name: 'Première séance', durationMin: 60, price: 70, mode: 'cabinet', kind: 'first_visit', isActive: true },
  { id: 9002, name: 'Séance de suivi', durationMin: 45, price: 55, mode: 'cabinet', isActive: true },
  { id: 9003, name: 'Séance en visio', durationMin: 45, price: 50, mode: 'visio', isActive: true },
]

export const demoHours = [1, 2, 3, 5]
  .map(d => ({ id: d, dayOfWeek: d, startTime: '09:00:00', endTime: '18:00:00' }))
  .concat([{ id: 6, dayOfWeek: 6, startTime: '09:00:00', endTime: '12:00:00' }])

/** Créneaux libres de la fiche publique de démonstration (jeudi complet, mercredi réduit), à venir uniquement. */
export function demoSlots(from: string, to: string): string[] {
  const out: string[] = []
  const end = new Date(`${to}T00:00:00Z`)
  for (const d = new Date(`${from}T00:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay() || 7
    if (![1, 2, 3, 5, 6].includes(dow)) continue
    const all = dow === 6 ? ['09:00', '10:30', '11:15'] : ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15', '17:00']
    const list = dow === 3 ? all.slice(2, 5) : all
    const day = d.toISOString().slice(0, 10)
    for (const h of list) out.push(`${day}T${h}:00+02:00`)
  }
  return out.filter(s => Date.parse(s) > Date.now())
}

/** Réponses publiques (lecture seule) pour la fiche de démonstration ; `undefined` = route inconnue. */
export function demoPublic(rest: string, query: Record<string, any> = {}): any {
  if (rest === `slug/${DEMO_SLUG}` || rest === String(DEMO_ID)) return { ...demoFiche, diplomas: demoDiplomas }
  if (rest === `${DEMO_ID}/consultation-types`) return demoTypes
  if (rest === `${DEMO_ID}/availabilities`) return demoHours
  if (rest === `${DEMO_ID}/slots`) {
    const from = String(query.from || new Date().toISOString().slice(0, 10))
    return demoSlots(from, String(query.to || from))
  }
  return undefined
}
