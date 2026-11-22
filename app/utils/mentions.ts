// Médecines citées dans une réponse de l'assistant : reconnues dans le texte, rien n'est inventé.
// Chaque slug correspond à une page /medecines (app/data/medecines.ts).
const MENTIONS: { slug: string; re: RegExp }[] = [
  { slug: 'sophrologie', re: /sophrolog/i },
  { slug: 'naturopathie', re: /naturopath/i },
  { slug: 'osteopathie', re: /ost[ée]opath/i },
  { slug: 'acupuncture', re: /acupunct/i },
  { slug: 'hypnotherapie', re: /hypno/i },
  { slug: 'massage', re: /massage/i },
  { slug: 'reflexologie', re: /r[ée]flexolog/i },
  // « kinésiolog » et non « kinési » : la kinésithérapie n'a pas de page
  { slug: 'kinesiologie', re: /kin[ée]siolog/i },
  { slug: 'shiatsu', re: /shiatsu/i },
  { slug: 'chiropraxie', re: /chiropra/i },
  { slug: 'etiopathie', re: /[ée]tiopath/i },
  { slug: 'medecine-traditionnelle-chinoise', re: /m[ée]decine (traditionnelle )?chinoise|\bMTC\b/i },
]

/** Slugs des médecines citées dans le texte, dans l'ordre de MENTIONS. */
export function mentionedMedicineSlugs(text: string): string[] {
  return MENTIONS.filter(m => m.re.test(text)).map(m => m.slug)
}
