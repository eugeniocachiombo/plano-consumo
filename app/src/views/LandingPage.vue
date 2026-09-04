<script setup>
import Navbar from '@/components/landing/Navbar.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import ProblemSection from '@/components/landing/ProblemSection.vue'
import AboutSection from '@/components/landing/AboutSection.vue'
import HowItWorks from '@/components/landing/HowItWorks.vue'
import BenefitsSection from '@/components/landing/BenefitsSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import DashboardPreview from '@/components/landing/DashboardPreview.vue'
import DownloadSection from '@/components/landing/DownloadSection.vue'
import Footer from '@/components/landing/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-[#071A33] text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
    <Navbar />
    <main>
      <HeroSection />
      <ProblemSection />
      <AboutSection />
      <HowItWorks />
      
      <!-- Secção Banner Central / Frase de Impacto -->
      <section class="py-20 bg-gradient-to-r from-blue-900 via-[#0B2A4A] to-blue-950 border-y border-blue-500/20 text-center px-4">
        <div class="max-w-4xl mx-auto space-y-4">
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            "Você define o plano. A aplicação ajuda-o a controlá-lo."
          </h2>
          <p class="text-slate-300 text-sm sm:text-base">
            O seu dinheiro. O seu plano. O seu controlo.
          </p>
        </div>
      </section>

      <BenefitsSection />
      <FeaturesSection />
      <DashboardPreview />
      <DownloadSection />
    </main>
    <Footer />
  </div>
</template>