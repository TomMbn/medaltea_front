<template>
  <section class="landing-benefits py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7f9]">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] text-center mb-20">
        Pourquoi choisir un praticien sur Medaltea ?
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Row 1 -->
        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg h-[280px]">
          <img src="/images/AdobeStock_550036958.jpeg" alt="Happy Customer" class="w-full h-full object-cover" />
        </div>
        
        <div class="benefit-card text-card bg-[#90BAD1]/30 p-8 rounded-[30px] shadow-lg flex flex-col justify-center h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Lorem ipsum</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Sed aliquam, metus nec finibus consectetur, nisi quam sollicitudin elit, ac aliquam massa metus id ex.
          </p>
        </div>

        <div class="benefit-card bg-gray-200/50 rounded-[30px] h-[280px]"></div>

        <div class="benefit-card text-card bg-[#014949] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Lorem ipsum</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
          </p>
        </div>

        <!-- Row 2 -->
        <div class="benefit-card text-card bg-[#014949] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Lorem ipsum</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Sed aliquam, metus nec finibus consectetur, nisi quam sollicitudin elit, ac aliquam massa.
          </p>
        </div>

        <div class="benefit-card bg-gray-200/50 rounded-[30px] h-[280px]"></div>

        <div class="benefit-card text-card bg-[#90BAD1]/30 p-8 rounded-[30px] shadow-lg flex flex-col justify-center h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Lorem ipsum</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
        </div>

        <div class="benefit-card bg-gray-200/50 rounded-[30px] h-[280px]"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-unbounded {
  font-family: 'Unbounded', cursive;
}
.benefit-card {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
}
</style>
