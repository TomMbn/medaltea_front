<template>
  <div class="bg-[#e0ecf2] min-h-screen overflow-x-hidden">
    <div class="w-11/12 max-w-[900px] mx-auto pt-32 pb-8">
      <article class="bg-white rounded-[20px] shadow-sm p-6 sm:p-10 lg:p-16 text-[#012828]">
        <h1 class="font-unbounded font-bold text-3xl lg:text-4xl mb-3">{{ title }}</h1>
        <p class="text-sm opacity-60 mb-10">Dernière mise à jour : {{ legal.lastUpdate }}</p>
        <div class="legal-content font-sans">
          <slot />
        </div>
      </article>
      <TheFooter />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { legal } from '~/data/legal'

// Les tableaux sont enveloppés dans une zone défilable atteignable au clavier (sinon ils sont coupés sur téléphone)
onMounted(() => {
  document.querySelectorAll('.legal-content table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-scroll')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'table-scroll'
    wrapper.tabIndex = 0
    wrapper.setAttribute('role', 'region')
    wrapper.setAttribute('aria-label', 'Tableau, défilable horizontalement')
    table.replaceWith(wrapper)
    wrapper.appendChild(table)
  })
})

defineProps({ title: { type: String, required: true } })
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.legal-content :deep(h2) { font-family: 'Unbounded', cursive; font-weight: 700; font-size: 1.25rem; margin: 2.5rem 0 1rem; }
.legal-content :deep(h3) { font-weight: 700; margin: 1.5rem 0 0.5rem; }
.legal-content :deep(p) { line-height: 1.75; margin-bottom: 1rem; opacity: 0.85; }
.legal-content :deep(ul) { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; line-height: 1.75; opacity: 0.85; }
.legal-content :deep(a) { color: #156F71; text-decoration: underline; }
.legal-content :deep(table) { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9rem; }
/* Téléphone : les tableaux défilent horizontalement au lieu d'être coupés (colonnes « base légale » et « durée » sinon invisibles) */
.legal-content :deep(.table-scroll) { overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 1rem; }
.legal-content :deep(.table-scroll table) { margin-bottom: 0; }
@media (max-width: 767px) {
  .legal-content :deep(table) { min-width: 38rem; }
}
.legal-content :deep(th), .legal-content :deep(td) { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; }
.legal-content :deep(th) { background: #f3f7f9; }
</style>
