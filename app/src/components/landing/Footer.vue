<script setup>
import logo from '@/assets/img/logo.png'
const scrollTo = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="bg-[#051326] border-t border-slate-800/80 py-12 text-slate-400 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/60">
        
        <!-- Coluna 1: Brand -->
        <div class="space-y-4 md:col-span-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center overflow-hidden">
              <img 
                :src="logo" 
                alt="Plano de Consumo Logo" 
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-lg font-bold text-white tracking-tight">Plano de Consumo</span>
          </div>
          <p class="text-slate-400 max-w-sm text-xs sm:text-sm leading-relaxed">
            Uma forma simples, visual e eficiente de planear, organizar e acompanhar os seus consumos pessoais sem complicações.
          </p>
        </div>

        <!-- Coluna 2: Navegação -->
        <div class="space-y-3">
          <p class="text-xs font-bold text-slate-200 uppercase tracking-wider">Navegação</p>
          <ul class="space-y-2 text-xs">
            <li><button @click="scrollTo('inicio')" class="hover:text-white transition-colors">Início</button></li>
            <li><button @click="scrollTo('sobre')" class="hover:text-white transition-colors">Sobre a App</button></li>
            <li><button @click="scrollTo('como-funciona')" class="hover:text-white transition-colors">Como Funciona</button></li>
            <li><button @click="scrollTo('beneficios')" class="hover:text-white transition-colors">Benefícios</button></li>
            <li><button @click="scrollTo('funcionalidades')" class="hover:text-white transition-colors">Funcionalidades</button></li>
          </ul>
        </div>

        <!-- Coluna 3: Descarregamento -->
        <div class="space-y-3">
          <p class="text-xs font-bold text-slate-200 uppercase tracking-wider">Descarregamento</p>
          <ul class="space-y-2 text-xs">
            <li><button @click="scrollTo('download')" class="hover:text-white transition-colors">Versão Web / Móvel</button></li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {{ new Date().getFullYear() }} Plano de Consumo. Todos os direitos reservados.</p>
        <p>Defina o seu limite. Registe os seus consumos. Controle o seu dinheiro.</p>
      </div>
    </div>
  </footer>
</template>