/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // We do NOT use extend here to completely REPLACE the default Tailwind sans font stack
    fontFamily: {
      sans: ['"Futura PT"', 'Futura', 'Jost', 'sans-serif'],
      unbounded: ['Unbounded', 'sans-serif'],
    },
    extend: {
      // Other extensions here if needed
    }
  },
  plugins: [],
}
