<template>
  <div>
    <div v-if="visible" class="menu-mask" @click="$emit('close')"></div>

    <aside class="app-sidebar" :class="{ 'is-open': visible }">
      <div class="brand">
        <div class="brand-logo">K</div>
        <div>
          <strong>PlanoK</strong>
          <small>Gestão de Consumo</small>
        </div>
      </div>

      <div class="menu-section">PRINCIPAL</div>

      <nav class="app-nav">
        <RouterLink to="/" class="menu-item" @click="$emit('close')">
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink to="/consumos" class="menu-item" @click="$emit('close')">
          <i class="pi pi-chart-line"></i>
          <span>Consumos</span>
        </RouterLink>

        <RouterLink to="/planos" class="menu-item" @click="$emit('close')">
          <i class="pi pi-wallet"></i>
          <span>Planos de consumo</span>
        </RouterLink>

        <RouterLink to="/categorias" class="menu-item" @click="$emit('close')">
          <i class="pi pi-tags"></i>
          <span>Categorias</span>
        </RouterLink>

        <div class="menu-section">GESTÃO</div>

        <RouterLink to="/cartoes" class="menu-item" @click="$emit('close')">
          <i class="pi pi-credit-card"></i>
          <span>Cartões</span>
        </RouterLink>

        <RouterLink to="/utilizadores" class="menu-item" @click="$emit('close')">
          <i class="pi pi-users"></i>
          <span>Utilizadores</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-help">
          <i class="pi pi-info-circle"></i>
          <div>
            <strong>Plano Standard</strong>
            <small>10.000 Kz / mês</small>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
});

defineEmits(['close']);
</script>