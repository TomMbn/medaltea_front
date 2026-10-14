<template>
  <section class="landing-benefits py-24">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-[34px] font-bold font-unbounded text-[#012828] text-center mb-20">
        Pourquoi choisir un praticien sur Léya ?
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <!-- Row 1 -->
        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg min-h-[280px]">
          <NuxtImg src="/images/benefits.jpg" alt="Benefits" class="w-full h-full object-cover" format="webp" quality="80" loading="lazy" sizes="xs:100vw sm:50vw xl:25vw" />
        </div>
        
        <div class="benefit-card text-card bg-[#90BAD1] p-8 rounded-[30px] shadow-lg flex flex-col justify-center min-h-[280px]">
          <h3 class="font-unbounded font-bold text-[18px] mb-4">Transparence Totale</h3>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Explorez les fiches détaillées (prestations, tarifs, horaires, adresse) pour choisir le praticien qui vous correspond en toute confiance.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg min-h-[280px]">
          <NuxtImg src="/images/rectangle-200.jpg" alt="Transparence" class="w-full h-full object-cover" format="webp" quality="80" loading="lazy" sizes="xs:100vw sm:50vw xl:25vw" />
        </div>

        <div class="benefit-card text-card bg-[#156F71] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white min-h-[280px]">
          <h3 class="font-unbounded font-bold text-[18px] mb-4">Orientation Léya</h3>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Profitez de notre assistant IA pour identifier les disciplines (naturopathie, sophrologie, etc.) qui peuvent répondre à vos besoins.
          </p>
        </div>

        <!-- Row 2 -->
        <div class="benefit-card text-card bg-[#156F71] p-8 rounded-[30px] shadow-lg flex flex-col justify-center text-white min-h-[280px]">
          <h3 class="font-unbounded font-bold text-[18px] mb-4">Accès Instantané</h3>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Trouvez un praticien et réservez en quelques clics : l'orientation et la prise de rendez-vous sont réunies au même endroit.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg min-h-[280px]">
          <NuxtImg src="/images/rectangle-203.jpg" alt="Accès instantané" class="w-full h-full object-cover" format="webp" quality="80" loading="lazy" sizes="xs:100vw sm:50vw xl:25vw" />
        </div>

        <div class="benefit-card text-card bg-[#90BAD1] p-8 rounded-[30px] shadow-lg flex flex-col justify-center min-h-[280px]">
          <h3 class="font-unbounded font-bold text-[18px] mb-4">Confidentialité</h3>
          <p class="text-[14px] leading-relaxed opacity-80 font-sans">
            Vos données sont traitées conformément au RGPD. Vos messages à l'assistant ne sont pas conservés par Léya : ils sont traités par notre prestataire d'IA. Voir la <NuxtLink to="/politique-de-confidentialite" class="underline">politique de confidentialité</NuxtLink>.
          </p>
        </div>

        <div class="benefit-card image-card rounded-[30px] overflow-hidden shadow-lg min-h-[280px]">
          <NuxtImg src="/images/rectangle-205.jpg" alt="Confidentialité" class="w-full h-full object-cover" format="webp" quality="80" loading="lazy" sizes="xs:100vw sm:50vw xl:25vw" />
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
