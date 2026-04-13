export default defineEventHandler(async (event) => {
    // Proxy matching the POST /auth/login endpoint on the VPS
    return proxyRequest(event, 'https://vps106845.serveur-vps.net/auth/login')
})
