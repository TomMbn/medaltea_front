<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2 lg:pt-7 pb-5 lg:pb-5">
    <div class="flex-1 min-w-[220px]">
      <h1 class="font-unbounded font-normal text-[24px] sm:text-[28px] xl:text-[32px] leading-[normal] text-vert-900">{{ title }}</h1>
      <p v-if="subtitle" class="mt-[2px] text-[16px] lg:text-[18px] leading-[normal] text-neutre-600">{{ subtitle }}</p>
    </div>
    <NuxtLink
      v-if="publicLink"
      :to="publicLink"
      target="_blank"
      class="inline-flex items-center gap-[14px] min-h-[48px] pl-6 pr-1 py-1 rounded-full border-[1.5px] border-vert-900 text-vert-900 text-[16px] lg:text-[18px] font-semibold whitespace-nowrap hover:bg-white transition-colors"
    >
      Voir ma fiche publique
      <span class="w-10 h-10 rounded-full border-[1.5px] border-vert-900 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'

// En-tête commun des pages de l'espace praticien (titre, sous-titre, accès à la fiche publique)
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})

const { praticienId } = useSession()
const { fiche } = useProCompletion()
const publicLink = computed(() => (praticienId.value ? `/praticiens/${fiche.value?.slug || praticienId.value}` : ''))
</script>
