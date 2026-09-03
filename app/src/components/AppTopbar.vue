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

      <!-- Botão/Área do Utilizador com Dropdown Trigger -->
      <div 
        class="topbar-user" 
        aria-haspopup="true" 
        aria-controls="user_menu"
        @click="toggleUserMenu"
      >
        <div class="avatar">EC</div>
        <div class="user-meta">
          <strong>Eugénio</strong>
          <small>Administrador</small>
        </div>
        <i class="pi pi-angle-down user-chevron"></i>
      </div>

      <Menu ref="userMenu" id="user_menu" :model="userMenuItems" :popup="true" />
      <ConfirmDialog />
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useUserStore } from '@/stores/user.store';

defineProps({
  darkMode: Boolean
});

defineEmits(['toggle-menu', 'toggle-dark']);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const confirm = useConfirm();

const userMenu = ref(null);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

// Executa o encerramento da sessão
const handleLogout = async () => {
    await userStore.logout();
    router.push('/');
};

// Confirmação antes de sair
const confirmLogout = () => {
  confirm.require({
    message: 'Tem certeza de que deseja encerrar a sua sessão?',
    header: 'Confirmar saída',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Sair',
    acceptClass: 'p-button-danger',
    accept: () => {
      handleLogout();
    }
  });
};

const userMenuItems = ref([
  {
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => {
      router.push({ name: 'perfil' });
    }
  },
  {
    separator: true
  },
  {
    label: 'Sair',
    icon: 'pi pi-sign-out',
    command: confirmLogout
  }
]);

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    consumos: 'Consumos',
    planos: 'Planos de consumo',
    categorias: 'Categorias',
    cartoes: 'Cartões',
    utilizadores: 'Utilizadores',
    perfil: 'Perfil'
  };

  return titles[route.name] || 'Dashboard';
});
</script>

<style scoped>
.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius, 6px);
  transition: background-color 0.2s;
}

.topbar-user:hover {
  background-color: var(--surface-hover, rgba(0, 0, 0, 0.04));
}

.user-chevron {
  font-size: 0.875rem;
  color: var(--text-color-secondary, #6c757d);
}
</style>