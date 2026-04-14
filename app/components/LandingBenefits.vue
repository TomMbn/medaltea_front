<template>
  <section class="landing-benefits py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] text-center mb-20">
        Pourquoi choisir un praticien sur Medaltea ?
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Row 1 -->
        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg h-[280px]">
          <img src="/images/benefits.jpg" alt="Benefits" class="w-full h-full object-cover" />
        </div>
        
        <div class="benefit-card text-card bg-[#90BAD1] p-8 rounded-[30px] shadow-lg flex flex-col justify-center h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Transparence Totale</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Explorez les profils détaillés et les retours d'expérience de la communauté pour choisir le praticien qui vous correspond en toute confiance.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg h-[280px]">
          <img src="/images/Rectangle 200.jpg" alt="Transparence" class="w-full h-full object-cover" />
        </div>

        <div class="benefit-card text-card bg-[#156F71] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Orientation Altea</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Profitez de notre IA spécialisée pour identifier la discipline naturelle (naturopathie, sophrologie, etc.) la plus adaptée à vos besoins.
          </p>
        </div>

        <!-- Row 2 -->
        <div class="benefit-card text-card bg-[#156F71] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Accès Instantané</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Trouvez une solution ou un praticien en quelques secondes. Plus besoin de chercher pendant des heures, Medaltea centralise le meilleur du bien-être.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg h-[280px]">
          <img src="/images/Rectangle 203.jpg" alt="Accès instantané" class="w-full h-full object-cover" />
        </div>

        <div class="benefit-card text-card bg-[#90BAD1] p-8 rounded-[30px] shadow-lg flex flex-col justify-center h-[280px]">
          <h4 class="font-unbounded font-bold text-[18px] mb-4">Confidentialité</h4>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Vos échanges et données de santé sont protégés. Nous utilisons des protocoles de sécurité avancés pour garantir votre vie privée.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg h-[280px]">
          <img src="/images/Rectangle 205.jpg" alt="Confidentialité" class="w-full h-full object-cover" />
        </div>
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
