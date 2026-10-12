export default defineEventHandler(async (event) => {
    // Proxy matching the POST /auth/register endpoint on the VPS
    const { apiBase } = useRuntimeConfig()
    return proxyRequest(event, `${apiBase}/auth/register`)
})
