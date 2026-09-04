<script setup>
const features = [
  { title: 'Registo do Plano de Consumo', desc: 'Defina valores personalizados para cada ciclo mensal.' },
  { title: 'Categorias Personalizáveis', desc: 'Agrupe gastos conforme a sua rotina (Alimentação, Lazer, etc.).' },
  { title: 'Registo de Consumos', desc: 'Lançamentos rápidos de valores, datas e descrições.' },
  { title: 'Painel Inteligente', desc: 'Visão consolidada de totais, gastos e saldo disponível.' },
  { title: 'Resumo por Categoria', desc: 'Entenda visualmente para onde está a ir cada valor.' },
  { title: 'Histórico Completo', desc: 'Aceda e analise os seus ciclos e despesas passadas.' },
  { title: 'Autenticação Segura', desc: 'Os seus dados e registos protegidos com total privacidade.' },
  { title: 'Totalmente Responsivo', desc: 'Aceda perfeitamente pelo telemóvel, tablet ou computador.' }
]
</script>

<template>
  <section id="funcionalidades" class="py-24 bg-[#0B2A4A]/30 border-t border-slate-800/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tudo o que precisa para controlar o seu consumo
        </h2>
        <p class="mt-4 text-slate-300 text-base sm:text-lg">
          Funcionalidades focadas na simplicidade e na eficiência do seu acompanhamento diário.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(item, index) in features" 
          :key="index"
          class="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
        >
          <div class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-white mb-1">{{ item.title }}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>