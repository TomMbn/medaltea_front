<template>
  <div class="auth-illustration relative w-full h-full overflow-hidden bg-[#e0ecf2]" :class="logo ? 'rounded-[32px]' : 'rounded-[40px]'">
    <!-- Background Image -->
    <NuxtImg 
      src="/images/landscape.webp" 
      alt="Paysage apaisant" 
      class="absolute inset-0 w-full h-full object-cover"
      width="1000"
      height="800"
      format="webp"
      quality="80"
      loading="eager"
      placeholder
    />
    
    <!-- Gradient Overlay for Text Readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#012828]/80 via-transparent to-transparent"></div>

    <!-- Variante V5 : logo en haut, accroche en bas à gauche -->
    <template v-if="logo">
      <NuxtLink to="/" class="absolute left-10 top-10" aria-label="Léya, retour à l'accueil">
        <img src="/images/footer/logo-blanc.svg" alt="" width="89" height="40" class="h-10 w-auto" style="animation: none;" />
      </NuxtLink>
      <p class="absolute left-10 bottom-10 right-10 max-w-[520px] font-unbounded font-normal text-[26px] xl:text-[32px] leading-[normal] text-white">{{ message }}</p>
    </template>

    <!-- Quote Content -->
    <div v-else class="absolute bottom-0 left-0 w-full p-12 pb-16 max-w-[850px]">
      <div class="quote-wrapper pl-6">
        <p class="text-white text-[32px] md:text-[38px] font-bold leading-[1.25] font-unbounded">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logo: { type: Boolean, default: false },
  message: { type: String, default: 'Expliquez-nous ce que vous ressentez, nous vous guidons !' },
})
</script>

<style scoped>
.auth-illustration {
  /* Ensure it fills the left half perfectly */
  position: relative;
}

.quote-wrapper {
  /* The distinct left border accent from the mockup */
  border-left: 2px solid rgba(255, 255, 255, 0.4);
}

.font-unbounded {
  font-family: 'Unbounded', cursive;
}
</style>
