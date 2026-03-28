<template>
  <section class="landing-medicines py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1200px] mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] mb-16">
        Recherche la médecine qui vous convient
      </h2>

      <div class="flex flex-wrap lg:flex-nowrap gap-4 justify-center">
        <!-- Medicine 1 -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/medicines-1.jpeg" alt="Massage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        <!-- Medicine 2 -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/medicine-2.jpeg" alt="Herboristerie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        <!-- Medicine 3 -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/medicine-3.jpeg" alt="Acupuncture" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        <!-- Medicine 4 -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/medicine-4.jpeg" alt="Yoga" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        <!-- Medicine 5 -->
        <div class="medicine-card group relative aspect-[11/15] w-full sm:w-[calc(50%-8px)] lg:w-1/5 rounded-[20px] overflow-hidden shadow-lg cursor-pointer">
          <img src="/images/medicine-5.jpeg" alt="Ostéopathie" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
