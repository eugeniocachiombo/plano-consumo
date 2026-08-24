<template>
  <div class="app-shell" :class="{ 'app-dark': darkMode }">
    <AppMenu :visible="menuVisible" @close="menuVisible = false" />

    <div class="app-main">
      <AppTopbar
        :dark-mode="darkMode"
        @toggle-menu="menuVisible = !menuVisible"
        @toggle-dark="darkMode = !darkMode"
      />

      <main class="app-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import AppMenu from '@/components/AppMenu.vue';
import AppTopbar from '@/components/AppTopbar.vue';

const menuVisible = ref(false);
const darkMode = ref(false);
</script>