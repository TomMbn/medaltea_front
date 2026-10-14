<template>
  <section class="mx-auto w-[calc(100%-1.5rem)] max-w-[1642px] mb-16 lg:mb-24" aria-labelledby="find-title">
    <div class="relative bg-vert-600 rounded-leya-m overflow-hidden lg:min-h-[578px]">
      <!-- Photo (moitié droite) -->
      <div class="relative h-[220px] sm:h-[300px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-1/2">
        <NuxtImg
          src="/images/landing/trouver-photo.webp"
          alt="Séance d'hypnose entre une praticienne et un patient"
          class="absolute inset-0 w-full h-full object-cover"
          width="1636"
          height="1156"
          format="webp"
          quality="75"
          loading="lazy"
          sizes="xs:100vw lg:818px"
        />
      </div>

      <!-- Contenu -->
      <div class="relative lg:w-1/2 px-6 sm:px-10 lg:pl-10 lg:pr-8 2xl:pl-[clamp(100px,9.1vw,158px)] 2xl:pr-[clamp(24px,3.6vw,63px)] py-10 lg:py-[88px]">
        <div class="max-w-[600px]">
          <h2 id="find-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-white">Trouvez un praticien près de chez vous</h2>
          <p class="mt-6 lg:mt-10 text-[17px] lg:text-[18px] font-light leading-snug text-white max-w-[554px]">Consultez des praticiens, triés par spécialité et par localisation.</p>

          <form class="mt-8 bg-white rounded-[28px] sm:rounded-full lg:rounded-[28px] 2xl:rounded-full px-5 py-3 sm:pl-5 sm:pr-1.5 sm:py-1.5 lg:px-5 lg:py-3 2xl:pl-5 2xl:pr-1.5 2xl:py-1.5 flex flex-col sm:flex-row lg:flex-col 2xl:flex-row sm:items-center lg:items-stretch 2xl:items-center gap-2 sm:gap-3.5 focus-ring-within" role="search" @submit.prevent="search">
            <label class="flex items-center gap-2 flex-1 min-w-0 cursor-text py-2 sm:py-0 lg:py-2 2xl:py-0">
              <MapPin :size="18" class="text-vert-600 shrink-0" aria-hidden="true" />
              <input v-model="place" type="text" aria-label="Ville, code postal ou nom du praticien" placeholder="Localisation" class="focus-in-parent bg-transparent text-[17px] lg:text-[18px] text-vert-900 placeholder-neutre-600 focus:outline-none min-w-0 w-full" />
            </label>
            <span class="hidden sm:block lg:hidden 2xl:block w-px h-7 bg-bleu-100" aria-hidden="true"></span>
            <label class="flex items-center gap-2 flex-[1.25] min-w-0 relative py-2 sm:py-0 lg:py-2 2xl:py-0 border-t border-bleu-100 sm:border-0 lg:border-t 2xl:border-0">
              <select v-model="speciality" aria-label="Besoin ou spécialité" class="focus-in-parent bg-transparent text-[17px] lg:text-[18px] text-vert-900 focus:outline-none w-full appearance-none cursor-pointer pr-6" :class="speciality ? '' : 'text-neutre-600'">
                <option value="">Besoin ou spécialité</option>
                <option v-for="sp in specialities" :key="sp.id" :value="sp.slug">{{ sp.name }}</option>
              </select>
              <ChevronDown :size="18" class="absolute right-0 text-vert-600 pointer-events-none" aria-hidden="true" />
            </label>
            <button type="submit" class="inline-flex items-center justify-center gap-[14px] min-h-[48px] bg-corail-500 text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 whitespace-nowrap w-full sm:w-auto lg:w-full 2xl:w-auto">
              Rechercher
              <span class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-corail-500"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </button>
          </form>

          <ul class="mt-8 flex flex-wrap gap-2" aria-label="Recherches fréquentes">
            <li v-for="s in examples" :key="s.label">
              <NuxtLink :to="{ path: '/trouver-un-praticien', query: { specialite: s.slug }, hash: '#resultats' }" class="inline-flex items-center border border-white/50 rounded-full px-3.5 py-[7px] min-h-[44px] sm:min-h-0 text-[16px] text-white hover:bg-white/10 transition-colors">{{ s.label }}</NuxtLink>
            </li>
          </ul>

          <NuxtLink to="/trouver-un-praticien" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-white text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1">
            Voir tous les praticiens
            <span class="w-10 h-10 rounded-full bg-vert-900 flex items-center justify-center text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, ChevronDown, ArrowUpRight } from 'lucide-vue-next'

const router = useRouter()
const { specialities } = await useSpecialities()

const place = ref('')
const speciality = ref('')
const examples = [
  { label: 'Ostéopathe', slug: 'osteopathie' },
  { label: 'Sophrologue', slug: 'sophrologie' },
  { label: 'Naturopathe', slug: 'naturopathie' },
]

function search() {
  const q = place.value.trim()
  const query = {}
  if (q) query.q = q
  if (speciality.value) query.specialite = speciality.value
  // Mesure d'audience (anonyme) : jamais le texte saisi
  trackEvent('praticien-search', { specialite: speciality.value || 'aucune', texte: q ? 'oui' : 'non', autour_de_moi: 'non' })
  router.push({ path: '/trouver-un-praticien', query, hash: '#resultats' })
}
</script>
