<template>
  <div class="flex flex-col min-h-screen min-h-[100svh] px-5 sm:px-8 lg:px-12 xl:px-[96px] py-8 lg:pt-[clamp(24px,5.5vh,72px)] lg:pb-[clamp(10px,2vh,40px)]">
    <NuxtLink to="/" class="lg:hidden self-start" aria-label="Léya, retour à l'accueil">
      <img src="/images/logo.svg" alt="Léya" width="120" height="54" class="w-[100px] h-auto" style="animation: none;" />
    </NuxtLink>

    <AuthAudienceSwitch v-if="!created" class="lg:hidden mt-6 mb-6" page="register" current="pro" />

    <h1 class="sr-only">Rejoindre Léya en tant que praticien</h1>

    <!-- Progression -->
    <div role="group" aria-label="Progression de l'inscription" :class="created ? 'mt-6 lg:mt-0' : ''">
      <p class="sr-only">{{ created ? 'Inscription terminée' : `Étape ${step} sur ${STEPS.length} · ${STEPS[step - 1]}` }}</p>
      <ol class="flex gap-3 max-w-[916px]" aria-hidden="true">
        <li v-for="(label, i) in STEPS" :key="label" class="flex-1 min-w-0 flex flex-col gap-2">
          <span class="h-[6px] rounded-[3px] transition-colors" :class="created || i < step ? 'bg-vert-600' : 'bg-bleu-100'" />
          <span class="text-[14px] lg:text-[16px] font-medium leading-tight" :class="created || i < step ? 'text-vert-600' : 'text-neutre-600'">{{ i + 1 }}. {{ label }}</span>
        </li>
      </ol>
    </div>

    <p v-if="restored && !created" class="mt-5 max-w-[560px] rounded-[12px] border border-vert-600/30 bg-white px-4 py-3 text-[16px]" role="status">
      Nous avons retrouvé votre inscription en cours (enregistrée sur cet appareil, sans le mot de passe).
      <button type="button" class="underline font-semibold text-vert-600 ml-1" @click="restart">Recommencer à zéro</button>
    </p>

    <!-- ======================= Confirmation ======================= -->
    <div v-if="created" class="mt-[clamp(12px,1.8vh,22px)] flex flex-col flex-1 gap-[clamp(12px,1.8vh,22px)]" role="status">
      <div class="flex flex-col gap-2">
        <h2 ref="titleRef" tabindex="-1" class="font-unbounded font-normal text-[28px] sm:text-[34px] lg:text-[40px] leading-[normal] text-vert-900 outline-none">Votre profil est créé</h2>
        <p class="text-[18px] lg:text-[20px] leading-[normal] text-neutre-600 max-w-[780px]">Bienvenue{{ created.firstName ? `, ${created.firstName}` : '' }} ! Complétez votre fiche et vos horaires depuis votre espace praticien.</p>
      </div>

      <p v-if="created.warnings.length" class="max-w-[776px] rounded-[12px] border border-[#fcd34d] bg-[#fffbeb] p-4 text-[14px] text-[#78350f]" role="alert">
        Votre compte est bien créé, mais {{ created.warnings.join(', ') }} n'a pas pu être enregistré{{ created.warnings.length > 1 ? 's' : '' }}. Vous pourrez le faire depuis votre espace.
      </p>

      <ul class="flex flex-col gap-4 max-w-[776px]">
        <li v-for="item in confirmItems" :key="item.title" class="flex items-start gap-4">
          <span class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="item.done ? 'bg-vert-600 text-white' : 'bg-bleu-100 text-vert-900'" aria-hidden="true">
            <Check v-if="item.done" :size="18" /><Clock v-else :size="18" />
          </span>
          <span class="leading-[normal]">
            <span class="block text-[18px] font-semibold">{{ item.title }}</span>
            <span class="block mt-0.5 text-[16px] text-neutre-600">{{ item.text }}</span>
          </span>
        </li>
      </ul>

      <div class="flex-1 min-h-6" />
      <div class="flex flex-wrap items-center gap-x-5 gap-y-4">
        <NuxtLink to="/pro/bienvenue" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow">
          Accéder à mon espace
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </NuxtLink>
        <NuxtLink :to="`/praticiens/${created.praticienId}`" target="_blank" class="text-[16px] font-medium text-vert-600 hover:underline">Voir ma fiche ↗</NuxtLink>
        <NuxtLink to="/pro/fiche" class="text-[16px] font-medium text-vert-600 hover:underline">Modifier mes informations</NuxtLink>
      </div>
    </div>

    <!-- ======================= Étapes ======================= -->
    <form v-else class="mt-[clamp(12px,1.8vh,22px)] flex flex-col flex-1 gap-[clamp(12px,1.8vh,22px)]" novalidate @submit.prevent="next">
      <div class="flex flex-col gap-2">
        <h2 ref="titleRef" tabindex="-1" class="font-unbounded font-normal text-[28px] sm:text-[34px] lg:text-[clamp(30px,4.3vh,40px)] leading-[normal] text-vert-900 outline-none">{{ TITLES[step - 1] }}</h2>
        <p class="text-[18px] lg:text-[20px] leading-[normal] text-neutre-600 max-w-[780px]">{{ SUBTITLES[step - 1] }}</p>
      </div>

      <!-- Étape 1 : identité -->
      <div v-if="step === 1" class="flex flex-col gap-[clamp(12px,2vh,20px)] max-w-[776px]">
        <div class="grid gap-[clamp(12px,2vh,20px)] sm:grid-cols-2">
          <div>
            <label for="s-first" class="label">Prénom</label>
            <input id="s-first" v-model.trim="form.firstName" autocomplete="given-name" maxlength="80" class="field" :aria-invalid="!!errors.firstName" aria-describedby="err-first" @input="errors.firstName = ''" />
            <p id="err-first" class="err" role="alert">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="s-last" class="label">Nom</label>
            <input id="s-last" v-model.trim="form.lastName" autocomplete="family-name" maxlength="80" class="field" :aria-invalid="!!errors.lastName" aria-describedby="err-last" @input="errors.lastName = ''" />
            <p id="err-last" class="err" role="alert">{{ errors.lastName }}</p>
          </div>
          <div>
            <label for="s-mail" class="label">E-mail professionnel</label>
            <div class="relative">
              <input id="s-mail" v-model.trim="form.mail" type="email" autocomplete="email" inputmode="email" maxlength="150" class="field pr-11" :aria-invalid="!!errors.mail" aria-describedby="err-mail" @input="errors.mail = ''" />
              <Check v-if="mailLooksValid" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
            </div>
            <p id="err-mail" class="err" role="alert">{{ errors.mail }}</p>
          </div>
          <div>
            <label for="s-phone" class="label">Téléphone</label>
            <input id="s-phone" v-model.trim="form.phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" class="field" placeholder="06 12 34 56 78" :aria-invalid="!!errors.phone" aria-describedby="err-phone" @input="errors.phone = ''" />
            <p id="err-phone" class="err" role="alert">{{ errors.phone }}</p>
          </div>
        </div>

        <div class="max-w-[380px]">
          <label for="s-pass" class="label">Mot de passe</label>
          <div class="relative">
            <input id="s-pass" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="200" class="field pr-24" :aria-invalid="!!errors.password" aria-describedby="err-password" @input="errors.password = ''" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-vert-600 px-2 py-1 rounded hover:bg-bleu-50" :aria-pressed="showPassword" @click="showPassword = !showPassword">
              {{ showPassword ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
          <p id="err-password" class="err" role="alert">{{ errors.password }}</p>
          <p class="mt-2 text-[16px] leading-[normal] text-neutre-600">8 caractères minimum, dont un chiffre.</p>
        </div>

        <!-- Adresse du cabinet (facultative) -->
        <div v-if="!manualAddress" class="relative">
          <label for="s-address" class="label">Adresse du cabinet</label>
          <input
            id="s-address"
            v-model="addressQuery"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="suggestions.length > 0 && suggestionsOpen"
            aria-controls="address-listbox"
            :aria-activedescendant="activeIndex >= 0 ? `addr-${activeIndex}` : undefined"
            autocomplete="off"
            class="field"
            placeholder="Ex. : 9 quai de la Fosse, Nantes"
            :aria-invalid="!!errors.address"
            aria-describedby="err-address hint-address"
            @input="onAddressInput"
            @keydown.down.prevent="moveActive(1)"
            @keydown.up.prevent="moveActive(-1)"
            @keydown.enter="onAddressEnter"
            @keydown.esc="suggestionsOpen = false"
            @blur="onAddressBlur"
          />
          <ul v-if="suggestions.length && suggestionsOpen" id="address-listbox" role="listbox" class="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#c8c8c8] rounded-[12px] shadow-douce overflow-hidden">
            <li v-for="(a, i) in suggestions" :id="`addr-${i}`" :key="a.label" role="option" :aria-selected="i === activeIndex">
              <button type="button" class="w-full text-left px-4 py-3 text-[16px] hover:bg-bleu-50" :class="i === activeIndex ? 'bg-bleu-50' : ''" @mousedown.prevent="pickAddress(a)">{{ a.label }}</button>
            </li>
          </ul>
          <p id="err-address" class="err" role="alert">{{ errors.address }}</p>
          <p v-if="form.address && form.city" class="mt-2 text-[16px] text-vert-600">✓ {{ form.address }}, {{ form.postalCode }} {{ form.city }}</p>
          <p v-if="searchEmpty" class="mt-2 text-[16px] text-vert-900" role="status">
            Aucune adresse trouvée.
            <button type="button" class="underline font-semibold text-vert-600" @click="manualAddress = true">Je ne trouve pas mon adresse</button>
          </p>
          <p id="hint-address" class="mt-2 text-[16px] leading-snug text-neutre-600 max-w-[560px]">Laissez vide si vous consultez uniquement en visio ou à domicile.</p>
        </div>

        <div v-else class="flex flex-col gap-[clamp(12px,2vh,20px)]">
          <div>
            <label for="s-street" class="label">Adresse du cabinet</label>
            <input id="s-street" v-model.trim="form.address" autocomplete="street-address" maxlength="200" class="field" :aria-invalid="!!errors.address" aria-describedby="err-address" @input="errors.address = ''; coords = null" />
            <p id="err-address" class="err" role="alert">{{ errors.address }}</p>
          </div>
          <div class="grid gap-5 sm:grid-cols-3">
            <div>
              <label for="s-cp" class="label">Code postal</label>
              <input id="s-cp" v-model.trim="form.postalCode" inputmode="numeric" maxlength="5" autocomplete="postal-code" class="field" :aria-invalid="!!errors.postalCode" aria-describedby="err-cp" @input="errors.postalCode = ''; coords = null" />
              <p id="err-cp" class="err" role="alert">{{ errors.postalCode }}</p>
            </div>
            <div class="sm:col-span-2">
              <label for="s-city" class="label">Ville</label>
              <input id="s-city" v-model.trim="form.city" autocomplete="address-level2" maxlength="100" class="field" :aria-invalid="!!errors.city" aria-describedby="err-city" @input="errors.city = ''; coords = null" />
              <p id="err-city" class="err" role="alert">{{ errors.city }}</p>
            </div>
          </div>
          <p class="text-[16px] text-neutre-600 leading-snug">Nous essaierons de localiser cette adresse. Si elle reste introuvable, votre fiche fonctionnera normalement mais n'apparaîtra pas dans la recherche « autour de moi ».</p>
          <button type="button" class="text-[16px] underline text-vert-600 justify-self-start text-left" @click="manualAddress = false">Utiliser la recherche d'adresse</button>
        </div>
      </div>

      <!-- Étape 2 : diplômes -->
      <div v-else-if="step === 2" class="flex flex-col gap-5 max-w-[776px]">
        <div v-for="(d, i) in form.diplomas" :key="d.key" class="rounded-[20px] bg-white p-5 flex flex-col gap-4">
          <div class="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
            <div>
              <label :for="`d-title-${i}`" class="label">Intitulé du diplôme</label>
              <input :id="`d-title-${i}`" v-model.trim="d.title" maxlength="150" class="field" :aria-invalid="!!errors[`d${i}title`]" @input="errors[`d${i}title`] = ''" />
              <p class="err" role="alert">{{ errors[`d${i}title`] }}</p>
            </div>
            <div>
              <label :for="`d-org-${i}`" class="label">Organisme <span class="hint">(facultatif)</span></label>
              <input :id="`d-org-${i}`" v-model.trim="d.organization" maxlength="150" class="field" />
            </div>
            <div>
              <label :for="`d-year-${i}`" class="label">Année</label>
              <input :id="`d-year-${i}`" v-model.trim="d.year" inputmode="numeric" maxlength="4" class="field" placeholder="2016" :aria-invalid="!!errors[`d${i}year`]" @input="errors[`d${i}year`] = ''" />
              <p class="err" role="alert">{{ errors[`d${i}year`] }}</p>
            </div>
          </div>
          <button type="button" class="self-start text-[16px] font-medium text-vert-600 hover:underline" @click="removeDiploma(i)">Retirer ce diplôme</button>
        </div>

        <button v-if="form.diplomas.length < 8" type="button" class="self-start inline-flex items-center gap-2 rounded-full bg-white px-5 py-[10px] text-[16px] font-semibold text-vert-900 hover:bg-white/70 transition-colors" @click="addDiploma">
          <Plus :size="18" aria-hidden="true" /> {{ form.diplomas.length ? 'Ajouter un autre diplôme' : 'Ajouter un diplôme' }}
        </button>
        <p v-if="!form.diplomas.length" class="text-[16px] text-neutre-600 leading-snug">Facultatif : vous pourrez compléter vos diplômes depuis votre espace.</p>

        <div class="max-w-[380px]">
          <label for="s-regnum" class="label">Numéro ADELI ou RPPS <span class="hint">(facultatif)</span></label>
          <input id="s-regnum" v-model.trim="form.regNumber" maxlength="11" inputmode="numeric" class="field" :aria-invalid="!!errors.regNumber" aria-describedby="err-regnum" @input="errors.regNumber = ''" />
          <p id="err-regnum" class="err" role="alert">{{ errors.regNumber }}</p>
          <p class="mt-2 text-[16px] text-neutre-600 leading-snug">Facultatif selon votre profession. Ce numéro n'est jamais affiché sur votre fiche publique.</p>
        </div>
      </div>

      <!-- Étape 3 : pratique -->
      <div v-else-if="step === 3" class="flex flex-col gap-[clamp(12px,1.8vh,22px)] max-w-[776px]">
        <fieldset>
          <legend class="font-unbounded font-normal text-[20px] leading-[normal] mb-3">Votre spécialité</legend>
          <p v-if="!specialities.length" class="text-[16px] text-neutre-600">Liste momentanément indisponible. Rechargez la page.</p>
          <div class="flex flex-wrap gap-2" aria-describedby="err-specialities">
            <label v-for="s in specialities" :key="s.id" class="chip" :class="form.specialityIds.includes(s.id) ? 'chip-on' : 'chip-off'">
              <input v-model="form.specialityIds" type="checkbox" :value="s.id" class="sr-only" @change="errors.specialityIds = ''" />
              {{ s.name }}
            </label>
          </div>
          <p id="err-specialities" class="err" role="alert">{{ errors.specialityIds }}</p>
        </fieldset>

        <div>
          <label for="s-tagline" class="label">Ce que je fais <span class="hint">(en une phrase)</span></label>
          <div class="relative">
            <input id="s-tagline" v-model="form.tagline" maxlength="160" class="field pr-11" placeholder="J’aide adultes et enfants à retrouver de l’autonomie dans les gestes du quotidien." />
            <Check v-if="form.tagline.trim().length >= 10" :size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-vert-600 pointer-events-none" aria-hidden="true" />
          </div>
          <p class="mt-2 text-[16px] leading-[normal] text-neutre-600">{{ form.tagline.length }} / 160 caractères</p>
        </div>

        <fieldset>
          <legend class="font-unbounded font-normal text-[20px] leading-[normal] mb-3">Pour qui ?</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="t in PUBLIC_TYPES" :key="t.v" class="chip" :class="form.publicTypes.includes(t.v) ? 'chip-public-on' : 'chip-off'">
              <input v-model="form.publicTypes" type="checkbox" :value="t.v" class="sr-only" />
              {{ t.l }}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend class="sr-only">Modes de consultation</legend>
          <div class="flex flex-wrap gap-4">
            <div v-for="m in MODES" :key="m.v" class="flex items-center gap-3 rounded-[18px] bg-white pl-[18px] pr-[14px] py-3">
              <span :id="`mode-${m.v}`" class="text-[18px] font-semibold leading-[normal]">{{ m.l }}</span>
              <button type="button" role="switch" :aria-checked="form.modes[m.v]" :aria-labelledby="`mode-${m.v}`" class="switch" :class="form.modes[m.v] ? 'switch-on' : ''" @click="toggleMode(m.v)"><span class="switch-knob" /></button>
            </div>
          </div>
          <p id="err-modes" class="err" role="alert">{{ errors.modes }}</p>
          <p v-if="errors.cabinetAddress" class="err" role="alert">
            {{ errors.cabinetAddress }}
            <button type="button" class="underline font-semibold" @click="goTo(1)">Ajouter mon adresse</button>
          </p>
        </fieldset>

        <fieldset>
          <legend class="sr-only">Prix des séances</legend>
          <div class="grid gap-4 sm:grid-cols-3 max-w-[780px]">
            <div v-for="f in priceFields" :key="f.key">
              <label :for="`p-${f.key}`" class="label">{{ f.label }}</label>
              <div class="relative">
                <input :id="`p-${f.key}`" v-model="form.prices[f.key]" inputmode="decimal" maxlength="6" class="field pr-12" placeholder="70" :aria-invalid="!!errors[`price-${f.key}`]" @input="errors[`price-${f.key}`] = ''" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-neutre-600 pointer-events-none" aria-hidden="true">€</span>
              </div>
              <p class="err" role="alert">{{ errors[`price-${f.key}`] }}</p>
            </div>
          </div>
          <p class="mt-1 text-[16px] text-neutre-600 leading-snug">Facultatif : une séance sans prix s'affiche sans tarif.</p>
        </fieldset>
      </div>

      <!-- Étape 4 : agenda -->
      <div v-else class="flex flex-col gap-[28px] max-w-[916px]">
        <div class="rounded-[24px] bg-white px-5 py-4 flex flex-col gap-2" role="group" aria-label="Semaine type">
          <div v-for="d in DAYS" :key="d.n" class="flex flex-wrap items-center gap-x-4 gap-y-2 py-[clamp(2px,0.6vh,6px)]">
            <button type="button" role="switch" :aria-checked="week[d.n].length > 0" :aria-label="`${d.label} : ${week[d.n].length ? 'ouvert' : 'indisponible'}`" class="switch" :class="week[d.n].length ? 'switch-on' : ''" @click="toggleDay(d.n)"><span class="switch-knob" /></button>
            <span class="w-[110px] text-[18px] font-semibold leading-[normal]" :class="week[d.n].length ? 'text-vert-900' : 'text-neutre-600'">{{ d.label }}</span>
            <template v-if="week[d.n].length">
              <template v-for="(r, i) in week[d.n]" :key="`${d.n}-${i}`">
                <span v-if="isEditing(d.n, i)" class="inline-flex flex-wrap items-center gap-2 rounded-[16px] bg-bleu-50 px-3 py-2">
                  <input v-model="r.start" type="time" step="900" :aria-label="`${d.label}, début de la plage ${i + 1}`" class="time-input" />
                  <span aria-hidden="true">–</span>
                  <input v-model="r.end" type="time" step="900" :aria-label="`${d.label}, fin de la plage ${i + 1}`" class="time-input" />
                  <button type="button" class="text-[14px] font-semibold text-vert-600 px-2 py-1 hover:underline" @click="editing = null">OK</button>
                  <button type="button" class="text-[14px] text-corail-700 px-2 py-1 hover:underline" @click="removeRange(d.n, i)">Supprimer</button>
                </span>
                <button v-else type="button" class="rounded-full bg-bleu-50 px-4 py-[9px] text-[16px] font-medium leading-[normal] hover:bg-bleu-100 transition-colors" :aria-label="`Modifier la plage ${hourLabel(r.start)} à ${hourLabel(r.end)}`" @click="editing = { day: d.n, idx: i }">{{ hourLabel(r.start) }} – {{ hourLabel(r.end) }}</button>
              </template>
              <button type="button" class="rounded-full px-4 py-[9px] text-[16px] font-medium leading-[normal] text-vert-600 hover:bg-bleu-50 transition-colors" :aria-label="`Ajouter une plage le ${d.label.toLowerCase()}`" @click="addRange(d.n)">+</button>
            </template>
            <span v-else class="text-[16px] text-neutre-600">Indisponible</span>
            <p v-if="weekErrors[d.n]" class="basis-full text-[16px] text-corail-700 leading-[normal]" role="alert">{{ weekErrors[d.n] }}</p>
          </div>
        </div>

        <fieldset>
          <legend class="text-[18px] font-semibold leading-[normal] mb-[10px]">Durée d’une séance</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="o in DURATIONS" :key="o.v" class="chip" :class="form.durationMin === o.v ? 'chip-on' : 'chip-off'">
              <input v-model.number="form.durationMin" type="radio" name="duration" :value="o.v" class="sr-only" />
              {{ o.l }}
            </label>
          </div>
        </fieldset>

        <div class="grid gap-2">
          <label class="flex items-start gap-3 text-[16px] lg:text-[18px] leading-snug cursor-pointer">
            <input v-model="accepted" type="checkbox" class="peer sr-only" :aria-invalid="!!errors.accepted" aria-describedby="err-accepted" @change="errors.accepted = ''" />
            <span :class="BOX" aria-hidden="true"><Check :size="16" /></span>
            <span>
              Je certifie exercer en conformité avec la réglementation et que ces informations sont exactes, et j'accepte les
              <NuxtLink to="/cgu-pro" target="_blank" class="underline">conditions générales des praticiens</NuxtLink> et la
              <NuxtLink to="/politique-de-confidentialite" target="_blank" class="underline">politique de confidentialité</NuxtLink>.
            </span>
          </label>
          <p id="err-accepted" class="err" role="alert">{{ errors.accepted }}</p>
        </div>
      </div>

      <p v-if="submitError" class="max-w-[776px] rounded-[12px] border border-[#fed7d7] bg-[#fff5f5] p-4 text-[14px] font-semibold text-[#c53030]" role="alert">{{ submitError }}</p>

      <div class="flex-1 min-h-6" />

      <!-- Actions : restent visibles en bas de l'écran quand le contenu dépasse -->
      <div class="sticky bottom-0 z-10 -mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-[96px] px-5 sm:px-8 lg:px-12 xl:px-[96px] pt-4 pb-4 lg:pb-[clamp(8px,1.5vh,20px)] bg-gradient-to-t from-bleu-50 from-70% to-transparent flex flex-wrap items-center gap-x-5 gap-y-4">
        <button type="submit" class="inline-flex items-center gap-[14px] min-h-[48px] bg-vert-900 text-white font-semibold text-[18px] rounded-full pl-6 pr-1 py-1 hover:shadow-douce transition-shadow disabled:opacity-80 disabled:cursor-wait" :disabled="submitting">
          {{ submitting ? 'Création de votre espace…' : step === STEPS.length ? 'Terminer mon inscription' : 'Continuer' }}
          <span class="w-10 h-10 rounded-full bg-corail-500 flex items-center justify-center"><ArrowUpRight :size="20" aria-hidden="true" /></span>
        </button>
        <button v-if="step > 1" type="button" class="text-[16px] font-medium text-vert-600 hover:underline disabled:opacity-50" :disabled="submitting" @click="back">Retour</button>
        <button v-if="step === STEPS.length" type="button" class="text-[16px] font-medium text-vert-600 hover:underline disabled:opacity-50" :disabled="submitting" @click="skipAgenda">Je configurerai mes horaires plus tard</button>
        <NuxtLink v-if="step === 1" :to="{ path: '/login', query: { espace: 'pro', redirect: '/pro/rendez-vous' } }" class="text-[16px] font-medium text-vert-600 hover:underline">Déjà inscrit ? Se connecter</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ArrowUpRight, Check, Clock, Plus } from 'lucide-vue-next'
import { DAYS, emptyWeek, PRESETS, validateWeek, weekTotalMinutes } from '~/utils/schedule'

const STEPS = ['Identité', 'Diplômes', 'Pratique', 'Agenda']
const TITLES = ['Faisons connaissance', 'Vos diplômes', 'Votre pratique', 'Vos disponibilités']
const SUBTITLES = [
  'Ces informations apparaîtront sur votre fiche publique.',
  'Ajoutez vos formations : elles s’affichent sur votre fiche publique.',
  'Ce que les patients verront en premier sur votre fiche.',
  'Les patients ne verront que les créneaux libres.',
]
const BOX = 'mt-0.5 w-6 h-6 shrink-0 rounded-[6px] border-2 border-vert-600 bg-white text-white flex items-center justify-center peer-checked:bg-vert-600 peer-focus-visible:shadow-[0_0_0_4px_#cde4df] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100'
const DRAFT_KEY = 'leya:pro-signup:v2'
const PUBLIC_TYPES = [
  { v: 'adults', l: 'Adultes' }, { v: 'children', l: 'Enfants' }, { v: 'teenagers', l: 'Adolescents' }, { v: 'babies', l: 'Bébés' },
  { v: 'seniors', l: 'Seniors' }, { v: 'athletes', l: 'Sportifs' }, { v: 'pregnant_women', l: 'Femmes enceintes' },
]
const MODES = [{ v: 'cabinet', l: 'Au cabinet' }, { v: 'visio', l: 'En visio' }, { v: 'domicile', l: 'À domicile' }]
const DURATIONS = [{ v: 45, l: '45 min' }, { v: 60, l: '1 h' }, { v: 90, l: '1 h 30' }]

const { specialities } = await useSpecialities()

const step = ref(1)
const titleRef = ref(null)
const restored = ref(false)
const showPassword = ref(false)
const submitting = ref(false)
const submitError = ref('')
const accepted = ref(false)
const created = ref(null)
const editing = ref(null)

let diplomaKey = 0
const newDiploma = () => ({ key: ++diplomaKey, title: '', organization: '', year: '' })
const blankForm = () => ({
  firstName: '', lastName: '', mail: '', password: '', phone: '', address: '', postalCode: '', city: '',
  diplomas: [], regNumber: '',
  specialityIds: [], tagline: '', publicTypes: [], modes: { cabinet: true, visio: false, domicile: false },
  prices: { first: '', follow: '', visio: '', home: '' }, durationMin: 60,
})
const blankWeek = () => PRESETS.find(p => p.id === 'weekday-lunch').build()
const form = reactive(blankForm())
const week = reactive(blankWeek())
const errors = reactive({})
const weekErrors = ref({})
const mailLooksValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.mail.trim()))

const hourLabel = (hhmm) => { const [h, m] = String(hhmm).split(':'); return !m || m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}` }
// Le formulaire défile dans sa colonne sur grand écran, dans la page sur mobile
function scrollToTop() {
  const scroller = titleRef.value?.closest('[data-scroll]')
  if (scroller && scroller.scrollHeight > scroller.clientHeight) scroller.scrollTo({ top: 0, behavior: 'smooth' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
const isEditing = (day, idx) => editing.value?.day === day && editing.value?.idx === idx

// ---------- Brouillon enregistré sur l'appareil (jamais le mot de passe)
function saveDraft() {
  if (created.value) return
  try {
    const { password, ...rest } = form
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step: step.value, form: rest, week: { ...week }, accepted: false, manualAddress: manualAddress.value }))
  } catch { /* stockage indisponible : pas de brouillon */ }
}
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY) } catch {} }

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      const base = blankForm()
      Object.assign(form, base, d.form, { password: '', modes: { ...base.modes, ...d.form?.modes }, prices: { ...base.prices, ...d.form?.prices } })
      form.diplomas = (Array.isArray(d.form?.diplomas) ? d.form.diplomas : []).map(x => ({ ...newDiploma(), title: x.title ?? '', organization: x.organization ?? '', year: x.year ?? '' }))
      if (d.week) for (const day of DAYS) week[day.n] = Array.isArray(d.week[day.n]) ? d.week[day.n].map(r => ({ start: r.start, end: r.end })) : []
      manualAddress.value = !!d.manualAddress
      step.value = Math.min(Math.max(Number(d.step) || 1, 1), STEPS.length)
      addressQuery.value = form.address ? `${form.address}, ${form.postalCode} ${form.city}` : ''
      restored.value = !!(d.form?.mail || d.form?.firstName || d.form?.address)
    }
  } catch { /* brouillon illisible : on repart de zéro */ }
  trackEvent('pro-signup-step', { step: step.value })
})

function restart() {
  clearDraft()
  Object.assign(form, blankForm())
  for (const day of DAYS) week[day.n] = blankWeek()[day.n]
  for (const k of Object.keys(errors)) delete errors[k]
  addressQuery.value = ''
  manualAddress.value = false
  accepted.value = false
  restored.value = false
  editing.value = null
  step.value = 1
}

// ---------- Adresse : saisie assistée (Base Adresse Nationale via notre serveur)
const manualAddress = ref(false)
const addressQuery = ref('')
const coords = ref(null)
const searchEmpty = ref(false)
const suggestions = ref([])
const suggestionsOpen = ref(false)
const activeIndex = ref(-1)
let timer = null
let addressToken = 0

watch([form, week, step, () => manualAddress.value], saveDraft, { deep: true })

function onAddressInput() {
  form.address = ''; form.postalCode = ''; form.city = ''
  coords.value = null
  errors.address = ''
  searchEmpty.value = false
  clearTimeout(timer)
  const q = addressQuery.value.trim()
  if (q.length < 3) { suggestions.value = []; return }
  const current = ++addressToken
  timer = setTimeout(async () => {
    try {
      const res = await $fetch('/api/address', { query: { q } })
      if (current !== addressToken) return
      suggestions.value = Array.isArray(res) ? res : []
      searchEmpty.value = suggestions.value.length === 0
      suggestionsOpen.value = true
      activeIndex.value = -1
    } catch {
      suggestions.value = []
      if (current === addressToken) searchEmpty.value = true
    }
  }, 250)
}
function pickAddress(a) {
  form.address = a.street
  form.postalCode = String(a.postalCode)
  form.city = a.city
  coords.value = Number.isFinite(a.latitude) && Number.isFinite(a.longitude) ? { latitude: a.latitude, longitude: a.longitude } : null
  addressQuery.value = a.label
  searchEmpty.value = false
  suggestionsOpen.value = false
  suggestions.value = []
  activeIndex.value = -1
  errors.address = ''
}
function moveActive(d) {
  if (!suggestions.value.length) return
  suggestionsOpen.value = true
  activeIndex.value = (activeIndex.value + d + suggestions.value.length) % suggestions.value.length
}
function onAddressEnter(e) {
  if (suggestionsOpen.value && activeIndex.value >= 0) { e.preventDefault(); pickAddress(suggestions.value[activeIndex.value]) }
}
function onAddressBlur() { setTimeout(() => { suggestionsOpen.value = false }, 120) }

// ---------- Diplômes
function addDiploma() { form.diplomas.push(newDiploma()) }
function removeDiploma(i) { form.diplomas.splice(i, 1) }

// ---------- Modes de consultation et prix
function toggleMode(m) { form.modes[m] = !form.modes[m]; errors.modes = ''; errors.cabinetAddress = '' }
const primaryMode = computed(() => (form.modes.cabinet ? 'cabinet' : form.modes.domicile ? 'domicile' : 'visio'))
// Une ligne de prix par prestation créée : séance et suivi (mode principal), puis visio / domicile s'ils s'ajoutent
const priceFields = computed(() => {
  const list = [{ key: 'first', label: 'Première séance' }, { key: 'follow', label: 'Suivi' }]
  if (form.modes.visio && primaryMode.value !== 'visio') list.push({ key: 'visio', label: 'Visio' })
  if (form.modes.domicile && primaryMode.value !== 'domicile') list.push({ key: 'home', label: 'À domicile' })
  return list
})

// ---------- Horaires
function toggleDay(n) {
  editing.value = null
  week[n] = week[n].length ? [] : [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }]
}
function addRange(n) {
  const last = week[n][week[n].length - 1]
  week[n].push(last && last.end >= '12:00' ? { start: '09:00', end: '12:00' } : { start: '14:00', end: '18:00' })
  editing.value = { day: n, idx: week[n].length - 1 }
}
function removeRange(n, i) { week[n].splice(i, 1); editing.value = null }

// ---------- Validation par étape
const passwordOk = (v) => String(v).length >= 8 && /\d/.test(v)
const phoneDigits = (v) => String(v).replace(/[\s.\-()]/g, '')
const priceOk = (v) => v === '' || v === null || (!Number.isNaN(Number(String(v).replace(',', '.'))) && Number(String(v).replace(',', '.')) >= 0 && Number(String(v).replace(',', '.')) <= 10000)
const validators = {
  1() {
    if (!form.firstName) errors.firstName = 'Indiquez votre prénom.'
    if (!form.lastName) errors.lastName = 'Indiquez votre nom.'
    if (!mailLooksValid.value) errors.mail = 'Saisissez une adresse e-mail valide.'
    if (!/^(?:0|\+33)[1-9]\d{8}$/.test(phoneDigits(form.phone))) errors.phone = 'Saisissez un numéro français valide (ex. 06 12 34 56 78).'
    if (!passwordOk(form.password)) errors.password = 'Le mot de passe doit contenir au moins 8 caractères, dont un chiffre.'
    if (manualAddress.value) {
      const any = form.address || form.postalCode || form.city
      if (any) {
        if (!form.address) errors.address = 'Indiquez l\'adresse du cabinet.'
        if (!/^\d{5}$/.test(form.postalCode)) errors.postalCode = 'Code postal à 5 chiffres.'
        if (!form.city) errors.city = 'Indiquez la ville.'
      }
    } else if (addressQuery.value.trim() && !(form.address && form.city)) {
      errors.address = 'Choisissez votre adresse dans la liste, ou laissez le champ vide.'
    }
  },
  2() {
    form.diplomas.forEach((d, i) => {
      const any = d.title || d.organization || d.year
      if (any && !d.title) errors[`d${i}title`] = 'Indiquez l\'intitulé du diplôme.'
      if (d.year && !(/^\d{4}$/.test(String(d.year)) && Number(d.year) >= 1950 && Number(d.year) <= new Date().getFullYear())) errors[`d${i}year`] = 'Année invalide.'
    })
    const n = form.regNumber.replace(/\s/g, '')
    if (n && !(/^\d{11}$/.test(n) || /^[0-9A-Za-z]{9}$/.test(n))) errors.regNumber = 'ADELI : 9 caractères ; RPPS : 11 chiffres.'
  },
  3() {
    if (!form.specialityIds.length) errors.specialityIds = 'Choisissez au moins une spécialité.'
    if (!Object.values(form.modes).some(Boolean)) errors.modes = 'Choisissez au moins un mode de consultation.'
    else if (form.modes.cabinet && !(form.address && form.city)) errors.cabinetAddress = 'Une consultation au cabinet demande l\'adresse du cabinet.'
    for (const f of priceFields.value) if (!priceOk(form.prices[f.key])) errors[`price-${f.key}`] = 'Prix invalide.'
  },
  4() {
    const we = validateWeek(week)
    weekErrors.value = we
    if (Object.keys(we).length) errors.week = 'Corrigez les horaires.'
    if (!accepted.value) errors.accepted = 'Cette acceptation est nécessaire pour créer votre compte.'
  },
}

function validate(n) {
  for (const k of Object.keys(errors)) delete errors[k]
  weekErrors.value = {}
  validators[n]()
  return Object.keys(errors).length === 0
}

async function focusFirstError() {
  await nextTick()
  document.querySelector('[aria-invalid="true"]')?.focus()
}
async function goTo(n) {
  step.value = n
  submitError.value = ''
  editing.value = null
  trackEvent('pro-signup-step', { step: n })
  await nextTick()
  titleRef.value?.focus()
  scrollToTop()
}

async function next() {
  if (submitting.value) return
  if (!validate(step.value)) { await focusFirstError(); trackEvent('pro-signup-invalid', { step: step.value }); return }
  if (step.value < STEPS.length) return goTo(step.value + 1)
  await finish()
}
function back() { if (step.value > 1) goTo(step.value - 1) }
async function skipAgenda() {
  for (const day of DAYS) week[day.n] = []
  if (validate(STEPS.length)) await finish()
  else await focusFirstError()
}

// ---------- Création du compte, puis des prestations, des horaires et des diplômes
const welcome = useState('pro-welcome', () => null)
const parsePrice = (v) => (v === '' || v === null ? undefined : Number(String(v).replace(',', '.')))

function consultationTypes() {
  const mode = primaryMode.value
  const list = [
    { name: 'Première séance', kind: 'first_visit', mode, price: parsePrice(form.prices.first) },
    { name: 'Suivi', kind: 'follow_up', mode, price: parsePrice(form.prices.follow), optional: true },
  ]
  if (form.modes.visio && mode !== 'visio') list.push({ name: 'Visio', kind: 'other', mode: 'visio', price: parsePrice(form.prices.visio), optional: true })
  if (form.modes.domicile && mode !== 'domicile') list.push({ name: 'À domicile', kind: 'other', mode: 'domicile', price: parsePrice(form.prices.home), optional: true })
  // Une prestation facultative (suivi, visio, domicile) n'est créée que si son prix est renseigné
  return list.filter(t => !t.optional || t.price !== undefined)
}

async function setupPractice() {
  const warnings = []
  let typesCreated = 0
  let rangesCreated = 0
  let diplomasCreated = 0
  for (const t of consultationTypes()) {
    try {
      await $fetch('/api/backend/praticiens/me/consultation-types', {
        method: 'POST',
        body: { name: t.name, durationMin: form.durationMin, price: t.price, mode: t.mode, kind: t.kind },
      })
      typesCreated++
    } catch { if (!warnings.includes('vos prestations')) warnings.push('vos prestations') }
  }
  for (const d of DAYS) {
    for (const r of week[d.n]) {
      try {
        await $fetch('/api/backend/praticiens/me/availabilities', { method: 'POST', body: { dayOfWeek: d.n, startTime: r.start, endTime: r.end } })
        rangesCreated++
      } catch { if (!warnings.includes('vos horaires')) warnings.push('vos horaires') }
    }
  }
  for (const d of form.diplomas) {
    if (!d.title) continue
    try {
      await $fetch('/api/backend/praticiens/me/diplomas', {
        method: 'POST',
        body: { title: d.title, ...(d.organization ? { organization: d.organization } : {}), ...(d.year ? { year: Number(d.year) } : {}) },
      })
      diplomasCreated++
    } catch { if (!warnings.includes('vos diplômes')) warnings.push('vos diplômes') }
  }
  return { warnings, typesCreated, rangesCreated, diplomasCreated }
}

async function finish() {
  // Brouillon restauré : le mot de passe n'est jamais conservé, il faut le ressaisir.
  if (!passwordOk(form.password)) {
    await goTo(1)
    errors.password = 'Saisissez votre mot de passe pour finaliser votre inscription.'
    await focusFirstError()
    return
  }
  submitting.value = true
  submitError.value = ''
  trackEvent('pro-signup-submit', { agenda: weekTotalMinutes(week) > 0 })
  try {
    // Adresse saisie à la main : on tente de la localiser avant l'envoi (échec sans conséquence)
    if (!coords.value && form.address && form.postalCode && form.city) {
      const hits = await $fetch('/api/address', { query: { q: `${form.address} ${form.postalCode} ${form.city}` } }).catch(() => [])
      const hit = Array.isArray(hits) ? hits.find(h => String(h.postalCode) === form.postalCode && Number.isFinite(h.latitude) && Number.isFinite(h.longitude)) : null
      if (hit) coords.value = { latitude: hit.latitude, longitude: hit.longitude }
    }
    const reg = form.regNumber.replace(/\s/g, '')
    const hasAddress = !!(form.address && form.city)
    const result = await $fetch('/api/register-pro', {
      method: 'POST',
      body: {
        mail: form.mail,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        ...(hasAddress ? { address: form.address, city: form.city, postalCode: Number(form.postalCode), ...(coords.value ?? {}), country: 'France' } : {}),
        phoneNumber: phoneDigits(form.phone),
        specialityIds: form.specialityIds,
        ...(form.tagline.trim() ? { tagline: form.tagline.trim() } : {}),
        ...(form.publicTypes.length ? { publicTypes: form.publicTypes } : {}),
        ...(/^\d{11}$/.test(reg) ? { rpps: reg } : reg ? { adeli: reg } : {}),
      },
    })
    refreshCookie('leya_session')
    refreshCookie('leya_role')
    refreshCookie('leya_praticien')

    // Le backend n'a pas ouvert de session : le compte est créé, on renvoie vers la connexion.
    if (!result?.authenticated) {
      clearDraft()
      trackEvent('pro-signup-success', { session: false })
      return navigateTo({ path: '/login', query: { espace: 'pro', redirect: '/pro/bienvenue' } })
    }

    const setup = await setupPractice()
    const agendaOn = week && weekTotalMinutes(week) > 0
    welcome.value = { firstName: form.firstName, agendaRequested: agendaOn, warnings: setup.warnings.map(w => (w === 'vos horaires' ? 'horaires' : w === 'vos prestations' ? 'prestation' : 'diplômes')) }
    created.value = {
      firstName: form.firstName,
      praticienId: result.praticienId ?? useSession().praticienId.value ?? '',
      time: new Date(),
      ...setup,
    }
    clearDraft()
    trackEvent('pro-signup-success', { session: true, agenda: agendaOn && !setup.warnings.length })
    await nextTick()
    titleRef.value?.focus()
    scrollToTop()
  } catch (e) {
    trackEvent('pro-signup-error', { status: apiStatus(e) ?? 0 })
    if (apiStatus(e) === 409) {
      await goTo(1)
      errors.mail = 'Un compte existe déjà avec cette adresse e-mail. Connectez-vous pour accéder à votre espace.'
      await focusFirstError()
    } else {
      submitError.value = apiErrorMessage(e, 'La création du compte a échoué. Vérifiez les informations saisies et réessayez.')
    }
  } finally {
    submitting.value = false
  }
}

// ---------- Écran de confirmation
const confirmItems = computed(() => {
  const c = created.value
  if (!c) return []
  const time = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(c.time)
  const ready = c.typesCreated > 0 && c.rangesCreated > 0
  return [
    { title: 'Profil créé', text: `Aujourd’hui à ${time}`, done: true },
    ready
      ? { title: 'Agenda configuré', text: `${c.typesCreated} prestation${c.typesCreated > 1 ? 's' : ''} et ${c.rangesCreated} plage${c.rangesCreated > 1 ? 's' : ''} horaire${c.rangesCreated > 1 ? 's' : ''} enregistrées`, done: true }
      : { title: 'Agenda à configurer', text: 'Ajoutez vos horaires et vos prestations depuis votre espace pour recevoir des réservations.', done: false },
    ready
      ? { title: 'Réservation en ligne ouverte', text: 'Les patients peuvent réserver un créneau sur votre fiche.', done: true }
      : { title: 'Réservation en ligne', text: 'Elle s’ouvre dès que vos horaires et vos prestations sont enregistrés.', done: false },
  ]
})
</script>

<style scoped>
.label { display: block; font-size: 16px; font-weight: 500; line-height: normal; margin-bottom: 8px; }
.hint { font-weight: 400; color: #626b6b; }
.field { width: 100%; height: 52px; border-radius: 12px; border: 1px solid #c8c8c8; padding: 0 16px; font-size: 16px; background: #fff; color: #012828; transition: box-shadow 0.15s; }
.field::placeholder { color: #959595; }
.field:focus { outline: none; border: 2px solid #156f71; padding: 0 15px; box-shadow: 0 0 0 4px #cde4df; }
.field[aria-invalid='true'] { border-color: #ec7f7a; }
.err { font-size: 16px; line-height: normal; color: #b5534e; margin-top: 8px; }
.err:empty { display: none; }

/* Pastilles de choix (spécialités, durée, public) */
.chip { display: inline-flex; align-items: center; border-radius: 9999px; padding: 9px 16px; font-size: 16px; font-weight: 500; line-height: normal; cursor: pointer; transition: background-color 0.15s, color 0.15s; }
.chip:focus-within { box-shadow: 0 0 0 4px #cde4df; }
.chip-on { background: #156f71; color: #fff; }
.chip-public-on { background: #fcdedb; color: #b5534e; }
.chip-off { background: #fff; color: #012828; }
.chip-off:hover { background: rgb(255 255 255 / 0.7); }

/* Interrupteur (48 × 28) */
.switch { position: relative; width: 48px; height: 28px; flex-shrink: 0; border-radius: 9999px; background: #d7e7f0; transition: background-color 0.15s; }
.switch:focus-visible { box-shadow: 0 0 0 4px #cde4df; }
/* Zone tactile élargie (44 px) sans changer la taille visible */
.switch::after { content: ''; position: absolute; inset: -8px -4px; }
.switch-on { background: #156f71; }
.switch-knob { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 9999px; background: #fff; transition: transform 0.15s; }
.switch-on .switch-knob { transform: translateX(20px); }

.time-input { height: 40px; border-radius: 10px; border: 1px solid #c8c8c8; background: #fff; padding: 0 10px; font-size: 16px; color: #012828; }
.time-input:focus { outline: none; border-color: #156f71; box-shadow: 0 0 0 3px #cde4df; }
</style>
