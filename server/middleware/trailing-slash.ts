// /page/ → /page (une seule URL par page, cohérent avec les canoniques)
export default defineEventHandler((event) => {
  const [path = '', query] = event.path.split('?')
  if (path.length > 1 && path.endsWith('/') && !path.startsWith('/api/') && !path.startsWith('/_')) {
    return sendRedirect(event, path.replace(/\/+$/, '') + (query ? `?${query}` : ''), 308)
  }
})
