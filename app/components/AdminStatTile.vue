<template>
  <li class="rounded-[24px] bg-white px-6 py-[22px] flex flex-col gap-[10px]" :data-testid="testid">
    <span class="text-[16px] font-medium leading-[normal] text-neutre-600">{{ label }}</span>
    <span class="font-unbounded font-normal text-[28px] xl:text-[32px] leading-[normal]">{{ value }}</span>
    <span v-if="trend" class="self-start rounded-full bg-bleu-50 px-4 py-[6px] text-[14px] font-medium leading-[normal]">{{ trend }}</span>
    <span v-if="hint" class="text-[14px] text-neutre-600 leading-[normal]">{{ hint }}</span>
  </li>
</template>

<script setup>
// Tuile d'indicateur du cockpit d'administration : la valeur arrive déjà formatée (utils/adminStats)
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, default: '' },
  hint: { type: String, default: '' },
  testid: { type: String, default: undefined },
})
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
</style>
