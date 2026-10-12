export default defineEventHandler(async (event) => {
    // Proxy matching the POST /auth/login endpoint on the VPS
    const { apiBase } = useRuntimeConfig()
    return proxyRequest(event, `${apiBase}/auth/login`)
})
