<template>
  <div class="relative bg-gradient-to-b from-bleu-50 to-[#e0ecf2] min-h-screen overflow-x-hidden">
    <!-- Décors : rond corail et illustration de fond (placés comme dans la maquette) -->
    <img src="/images/medecines/rond-corail.svg" alt="" aria-hidden="true" class="hidden xl:block absolute -left-[15%] top-[420px] w-[37%] max-w-[640px] pointer-events-none select-none" style="animation: none;" />
    <img src="/images/medecines/illu-naturopathie.svg" alt="" aria-hidden="true" class="hidden xl:block absolute right-[-3%] top-[1484px] w-[35%] max-w-[605px] opacity-[0.08] pointer-events-none select-none" style="animation: none;" />

    <!-- Bandeau vert -->
    <div class="absolute inset-x-0 top-0 h-[640px] sm:h-[470px] bg-vert-600 overflow-hidden" aria-hidden="true">
      <img src="/images/footer/feuille-2.svg" alt="" class="hidden lg:block absolute left-[40%] top-[40px] w-[11%] opacity-60" style="animation: none;" />
      <img src="/images/footer/feuille-1.svg" alt="" class="hidden lg:block absolute left-[3.5%] top-[140px] w-[12.5%] opacity-60" style="animation: none;" />
      <img src="/images/footer/feuille-5.svg" alt="" class="hidden lg:block absolute right-0 top-[180px] w-[15%] opacity-60" style="animation: none;" />
    </div>

    <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pt-28 lg:pt-[130px]">
      <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-x-[68px]">
        <!-- Colonne principale : fil d'Ariane, identité, présentation -->
        <div class="min-w-0">
          <nav aria-label="Fil d'Ariane" class="inline-flex flex-wrap items-center bg-white rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-900">
            <NuxtLink to="/trouver-un-praticien" class="hover:underline">Praticiens</NuxtLink>
            <template v-if="mainSpeciality">
              <span aria-hidden="true" class="mx-1.5">›</span>
              <NuxtLink :to="{ path: '/trouver-un-praticien', query: { specialite: mainSpeciality.slug }, hash: '#resultats' }" class="hover:underline">{{ mainSpeciality.name }}</NuxtLink>
            </template>
            <template v-if="praticien.city">
              <span aria-hidden="true" class="mx-1.5">›</span>
              <NuxtLink :to="{ path: '/trouver-un-praticien', query: { q: praticien.city }, hash: '#resultats' }" class="hover:underline">{{ praticien.city }}</NuxtLink>
            </template>
          </nav>

          <!-- Identité -->
          <header class="relative mt-8 lg:mt-[53px] flex flex-col sm:flex-row sm:items-start gap-6 lg:gap-[26px]">
            <div class="relative shrink-0 w-[200px] sm:w-[254px] sm:mt-[30px]">
              <div class="-rotate-[4deg] w-full aspect-[254/292] rounded-[32px] border-8 border-bleu-50 shadow-douce overflow-hidden bg-vert-900">
                <img v-if="photo && !photoFailed" ref="photoEl" :src="photo" :alt="`Photo de ${fullName}`" width="254" height="292" referrerpolicy="no-referrer" class="w-full h-full object-cover" style="animation: none;" @error="photoFailed = true" />
                <span v-else class="w-full h-full flex items-center justify-center text-white font-unbounded text-[56px]" aria-hidden="true">{{ initials }}</span>
              </div>
              <!-- Note Google (lue en direct) -->
              <div v-if="google" class="absolute -left-4 sm:-left-4 xl:-left-10 -top-6 sm:top-[-10px] -rotate-[8deg] flex items-center gap-4 bg-white rounded-[20px] shadow-douce px-5 py-4">
                <span class="font-unbounded text-[28px] sm:text-[32px] leading-none text-vert-900">{{ googleRating }}</span>
                <span class="flex flex-col gap-1">
                  <span class="text-[18px] leading-none text-jaune-400" aria-hidden="true">★★★★★</span>
                  <span class="text-[14px] sm:text-[16px] leading-none text-neutre-600 whitespace-nowrap">{{ google.userRatingCount }} avis · Google Maps</span>
                </span>
              </div>
            </div>

            <div class="min-w-0 sm:pt-4">
              <h1 class="font-unbounded font-normal text-white text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.23] break-words">{{ fullName }}</h1>
              <p v-if="mainSpeciality" class="mt-5 lg:mt-[25px] inline-flex items-center gap-[14px] bg-white rounded-full pl-2 pr-6 py-2">
                <span class="w-[52px] h-[52px] shrink-0 rounded-full bg-bleu-100 flex items-center justify-center">
                  <img v-if="pictogram" :src="pictogram" alt="" width="25" height="28" class="max-w-[28px] max-h-[28px] w-auto h-auto" style="animation: none;" />
                  <Leaf v-else :size="22" class="text-vert-600" aria-hidden="true" />
                </span>
                <span class="font-unbounded text-[20px] lg:text-[26px] leading-[normal] text-vert-900">{{ mainSpeciality.name }}</span>
              </p>
              <p class="mt-4 flex items-center gap-2 text-[17px] lg:text-[20px] text-white leading-[normal]">
                <MapPin :size="18" class="shrink-0" aria-hidden="true" />
                <span>{{ praticien.city }}<template v-if="modesLabel"> · {{ modesLabel }}</template></span>
              </p>
            </div>
          </header>

          <!-- Présentation -->
          <section v-if="about" class="mt-12 lg:mt-[36px]" aria-labelledby="about-title">
            <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-1.5 leading-[normal]">En bref</p>
            <h2 id="about-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900 flex flex-wrap items-center gap-x-[14px] gap-y-2">
              Ce que fait <span class="bg-corail-100 text-corail-700 rounded-full px-4 pt-0.5 pb-1.5">{{ praticien.firstName }}</span>
            </h2>
            <p class="mt-4 lg:mt-3.5 text-[18px] lg:text-[24px] leading-snug text-neutre-600 max-w-[820px] whitespace-pre-line">{{ about }}</p>
          </section>
        </div>

        <!-- Colonne latérale : réservation, ou information pour une fiche non réclamée -->
        <aside class="mt-10 xl:mt-[110px] xl:self-start xl:row-span-2 min-w-0 max-w-[560px] xl:max-w-none" aria-label="Réservation">
          <section v-if="bookable" id="reservation" class="bg-white rounded-[32px] shadow-[0_12px_16px_rgba(1,40,40,0.08)] p-6 sm:p-7 scroll-mt-28" aria-labelledby="booking-title">
            <AppointmentBooking :praticien="praticien" :types="types" :from-price="fromPrice" />
          </section>
          <section v-else class="bg-white rounded-[32px] shadow-[0_12px_16px_rgba(1,40,40,0.08)] p-6 sm:p-7" aria-labelledby="unclaimed-title">
            <h2 id="unclaimed-title" class="font-unbounded font-normal text-[20px] text-vert-900">Réservation indisponible</h2>
            <div class="mt-4">
              <ClaimListing :praticien="praticien" />
            </div>
            <a v-if="praticien.phoneNumber" :href="`tel:${praticien.phoneNumber}`" class="mt-5 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
              Appeler le cabinet
              <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><Phone :size="18" aria-hidden="true" /></span>
            </a>
          </section>
        </aside>
      </div>

      <!-- Repères -->
      <ul v-if="highlights.length" class="mt-12 lg:mt-[40px] flex flex-wrap gap-4 lg:gap-6" aria-label="Repères">
        <li v-for="(h, i) in highlights" :key="h.label" class="flex items-center gap-3 bg-white rounded-[20px] shadow-douce pl-3 pr-[22px] py-3" :class="['rotate-[3deg]', '-rotate-[3deg]', 'rotate-[2deg]'][i % 3]">
          <span class="w-10 h-10 rounded-full bg-corail-100 text-corail-500 flex items-center justify-center shrink-0"><component :is="h.icon" :size="18" aria-hidden="true" /></span>
          <span class="text-[16px] lg:text-[18px] font-semibold text-vert-900 leading-[normal]">{{ h.label }}</span>
        </li>
      </ul>

      <!-- En pratique -->
      <section v-if="hasPracticalBlocks" class="mt-14 lg:mt-[40px]" aria-labelledby="practical-title">
        <h2 id="practical-title" class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] lg:leading-none text-vert-900">En pratique</h2>

        <div class="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- La discipline -->
          <div v-if="medicine" class="relative overflow-hidden bg-vert-600 rounded-[28px] px-7 lg:px-8 py-[30px] lg:min-h-[300px] flex flex-col items-start gap-4" :class="publicChips.length || infoChips.length ? '' : 'lg:col-span-2'">
            <img :src="pictogram" alt="" aria-hidden="true" class="hidden sm:block absolute right-6 top-8 w-[240px] h-auto opacity-[0.16]" style="animation: none; filter: brightness(0) invert(1);" />
            <p class="relative text-[14px] font-medium uppercase tracking-[0.08em] text-bleu-100 leading-[normal]">La discipline</p>
            <p class="relative font-unbounded text-[22px] lg:text-[26px] leading-[normal] text-white">{{ capitalize(medicine.nameWithArticle) }}</p>
            <p class="relative text-[17px] lg:text-[18px] leading-[normal] text-bleu-100 max-w-[400px]">{{ medicine.shortDescription }}.</p>
            <NuxtLink :to="`/medecines/${medicine.slug}`" class="relative inline-flex items-center gap-[14px] min-h-[48px] bg-white text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
              Découvrir {{ medicine.nameWithArticle }}
              <span class="w-10 h-10 rounded-full bg-vert-900 flex items-center justify-center text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
            </NuxtLink>
          </div>

          <!-- Pour qui -->
          <div v-if="publicChips.length || infoChips.length" class="bg-white rounded-[28px] px-7 lg:px-8 py-[30px] lg:min-h-[300px]" :class="medicine ? '' : 'lg:col-span-2'">
            <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px] leading-[normal] text-vert-900">Pour qui ?</h3>
            <ul v-if="publicChips.length" class="mt-5 flex flex-wrap gap-2" aria-label="Public accueilli">
              <li v-for="c in publicChips" :key="c" class="bg-bleu-50 text-vert-900 text-[16px] font-medium rounded-full px-4 py-[9px] leading-[normal]">{{ c }}</li>
            </ul>
            <ul v-if="infoChips.length" class="mt-4 flex flex-wrap gap-2" aria-label="Informations">
              <li v-for="c in infoChips" :key="c.label" class="inline-flex items-center gap-2 border border-bleu-100 text-vert-900 text-[16px] rounded-full pl-3 pr-4 py-[9px] leading-[normal]">
                <component :is="c.icon" :size="14" class="text-vert-600" aria-hidden="true" /> {{ c.label }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="modeRows.length || types.length || diplomas.length" class="mt-4 grid grid-cols-1 lg:grid-cols-[320fr_480fr_496fr] gap-4">
          <!-- Modalités -->
          <div v-if="modeRows.length" class="bg-bleu-300 rounded-[28px] px-7 lg:px-8 py-[30px]">
            <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px] leading-[normal] text-vert-900">Modalités</h3>
            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="m in modeRows" :key="m.label" class="flex items-center gap-[10px] text-[18px] leading-[normal]" :class="m.on ? 'text-vert-900' : 'text-vert-900/60'">
                <span class="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0" :class="m.on ? 'bg-vert-900 text-white' : 'bg-white text-vert-900'"><Check v-if="m.on" :size="12" aria-hidden="true" /><X v-else :size="12" aria-hidden="true" /></span>
                {{ m.label }}
              </li>
            </ul>
          </div>

          <!-- Tarifs -->
          <div v-if="types.length || reimbursement" class="bg-white rounded-[28px] px-7 lg:px-8 py-[30px]">
            <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px] leading-[normal] text-vert-900">Tarifs</h3>
            <ul v-if="types.length" class="mt-4 flex flex-col gap-3">
              <li v-for="(t, i) in types" :key="t.id" class="flex items-center gap-3 rounded-full px-[14px] py-2 text-[18px] leading-[normal] text-vert-900" :class="i === 0 ? 'bg-corail-100' : ''">
                <span class="flex-1 min-w-0 truncate">{{ t.name }}</span>
                <span v-if="t.durationMin" class="text-[16px] text-neutre-600 whitespace-nowrap">{{ durationLabel(t.durationMin) }}</span>
                <span v-if="t.price != null" class="font-semibold whitespace-nowrap" :class="i === 0 ? 'text-corail-700' : 'text-vert-600'">{{ t.price }} €</span>
              </li>
            </ul>
            <p v-if="reimbursement" class="mt-4 text-[16px] leading-snug text-neutre-600">{{ reimbursement }}</p>
          </div>

          <!-- Diplômes -->
          <div v-if="diplomas.length" class="bg-vert-600 rounded-[28px] px-7 lg:px-8 py-[30px]">
            <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px] leading-[normal] text-white">Formation et diplômes</h3>
            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="d in diplomas" :key="d.id ?? d.title" class="flex items-start gap-3 text-white leading-[normal]">
                <span class="w-[26px] h-[26px] rounded-full bg-white text-vert-900 flex items-center justify-center shrink-0 mt-1"><Check :size="12" aria-hidden="true" /></span>
                <span>
                  <span class="block text-[17px] lg:text-[18px]">{{ d.title }}</span>
                  <span v-if="d.organization || d.year" class="block text-[16px] text-bleu-100">{{ [d.organization, d.year].filter(Boolean).join(' · ') }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Venir au cabinet -->
      <section class="mt-16 lg:mt-[120px]" aria-labelledby="where-title">
        <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-3 leading-[normal]">Infos pratiques</p>
        <h2 id="where-title" class="font-unbounded font-normal text-[28px] lg:text-[40px] leading-[1.2] lg:leading-none text-vert-900">Venir au cabinet</h2>

        <div class="mt-8 lg:mt-[50px] grid grid-cols-1 lg:grid-cols-[minmax(0,900px)_minmax(0,1fr)] gap-8 lg:gap-12">
          <!-- Adresse -->
          <div class="relative overflow-hidden rounded-leya-m bg-bleu-100 min-h-[300px] lg:min-h-[480px]">
            <span class="absolute left-1/2 top-[34%] -translate-x-1/2 w-16 h-16 rounded-full bg-white shadow-douce flex items-center justify-center text-corail-500" aria-hidden="true"><MapPin :size="26" /></span>
            <div class="absolute left-4 right-4 bottom-4 lg:left-8 lg:bottom-8 lg:max-w-[524px] bg-white rounded-[20px] shadow-douce p-5 lg:p-6">
              <div class="flex items-start gap-3">
                <span class="w-10 h-10 rounded-full bg-bleu-50 text-vert-600 flex items-center justify-center shrink-0"><MapPin :size="18" aria-hidden="true" /></span>
                <span class="text-[17px] lg:text-[18px] leading-snug text-vert-900">
                  <address class="not-italic font-medium">{{ praticien.address }}<template v-if="praticien.address">, </template>{{ formatPostalCode(praticien.postalCode) }} {{ praticien.city }}</address>
                  <span v-if="praticien.addressComplement" class="block text-neutre-600 text-[16px]">{{ praticien.addressComplement }}</span>
                </span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2.5">
                <a :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[16px] rounded-full pl-5 pr-1 py-1 hover:shadow-douce transition-shadow">
                  Ouvrir dans Google Maps
                  <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="18" aria-hidden="true" /></span>
                </a>
                <a :href="directionsUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-[10px] min-h-[48px] border-[1.5px] border-vert-900 text-vert-900 font-semibold text-[16px] rounded-full pl-5 pr-4 py-1 hover:bg-bleu-50 transition-colors">
                  Itinéraire <Navigation :size="16" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <!-- Horaires et contact -->
          <div class="min-w-0">
            <template v-if="hasHours">
              <h3 class="font-unbounded font-normal text-[20px] lg:text-[22px] leading-[normal] text-vert-900">Horaires</h3>
              <ul class="mt-4 flex flex-col gap-[7px]">
                <li v-for="d in DAYS" :key="d.n" class="flex items-center gap-4 rounded-full px-4 py-2 text-[17px] lg:text-[18px] leading-[normal]" :class="d.n === todayN ? 'bg-vert-900 text-white' : 'text-vert-900'">
                  <span class="flex-1">{{ d.label }}<template v-if="d.n === todayN"> · aujourd’hui</template></span>
                  <span v-if="!week[d.n].length" :class="d.n === todayN ? 'text-white/70' : 'text-neutre-600'">Fermé</span>
                  <span v-else class="flex flex-wrap justify-end gap-x-3"><span v-for="r in week[d.n]" :key="r.start" class="whitespace-nowrap">{{ hourLabel(r.start) }} – {{ hourLabel(r.end) }}</span></span>
                </li>
              </ul>
              <p v-if="openNow" class="mt-4 inline-flex items-center gap-2 bg-white text-vert-900 text-[16px] font-medium rounded-full pl-3 pr-4 py-[9px] leading-[normal]"><Clock :size="14" class="text-vert-600" aria-hidden="true" /> {{ openNow }}</p>
            </template>
            <p v-else-if="praticien.schedules" class="text-[17px] text-vert-900 whitespace-pre-line">{{ praticien.schedules }}</p>

            <ul v-if="contactLinks.length" class="flex flex-wrap gap-2" :class="hasHours || praticien.schedules ? 'mt-6' : ''" aria-label="Contact">
              <li v-for="l in contactLinks" :key="l.label">
                <a :href="l.href" :target="l.external ? '_blank' : undefined" :rel="l.external ? 'noopener noreferrer nofollow' : undefined" class="inline-flex items-center gap-2 bg-white text-vert-900 text-[16px] font-medium rounded-full pl-3 pr-4 py-[9px] leading-[normal] hover:bg-white/70 transition-colors">
                  <component :is="l.icon" :size="14" class="text-vert-600" aria-hidden="true" /> {{ l.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- Avis Google (note lue en direct, sans les textes des avis) -->
    <section v-if="google" class="relative mt-16 lg:mt-[110px] bg-vert-600 overflow-hidden py-14 lg:py-[84px]" aria-labelledby="reviews-title">
      <img src="/images/footer/feuille-1.svg" alt="" aria-hidden="true" class="hidden lg:block absolute left-[3%] top-[40px] w-[11%] opacity-50" style="animation: none;" />
      <img src="/images/footer/feuille-5.svg" alt="" aria-hidden="true" class="hidden lg:block absolute right-[4%] bottom-[20px] w-[12%] opacity-50" style="animation: none;" />
      <div class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px]">
        <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-bleu-100 leading-[normal]">Avis Google</p>
        <h2 id="reviews-title" class="sr-only">Avis Google</h2>
        <div class="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p class="font-unbounded text-[56px] lg:text-[72px] leading-none text-white">{{ googleRating }}</p>
          <div class="flex flex-col gap-2">
            <p class="text-[24px] leading-none text-jaune-400" aria-hidden="true">★★★★★</p>
            <p class="text-[17px] lg:text-[20px] text-bleu-100 leading-[normal]">{{ google.userRatingCount }} avis sur Google Maps</p>
          </div>
        </div>
        <a v-if="google.googleMapsUri" :href="google.googleMapsUri" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-white text-vert-900 font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
          Voir les avis sur Google Maps
          <span class="w-10 h-10 rounded-full bg-vert-900 flex items-center justify-center text-white"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </a>
        <p class="mt-6 text-[14px] text-bleu-100/80 leading-snug">Note et nombre d’avis fournis par Google Maps, mis à jour à chaque affichage. Léya ne modifie pas ces avis.</p>
      </div>
    </section>

    <!-- La discipline en bref -->
    <section v-if="medicine" class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] pt-16 lg:pt-[110px] pb-20 lg:pb-[140px]" aria-labelledby="discipline-title">
      <div class="grid grid-cols-1 lg:grid-cols-[620px_1fr] gap-10 lg:gap-[88px] items-center">
        <div class="discipline-mask aspect-[620/460] w-full max-w-[620px]">
          <NuxtImg :src="medicine.heroImage" :alt="`${medicine.name} : séance avec un praticien`" class="w-full h-full object-cover" width="1240" height="920" format="webp" quality="75" sizes="xs:100vw lg:620px" loading="lazy" />
        </div>
        <div>
          <p class="text-[14px] font-medium uppercase tracking-[0.08em] text-vert-600 mb-4 leading-[normal]">La discipline</p>
          <h2 id="discipline-title" class="font-unbounded font-normal text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-vert-900 flex flex-wrap items-center gap-x-[14px] gap-y-2">
            {{ capitalize(medicine.nameWithArticle) }}, <span class="bg-corail-100 text-corail-700 rounded-full px-4 pt-0.5 pb-1.5">en bref</span>
          </h2>
          <p class="mt-6 text-[17px] lg:text-[20px] leading-snug text-neutre-600 max-w-[620px]">{{ medicine.definitionText?.[0] ?? `${medicine.shortDescription}.` }}</p>
          <ul v-if="medicine.conditions?.length" class="mt-7 flex flex-wrap gap-2" aria-label="Motifs de consultation fréquents">
            <li v-for="c in medicine.conditions.slice(0, 3)" :key="c" class="bg-white text-vert-900 text-[16px] font-medium rounded-full px-4 py-[9px] leading-[normal]">{{ c }}</li>
          </ul>
          <NuxtLink :to="`/medecines/${medicine.slug}`" class="mt-8 inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
            Voir la fiche {{ medicine.name.toLowerCase() }}
            <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
          </NuxtLink>
        </div>
      </div>
      <p class="mt-14 text-[14px] text-neutre-600/80 leading-relaxed max-w-[820px]">
        Fiche professionnelle. Ce praticien exerce sous sa propre responsabilité ; Léya n’est pas partie à la relation de soin et ne remplace pas un avis médical.
        <NuxtLink to="/cgu" class="underline">En savoir plus</NuxtLink>
      </p>
    </section>
    <p v-else class="relative mx-auto w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1328px] mt-14 pb-20 text-[14px] text-neutre-600/80 leading-relaxed">
      Fiche professionnelle. Ce praticien exerce sous sa propre responsabilité ; Léya n’est pas partie à la relation de soin et ne remplace pas un avis médical.
      <NuxtLink to="/cgu" class="underline">En savoir plus</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MapPin, Phone, Navigation, Globe, Star, Check, Clock, Leaf, ArrowUpRight, X, Languages, CreditCard, Accessibility } from 'lucide-vue-next'
import { getMedecineBySlug, medecinePictogram } from '~/data/medecines'

const route = useRoute()
// L'adresse publique est le slug. Les anciennes adresses numériques (/praticiens/12) redirigent vers elle.
const param = String(route.params.slug)
const legacyId = /^\d+$/.test(param)
if (!legacyId && !/^[a-z0-9-]{1,120}$/.test(param)) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}

const { data: praticien, error } = await useAsyncData(`praticien-${param}`, () =>
  $fetch(legacyId ? `/api/backend/praticiens/${param}` : `/api/backend/praticiens/slug/${param}`),
)
if (error.value || !praticien.value) {
  throw createError({ statusCode: 404, statusMessage: 'Praticien introuvable', fatal: true })
}
if (legacyId && praticien.value.slug) {
  await navigateTo({ path: `/praticiens/${praticien.value.slug}`, query: route.query }, { redirectCode: 301, replace: true })
}
const id = praticien.value.id

// Les fiches non revendiquées n'ont ni prestations ni créneaux : on ne les interroge pas.
const bookable = computed(() => praticien.value.bookable !== false)

const { data: rawTypes } = await useAsyncData(`praticien-${id}-types`, () =>
  bookable.value ? $fetch(`/api/backend/praticiens/${id}/consultation-types`).catch(() => []) : [],
)
const types = computed(() => normalizeTypes(rawTypes.value))
const fromPrice = computed(() => {
  const prices = types.value.map(t => t.price).filter(p => p != null)
  return prices.length ? Math.min(...prices) : (praticien.value.priceFrom ?? praticien.value.price ?? null)
})

const { data: rawHours } = await useAsyncData(`praticien-${id}-hours`, () =>
  bookable.value ? $fetch(`/api/backend/praticiens/${id}/availabilities`).catch(() => []) : [],
)
const week = computed(() => weekFromServer(rawHours.value))
const hasHours = computed(() => Array.isArray(rawHours.value) && rawHours.value.length > 0)
const todayN = computed(() => { const d = new Date(`${todayKey()}T12:00:00Z`).getUTCDay(); return d === 0 ? 7 : d })
const hourLabel = (hhmm) => { const [h, m] = hhmm.split(':'); return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}` }

// « Ouvert maintenant · ferme à 18h » : calculé côté navigateur (dépend de l'heure), une fois la page hydratée
const openNow = ref('')
onNuxtReady(() => {
  const now = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS_TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  const range = (week.value[todayN.value] ?? []).find(r => r.start <= now && now < r.end)
  if (range) openNow.value = `Ouvert maintenant · ferme à ${hourLabel(range.end)}`
})

const fullName = computed(() => `${praticien.value.firstName} ${praticien.value.lastName}`)
const initials = computed(() => `${(praticien.value.firstName || '?')[0]}${(praticien.value.lastName || '')[0] || ''}`.toUpperCase())
// Texte de présentation : affiché dès que l'API le fournira.
const about = computed(() => praticien.value.bio ?? praticien.value.description ?? praticien.value.about ?? praticien.value.presentation ?? '')
// Site web : uniquement http(s), sinon on ne l'affiche pas
const safeWebsite = computed(() => { try { const u = new URL(praticien.value.website); return ['http:', 'https:'].includes(u.protocol) ? u.href : '' } catch { return '' } })
const addressLine = computed(() => `${praticien.value.address}, ${formatPostalCode(praticien.value.postalCode)} ${praticien.value.city}`)
const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine.value)}`)
const directionsUrl = computed(() => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine.value)}`)

// Spécialité principale et médecine correspondante (page /medecines)
const mainSpeciality = computed(() => praticien.value.specialities?.[0] ?? null)
const medicine = computed(() => getMedecineBySlug(mainSpeciality.value?.slug ?? ''))
const pictogram = computed(() => (medicine.value ? medecinePictogram(medicine.value) : ''))
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// --- Informations facultatives de la fiche : on n'affiche que ce que l'API fournit
const isHttps = (value) => { try { return new URL(value).protocol === 'https:' } catch { return false } }
const photo = computed(() => (isHttps(praticien.value.photoUrl) ? praticien.value.photoUrl : ''))
const photoFailed = ref(false)
const photoEl = ref(null)
// L'erreur de chargement peut survenir avant l'hydratation (rendu serveur) : on la revérifie au montage.
onNuxtReady(() => { const el = photoEl.value; if (el?.complete && el.naturalWidth === 0) photoFailed.value = true })

const diplomas = computed(() => (Array.isArray(praticien.value.diplomas) ? praticien.value.diplomas.filter(d => d?.title) : []))
const experience = computed(() => {
  const year = Number(praticien.value.practicingSince)
  return Number.isInteger(year) && year >= 1950 && year <= new Date().getFullYear() ? year : null
})

// Note Google : lue une seule fois par affichage, côté navigateur (jamais stockée ni mise en cache).
// Chaque lecture est facturée par Google ; en cas d'erreur (pas de fiche liée, Google injoignable), rien n'est affiché.
const google = ref(null)
onNuxtReady(async () => {
  if (!praticien.value.hasGoogleRating) return
  try {
    const result = await $fetch(`/api/backend/praticiens/${id}/google-rating`)
    if (typeof result?.rating === 'number' && result.userRatingCount > 0) google.value = result
  } catch { /* rien à afficher */ }
})
const googleRating = computed(() => google.value?.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }))

// Modes de consultation (d'après les prestations)
const hasMode = (m) => types.value.some(t => (t.mode ?? 'cabinet') === m)
const modesLabel = computed(() => {
  const labels = []
  if (hasMode('cabinet')) labels.push('Cabinet')
  if (hasMode('visio')) labels.push('visio')
  return labels.length === 2 ? 'Cabinet et visio' : labels[0] ?? ''
})
const modeRows = computed(() => (types.value.length
  ? [{ label: 'Au cabinet', on: hasMode('cabinet') }, { label: 'En visio', on: hasMode('visio') }]
  : []))
const durationLabel = (min) => (min >= 60 && min % 60 === 0 ? `${min / 60} h` : `${min} min`)

const PAYMENTS = PAYMENT_LABELS
const PUBLICS = PUBLIC_LABELS
const languageName = (code) => {
  try { const name = new Intl.DisplayNames(['fr'], { type: 'language' }).of(code); return name ? name.charAt(0).toUpperCase() + name.slice(1) : code } catch { return code }
}
const publicChips = computed(() => (Array.isArray(praticien.value.publicTypes) ? praticien.value.publicTypes.map(v => PUBLICS[v]).filter(Boolean) : []))
const infoChips = computed(() => {
  const p = praticien.value
  const out = []
  for (const code of Array.isArray(p.languages) ? p.languages : []) out.push({ label: languageName(code), icon: Languages })
  for (const m of Array.isArray(p.paymentMethods) ? p.paymentMethods : []) if (PAYMENTS[m]) out.push({ label: PAYMENTS[m], icon: CreditCard })
  if (p.wheelchairAccessible === true) out.push({ label: 'Accessible PMR', icon: Accessibility })
  return out
})
const reimbursement = computed(() => (typeof praticien.value.reimbursementInfo === 'string' ? praticien.value.reimbursementInfo.trim() : ''))
const hasPracticalBlocks = computed(() => !!medicine.value || publicChips.value.length > 0 || infoChips.value.length > 0 || types.value.length > 0 || diplomas.value.length > 0)

const highlights = computed(() => {
  const out = []
  if (experience.value) out.push({ label: `Exerce depuis ${experience.value}`, icon: Check })
  if (google.value) out.push({ label: `${googleRating.value} · ${google.value.userRatingCount} avis Google`, icon: Star })
  if (praticien.value.isVerified) out.push({ label: 'Profil vérifié', icon: Check })
  return out
})

const SOCIAL = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok' }
const socialLinks = computed(() => Object.entries(SOCIAL)
  .map(([key, label]) => ({ label, href: praticien.value.socialLinks?.[key] }))
  .filter(l => isHttps(l.href)))
const contactLinks = computed(() => [
  ...(praticien.value.phoneNumber ? [{ label: praticien.value.phoneNumber, href: `tel:${praticien.value.phoneNumber}`, icon: Phone }] : []),
  ...(safeWebsite.value ? [{ label: 'Site web', href: safeWebsite.value, icon: Globe, external: true }] : []),
  ...socialLinks.value.map(l => ({ label: l.label, href: l.href, icon: Globe, external: true })),
])

// Indexation : uniquement les fiches revendiquées et suffisamment renseignées (voir shared/utils/praticien.ts).
// Les autres restent en noindex : fiches nominatives non revendiquées ou pages trop pauvres.
const indexable = computed(() => isIndexablePraticien(praticien.value))
const canonicalUrl = computed(() => `https://leya-sante.fr/praticiens/${praticien.value.slug ?? id}`)

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: indexable.value ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd()) }] : [],
}))

function jsonLd() {
  const p = praticien.value
  const business = {
    '@type': 'MedicalBusiness',
    '@id': `${canonicalUrl.value}#praticien`,
    name: fullName.value,
    url: canonicalUrl.value,
    address: { '@type': 'PostalAddress', streetAddress: p.address, postalCode: formatPostalCode(p.postalCode), addressLocality: p.city, addressCountry: 'FR' },
    ...(p.phoneNumber ? { telephone: p.phoneNumber } : {}),
    ...(([safeWebsite.value, ...socialLinks.value.map(l => l.href)].filter(Boolean)).length ? { sameAs: [safeWebsite.value, ...socialLinks.value.map(l => l.href)].filter(Boolean) } : {}),
    ...(Array.isArray(p.paymentMethods) && p.paymentMethods.length ? { paymentAccepted: p.paymentMethods.map(m => PAYMENTS[m]).filter(Boolean).join(', ') } : {}),
    ...(p.photoUrl ? { image: p.photoUrl } : {}),
    ...(p.bio ? { description: p.bio } : {}),
    ...(p.specialities?.length ? { knowsAbout: p.specialities.map(s => s.name) } : {}),
    ...(p.latitude != null && p.longitude != null ? { geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude } } : {}),
    ...(p.averageRating && p.reviewCount > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.averageRating, reviewCount: p.reviewCount } } : {}),
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://leya-sante.fr' },
          { '@type': 'ListItem', position: 2, name: 'Trouver un praticien', item: 'https://leya-sante.fr/trouver-un-praticien' },
          { '@type': 'ListItem', position: 3, name: fullName.value, item: canonicalUrl.value },
        ],
      },
    ],
  }
}

useSeoMeta({
  title: () => bookable.value ? `${fullName.value} — Prendre rendez-vous | Léya` : `${fullName.value} — ${praticien.value.city} | Léya`,
  description: () => bookable.value
    ? `Prenez rendez-vous en ligne avec ${fullName.value} à ${praticien.value.city}.`
    : `Fiche de ${fullName.value}, ${praticien.value.city}.`,
  robots: () => indexable.value ? 'index, follow' : 'noindex, nofollow',
})
</script>

<style scoped>
/* Photo à la forme découpée de la maquette (le canal alpha de l'image sert de masque) */
.discipline-mask {
  -webkit-mask: url('/images/medecines/masque-discipline.webp') center / 100% 100% no-repeat;
  mask: url('/images/medecines/masque-discipline.webp') center / 100% 100% no-repeat;
}
</style>
