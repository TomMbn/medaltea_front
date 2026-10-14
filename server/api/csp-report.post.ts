/**
 * Réception des rapports de la politique de sécurité des contenus (mode « rapport seul »).
 * Seules quelques informations techniques sont journalisées ; rien n'est stocké ni renvoyé.
 */
export default defineEventHandler(async (event) => {
    setResponseStatus(event, 204)
    try {
        const raw = await readRawBody(event, 'utf8')
        if (!raw || raw.length > 10_000) return
        const body = JSON.parse(raw)
        const report = body?.['csp-report'] ?? body
        const pick = (value: unknown) => String(value ?? '').slice(0, 200)
        console.warn('[csp-report]', JSON.stringify({
            directive: pick(report['violated-directive'] ?? report.effectiveDirective),
            blocked: pick(report['blocked-uri'] ?? report.blockedURL),
            page: pick(report['document-uri'] ?? report.documentURL).split('?')[0],
        }))
    } catch { /* rapport illisible : ignoré */ }
})
