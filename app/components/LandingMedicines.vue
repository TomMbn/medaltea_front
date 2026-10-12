<template>
  <section class="landing-medicines py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1200px] mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] mb-16">
        Recherche la médecine qui vous convient
      </h2>

      <div class="flex flex-wrap lg:flex-nowrap gap-4 justify-center">
        <!-- Massage -->
        <NuxtLink to="/medecines/massage" class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <NuxtImg src="/images/medicines-1.jpeg" alt="Massage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width="400" height="545" format="webp" quality="80" loading="lazy" placeholder sizes="sm:50vw lg:250px" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="absolute bottom-4 left-0 right-0 text-center text-white font-unbounded font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Massage</span>
        </NuxtLink>

        <!-- Herboristerie (page à venir) -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <NuxtImg src="/images/medicine-2.jpeg" alt="Herboristerie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width="400" height="545" format="webp" quality="80" loading="lazy" placeholder sizes="sm:50vw lg:250px" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="absolute bottom-4 left-0 right-0 text-center text-white font-unbounded font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Herboristerie</span>
        </div>

        <!-- Acupuncture -->
        <NuxtLink to="/medecines/acupuncture" class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <NuxtImg src="/images/medicine-3.jpeg" alt="Acupuncture" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width="400" height="545" format="webp" quality="80" loading="lazy" placeholder sizes="sm:50vw lg:250px" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="absolute bottom-4 left-0 right-0 text-center text-white font-unbounded font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Acupuncture</span>
        </NuxtLink>

        <!-- Yoga (page à venir) -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <NuxtImg src="/images/medicine-4.jpeg" alt="Yoga" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width="400" height="545" format="webp" quality="80" loading="lazy" placeholder sizes="sm:50vw lg:250px" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="absolute bottom-4 left-0 right-0 text-center text-white font-unbounded font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Yoga</span>
        </div>

        <!-- Ostéopathie -->
        <NuxtLink to="/medecines/osteopathie" class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <NuxtImg src="/images/medicine-5.jpeg" alt="Ostéopathie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width="400" height="545" format="webp" quality="80" loading="lazy" placeholder sizes="sm:50vw lg:250px" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="absolute bottom-4 left-0 right-0 text-center text-white font-unbounded font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ostéopathie</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
</style>
