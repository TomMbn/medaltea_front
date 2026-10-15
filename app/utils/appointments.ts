export type AppointmentStatus =
  | 'pending' | 'confirmed' | 'cancelled_by_user' | 'cancelled_by_praticien' | 'completed' | 'no_show'

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled_by_user: 'Annulé par le patient',
  cancelled_by_praticien: 'Annulé par le praticien',
  completed: 'Terminé',
  no_show: 'Patient absent',
}

export const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled_by_user: 'bg-gray-200 text-gray-700',
  cancelled_by_praticien: 'bg-gray-200 text-gray-700',
  completed: 'bg-[#e0ecf2] text-[#156F71]',
  no_show: 'bg-red-100 text-red-800',
}

export const isActiveStatus = (s: string) => s === 'pending' || s === 'confirmed'

export interface Appointment {
  id: number
  startAt: string
  endAt: string | null
  status: string
  userNote: string | null
  cancelReason: string | null
  praticienId: number | null
  praticienName: string | null
  praticienCity: string | null
  praticienAddress: string | null
  typeName: string | null
  durationMin: number | null
  price: number | null
  mode: string | null
  patientName: string | null
  patientContact: string | null
  isGuest: boolean
  /** Autre créneau proposé par le praticien, en attente de la réponse du patient */
  proposal: { startAt: string; endAt: string | null; expiresAt: string | null } | null
}

const fullName = (o: any) => [o?.firstName, o?.lastName].filter(Boolean).join(' ') || null

/** La forme exacte des rendez-vous n'est pas documentée : on accepte plusieurs variantes. */
export function normalizeAppointment(raw: any): Appointment {
  const type = raw?.consultationType ?? raw?.type ?? {}
  const prat = raw?.praticien ?? {}
  const patient = raw?.user ?? raw?.patient ?? {}
  return {
    id: Number(raw?.id),
    startAt: String(raw?.startAt ?? raw?.start ?? ''),
    endAt: raw?.endAt ?? raw?.end ?? null,
    status: String(raw?.status ?? 'pending'),
    userNote: raw?.userNote ?? raw?.note ?? null,
    cancelReason: raw?.cancelReason ?? raw?.cancellationReason ?? raw?.reason ?? null,
    praticienId: prat?.id ?? raw?.praticienId ?? null,
    praticienName: fullName(prat),
    praticienCity: prat?.city ?? null,
    praticienAddress: prat?.address ?? null,
    typeName: type?.name ?? raw?.consultationTypeName ?? null,
    durationMin: type?.durationMin ?? raw?.durationMin ?? null,
    price: type?.price ?? raw?.price ?? null,
    mode: type?.mode ?? raw?.mode ?? null,
    patientName: fullName(patient) || patient?.name || raw?.patientName || null,
    // Invité : l'e-mail et le téléphone sont les seuls moyens de contacter la personne
    patientContact: raw?.isGuest === true
      ? ([patient?.email, patient?.phoneNumber].filter(Boolean).join(' · ') || null)
      : (patient?.mail ?? patient?.email ?? patient?.phoneNumber ?? raw?.patientMail ?? null),
    isGuest: raw?.isGuest === true,
    proposal: raw?.proposal?.startAt ? { startAt: String(raw.proposal.startAt), endAt: raw.proposal.endAt ?? null, expiresAt: raw.proposal.expiresAt ?? null } : null,
  }
}

export function normalizeAppointments(raw: any): Appointment[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.items ?? []
  return list.filter((a: any) => a?.id != null).map(normalizeAppointment)
}

export const isPast = (a: Appointment) => new Date(a.endAt ?? a.startAt).getTime() < Date.now()

/** Message d'erreur lisible à partir d'une erreur $fetch. */
export function apiErrorMessage(e: any, fallback = 'Une erreur est survenue. Réessayez dans un instant.'): string {
  const msg = e?.data?.statusMessage ?? e?.data?.message ?? e?.statusMessage
  if (Array.isArray(msg)) return msg.join(' ')
  return typeof msg === 'string' && msg ? msg : fallback
}
export const apiStatus = (e: any): number | undefined => e?.statusCode ?? e?.status ?? e?.response?.status
