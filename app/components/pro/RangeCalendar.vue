<template>
  <div class="select-none" role="group" :aria-label="`Calendrier, ${monthLabel(cursor.y, cursor.m)}`">
    <div class="flex items-center justify-between mb-3">
      <button type="button" class="w-9 h-9 rounded-full hover:bg-gray-100 disabled:opacity-30" :disabled="!canPrev" aria-label="Mois précédent" @click="shift(-1)">‹</button>
      <p class="font-semibold capitalize text-sm" aria-live="polite">{{ monthLabel(cursor.y, cursor.m) }}</p>
      <button type="button" class="w-9 h-9 rounded-full hover:bg-gray-100" aria-label="Mois suivant" @click="shift(1)">›</button>
    </div>

    <div class="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-1" aria-hidden="true">
      <span v-for="d in DAYS" :key="d.n">{{ d.short }}</span>
    </div>

    <div class="grid grid-cols-7 gap-y-1">
      <span v-for="i in leading" :key="`b${i}`" />
      <button
        v-for="c in cells"
        :key="c.key"
        type="button"
        class="relative h-10 text-sm transition-colors"
        :class="cellClass(c)"
        :disabled="c.past"
        :aria-label="cellLabel(c)"
        :aria-pressed="c.key === start || c.key === end"
        @click="pick(c.key)"
        @mouseenter="hover = c.key"
        @mouseleave="hover = ''"
        @focus="hover = c.key"
      >
        {{ c.day }}
        <span v-if="c.marked" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
      </button>
    </div>

    <ul class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
      <li class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-[#156F71]" aria-hidden="true" /> Sélection</li>
      <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" /> Absence déjà prévue</li>
      <li class="flex items-center gap-1.5"><span class="text-gray-300" aria-hidden="true">12</span> Jour fermé</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  start: { type: String, default: '' },
  end: { type: String, default: '' },
  marked: { type: Object, default: () => new Set() },   // jours déjà en absence
  closedWeekdays: { type: Array, default: () => [] },   // jours de la semaine sans horaires (1 = lundi)
})
const emit = defineEmits(['update:start', 'update:end'])

const today = todayKey()
const initial = parseKey(props.start || today)
const cursor = ref({ y: initial.y, m: initial.m })
const hover = ref('')

const t = parseKey(today)
const canPrev = computed(() => cursor.value.y > t.y || (cursor.value.y === t.y && cursor.value.m > t.m))

function shift(n) {
  let { y, m } = cursor.value
  m += n
  if (m < 1) { m = 12; y-- }
  if (m > 12) { m = 1; y++ }
  cursor.value = { y, m }
}

const weekdayOf = (key) => { const d = new Date(`${key}T12:00:00Z`).getUTCDay(); return d === 0 ? 7 : d }
const leading = computed(() => weekdayOf(toKey(cursor.value.y, cursor.value.m, 1)) - 1)
const cells = computed(() => {
  const { y, m } = cursor.value
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return Array.from({ length: count }, (_, i) => {
    const key = toKey(y, m, i + 1)
    return { key, day: i + 1, past: key < today, today: key === today, closed: props.closedWeekdays.includes(weekdayOf(key)), marked: props.marked.has(key) }
  })
})

// Aperçu de la plage pendant le choix de la date de fin.
const previewEnd = computed(() => (props.start && !props.end && hover.value && hover.value >= props.start ? hover.value : props.end))
const inRange = (key) => props.start && previewEnd.value && key > props.start && key < previewEnd.value

function pick(key) {
  if (!props.start || props.end) { emit('update:start', key); emit('update:end', ''); return }
  if (key < props.start) { emit('update:start', key); emit('update:end', props.start); return }
  emit('update:end', key)
}

function cellClass(c) {
  if (c.key === props.start || c.key === props.end) return 'bg-[#156F71] text-white font-bold rounded-lg'
  if (inRange(c.key)) return 'bg-[#e0ecf2] text-[#012828]'
  if (c.past) return 'text-gray-300 cursor-not-allowed'
  if (c.closed) return 'text-gray-300 hover:bg-gray-100 rounded-lg'
  return 'hover:bg-gray-100 rounded-lg' + (c.today ? ' ring-1 ring-[#156F71]' : '')
}
function cellLabel(c) {
  const parts = [formatDay(c.key, true)]
  if (c.key === props.start) parts.push('début de la sélection')
  if (c.key === props.end) parts.push('fin de la sélection')
  if (c.marked) parts.push('absence déjà prévue')
  if (c.closed) parts.push('jour fermé')
  return parts.join(', ')
}
</script>
