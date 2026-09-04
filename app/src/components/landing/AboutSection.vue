<template>
  <section id="sobre" class="py-24 bg-[#071A33] relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Text Content -->
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Conceito Central
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            O que é o Plano de Consumo?
          </h2>
          <p class="text-slate-300 text-base sm:text-lg leading-relaxed">
            O <strong class="text-white">Plano de Consumo</strong> é uma aplicação criada para ajudá-lo a organizar e acompanhar os seus gastos. Em vez de simplesmente registar despesas passadas, você define previamente quanto pretende consumir durante determinado período e acompanha a evolução dos seus gastos em tempo real.
          </p>

          <div class="space-y-4 pt-2">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-semibold text-base">Você define o seu próprio limite</h4>
                <p class="text-slate-400 text-sm">Sem pacotes pré-definidos. Insira exactamente o valor do seu orçamento mensal.</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-semibold text-base">Acompanhe o saldo disponível real</h4>
                <p class="text-slate-400 text-sm">Saiba instantaneamente quanto ainda pode gastar até ao final do período.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Image / Visual Illustration -->
        <div class="relative">
          <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 opacity-20 blur-xl"></div>
          <div class="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <h3 class="text-xl font-bold text-white border-b border-slate-800 pb-4">
              Como funciona o cálculo:
            </h3>

            <div class="space-y-4 font-mono text-sm">
              <div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40">
                <span class="text-slate-400">Plano Definido (Ex: Setembro)</span>
                <span class="text-white font-bold">150.000 Kz</span>
              </div>
              <div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40">
                <span class="text-slate-400">(-) Total de Gastos Registados</span>
                <span class="text-amber-400 font-bold">82.500 Kz</span>
              </div>
              <div class="flex justify-between items-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span class="text-emerald-300 font-sans font-semibold">(=) Disponível para Gastar</span>
                <span class="text-emerald-400 font-bold text-lg">67.500 Kz</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>