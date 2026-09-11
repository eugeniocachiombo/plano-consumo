<template>
  <Toast style="width: auto;" />
  <RouterView />
</template>

<script setup>
import Toast from 'primevue/toast';
import { RouterView } from 'vue-router';
</script>