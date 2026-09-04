<script setup>
const scrollTo = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="inicio" class="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-b from-[#071A33] via-[#0B2A4A] to-[#071A33]">
    <!-- Elementos visuais de fundo -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto space-y-6">
        
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Controle o seu consumo de forma inteligente
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Planeie o seu consumo. <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Controle melhor o seu dinheiro.
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
          O <strong class="text-white font-semibold">Plano de Consumo</strong> ajuda-o a definir o quanto pretende consumir, registar os seus gastos e acompanhar em tempo real quanto já consumiu e quanto ainda tem disponível.
        </p>

        <!-- CTA Buttons -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            @click="scrollTo('download')"
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descarregar gratuitamente
          </button>

          <button 
            @click="scrollTo('como-funciona')"
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-semibold text-base transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Ver funcionalidades
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mockup da App / Dashboard Representation -->
      <div class="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
        <div class="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-blue-950/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 overflow-hidden">
          
          <!-- Decorative Browser Header -->
          <div class="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <div class="text-xs font-mono text-slate-500 bg-slate-950/60 px-4 py-1.5 rounded-lg border border-slate-800">
              dashboard.planodeconsumo.app
            </div>
            <div class="w-12"></div>
          </div>

          <!-- Cards do Painel -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <!-- Card 1: Planeado -->
            <div class="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plano de Consumo</span>
                <span class="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">Definido por si</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">150.000 Kz</div>
              <p class="text-xs text-slate-400 mt-2">Mês de Setembro</p>
            </div>

            <!-- Card 2: Consumido -->
            <div class="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gasto este Mês</span>
                <span class="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">55% consumido</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">82.500 Kz</div>
              <p class="text-xs text-slate-400 mt-2">12 lançamentos registados</p>
            </div>

            <!-- Card 3: Disponível -->
            <div class="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponível</span>
                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">Saldo seguro</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">67.500 Kz</div>
              <p class="text-xs text-slate-400 mt-2">Restante para o mês</p>
            </div>
          </div>

          <!-- Mini Progress Bar / Visual Feed -->
          <div class="bg-slate-950/50 rounded-xl p-4 sm:p-5 border border-slate-800/80">
            <div class="flex justify-between items-center mb-2 text-sm">
              <span class="text-slate-300 font-medium">Progresso do Orçamento</span>
              <span class="text-slate-400 font-semibold">55%</span>
            </div>
            <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[55%] transition-all duration-1000"></div>
            </div>
          </div>

          <!-- Cards Flutuantes (Efeito Visual) -->
          <!-- <div class="hidden lg:block absolute -bottom-6 -right-6 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl animate-bounce-slow max-w-xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Novo consumo registado</p>
                <p class="text-sm font-bold text-white">Supermercado: -12.000 Kz</p>
              </div>
            </div>
          </div> -->

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-slow {
  animation: bounceSlow 4s infinite ease-in-out;
}
</style>