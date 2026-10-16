/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // We do NOT use extend here to completely REPLACE the default Tailwind sans font stack
    fontFamily: {
      sans: ['"Futura PT"', 'Futura', 'Jost', 'sans-serif'],
      unbounded: ['Unbounded', 'sans-serif'],
    },
    extend: {
      // Palette de la maquette V5 (Figma). Les valeurs déjà utilisées sur le site (#012828, #156F71, #EC7F7A, #90BAD1) sont identiques.
      colors: {
        vert: { 50: '#e7f2f0', 600: '#156f71', 900: '#012828' },
        corail: { 100: '#fcdedb', 500: '#ec7f7a', 700: '#a64a45' },
        bleu: { 50: '#eef5f8', 100: '#d7e7f0', 300: '#90bad1' },
        jaune: { 400: '#ffdb25' },
        neutre: { 200: '#d9d9d9', 300: '#c8c8c8', 500: '#959595', 600: '#626b6b' },
      },
      borderRadius: { 'leya-s': '10px', 'leya-m': '20px', 'leya-xl': '50px' },
      boxShadow: { douce: '0 12px 32px rgba(1, 40, 40, 0.08)' },
      // Échelle typographique de la maquette (polices inchangées : Unbounded pour les titres, Futura pour le reste)
      fontSize: {
        h1: ['56px', { lineHeight: '1.15' }],
        h2: ['40px', { lineHeight: '1.2' }],
        h3: ['32px', { lineHeight: '1.25' }],
        h4: ['26px', { lineHeight: '1.3' }],
        h5: ['20px', { lineHeight: '1.35' }],
        chiffre: ['64px', { lineHeight: '1' }],
      },
    }
  },
  plugins: [],
}
