<template>
  <header class="app-topbar">
    <div class="topbar-left">
      <Button icon="pi pi-bars" text rounded severity="secondary" aria-label="Abrir menu"
        @click="$emit('toggle-menu')" />

      <div class="breadcrumb">
        <i class="pi pi-home"></i>
        <span>PlanoK</span>
        <i class="pi pi-angle-right"></i>
        <strong>{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="topbar-actions">
      <Button :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'" text rounded severity="secondary" aria-label="Alternar tema"
        @click="$emit('toggle-dark')" />

      <Button icon="pi pi-bell" text rounded severity="secondary" aria-label="Notificações" />

      <!-- Botão/Área do Utilizador com Dropdown Trigger -->
      <div class="topbar-user textcolor" aria-haspopup="true" aria-controls="user_menu" @click="toggleUserMenu">
        <div class="avatar">
          {{ userInitials }}
        </div>
        <div class="user-meta">
          <strong>
            {{ formatTitleCase(userStore?.currentUser?.name, 'Não Encontrado') }}
          </strong>

          <small>
            {{ formatTitleCase(userStore?.currentUser?.profile, 'Consumidor') }}
          </small>
        </div>
        <i class="pi pi-angle-down user-chevron"></i>
      </div>

      <!-- Menu da Topbar -->
      <Menu ref="userMenu" id="user_menu" :model="userMenuItems" :popup="true" append-to=".app-shell"
        class="theme-adapted-dialog" />

      <!-- Dialog Personalizado para Confirmação de Saída -->
      <Dialog v-model:visible="isLogoutDialogVisible" header="Confirmar saída" :modal="true"
        :dismissableMask="!isLoggingOut" :closable="!isLoggingOut" append-to=".app-shell" class="theme-adapted-dialog"
        style="width: 100%; max-width: 450px;">
        <div class="flex items-start gap-4 py-2">
          <i class="pi pi-exclamation-triangle text-amber-500 text-3xl flex-shrink-0 mt-1"></i>
          <p class="text-sm leading-relaxed">
            Tem certeza de que deseja encerrar a sua sessão?
          </p>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <Button label="Cancelar" class="p-button-text p-button-secondary" :disabled="isLoggingOut"
              @click="isLogoutDialogVisible = false" />
            <Button label="Sair" icon="pi pi-sign-out" class="p-button-danger" :loading="isLoggingOut"
              @click="handleLogout" />
          </div>
        </template>
      </Dialog>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import { useUserStore } from '@/stores/user.store';

defineProps({
  darkMode: Boolean
});

defineEmits(['toggle-menu', 'toggle-dark']);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userMenu = ref(null);

const isLogoutDialogVisible = ref(false);
const isLoggingOut = ref(false);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await userStore.logout();
  } finally {
    isLoggingOut.value = false;
    isLogoutDialogVisible.value = false;
  }
};

const confirmLogout = () => {
  isLogoutDialogVisible.value = true;
};

const userInitials = computed(() => {
  const name = userStore?.currentUser?.name;
  if (!name) return 'PK';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

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

function formatTitleCase(value, defaultValue = '') {
  if (!value) return defaultValue;

  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

onMounted(async () => {
  await userStore.initUser();
});
</script>

<style scoped>
.textcolor {
  color: var(--text-color);
}
</style>