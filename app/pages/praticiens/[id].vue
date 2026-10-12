<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[1100px] mx-auto pt-32 pb-8">
      <NuxtLink to="/trouver-un-praticien" class="inline-flex items-center gap-1 text-[#156F71] text-sm font-medium mb-6 hover:underline">
        <ArrowLeft :size="14" aria-hidden="true" /> Tous les praticiens
      </NuxtLink>

      <div class="grid gap-6 lg:grid-cols-5">
        <!-- Fiche -->
        <section class="lg:col-span-2 bg-white rounded-[20px] shadow-sm p-6 sm:p-8 text-[#012828] h-fit" aria-labelledby="praticien-name">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 shrink-0 rounded-full bg-[#156F71] text-white flex items-center justify-center font-bold text-xl" aria-hidden="true">
              {{ initials }}
            </div>
            <div>
              <h1 id="praticien-name" class="font-unbounded font-bold text-xl leading-tight">
                {{ praticien.firstName }} {{ praticien.lastName }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">{{ praticien.city }}</p>
            </div>
          </div>

          <dl class="space-y-4 text-sm font-sans">
            <div class="flex gap-3">
              <dt class="shrink-0"><MapPin :size="16" class="text-[#156F71]" aria-label="Adresse" /></dt>
              <dd>{{ praticien.address }}<br />{{ formatPostalCode(praticien.postalCode) }} {{ praticien.city }}</dd>
            </div>
            <div v-if="praticien.phoneNumber" class="flex gap-3">
              <dt class="shrink-0"><Phone :size="16" class="text-[#156F71]" aria-label="Téléphone" /></dt>
              <dd><a :href="`tel:${praticien.phoneNumber}`" class="underline">{{ praticien.phoneNumber }}</a></dd>
            </div>
            <div v-if="praticien.schedules" class="flex gap-3">
              <dt class="shrink-0"><Clock :size="16" class="text-[#156F71]" aria-label="Horaires" /></dt>
              <dd>{{ praticien.schedules }}</dd>
            </div>
            <div v-if="praticien.price" class="flex gap-3">
              <dt class="shrink-0"><Euro :size="16" class="text-[#156F71]" aria-label="Tarif" /></dt>
              <dd>À partir de {{ praticien.price }} € la séance</dd>
            </div>
          </dl>

          <p class="mt-6 text-xs text-gray-500 leading-relaxed">
            Fiche professionnelle. Ce praticien exerce sous sa propre responsabilité ; Léya n'est pas partie à la relation de soin.
            <NuxtLink to="/cgu" class="underline">En savoir plus</NuxtLink>
          </p>
        </section>

        <!-- Réservation -->
        <section class="lg:col-span-3 bg-white rounded-[20px] shadow-sm p-6 sm:p-8 text-[#012828]" aria-labelledby="booking-title">
          <h2 id="booking-title" class="font-unbounded font-bold text-lg mb-6">Prendre rendez-vous</h2>
          <AppointmentBooking :praticien="praticien" :types="types" />
        </section>
      </div>

      <TheFooter />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, MapPin, Phone, Clock, Euro } from 'lucide-vue-next'

const route = useRoute()
const id = Number(route.params.id)
if (!Number.isInteger(id) || id < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: praticien, error } = await useAsyncData(`praticien-${id}`, () => $fetch(`/api/backend/praticiens/${id}`))
if (error.value || !praticien.value) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: rawTypes } = await useAsyncData(`praticien-${id}-types`, () =>
  $fetch(`/api/backend/praticiens/${id}/consultation-types`).catch(() => []),
)
const types = computed(() => normalizeTypes(rawTypes.value))

const initials = computed(() => `${(praticien.value.firstName || '?')[0]}${(praticien.value.lastName || '')[0] || ''}`.toUpperCase())

// Fiches nominatives : non indexées tant que le cadre légal (information, opposition) n'est pas validé.
useSeoMeta({
  title: () => `${praticien.value.firstName} ${praticien.value.lastName} — Prendre rendez-vous | Léya`,
  description: () => `Prenez rendez-vous en ligne avec ${praticien.value.firstName} ${praticien.value.lastName} à ${praticien.value.city}.`,
  robots: 'noindex, nofollow',
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
