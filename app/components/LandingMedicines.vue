<template>
  <section class="landing-medicines py-24 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] mb-16">
        Recherche la médecine qui vous convient
      </h2>

      <div class="flex flex-wrap lg:flex-nowrap gap-4 justify-center">
        <!-- Medicine 1 -->
        <div class="medicine-card group relative h-[400px] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/AdobeStock_219268662.jpeg" alt="Massage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white text-[18px] font-bold font-unbounded">Massage</div>
        </div>

        <!-- Medicine 2 -->
        <div class="medicine-card group relative h-[400px] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/AdobeStock_243765470.jpeg" alt="Herboristerie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white text-[18px] font-bold font-unbounded">Herboristerie</div>
        </div>

        <!-- Medicine 3 -->
        <div class="medicine-card group relative h-[400px] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/AdobeStock_313373132.jpeg" alt="Acupuncture" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white text-[18px] font-bold font-unbounded">Acupuncture</div>
        </div>

        <!-- Medicine 4 -->
        <div class="medicine-card group relative h-[400px] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/AdobeStock_280340375.jpeg" alt="Yoga" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white text-[18px] font-bold font-unbounded">Yoga</div>
        </div>

        <!-- Medicine 5 -->
        <div class="medicine-card group relative h-[400px] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/AdobeStock_329541430.jpeg" alt="Ostéopathie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white text-[18px] font-bold font-unbounded">Ostéopathie</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
</style>
