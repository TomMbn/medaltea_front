<template>
  <section class="relative bg-[#EEF2F5] overflow-hidden flex items-center justify-center min-h-[600px] pt-[140px] pb-28 px-4">

    <!-- Glow rose derrière l'avatar top-center -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />

    <!-- Avatar top-center -->
    <div class="absolute top-[92px] left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex z-10">
      <div class="w-[72px] h-[72px] rounded-full overflow-hidden shadow-lg ring-2 ring-white">
        <img src="https://placehold.co/72x72/c4a882/ffffff?text=M" alt="Magnétiseuse" class="w-full h-full object-cover" />
      </div>
      <span class="bg-[#E8755A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">Magnétiseuse</span>
    </div>

    <!-- Avatar gauche -->
    <div class="absolute left-[7%] top-1/2 -translate-y-1/3 flex-col items-center gap-2 hidden md:flex z-10">
      <div class="w-[88px] h-[88px] rounded-full overflow-hidden shadow-lg ring-2 ring-white">
        <img src="https://placehold.co/88x88/a8c0b0/ffffff?text=E" alt="Ergothérapeute" class="w-full h-full object-cover" />
      </div>
      <span class="bg-[#E8755A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">Ergothérapeute</span>
    </div>

    <!-- Avatar droite (carré arrondi) -->
    <div class="absolute right-[7%] top-[92px] flex-col items-center gap-2 hidden md:flex z-10">
      <div class="w-[120px] h-[120px] rounded-[20px] overflow-hidden shadow-lg ring-2 ring-white">
        <img src="https://placehold.co/120x120/8a9bb5/ffffff?text=O" alt="Ostéopathe" class="w-full h-full object-cover" />
      </div>
      <span class="bg-[#E8755A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">Ostéopathe</span>
    </div>

    <!-- Contenu centré -->
    <div class="relative z-10 text-center w-full max-w-xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-10">
        Rechercher parmi des milliers de <span class="text-[#E8755A]">praticiens</span>
      </h1>

      <!-- Barre de recherche -->
      <div class="bg-white rounded-full shadow-md flex items-center h-14 overflow-hidden">
        <!-- Localisation -->
        <div class="flex items-center gap-2 px-5 flex-1 min-w-0 border-r border-gray-100">
          <MapPin :size="15" class="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Localisation"
            class="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0 w-full"
          />
        </div>

        <!-- Spécialité -->
        <div class="flex items-center px-5 flex-1">
          <select class="bg-transparent text-sm text-gray-500 focus:outline-none w-full appearance-none cursor-pointer">
            <option value="" disabled selected>Spécialité</option>
            <option>Ostéopathie</option>
            <option>Naturopathie</option>
            <option>Sophrologie</option>
            <option>Acupuncture</option>
            <option>Hypnothérapie</option>
            <option>Magnétisme</option>
            <option>Ergothérapie</option>
          </select>
        </div>

        <!-- Bouton -->
        <div class="shrink-0 pr-1.5">
          <button class="bg-[#156F71] text-white text-sm font-semibold h-11 px-5 rounded-full flex items-center gap-2 hover:bg-[#0f5557] transition-colors whitespace-nowrap">
            Rechercher <Search :size="14" />
          </button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { MapPin, Search } from 'lucide-vue-next'
</script>
