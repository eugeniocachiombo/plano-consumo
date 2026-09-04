<template>
  <section class="py-24 bg-[#071A33] relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Uma visão clara do seu consumo
        </h2>
        <p class="mt-4 text-slate-300 text-base sm:text-lg">
          Interface concebida para que entenda a sua situação financeira em segundos.
        </p>
      </div>

      <!-- Dashboard Interactive/Visual Container -->
      <div class="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1 & 2: Overview & Categories -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold text-white">Resumo de Setembro</h3>
                <p class="text-xs text-slate-400">Plano activo registado</p>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Em dia</span>
            </div>

            <!-- Dashboard Mini Cards -->
            <div class="grid grid-cols-3 gap-3">
              <div class="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p class="text-[10px] sm:text-xs text-slate-400 uppercase">Plano</p>
                <p class="text-sm sm:text-lg font-bold text-white mt-1">150.000 Kz</p>
              </div>
              <div class="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p class="text-[10px] sm:text-xs text-slate-400 uppercase">Gasto</p>
                <p class="text-sm sm:text-lg font-bold text-amber-400 mt-1">82.500 Kz</p>
              </div>
              <div class="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p class="text-[10px] sm:text-xs text-slate-400 uppercase">Disponível</p>
                <p class="text-sm sm:text-lg font-bold text-emerald-400 mt-1">67.500 Kz</p>
              </div>
            </div>

            <!-- Category Distribution Simulated -->
            <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-800 space-y-3">
              <p class="text-xs font-bold text-slate-300 uppercase tracking-wider">Consumo por Categoria</p>
              
              <div class="space-y-2">
                <div>
                  <div class="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Alimentação</span>
                    <span>45.000 Kz</span>
                  </div>
                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 w-[54%]"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Transporte</span>
                    <span>22.500 Kz</span>
                  </div>
                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-400 w-[27%]"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Lazer & Outros</span>
                    <span>15.000 Kz</span>
                  </div>
                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-400 w-[19%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3: Recent Activity -->
          <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-800 space-y-4">
            <h4 class="text-sm font-bold text-white uppercase tracking-wider">Últimos Consumos</h4>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <p class="text-xs font-semibold text-white">Supermercado</p>
                  <p class="text-[10px] text-slate-400">Hoje, 14:20 • Alimentação</p>
                </div>
                <span class="text-xs font-bold text-slate-200">-12.000 Kz</span>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <p class="text-xs font-semibold text-white">Combustível</p>
                  <p class="text-[10px] text-slate-400">Ontem • Transporte</p>
                </div>
                <span class="text-xs font-bold text-slate-200">-8.500 Kz</span>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <p class="text-xs font-semibold text-white">Restaurante</p>
                  <p class="text-[10px] text-slate-400">02 Set • Lazer</p>
                </div>
                <span class="text-xs font-bold text-slate-200">-15.000 Kz</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>