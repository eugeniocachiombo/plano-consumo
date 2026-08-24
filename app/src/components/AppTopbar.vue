<template>
  <header class="app-topbar">
    <div class="topbar-left">
      <Button
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        aria-label="Abrir menu"
        @click="$emit('toggle-menu')"
      />

      <div class="breadcrumb">
        <i class="pi pi-home"></i>
        <span>PlanoK</span>
        <i class="pi pi-angle-right"></i>
        <strong>{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="topbar-actions">
      <Button
        :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
        text
        rounded
        severity="secondary"
        aria-label="Alternar tema"
        @click="$emit('toggle-dark')"
      />

      <Button icon="pi pi-bell" text rounded severity="secondary" aria-label="Notificações" />

      <div class="topbar-user">
        <div class="avatar">EC</div>
        <div class="user-meta">
          <strong>Eugénio</strong>
          <small>Administrador</small>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';

defineProps({
  darkMode: Boolean
});

defineEmits(['toggle-menu', 'toggle-dark']);

const route = useRoute();

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    consumos: 'Consumos',
    planos: 'Planos de consumo',
    categorias: 'Categorias',
    cartoes: 'Cartões',
    utilizadores: 'Utilizadores'
  };

  return titles[route.name] || 'Dashboard';
});
</script>