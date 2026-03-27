export default defineEventHandler(async (event) => {
    // Proxy matching the POST /auth/register endpoint on the VPS
    // This forwards the body, headers and method correctly.
    return proxyRequest(event, 'https://vps106845.serveur-vps.net/auth/register')
})
