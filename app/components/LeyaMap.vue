<template>
  <div class="leya-map isolate overflow-hidden bg-bleu-100" :class="[fill ? 'absolute inset-0' : 'relative', rounded ? 'rounded-[28px]' : '']" role="region" :aria-label="ariaLabel">
    <div ref="el" class="absolute inset-0"></div>

    <!-- Zoom (maquette) -->
    <div v-if="zoomControls" class="absolute z-[500] flex items-center rounded-[20px] bg-white shadow-douce overflow-hidden" :class="zoomPlacement === 'top-right' ? 'right-4 top-4' : 'left-4 xl:left-7 bottom-10'">
      <button type="button" class="w-[81px] h-[66px] flex items-center justify-center text-vert-900 hover:bg-bleu-50 transition-colors" aria-label="Dézoomer" @click="zoomBy(-1)"><Minus :size="22" aria-hidden="true" /></button>
      <button type="button" class="w-[81px] h-[66px] flex items-center justify-center text-vert-900 hover:bg-bleu-50 transition-colors" aria-label="Zoomer" @click="zoomBy(1)"><Plus :size="22" aria-hidden="true" /></button>
    </div>

    <p v-if="failed" class="absolute inset-0 flex items-center justify-center p-6 text-center text-[16px] text-neutre-600">La carte n’a pas pu être chargée. Utilisez la liste des praticiens.</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Plus, Minus } from 'lucide-vue-next'

const props = defineProps({
  // [{ id, lat, lng, price (nombre ou null), label }]
  markers: { type: Array, default: () => [] },
  selectedId: { type: [Number, String], default: null },
  center: { type: Array, default: () => [46.6, 2.4] },
  zoom: { type: Number, default: 6 },
  // Cadre automatiquement les repères (sauf après un déplacement de l'utilisateur)
  fit: { type: Boolean, default: true },
  // Points sur lesquels cadrer au départ (sinon tous les repères)
  fitPoints: { type: Array, default: () => [] },
  // Marge à droite du cadrage (px) : place d'un panneau posé sur la carte (grand écran uniquement)
  fitPaddingRight: { type: Number, default: 0 },
  // Regroupe les repères proches (liste de résultats)
  cluster: { type: Boolean, default: false },
  // Décale le cadrage vers le bas (px) pour que le repère unique reste visible au-dessus d'un encart
  offsetY: { type: Number, default: 0 },
  zoomControls: { type: Boolean, default: true },
  zoomPlacement: { type: String, default: 'bottom-left' },
  // Fiche : la molette ne zoome pas (elle fait défiler la page)
  scrollWheel: { type: Boolean, default: true },
  rounded: { type: Boolean, default: true },
  // Remplit entièrement son parent (positionné)
  fill: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Carte' },
})
const emit = defineEmits(['select', 'moved'])

const el = ref(null)
const failed = ref(false)
let L = null
let map = null
let layer = null
const markerById = new Map()
// Vrai pendant un déplacement fait par le code (cadrage) : il ne doit pas déclencher « Rechercher dans cette zone »
let ignoreUntil = 0
const quiet = (ms) => { ignoreUntil = Date.now() + ms }

// Repères (maquette) : pastille bleue de 74 px avec silhouette blanche, bulle blanche du prix au-dessus (bulle foncée quand le repère est sélectionné).
// Fiche d'un praticien : pastille corail de 64 px avec un repère de lieu.
const person = '<svg style="animation:none" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="11" r="5.5" fill="#fff"/><path d="M5.5 27c0-5.6 4.7-9 10.5-9s10.5 3.4 10.5 9v1.5h-21z" fill="#fff"/></svg>'
const pin = '<svg style="animation:none" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#012828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
function iconFor(m, selected) {
  if (m.variant === 'cabinet') {
    return L.divIcon({ className: 'ley-marker', html: `<span class="ley-cabinet">${pin}</span>`, iconSize: [64, 64], iconAnchor: [32, 32] })
  }
  const price = m.price != null ? `<span class="ley-price${selected ? ' ley-price-on' : ''}">${Math.round(m.price)}&nbsp;€</span>` : ''
  return L.divIcon({
    className: 'ley-marker',
    html: `${price}<span class="ley-pin${selected ? ' ley-pin-on' : ''}">${person}</span>`,
    iconSize: [PIN, PIN],
    iconAnchor: [PIN / 2, PIN / 2],
  })
}
// Taille des repères : 74 px comme la maquette, plus petits sur téléphone
const PIN = typeof window !== 'undefined' && window.innerWidth < 640 ? 56 : 74

// Appelé depuis le gabarit : `map` n'est pas réactive, on passe par une fonction
function zoomBy(dir) { if (!map) return; if (dir > 0) map.zoomIn(); else map.zoomOut() }

function drawMarkers() {
  if (!map || !layer) return
  layer.clearLayers()
  markerById.clear()
  for (const m of props.markers) {
    if (!Number.isFinite(m.lat) || !Number.isFinite(m.lng)) continue
    const mk = L.marker([m.lat, m.lng], { icon: iconFor(m, m.id === props.selectedId), title: m.label || undefined, keyboard: true, riseOnHover: true, zIndexOffset: m.id === props.selectedId ? 1000 : 0 })
    mk.on('click', () => emit('select', m.id))
    mk.addTo(layer)
    markerById.set(m.id, mk)
  }
}

function fitMarkers() {
  if (!map) return
  const pts = props.fitPoints.length ? props.fitPoints : props.markers.filter(m => Number.isFinite(m.lat) && Number.isFinite(m.lng)).map(m => [m.lat, m.lng])
  quiet(500)
  if (pts.length === 1) { map.setView(pts[0], Math.max(props.zoom, 15), { animate: false }); if (props.offsetY) map.panBy([0, props.offsetY], { animate: false }) }
  else if (pts.length > 1) map.fitBounds(pts, { paddingTopLeft: [70, 90], paddingBottomRight: [70 + (window.innerWidth >= 1280 ? props.fitPaddingRight : 0), 70], maxZoom: 14, animate: false })
  else map.setView(props.center, props.zoom, { animate: false })
}

function refreshSelection() {
  for (const m of props.markers) {
    const mk = markerById.get(m.id)
    if (!mk) continue
    const on = m.id === props.selectedId
    mk.setIcon(iconFor(m, on))
    mk.setZIndexOffset(on ? 1000 : 0)
  }
}

onMounted(async () => {
  try {
    L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')
    // « Réduire les animations » désactivé : zoom et fondus de Leaflet sans animation
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    map = L.map(el.value, { zoomControl: false, scrollWheelZoom: props.scrollWheel, attributionControl: true, worldCopyJump: false, zoomAnimation: !calm, fadeAnimation: !calm, markerZoomAnimation: !calm })
    map.attributionControl.setPrefix(false)
    map.attributionControl.setPosition('bottomleft')
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>' }).addTo(map)
    if (props.cluster) {
      // Le plugin attend Leaflet en variable globale
      window.L = L
      await import('leaflet.markercluster')
      await import('leaflet.markercluster/dist/MarkerCluster.css')
      layer = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 48,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: (c) => {
          const n = c.getChildCount()
          return L.divIcon({ className: 'ley-marker', html: `<span class="ley-cluster">${n}</span>`, iconSize: [48, 48], iconAnchor: [24, 24] })
        },
      }).addTo(map)
    } else {
      layer = L.layerGroup().addTo(map)
    }
    map.setView(props.center, props.zoom)
    drawMarkers()
    if (props.fit) fitMarkers()
    map.on('moveend', () => {
      if (Date.now() < ignoreUntil) return
      const b = map.getBounds()
      emit('moved', { bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], center: map.getCenter(), zoom: map.getZoom() })
    })
    // Taille correcte une fois la mise en page terminée
    setTimeout(() => map?.invalidateSize(), 200)
  } catch {
    failed.value = true
  }
})

watch(() => props.markers, () => { drawMarkers(); if (props.fit) fitMarkers() })
watch(() => props.selectedId, refreshSelection)
onBeforeUnmount(() => { map?.remove(); map = null })

defineExpose({
  fit: fitMarkers,
  // Met un repère en évidence, même s'il est dans un groupe
  focus(id) {
    const mk = markerById.get(id)
    if (!mk || !map) return
    quiet(2000)
    if (layer?.zoomToShowLayer) layer.zoomToShowLayer(mk, () => { quiet(1000); map.panTo(mk.getLatLng()) })
    else map.panTo(mk.getLatLng())
  },
  panTo(lat, lng) { if (map) { quiet(1000); map.panTo([lat, lng]) } },
  invalidate() { map?.invalidateSize() },
  getBbox() { if (!map) return null; const b = map.getBounds(); return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] },
})
</script>

<style>
/* L'animation d'apparition globale des images décalerait les tuiles de la carte */
.leya-map img, .leya-map svg { animation: none !important; will-change: auto !important; }

/* Repères de la carte (maquette) : pastille bleue, silhouette blanche, bulle verte du prix */
.ley-marker { background: none; border: 0; }
.ley-cluster { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: #156f71; color: #fff; font-weight: 600; font-size: 16px; border: 3px solid #fff; box-shadow: 0 6px 16px rgba(1, 40, 40, 0.2); cursor: pointer; }
.ley-pin { position: absolute; inset: 0; border-radius: 9999px; background: #90bad1; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, background-color 0.15s; cursor: pointer; }
.ley-marker:hover .ley-pin, .ley-marker:focus-visible .ley-pin { transform: scale(1.06); }
.ley-pin-on { box-shadow: 0 0 0 3px #fff, 0 6px 16px rgba(1, 40, 40, 0.25); transform: scale(1.06); }
.ley-price { position: absolute; left: 50%; top: -26px; transform: translateX(-50%); background: #fff; color: #012828; font-weight: 500; font-size: 16px; line-height: normal; padding: 9px 18px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 6px 16px rgba(1, 40, 40, 0.12); z-index: 1; }
.ley-price-on { background: #156f71; color: #fff; }
.ley-cabinet { position: absolute; inset: 0; border-radius: 9999px; background: #ec7f7a; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(1, 40, 40, 0.18); }
.leya-map .leaflet-container { font-family: inherit; background: #d7e7f0; }
.leya-map .leaflet-control-attribution { font-size: 11px; background: rgba(255, 255, 255, 0.8); border-radius: 8px; margin: 0 0 8px 8px; }
.leya-map .leaflet-tile-pane { filter: grayscale(0.6) saturate(0.85) brightness(1.06) contrast(0.92); }
.leya-map .leaflet-marker-icon:focus-visible { outline: 3px solid #156f71; outline-offset: 2px; border-radius: 9999px; }
</style>
