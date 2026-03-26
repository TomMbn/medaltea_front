<template>
  <div class="min-h-screen bg-[#f4f7f9] font-sans antialiased selection:bg-[#EC7F7A]/30">
    <TheNavbar />
    
    <main class="mx-auto w-11/12 max-w-7xl pt-28 pb-10 flex-1 flex flex-col">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <!-- Dashboard Illustration (Left Panel - Desktop only or bottom on mobile) -->
        <div class="hidden lg:block lg:col-span-4 h-full pb-8">
          <ChatbotIllustration />
        </div>

        <!-- Chat Interface (Right Panel - Main focus) -->
        <div class="col-span-1 lg:col-span-8 flex flex-col h-full">
          <ChatbotInterface class="my-auto" />
        </div>
      </div>
    </main>
  </div>
</template>
