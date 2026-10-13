import type { H3Event } from 'h3'

/** Événements que le front transmet à l'API ; tous les autres sont émis par l'API elle-même. */
export type UserTrackingEvent = 'chat_message_sent' | 'chat_quota_reached'

/**
 * Valeurs autorisées par l'API (liste blanche, toute autre clé est refusée) :
 * - chat_message_sent : history_length (entier) ;
 * - chat_quota_reached : scope ('user' | 'ip').
 * Jamais de contenu de message ni de donnée identifiante : l'API rattache l'événement au compte du jeton.
 */
export type UserTrackingProps = Record<string, string | number>

/**
 * Envoie un événement de tracking utilisateur à l'API (POST /tracking/events) avec le jeton de la session,
 * comme requireUser(). Sans attente : ne retarde ni ne fait échouer la requête en cours, même si l'API ne répond pas.
 */
export function trackUserEvent(event: H3Event, name: UserTrackingEvent, props: UserTrackingProps = {}): void {
    try {
        const token = readToken(event)
        if (!token) return

        const { apiBase } = useRuntimeConfig()
        const sending = $fetch(`${apiBase}/tracking/events`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: { name, props },
            timeout: 3000,
            retry: 0,
        }).catch((error: any) => {
            // Statut seulement : ni jeton ni contenu dans les journaux
            console.warn('User tracking failed:', error?.response?.status ?? error?.name ?? 'error')
        })
        // En serverless, laisse l'envoi se terminer après la réponse, sans la retarder
        event.waitUntil?.(sending)
    } catch {
        // Le tracking ne doit jamais gêner le chat
    }
}
