<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/img/logo.png'

const router = useRouter()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollTo = (id) => {
  isMobileMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToLogin = () => {
  isMobileMenuOpen.value = false
  router.push({ name: 'login' })
}
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-[#071A33]/90 backdrop-blur-md border-b border-slate-800/80 py-4 shadow-xl' : 'bg-transparent py-6'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <a href="#" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform overflow-hidden">
          <img 
            :src="logo" 
            alt="Plano de Consumo Logo" 
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-xl font-bold tracking-tight text-white">Plano de Consumo</span>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <button @click="scrollTo('inicio')" class="hover:text-white transition-colors hover:cursor-pointer">Início</button>
        <button @click="scrollTo('sobre')" class="hover:text-white transition-colors hover:cursor-pointer">Sobre</button>
        <button @click="scrollTo('como-funciona')" class="hover:text-white transition-colors hover:cursor-pointer">Como funciona</button>
        <button @click="scrollTo('beneficios')" class="hover:text-white transition-colors hover:cursor-pointer">Benefícios</button>
        <button @click="scrollTo('funcionalidades')" class="hover:text-white transition-colors hover:cursor-pointer">Funcionalidades</button>
      </nav>

      <!-- Desktop CTA & Login -->
      <div class="hidden md:flex items-center gap-4">
        <button 
          @click="goToLogin"
          class="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors hover:cursor-pointer"
        >
          Iniciar sessão
        </button>

        <button 
          @click="scrollTo('download')" 
          class="hover:cursor-pointer px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descarregar gratuitamente
        </button>
      </div>

      <!-- Mobile Hamburger Button -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 focus:outline-none"
        aria-label="Abrir Menu"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-[#0B2A4A] border-b border-slate-700/50 px-4 pt-4 pb-6 space-y-3 mt-4">
        <button @click="scrollTo('inicio')" class="block w-full text-left py-2 text-slate-200 font-medium">Início</button>
        <button @click="scrollTo('sobre')" class="block w-full text-left py-2 text-slate-200 font-medium">Sobre</button>
        <button @click="scrollTo('como-funciona')" class="block w-full text-left py-2 text-slate-200 font-medium">Como funciona</button>
        <button @click="scrollTo('beneficios')" class="block w-full text-left py-2 text-slate-200 font-medium">Benefícios</button>
        <button @click="scrollTo('funcionalidades')" class="block w-full text-left py-2 text-slate-200 font-medium">Funcionalidades</button>
        
        <div class="pt-4 border-t border-slate-800 flex flex-col gap-3">
          <button 
            @click="goToLogin"
            class="w-full py-2.5 rounded-xl border border-slate-700 text-slate-200 font-semibold text-center hover:bg-slate-800 transition-colors"
          >
            Iniciar sessão
          </button>
          
          <button 
            @click="scrollTo('download')" 
            class="w-full px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-center flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descarregar gratuitamente
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>