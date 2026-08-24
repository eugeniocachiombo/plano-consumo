<template>
  <div class="stat-card">
    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      <strong class="stat-value">{{ value }}</strong>
      <span v-if="hint" class="stat-hint">
        <i :class="hintIcon"></i>
        {{ hint }}
      </span>
    </div>
    <div class="stat-icon" :class="iconClass">
      <i :class="icon"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  hint: String,
  hintIcon: {
    type: String,
    default: 'pi pi-arrow-up'
  },
  icon: String,
  iconClass: {
    type: String,
    default: ''
  }
});
</script>