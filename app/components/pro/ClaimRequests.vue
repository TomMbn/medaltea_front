<template>
  <section v-if="requests.length" class="bg-white rounded-[20px] shadow-sm p-5 sm:p-6 mb-6" aria-labelledby="claims-title">
    <h2 id="claims-title" class="font-unbounded font-bold text-base mb-3">Mes demandes de revendication</h2>
    <ul class="grid gap-2">
      <li v-for="r in requests" :key="r.id" class="rounded-xl border border-gray-200 px-4 py-3 text-sm">
        <p class="font-semibold">
          {{ r.praticien?.firstName }} {{ r.praticien?.lastName }}<template v-if="r.praticien?.city"> — {{ r.praticien.city }}</template>
        </p>
        <p class="mt-1">
          <span class="inline-block text-xs font-semibold rounded-full px-2.5 py-1" :class="STATUS[r.status]?.class ?? 'bg-gray-100'">{{ STATUS[r.status]?.label ?? r.status }}</span>
          <span v-if="r.createdAt" class="text-xs text-[#012828]/60 ml-2">Envoyée le {{ formatDate(r.createdAt) }}</span>
        </p>
        <p v-if="r.status === 'rejected' && r.decisionReason" class="text-xs text-[#012828]/70 mt-2">Motif : {{ r.decisionReason }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const { data } = await useAsyncData('pro-claims', () => $fetch('/api/backend/praticiens/me/claim-requests').catch(() => []), { server: false, default: () => [] })
const requests = computed(() => (Array.isArray(data.value) ? data.value : []))

const STATUS = {
  pending: { label: 'En attente de vérification', class: 'bg-amber-100 text-amber-900' },
  approved: { label: 'Acceptée', class: 'bg-emerald-100 text-emerald-900' },
  rejected: { label: 'Refusée', class: 'bg-red-100 text-red-900' },
}
const formatDate = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
