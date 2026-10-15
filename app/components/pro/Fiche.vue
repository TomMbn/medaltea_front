<template>
  <div>
    <p v-if="loadError" class="text-[16px] text-red-700 bg-red-50 rounded-[16px] p-3" role="alert">
      Impossible de charger votre fiche pour le moment. Réessayez dans un instant.
    </p>
    <p v-else-if="!form" class="text-[16px] text-neutre-600" role="status">Chargement de votre fiche…</p>

    <template v-else>
      <p v-if="unlocated" class="text-[16px] bg-amber-50 border border-amber-300 text-amber-900 rounded-[16px] px-4 py-3 mb-5" role="status">
        Votre adresse n'est pas localisée : votre fiche fonctionne normalement mais n'apparaît pas dans la recherche « autour de moi ».
        <button type="button" class="underline font-semibold" @click="toggle('cabinet', true)">Recherchez votre adresse</button> pour la localiser.
      </p>

      <!-- État de la fiche -->
      <div class="mt-[22px] flex flex-wrap gap-3">
        <span v-if="fiche.isVerified" class="inline-flex items-center gap-2 rounded-full bg-white pl-3 pr-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-600"><Check :size="14" aria-hidden="true" /> Fiche vérifiée</span>
        <span class="rounded-full bg-corail-100 px-4 py-[9px] text-[16px] font-medium leading-[normal] text-corail-700">Complétée à {{ percent }} %</span>
      </div>

      <div class="mt-6 grid grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,620fr)_minmax(0,724fr)] gap-6 items-start">
        <!-- Sections à renseigner -->
        <div class="flex flex-col gap-[10px]">
          <form id="fiche-form" class="hidden" novalidate @submit.prevent="save"></form>

        <!-- Identité et photo -->
        <div id="identite" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'identite'" aria-controls="panel-identite" @click="toggle('identite')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.identite ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.identite" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Identité et photo</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.identite ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.identite ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'identite' ? 'Fermer' : done.identite ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'identite'" id="panel-identite" class="px-5 pb-6 pt-1">
            <ProPhotoUpload class="mb-5" :photo-url="fiche.photoUrl || ''" :first-name="form.firstName" :last-name="form.lastName" />
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="f-first" class="label">Prénom</label>
                <input id="f-first" v-model="form.firstName" maxlength="80" autocomplete="given-name" class="field" :aria-invalid="!!errors.firstName" />
                <p v-if="errors.firstName" class="err" role="alert">{{ errors.firstName }}</p>
              </div>
              <div>
                <label for="f-last" class="label">Nom</label>
                <input id="f-last" v-model="form.lastName" maxlength="80" autocomplete="family-name" class="field" :aria-invalid="!!errors.lastName" />
                <p v-if="errors.lastName" class="err" role="alert">{{ errors.lastName }}</p>
              </div>
            </div>
            <div class="mt-4 max-w-[200px]">
              <label for="f-since" class="label">Exerce depuis (année)</label>
              <input id="f-since" v-model="form.practicingSince" inputmode="numeric" maxlength="4" class="field" :aria-invalid="!!errors.practicingSince" />
              <p v-if="errors.practicingSince" class="err" role="alert">{{ errors.practicingSince }}</p>
            </div>
          </div>
        </div>

        <!-- Spécialité et « Ce que je fais » -->
        <div id="presentation" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'presentation'" aria-controls="panel-presentation" @click="toggle('presentation')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.presentation ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.presentation" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Spécialité et « Ce que je fais »</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.presentation ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.presentation ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'presentation' ? 'Fermer' : done.presentation ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'presentation'" id="panel-presentation" class="px-5 pb-6 pt-1">
            <fieldset>
              <legend class="label">Spécialités</legend>
              <div class="flex flex-wrap gap-2">
                <label v-for="s in specialities" :key="s.id" class="chip" :class="form.specialityIds.includes(s.id) ? 'chip-on' : ''">
                  <input v-model="form.specialityIds" type="checkbox" :value="s.id" class="sr-only" />
                  {{ s.name }}
                </label>
              </div>
              <p v-if="errors.specialityIds" class="err" role="alert">{{ errors.specialityIds }}</p>
            </fieldset>
            <div class="mt-5">
              <label for="f-bio" class="label">Ce que je fais</label>
              <textarea id="f-bio" v-model="form.bio" rows="6" maxlength="2000" class="field" aria-describedby="f-bio-help" placeholder="Votre parcours, votre approche, ce qu'un patient peut attendre d'une séance…"></textarea>
              <p id="f-bio-help" class="help">
                {{ form.bio.length }} / 2000 caractères.
                <template v-if="form.bio.trim().length < 50">Une présentation d'au moins 50 caractères permet à votre fiche d'apparaître sur Google.</template>
                Ne promettez pas de guérison : décrivez votre pratique.
              </p>
            </div>
          </div>
        </div>

        <!-- Pour qui, pour quoi -->
        <div id="public" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'public'" aria-controls="panel-public" @click="toggle('public')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.public ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.public" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Pour qui, pour quoi</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.public ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.public ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'public' ? 'Fermer' : done.public ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'public'" id="panel-public" class="px-5 pb-6 pt-1">
            <fieldset>
              <legend class="label">Public accueilli</legend>
              <div class="flex flex-wrap gap-2">
                <label v-for="(label, key) in PUBLIC_LABELS" :key="key" class="chip" :class="form.publicTypes.includes(key) ? 'chip-on' : ''">
                  <input v-model="form.publicTypes" type="checkbox" :value="key" class="sr-only" /> {{ label }}
                </label>
              </div>
            </fieldset>
            <fieldset class="mt-5">
              <legend class="label">Langues parlées</legend>
              <div class="flex flex-wrap gap-2">
                <label v-for="code in languageOptions" :key="code" class="chip" :class="form.languages.includes(code) ? 'chip-on' : ''">
                  <input v-model="form.languages" type="checkbox" :value="code" class="sr-only" /> {{ languageName(code) }}
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <!-- Modalités et tarifs -->
        <div id="tarifs" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'tarifs'" aria-controls="panel-tarifs" @click="toggle('tarifs')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.tarifs ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.tarifs" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Modalités et tarifs</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.tarifs ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.tarifs ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'tarifs' ? 'Fermer' : done.tarifs ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'tarifs'" id="panel-tarifs" class="px-5 pb-6 pt-1">
            <p class="text-[16px] text-neutre-600 mb-4">Vos prestations (durée, lieu, prix) se gèrent dans <NuxtLink to="/pro/prestations" class="underline text-vert-900 font-semibold">Prestations</NuxtLink>. Ici, indiquez comment vos patients vous règlent.</p>
            <fieldset>
              <legend class="label">Moyens de paiement</legend>
              <div class="flex flex-wrap gap-2">
                <label v-for="(label, key) in PAYMENT_LABELS" :key="key" class="chip" :class="form.paymentMethods.includes(key) ? 'chip-on' : ''">
                  <input v-model="form.paymentMethods" type="checkbox" :value="key" class="sr-only" /> {{ label }}
                </label>
              </div>
            </fieldset>
            <div class="mt-5">
              <label for="f-reimb" class="label">Remboursement <span class="opt">(facultatif)</span></label>
              <textarea id="f-reimb" v-model="form.reimbursementInfo" rows="2" maxlength="500" class="field" placeholder="Ex. : remboursé par certaines mutuelles, feuille de soins sur demande"></textarea>
            </div>
          </div>
        </div>

        <!-- Diplômes -->
        <div id="formation" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'formation'" aria-controls="panel-formation" @click="toggle('formation')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.diplomes ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.diplomes" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Diplômes</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.diplomes ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.diplomes ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'formation' ? 'Fermer' : done.diplomes ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'formation'" id="panel-formation" class="px-5 pb-6 pt-1">
            <ul v-if="diplomas.length" class="grid gap-2 mb-5">
              <li v-for="d in diplomas" :key="d.id" class="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-bleu-100 px-4 py-3">
                <span class="text-[16px]">
                  <span class="font-semibold">{{ d.title }}</span><template v-if="d.organization"> — {{ d.organization }}</template><template v-if="d.year"> ({{ d.year }})</template>
                </span>
                <button type="button" class="text-[14px] px-4 min-h-[40px] rounded-full border border-neutre-300 hover:bg-bleu-50 disabled:opacity-50" :disabled="diplomaBusy" :aria-label="`Supprimer le diplôme ${d.title}`" @click="removeDiploma(d)">Supprimer</button>
              </li>
            </ul>
            <p v-else class="text-[16px] text-neutre-600 mb-5">Aucun diplôme renseigné.</p>

            <form class="grid gap-3 sm:grid-cols-6" novalidate @submit.prevent="addDiploma">
              <div class="sm:col-span-3">
                <label for="d-title" class="label">Intitulé</label>
                <input id="d-title" v-model="diploma.title" maxlength="150" class="field" />
              </div>
              <div class="sm:col-span-2">
                <label for="d-org" class="label">Organisme <span class="opt">(facultatif)</span></label>
                <input id="d-org" v-model="diploma.organization" maxlength="150" class="field" />
              </div>
              <div>
                <label for="d-year" class="label">Année</label>
                <input id="d-year" v-model="diploma.year" inputmode="numeric" maxlength="4" class="field" />
              </div>
              <div class="sm:col-span-6 flex flex-wrap items-center gap-3">
                <button type="submit" class="border border-vert-900 text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-900 hover:text-white transition-colors disabled:opacity-50" :disabled="diplomaBusy">Ajouter ce diplôme</button>
                <p v-if="diplomaError" class="text-[16px] text-red-700" role="alert">{{ diplomaError }}</p>
              </div>
            </form>

            <h3 class="mt-8 text-[16px] font-semibold">Identifiants professionnels</h3>
            <p class="help mb-4">Ces numéros ne sont jamais affichés sur votre fiche. Ils servent à vérifier votre identité.</p>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <label for="f-rpps" class="label">RPPS <span class="opt">(11 chiffres)</span></label>
                <input id="f-rpps" v-model="form.rpps" inputmode="numeric" maxlength="11" class="field" :aria-invalid="!!errors.rpps" />
                <p v-if="errors.rpps" class="err" role="alert">{{ errors.rpps }}</p>
              </div>
              <div>
                <label for="f-adeli" class="label">ADELI <span class="opt">(9 caractères)</span></label>
                <input id="f-adeli" v-model="form.adeli" maxlength="9" class="field" :aria-invalid="!!errors.adeli" />
                <p v-if="errors.adeli" class="err" role="alert">{{ errors.adeli }}</p>
              </div>
              <div>
                <label for="f-siret" class="label">SIRET <span class="opt">(14 chiffres)</span></label>
                <input id="f-siret" v-model="form.siret" inputmode="numeric" maxlength="14" class="field" :aria-invalid="!!errors.siret" />
                <p v-if="errors.siret" class="err" role="alert">{{ errors.siret }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Adresse et horaires -->
        <div id="cabinet" class="rounded-[20px] bg-white scroll-mt-24">
          <button type="button" class="w-full flex items-center gap-3 pl-5 pr-4 min-h-[69px] py-3 text-left" :aria-expanded="open === 'cabinet'" aria-controls="panel-cabinet" @click="toggle('cabinet')">
            <span class="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center" :class="done.cabinet ? 'bg-vert-600 text-white' : 'bg-corail-100 text-corail-700'" aria-hidden="true">
              <Check v-if="done.cabinet" :size="14" /><Info v-else :size="14" />
            </span>
            <span class="flex-1 min-w-0 text-[18px] font-semibold leading-[normal] text-vert-900">Adresse et horaires</span>
            <span class="hidden sm:inline-flex shrink-0 rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal]" :class="done.cabinet ? 'bg-bleu-50 text-vert-600' : 'bg-corail-100 text-corail-700'">{{ done.cabinet ? 'Complété' : 'À compléter' }}</span>
            <span class="shrink-0 inline-flex items-center gap-1 text-[16px] font-semibold text-vert-900">{{ open === 'cabinet' ? 'Fermer' : done.cabinet ? 'Modifier' : 'Compléter' }} <ArrowUpRight :size="16" aria-hidden="true" /></span>
          </button>
          <div v-show="open === 'cabinet'" id="panel-cabinet" class="px-5 pb-6 pt-1">
            <div class="grid gap-4">
              <div>
                <AddressSuggest id="f-search" v-model="addressSearch" label="Rechercher votre adresse" @select="pickAddress" />
                <p v-if="form.located" class="text-[14px] text-emerald-700 mt-1">✓ Adresse localisée.</p>
                <p v-else class="help">Choisissez une suggestion pour que votre fiche apparaisse dans la recherche « autour de moi ».</p>
              </div>
              <div>
                <label for="f-address" class="label">Adresse</label>
                <input id="f-address" v-model="form.address" maxlength="200" autocomplete="street-address" class="field" :aria-invalid="!!errors.address" @input="form.located = ''" />
                <p v-if="errors.address" class="err" role="alert">{{ errors.address }}</p>
              </div>
              <div>
                <label for="f-complement" class="label">Complément d'adresse <span class="opt">(facultatif)</span></label>
                <input id="f-complement" v-model="form.addressComplement" maxlength="200" class="field" />
              </div>
              <div class="grid gap-4 sm:grid-cols-3">
                <div>
                  <label for="f-postal" class="label">Code postal</label>
                  <input id="f-postal" v-model="form.postalCode" inputmode="numeric" maxlength="5" autocomplete="postal-code" class="field" :aria-invalid="!!errors.postalCode" @input="form.located = ''" />
                  <p v-if="errors.postalCode" class="err" role="alert">{{ errors.postalCode }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label for="f-city" class="label">Ville</label>
                  <input id="f-city" v-model="form.city" maxlength="100" autocomplete="address-level2" class="field" :aria-invalid="!!errors.city" @input="form.located = ''" />
                  <p v-if="errors.city" class="err" role="alert">{{ errors.city }}</p>
                </div>
              </div>
              <div>
                <p class="label">Accessibilité</p>
                <div class="flex flex-wrap gap-4 text-[16px]">
                  <label class="inline-flex items-center gap-2 min-h-[44px]"><input v-model="form.wheelchair" type="radio" value="yes" class="accent-vert-600" /> Accessible aux personnes à mobilité réduite</label>
                  <label class="inline-flex items-center gap-2 min-h-[44px]"><input v-model="form.wheelchair" type="radio" value="no" class="accent-vert-600" /> Non accessible</label>
                </div>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label for="f-phone" class="label">Téléphone</label>
                  <input id="f-phone" v-model="form.phoneNumber" inputmode="tel" maxlength="20" autocomplete="tel" class="field" :aria-invalid="!!errors.phoneNumber" />
                  <p v-if="errors.phoneNumber" class="err" role="alert">{{ errors.phoneNumber }}</p>
                </div>
                <div>
                  <label for="f-web" class="label">Site web</label>
                  <input id="f-web" v-model="form.website" type="url" maxlength="200" placeholder="https://" class="field" :aria-invalid="!!errors.website" />
                  <p v-if="errors.website" class="err" role="alert">{{ errors.website }}</p>
                </div>
                <div v-for="n in socials" :key="n.key">
                  <label :for="`f-${n.key}`" class="label">{{ n.label }}</label>
                  <input :id="`f-${n.key}`" v-model="form.social[n.key]" type="url" maxlength="200" placeholder="https://" class="field" :aria-invalid="!!errors[n.key]" />
                  <p v-if="errors[n.key]" class="err" role="alert">{{ errors[n.key] }}</p>
                </div>
              </div>
              <p class="text-[16px] text-neutre-600">Vos horaires d'ouverture se gèrent dans <NuxtLink to="/pro/horaires" class="underline text-vert-900 font-semibold">Horaires</NuxtLink>.</p>
            </div>
          </div>
        </div>

          <!-- Barre d'enregistrement -->
          <div class="sticky bottom-0 pb-2 pt-3 bg-gradient-to-t from-bleu-50 via-bleu-50 to-transparent">
            <div class="flex flex-wrap items-center gap-3 bg-white rounded-[16px] shadow-md px-4 py-3">
              <button type="submit" form="fiche-form" class="bg-vert-900 text-white text-[16px] font-semibold px-6 min-h-[44px] rounded-full hover:bg-vert-600 transition-colors disabled:opacity-50" :disabled="saving || !dirty">
                {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
              <p v-if="dirty && !saving" class="text-[14px] text-neutre-600">Modifications non enregistrées</p>
              <p v-if="saved" class="text-[16px] text-emerald-700" role="status">Fiche enregistrée.</p>
              <p v-if="saved && locateWarning" class="text-[16px] text-amber-800" role="status">{{ locateWarning }}</p>
              <p v-if="errorMessage" class="text-[16px] text-red-700" role="alert">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Aperçu de la fiche publique (dernière version enregistrée) -->
        <aside class="hidden xl:block rounded-[28px] bg-white p-5" aria-label="Aperçu de votre fiche publique">
          <h2 class="font-unbounded font-normal text-[18px] leading-[normal] text-vert-900">Aperçu en direct</h2>
          <p class="mt-1 text-[14px] text-neutre-600">Version enregistrée de votre fiche, telle que la voient les patients.</p>
          <div ref="previewBox" class="relative mt-4 h-[780px] overflow-hidden rounded-[20px] border border-bleu-100" aria-hidden="true">
            <iframe :key="previewKey" :src="previewSrc" title="Aperçu de la fiche publique" tabindex="-1" loading="lazy" class="absolute left-0 top-0 border-0 origin-top-left pointer-events-none" :style="{ width: '1728px', height: `${Math.round(780 / previewScale)}px`, transform: `scale(${previewScale})` }"></iframe>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Check, Info, ArrowUpRight } from 'lucide-vue-next'
import { onBeforeRouteLeave } from 'vue-router'

const { specialities } = await useSpecialities()
const { data: fiche, error: loadError, refresh } = await useAsyncData('pro-fiche', () => $fetch('/api/backend/praticiens/me'), { server: false })

// Sections repliables : une seule ouverte à la fois
const open = ref(null)
function toggle(id, force) {
  open.value = force ? id : open.value === id ? null : id
  if (open.value) nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}
// Les liens d'ancre (#presentation, #pratique, #cabinet, #formation) ouvrent la section correspondante
const ANCHORS = { presentation: 'presentation', pratique: 'public', cabinet: 'cabinet', formation: 'formation' }
onMounted(() => { const h = window.location.hash.slice(1); if (ANCHORS[h]) toggle(ANCHORS[h], true) })

const { hasTypes, hasHours, percent } = useProCompletion()

const socials = [
  { key: 'facebook', label: 'Facebook' }, { key: 'instagram', label: 'Instagram' }, { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' }, { key: 'tiktok', label: 'TikTok' },
]
const COMMON_LANGUAGES = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'nl', 'ru', 'zh']
const languageName = (code) => { try { const n = new Intl.DisplayNames(['fr'], { type: 'language' }).of(code); return n ? n.charAt(0).toUpperCase() + n.slice(1) : code } catch { return code } }
const languageOptions = computed(() => [...new Set([...COMMON_LANGUAGES, ...(form.value?.languages ?? [])])])

const toForm = (f) => ({
  firstName: f.firstName ?? '', lastName: f.lastName ?? '',
  specialityIds: (f.specialities ?? []).map(s => s.id),
  bio: f.bio ?? '', practicingSince: f.practicingSince ? String(f.practicingSince) : '',
  address: f.address ?? '', addressComplement: f.addressComplement ?? '', postalCode: f.postalCode ? String(f.postalCode).padStart(5, '0') : '', city: f.city ?? '',
  wheelchair: f.wheelchairAccessible === true ? 'yes' : f.wheelchairAccessible === false ? 'no' : '',
  phoneNumber: f.phoneNumber ?? '', website: f.website ?? '',
  social: Object.fromEntries(socials.map(s => [s.key, f.socialLinks?.[s.key] ?? ''])),
  publicTypes: [...(f.publicTypes ?? [])], languages: [...(f.languages ?? [])], paymentMethods: [...(f.paymentMethods ?? [])],
  reimbursementInfo: f.reimbursementInfo ?? '',
  rpps: f.rpps ?? '', adeli: f.adeli ?? '', siret: f.siret ?? '',
  // Coordonnées d'une suggestion choisie dans cette session (vide : aucune)
  located: '',
})

const form = ref(null)
const initial = ref('')
const addressSearch = ref('')
let pickedCoords = null
// Fiche sans coordonnées : absente de la recherche « autour de moi »
const unlocated = computed(() => !!fiche.value && (fiche.value.latitude == null || fiche.value.longitude == null))

function pickAddress(a) {
  form.value.address = a.street
  form.value.postalCode = String(a.postalCode)
  form.value.city = a.city
  const ok = Number.isFinite(a.latitude) && Number.isFinite(a.longitude)
  pickedCoords = ok ? { latitude: a.latitude, longitude: a.longitude } : null
  form.value.located = ok ? `${a.latitude},${a.longitude}` : ''
}
const snapshot = (value) => JSON.stringify(value, (k, v) => (Array.isArray(v) ? [...v].sort() : v))
watch(fiche, (f) => {
  if (!f) return
  form.value = reactive(toForm(f))
  initial.value = snapshot(form.value)
}, { immediate: true })

const dirty = computed(() => !!form.value && snapshot(form.value) !== initial.value)

const errors = reactive({})
const saving = ref(false)
const saved = ref(false)
const errorMessage = ref('')
const locateWarning = ref('')

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  const f = form.value
  const digits = (v) => String(v).replace(/[\s.]/g, '')
  if (!f.firstName.trim()) errors.firstName = 'Prénom requis.'
  if (!f.lastName.trim()) errors.lastName = 'Nom requis.'
  if (!f.specialityIds.length) errors.specialityIds = 'Choisissez au moins une spécialité.'
  if (f.practicingSince && !(/^\d{4}$/.test(f.practicingSince) && +f.practicingSince >= 1950 && +f.practicingSince <= new Date().getFullYear())) errors.practicingSince = 'Année invalide.'
  if (!f.address.trim()) errors.address = 'Adresse requise.'
  if (!/^\d{5}$/.test(f.postalCode)) errors.postalCode = 'Code postal à 5 chiffres.'
  if (!f.city.trim()) errors.city = 'Ville requise.'
  if (f.phoneNumber && !/^\+?\d{10,15}$/.test(digits(f.phoneNumber))) errors.phoneNumber = 'Numéro invalide (10 chiffres, ou format international).'
  if (f.website && !/^https?:\/\/\S+$/.test(f.website)) errors.website = 'Adresse invalide (http ou https).'
  for (const s of socials) if (f.social[s.key] && !/^https:\/\/\S+$/.test(f.social[s.key])) errors[s.key] = 'Lien invalide (https requis).'
  if (f.rpps && !/^\d{11}$/.test(f.rpps)) errors.rpps = '11 chiffres.'
  if (f.adeli && !/^[0-9A-Za-z]{9}$/.test(f.adeli)) errors.adeli = '9 caractères.'
  if (f.siret && !/^\d{14}$/.test(f.siret)) errors.siret = '14 chiffres.'
  return Object.keys(errors).length === 0
}

/** Seuls les champs modifiés sont envoyés. */
function changes() {
  const before = toForm(fiche.value)
  const now = form.value
  const out = {}
  const same = (a, b) => snapshot(a) === snapshot(b)
  for (const key of ['firstName', 'lastName', 'bio', 'address', 'addressComplement', 'postalCode', 'city', 'website', 'reimbursementInfo', 'rpps', 'adeli', 'siret']) {
    if (now[key].trim() !== String(before[key]).trim()) out[key] = now[key].trim()
  }
  if (now.phoneNumber !== before.phoneNumber) out.phoneNumber = now.phoneNumber.replace(/[\s.]/g, '')
  if (now.practicingSince !== before.practicingSince && now.practicingSince) out.practicingSince = Number(now.practicingSince)
  for (const key of ['specialityIds', 'publicTypes', 'languages', 'paymentMethods']) if (!same(now[key], before[key])) out[key] = [...now[key]]
  if (now.wheelchair !== before.wheelchair && now.wheelchair) out.wheelchairAccessible = now.wheelchair === 'yes'
  if (!same(now.social, before.social)) out.socialLinks = Object.fromEntries(Object.entries(now.social).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]))
  return out
}

async function save() {
  saved.value = false
  errorMessage.value = ''
  if (!validate()) { errorMessage.value = 'Corrigez les champs signalés.'; return }
  const payload = changes()
  const addressChanged = !!(payload.address || payload.postalCode || payload.city)
  // Une suggestion choisie pour une adresse jusque-là non localisée doit aussi enregistrer ses coordonnées
  const locatesExisting = !!(form.value.located && unlocated.value)
  if (!Object.keys(payload).length && !locatesExisting) return
  saving.value = true
  locateWarning.value = ''
  try {
    // Coordonnées pour la recherche « autour de moi » : suggestion choisie, sinon recherche automatique (Base Adresse Nationale)
    if (addressChanged || locatesExisting) {
      let coords = form.value.located ? pickedCoords : null
      if (!coords) {
        const f = form.value
        const hits = await $fetch('/api/address', { query: { q: `${f.address} ${f.postalCode} ${f.city}` } }).catch(() => [])
        const hit = Array.isArray(hits) ? hits.find(h => String(h.postalCode) === f.postalCode && Number.isFinite(h.latitude) && Number.isFinite(h.longitude)) : null
        if (hit) coords = { latitude: hit.latitude, longitude: hit.longitude }
      }
      if (coords) Object.assign(payload, coords)
      else if (addressChanged) {
        // Adresse changée mais introuvable : on retire les anciennes coordonnées plutôt que de laisser une position fausse
        payload.latitude = null
        payload.longitude = null
        locateWarning.value = 'Nous n\'avons pas pu localiser cette adresse : votre fiche n\'apparaîtra pas dans la recherche « autour de moi ».'
      }
    }
    try {
      await $fetch(`/api/backend/praticiens/${fiche.value.id}`, { method: 'PUT', body: payload })
    } catch (e) {
      // Le backend peut refuser la remise à zéro des coordonnées : on enregistre alors le reste
      const message = String(e?.data?.message ?? e?.statusMessage ?? '')
      if (payload.latitude === null && (e?.statusCode ?? e?.response?.status) === 400 && /latitude|longitude/i.test(message)) {
        delete payload.latitude; delete payload.longitude
        await $fetch(`/api/backend/praticiens/${fiche.value.id}`, { method: 'PUT', body: payload })
      } else throw e
    }
    pickedCoords = null
    addressSearch.value = ''
    await refresh()
    saved.value = true
    trackEvent('pro-fiche-saved')
  } catch (e) {
    errorMessage.value = apiErrorMessage(e, 'Impossible d\'enregistrer votre fiche. Réessayez dans un instant.')
  } finally {
    saving.value = false
  }
}

// --- Diplômes
const diplomas = computed(() => (Array.isArray(fiche.value?.diplomas) ? fiche.value.diplomas : []))
const diploma = reactive({ title: '', organization: '', year: '' })
const diplomaBusy = ref(false)
const diplomaError = ref('')
async function addDiploma() {
  diplomaError.value = ''
  if (!diploma.title.trim()) { diplomaError.value = 'Indiquez l\'intitulé du diplôme.'; return }
  if (diploma.year && !(/^\d{4}$/.test(diploma.year) && +diploma.year >= 1950 && +diploma.year <= new Date().getFullYear())) { diplomaError.value = 'Année invalide.'; return }
  diplomaBusy.value = true
  try {
    const body = { title: diploma.title.trim() }
    if (diploma.organization.trim()) body.organization = diploma.organization.trim()
    if (diploma.year) body.year = Number(diploma.year)
    await $fetch('/api/backend/praticiens/me/diplomas', { method: 'POST', body })
    diploma.title = ''; diploma.organization = ''; diploma.year = ''
    await refresh()
  } catch (e) {
    diplomaError.value = apiErrorMessage(e, 'Impossible d\'ajouter ce diplôme.')
  } finally { diplomaBusy.value = false }
}
async function removeDiploma(d) {
  diplomaBusy.value = true
  diplomaError.value = ''
  try {
    await $fetch(`/api/backend/praticiens/me/diplomas/${d.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    diplomaError.value = apiErrorMessage(e, 'Impossible de supprimer ce diplôme.')
  } finally { diplomaBusy.value = false }
}

// Etat de chaque section (affiché dans la liste)
const done = computed(() => {
  const f = fiche.value ?? {}
  return {
    identite: !!(f.firstName && f.lastName && f.photoUrl),
    presentation: !!((f.specialities ?? []).length && (f.bio ?? '').trim().length >= 50),
    public: !!(f.publicTypes ?? []).length,
    tarifs: hasTypes.value,
    diplomes: diplomas.value.length > 0,
    cabinet: !!(f.address && f.city && hasHours.value),
  }
})

// Aperçu : la page publique de la fiche, réduite ; rechargée après chaque enregistrement
// La fiche s'affiche sur 1728 px de large puis est réduite pour remplir exactement la zone (qui varie avec la fenêtre)
const previewBox = ref(null)
const previewScale = ref(684 / 1728)
let resizeObs
function fitPreview() { const w = previewBox.value?.clientWidth; if (w) previewScale.value = w / 1728 }
// La zone n'existe qu'une fois la fiche chargée : on la suit dès qu'elle apparaît
watch(previewBox, (el) => {
  resizeObs?.disconnect()
  if (!el) return
  fitPreview()
  if (window.ResizeObserver) { resizeObs = new ResizeObserver(fitPreview); resizeObs.observe(el) }
})
onBeforeUnmount(() => resizeObs?.disconnect())
const previewKey = ref(0)
const previewSrc = computed(() => `/praticiens/${fiche.value?.slug || fiche.value?.id}`)
watch(fiche, () => { previewKey.value++ })

// --- Quitter avec des modifications non enregistrées
onBeforeRouteLeave(() => (dirty.value && !window.confirm('Quitter sans enregistrer vos modifications ?') ? false : true))
const warnUnload = (e) => { if (dirty.value) { e.preventDefault(); e.returnValue = '' } }
onMounted(() => window.addEventListener('beforeunload', warnUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnload))
</script>

<style scoped>
.font-unbounded { font-family: 'Unbounded', cursive; }
.label { display: block; font-size: 1rem; font-weight: 500; margin-bottom: 0.375rem; }
.opt { font-weight: 400; color: rgb(1 40 40 / 0.6); }
.field { width: 100%; border: 1px solid #c8c8c8; border-radius: 12px; padding: 0.75rem 1rem; min-height: 48px; font-size: 1rem; background: #fff; }
.field[aria-invalid='true'] { border-color: #b91c1c; }
.err { color: #b91c1c; font-size: 0.875rem; margin-top: 0.25rem; }
.help { font-size: 0.875rem; color: #626b6b; margin-top: 0.375rem; }
.chip { display: inline-flex; align-items: center; min-height: 40px; border: 1px solid #c8c8c8; border-radius: 999px; padding: 0.4rem 1rem; font-size: 1rem; font-weight: 500; cursor: pointer; background: #fff; }
.chip:focus-within { outline: 2px solid #156F71; outline-offset: 2px; }
.chip-on { background: #012828; color: #fff; border-color: #012828; }
</style>
