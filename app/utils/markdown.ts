import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Sous-ensemble de balises produit par le Markdown : tout le reste (script, iframe, img, style, on*…) est supprimé.
const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'del', 's', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]
const ALLOWED_ATTR = ['href', 'title']

let hooked = false
function ensureHook() {
  if (hooked) return
  hooked = true
  // Les liens s'ouvrent dans un nouvel onglet, sans accès à la page d'origine.
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer nofollow')
    }
  })
}

/** Convertit du Markdown en HTML assaini. À n'appeler que côté client (DOMPurify a besoin du DOM). */
export function renderMarkdown(text: string): string {
  if (!text) return ''
  const html = marked.parse(text, { breaks: true, async: false }) as string
  if (typeof window === 'undefined') return ''
  ensureHook()
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  })
}
