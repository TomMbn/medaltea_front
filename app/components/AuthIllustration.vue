<template>
  <div class="auth-illustration relative w-full h-full overflow-hidden rounded-[40px] bg-[#e0ecf2]">
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

    <!-- Quote Content -->
    <div class="absolute bottom-0 left-0 w-full p-12 pb-16 max-w-[850px]">
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
