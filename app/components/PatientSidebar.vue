<template>
  <div class="xl:w-[360px] shrink-0 flex flex-col gap-6">
    <section class="rounded-[30px] bg-vert-600 p-8 flex flex-col items-center gap-[14px] text-center" aria-label="Mon identité">
      <span class="w-24 h-24 rounded-full bg-bleu-100 flex items-center justify-center font-unbounded text-[26px] leading-[normal] text-vert-900" aria-hidden="true">{{ initials }}</span>
      <p class="font-unbounded font-normal text-[20px] leading-[normal] text-white break-words max-w-full">{{ displayName }}</p>
      <p v-if="me?.mail" class="text-[16px] leading-[normal] text-[#cde4df] break-all">{{ me.mail }}</p>
    </section>

    <nav class="flex flex-col gap-[6px]" aria-label="Espace patient">
      <NuxtLink v-for="item in items" :key="item.key" :to="item.to" class="flex items-center gap-3 rounded-full px-[18px] py-[14px] text-[18px] leading-[normal] transition-colors" :class="item.key === active ? 'bg-white font-semibold shadow-douce' : 'hover:bg-white/70'" :aria-current="item.key === active ? 'page' : undefined">
        <component :is="item.icon" :size="20" aria-hidden="true" /> {{ item.label }}
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { CalendarDays, User } from 'lucide-vue-next'

// Colonne gauche de l'espace patient (carte d'identité + menu), partagée par « Mon profil » et « Mes rendez-vous ».
const props = defineProps({
  active: { type: String, required: true }, // 'profil' | 'rdv'
  me: { type: Object, default: null },
})

const items = [
  { key: 'profil', label: 'Profil', icon: User, to: '/mon-compte' },
  { key: 'rdv', label: 'Mes rendez-vous', icon: CalendarDays, to: '/mes-rendez-vous' },
]

const displayName = computed(() => [props.me?.firstName, props.me?.lastName].filter(Boolean).join(' ') || 'Mon compte')
const initials = computed(() => {
  const f = (props.me?.firstName || '')[0] || ''
  const l = (props.me?.lastName || '')[0] || ''
  return (f + l || (props.me?.mail || '?')[0]).toUpperCase()
})
</script>
