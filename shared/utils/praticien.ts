/**
 * Une fiche n'est indexée par les moteurs de recherche que si elle est revendiquée,
 * réservable et suffisamment renseignée (une fiche vide serait une page pauvre,
 * et une fiche nominative non revendiquée n'a pas à être mise en avant).
 */
export const isIndexablePraticien = (p: any): boolean =>
  !!p && p.claimed === true && p.bookable === true && typeof p.bio === 'string' && p.bio.trim().length >= 50
