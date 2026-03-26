<template>
  <div class="relative h-full min-h-[400px] md:min-h-full overflow-hidden rounded-[20px] shadow-2xl group bg-white">
    <!-- Background Image -->
    <img 
      src="/images/landscape.png" 
      alt="Mountain Sunset" 
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    
    <!-- Figma Gradient Overlay (30% Opacity) -->
    <div 
      class="absolute inset-0 opacity-30"
      style="background: linear-gradient(180deg, #DEDEDE 0%, #90BAD1 100%)"
    ></div>
    
    <!-- Dark Bottom Gradient for Text Legibility -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    
    <!-- Content -->
    <div class="absolute bottom-6 left-10 right-10 flex items-start gap-4">
      <!-- Vertical White Bar -->
      <div class="w-1.5 h-14 bg-white rounded-full mt-1.5 shrink-0 shadow-glow"></div>
      
      <h2 class="text-3xl lg:text-4xl font-semibold text-white leading-[1.1] tracking-tight font-unbounded">
        Explique-nous ce que tu ressens, on te guide !
      </h2>
    </div>
  </div>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}
</style>
