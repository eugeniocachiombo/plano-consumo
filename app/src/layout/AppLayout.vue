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

<style scoped>
:deep(.p-dialog),
:deep(.p-confirm-dialog),
:deep(.p-confirmdialog),
:deep(.theme-adapted-dialog.p-dialog) {
  background: var(--surface-card) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--text-color) !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25) !important;
}

:deep(.p-dialog .p-dialog-header),
:deep(.theme-adapted-dialog .p-dialog-header) {
  background: var(--surface-card) !important;
  color: var(--text-color) !important;
  border-bottom: 1px solid var(--surface-border) !important;
  padding: 1.25rem 1.5rem !important;
}

:deep(.p-dialog .p-dialog-title),
:deep(.theme-adapted-dialog .p-dialog-header .p-dialog-title) {
  color: var(--text-color) !important;
  font-weight: 600 !important;
}

:deep(.p-dialog .p-dialog-header-icon),
:deep(.p-dialog .p-dialog-close-button),
:deep(.p-dialog .p-dialog-maximize-button),
:deep(.theme-adapted-dialog .p-dialog-header-actions button) {
  color: var(--text-color-secondary) !important;
}

:deep(.p-dialog .p-dialog-header-icon:hover),
:deep(.p-dialog .p-dialog-close-button:hover),
:deep(.p-dialog .p-dialog-maximize-button:hover),
:deep(.theme-adapted-dialog .p-dialog-header-actions button:hover) {
  background: var(--surface-hover) !important;
  color: var(--text-color) !important;
}

:deep(.p-dialog .p-dialog-content),
:deep(.theme-adapted-dialog .p-dialog-content) {
  background: var(--surface-card) !important;
  color: var(--text-color) !important;
  padding: 1.25rem 1.5rem !important;
}

:deep(.p-dialog .p-dialog-footer),
:deep(.theme-adapted-dialog .p-dialog-footer) {
  background: var(--surface-card) !important;
  border-top: 1px solid var(--surface-border) !important;
  padding: 1rem 1.5rem !important;
}
</style>