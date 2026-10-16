// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

// Règles recommandées de Nuxt/Vue. Les règles purement stylistiques sont laissées au code existant (formatage libre).
export default withNuxt({
  ignores: ['docs/**', 'tests/reports/**', 'test-results/**', 'public/**'],
}, {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    // Données JSON d'API non typées (passerelle, démo) : any accepté
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
  },
})
