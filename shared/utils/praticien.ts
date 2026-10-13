/**
 * Une fiche n'est indexée par les moteurs de recherche que si elle est revendiquée,
 * réservable et suffisamment renseignée (une fiche vide serait une page pauvre,
 * et une fiche nominative non revendiquée n'a pas à être mise en avant).
 */
export const isIndexablePraticien = (p: any): boolean =>
  !!p && p.claimed === true && p.bookable === true && typeof p.bio === 'string' && p.bio.trim().length >= 50

/** Libellés français des valeurs de l'API (fiche publique et formulaire praticien). */
export const PAYMENT_LABELS: Record<string, string> = { card: 'Carte bancaire', cash: 'Espèces', check: 'Chèque', transfer: 'Virement' }
export const PUBLIC_LABELS: Record<string, string> = { babies: 'Bébés', children: 'Enfants', teenagers: 'Adolescents', adults: 'Adultes', seniors: 'Seniors', pregnant_women: 'Femmes enceintes', athletes: 'Sportifs' }
