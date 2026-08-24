<template>
  <div class="consumption-chart">
    <div
      v-for="item in data"
      :key="item.month"
      class="chart-column"
    >
      <div class="chart-value">{{ format(item.value) }}</div>
      <div class="chart-bar-area">
        <div class="chart-bar" :style="{ height: `${(item.value / max) * 100}%` }"></div>
      </div>
      <span>{{ item.month }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const max = computed(() => Math.max(...props.data.map(item => item.value), 1));

function format(value) {
  return new Intl.NumberFormat('pt-AO').format(value);
}
</script>