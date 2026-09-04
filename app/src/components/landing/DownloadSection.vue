<script setup>
// Variável configurável para inserção posterior do link de descarregamento real
const downloadUrl = '#'

const handleDownload = () => {
  if (downloadUrl && downloadUrl !== '#') {
    window.location.href = downloadUrl
  } else {
    alert('O link de descarregamento estará disponível em breve!')
  }
}
</script>

<template>
  <section id="download" class="py-24 bg-gradient-to-b from-[#071A33] via-[#0B2A4A] to-[#071A33] relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="rounded-3xl bg-gradient-to-r from-blue-900/80 to-slate-900 border border-blue-500/30 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
        <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comece a controlar o seu consumo hoje
          </h2>
          <p class="text-slate-300 text-base sm:text-lg leading-relaxed">
            Descarregue gratuitamente o <strong class="text-white">Plano de Consumo</strong> e tenha uma forma simples e organizada de acompanhar os seus gastos diários.
          </p>

          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              @click="handleDownload" 
              class="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descarregar gratuitamente
            </button>
          </div>

          <p class="text-xs text-slate-400 pt-2">
            Aplicação 100% gratuita • Sem mensalidades ou subscrições
          </p>
        </div>
      </div>

    </div>
  </section>
</template>