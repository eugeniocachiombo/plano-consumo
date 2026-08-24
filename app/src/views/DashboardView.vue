<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Dashboard</h1>
        <p>Acompanhe o seu plano de consumo mensal.</p>
      </div>
      <Button label="Novo consumo" icon="pi pi-plus" @click="showNew = true" />
    </div>

    <div class="stats-grid">
      <StatCard
        label="Plano de consumo"
        value="10.000 Kz"
        hint="Plano atual"
        hint-icon="pi pi-check"
        icon="pi pi-wallet"
      />
      <StatCard
        label="Gasto este mês"
        value="6.000 Kz"
        hint="+12% vs. mês anterior"
        icon="pi pi-chart-line"
        icon-class="purple"
      />
      <StatCard
        label="Valor restante"
        value="4.000 Kz"
        hint="40% disponível"
        icon="pi pi-money-bill"
        icon-class="green"
      />
    </div>

    <div class="dashboard-grid">
      <Card class="dashboard-card">
        <template #title>
          <div class="card-title-row">
            <span>Consumo mensal</span>
            <Select v-model="period" :options="periods" />
          </div>
        </template>
        <template #content>
          <ConsumptionChart :data="chartData" />
        </template>
      </Card>

      <Card class="dashboard-card">
        <template #title>
          <div class="card-title-row">
            <span>Resumo por categoria</span>
            <small>Este mês</small>
          </div>
        </template>
        <template #content>
          <div class="category-list">
            <div v-for="category in store.categories" :key="category.name" class="category-item">
              <div class="category-top">
                <span>{{ category.name }}</span>
                <strong>{{ category.value.toLocaleString('pt-AO') }} Kz</strong>
              </div>
              <ProgressBar :value="category.percent" :show-value="false" />
              <small>{{ category.percent }}% do consumo</small>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card class="dashboard-card">
      <template #title>
        <div class="card-title-row">
          <span>Últimos consumos</span>
          <Button label="Ver todos" text @click="$router.push('/consumos')" />
        </div>
      </template>

      <template #content>
        <DataTable :value="store.consumptions" responsive-layout="scroll">
          <Column field="date" header="Data" />
          <Column field="category" header="Categoria" />
          <Column field="description" header="Descrição" />
          <Column header="Valor">
            <template #body="{ data }">
              <strong>{{ data.value.toLocaleString('pt-AO') }} Kz</strong>
            </template>
          </Column>
          <Column header="Estado">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="data.status === 'Confirmado' ? 'success' : 'warn'"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="showNew" modal header="Novo consumo" :style="{ width: '420px' }">
      <div class="form-grid">
        <div class="field">
          <label>Categoria</label>
          <Select v-model="newConsumption.category" :options="categories" placeholder="Selecione" />
        </div>
        <div class="field">
          <label>Descrição</label>
          <InputText v-model="newConsumption.description" />
        </div>
        <div class="field">
          <label>Valor (Kz)</label>
          <InputNumber v-model="newConsumption.value" :min="0" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showNew = false" />
        <Button label="Guardar" icon="pi pi-check" @click="saveConsumption" />
      </template>
    </Dialog>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import ProgressBar from 'primevue/progressbar';
import Select from 'primevue/select';
import Tag from 'primevue/tag';

import StatCard from '@/components/StatCard.vue';
import ConsumptionChart from '@/components/ConsumptionChart.vue';
import { dashboardStore as store } from '@/stores/dashboard';

const periods = ['Últimos 6 meses', 'Este ano'];
const period = ref(periods[0]);
const categories = ['Alimentação', 'Bebidas', 'Transporte', 'Lazer', 'Outros'];
const showNew = ref(false);

const newConsumption = reactive({
  category: '',
  description: '',
  value: 0
});

const chartData = computed(() => [
  { month: 'Mar', value: 3400 },
  { month: 'Abr', value: 4900 },
  { month: 'Mai', value: 6100 },
  { month: 'Jun', value: 4300 },
  { month: 'Jul', value: 7500 },
  { month: 'Ago', value: 6000 }
]);

function saveConsumption() {
  if (!newConsumption.category || !newConsumption.description || !newConsumption.value) return;

  store.consumptions.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('pt-AO'),
    category: newConsumption.category,
    description: newConsumption.description,
    value: newConsumption.value,
    status: 'Confirmado'
  });

  newConsumption.category = '';
  newConsumption.description = '';
  newConsumption.value = 0;
  showNew.value = false;
}
</script>