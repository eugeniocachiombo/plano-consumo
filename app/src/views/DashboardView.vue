<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
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
import Toast from 'primevue/toast';

import StatCard from '@/components/StatCard.vue';
import ConsumptionChart from '@/components/ConsumptionChart.vue';

import { useConsumptionStore } from '@/stores/consumption.store';
import { useConsumptionPlanStore } from '@/stores/consumption-plan.store';
import { useCategoryStore } from '@/stores/category.store';
import { useToast } from 'primevue/usetoast';

// Stores
const consumptionStore = useConsumptionStore();
const consumptionPlanStore = useConsumptionPlanStore();
const categoryStore = useCategoryStore();
const toast = useToast();

const periods = ['Últimos 6 meses', 'Este ano'];
const period = ref(periods[0]);
const showNew = ref(false);

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

// Formulário de Novo Consumo
const newConsumption = reactive({
  categoryId: null,
  description: '',
  value: null
});

// Erros de Validação
const fieldErrors = ref({});

function clearFieldError(field) {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field];
  }
}

function getErrorMessage(errorField) {
  if (!errorField) return '';
  return Array.isArray(errorField) ? errorField[0] : errorField;
}

function resetForm() {
  newConsumption.categoryId = null;
  newConsumption.description = '';
  newConsumption.value = null;
  fieldErrors.value = {};
}

function openCreateDialog() {
  resetForm();
  showNew.value = true;
}

function validateForm() {
  const errors = {};
  if (!newConsumption.categoryId) {
    errors.categoryId = 'Selecione uma categoria.';
  }
  if (newConsumption.value === null || newConsumption.value === undefined || isNaN(newConsumption.value) || newConsumption.value <= 0) {
    errors.value = 'Informe um valor válido maior que 0.';
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

// Opcoes de Categorias para o Select
const categoriesOptions = computed(() => {
  return (categoryStore.categories || []).map((c) => ({
    label: c.name,
    value: c.id
  }));
});

// Totais do Mes Atual
const currentMonthPlanTotal = computed(() => {
  const plans = consumptionPlanStore.consumptionPlans || [];
  return plans
    .filter((p) => Number(p.month) === currentMonth && Number(p.year) === currentYear)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
});

const currentMonthConsumptionTotal = computed(() => {
  const items = consumptionStore.consumptions || [];
  return items
    .filter((c) => Number(c.month) === currentMonth && Number(c.year) === currentYear)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
});

const remainingAmount = computed(() => {
  return currentMonthPlanTotal.value - currentMonthConsumptionTotal.value;
});

const availablePercent = computed(() => {
  if (currentMonthPlanTotal.value <= 0) return 0;
  const pct = (remainingAmount.value / currentMonthPlanTotal.value) * 100;
  return Math.max(0, Math.round(pct));
});

// Dados do Grafico
const chartData = computed(() => {
  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const items = consumptionStore.consumptions || [];

  if (period.value === 'Este ano') {
    return monthLabels.map((monthName, index) => {
      const monthNum = index + 1;
      const total = items
        .filter((c) => Number(c.year) === currentYear && Number(c.month) === monthNum)
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      return { month: monthName, value: total };
    });
  }

  // Ultimos 6 meses
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentDate.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = items
      .filter((c) => Number(c.year) === y && Number(c.month) === m)
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    result.push({ month: monthLabels[m - 1], value: total });
  }
  return result;
});

// Categorias do Mes Atual para a lista
const categoriesSummary = computed(() => {
  const categories = categoryStore.categories || [];
  const items = consumptionStore.consumptions || [];
  const monthTotal = currentMonthConsumptionTotal.value;

  return categories.map((cat) => {
    const totalCat = items
      .filter((c) => Number(c.categoryId) === Number(cat.id) && Number(c.month) === currentMonth && Number(c.year) === currentYear)
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const percent = monthTotal > 0 ? Math.round((totalCat / monthTotal) * 100) : 0;

    return {
      name: cat.name,
      value: totalCat,
      percent
    };
  });
});

// Ultimos Consumos para a Tabela
const recentConsumptions = computed(() => {
  const list = [...(consumptionStore.consumptions || [])];
  return list.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
});

function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0 Kz';
  return `${Number(val).toLocaleString('pt-AO')} Kz`;
}

function getCategoryName(categoryId, rowData) {
  if (rowData?.category?.name) return rowData.category.name;
  const list = categoryStore.categories || [];
  const cat = list.find((c) => Number(c.id) === Number(categoryId));
  return cat ? cat.name : `Categoria #${categoryId}`;
}

async function saveConsumption() {
  if (consumptionStore.isLoading) return;

  if (!validateForm()) return;

  try {
    await consumptionStore.create({
      categoryId: Number(newConsumption.categoryId),
      description: newConsumption.description ? newConsumption.description.trim() : null,
      amount: Number(newConsumption.value),
      month: currentMonth,
      year: currentYear
    });

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Consumo criado com sucesso.',
      life: 3500
    });

    resetForm();
    showNew.value = false;
  } catch (error) {
    const responseData = error?.response?.data;

    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }

    toast.add({
      severity: 'error',
      summary: 'Erro na Operação',
      detail: responseData?.message || 'Por favor, verifique os campos destacados e tente novamente.',
      life: 5000
    });
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      consumptionStore.list(),
      consumptionPlanStore.list(),
      categoryStore.list()
    ]);
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <Toast position="top-right" />

  <section>
    <div class="page-heading">
      <div>
        <h1>Dashboard</h1>
        <p>Acompanhe o seu plano de consumo mensal.</p>
      </div>
      <Button label="Novo consumo" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <div class="stats-grid">
      <StatCard
        label="Plano de consumo"
        :value="formatCurrency(currentMonthPlanTotal)"
        hint="Plano atual"
        hint-icon="pi pi-check"
        icon="pi pi-wallet"
      />
      <StatCard
        label="Gasto este mês"
        :value="formatCurrency(currentMonthConsumptionTotal)"
        hint="Total consumido"
        icon="pi pi-chart-line"
        icon-class="purple"
      />
      <StatCard
        label="Valor restante"
        :value="formatCurrency(remainingAmount)"
        :hint="`${availablePercent}% disponível`"
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
            <div v-for="category in categoriesSummary" :key="category.name" class="category-item">
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
        <DataTable :value="recentConsumptions" responsive-layout="scroll">
          <Column header="Data">
            <template #body="{ data }">
              {{ data.month }}/{{ data.year }}
            </template>
          </Column>
          <Column header="Categoria">
            <template #body="{ data }">
              {{ getCategoryName(data.categoryId, data) }}
            </template>
          </Column>
          <Column field="description" header="Descrição" />
          <Column header="Valor">
            <template #body="{ data }">
              <strong>{{ Number(data.amount || 0).toLocaleString('pt-AO') }} Kz</strong>
            </template>
          </Column>
          <Column header="Estado">
            <template #body>
              <Tag
                value="Confirmado"
                severity="success"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="showNew"
      modal
      append-to="self"
      header="Novo consumo"
      :style="{ width: '420px' }"
      :dismissableMask="!consumptionStore.isLoading"
      :closable="!consumptionStore.isLoading"
    >
      <form @submit.prevent="saveConsumption" class="form-grid" novalidate>
        <div class="field mt-4">
          <label class="required-label font-medium text-sm">Categoria</label>
          <Select
            v-model="newConsumption.categoryId"
            :options="categoriesOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione"
            class="w-full"
            :class="{ 'p-invalid': !!fieldErrors.categoryId }"
            :invalid="!!fieldErrors.categoryId"
            :disabled="consumptionStore.isLoading"
            aria-describedby="consumption-category-error"
            @change="clearFieldError('categoryId')"
            @update:modelValue="clearFieldError('categoryId')"
          />
          <small
            id="consumption-category-error"
            v-if="fieldErrors.categoryId"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.categoryId) }}</span>
          </small>
        </div>

        <div class="field">
          <label class="font-medium text-sm">Descrição</label>
          <InputText
            v-model="newConsumption.description"
            class="w-full"
            :class="{ 'p-invalid': !!fieldErrors.description }"
            :invalid="!!fieldErrors.description"
            :disabled="consumptionStore.isLoading"
            aria-describedby="consumption-description-error"
            @input="clearFieldError('description')"
          />
          <small
            id="consumption-description-error"
            v-if="fieldErrors.description"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.description) }}</span>
          </small>
        </div>

        <div class="field">
          <label class="required-label font-medium text-sm">Valor (Kz)</label>
          <InputNumber
            v-model="newConsumption.value"
            mode="currency"
            currency="AOA"
            locale="pt-AO"
            :min="0"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            placeholder="0,00"
            class="w-full"
            :class="{ 'p-invalid': !!fieldErrors.value }"
            :invalid="!!fieldErrors.value"
            :disabled="consumptionStore.isLoading"
            aria-describedby="consumption-value-error"
            @update:modelValue="clearFieldError('value')"
          />
          <small
            id="consumption-value-error"
            v-if="fieldErrors.value"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.value) }}</span>
          </small>
        </div>

        <div class="dialog-footer mt-4 flex justify-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            text
            :disabled="consumptionStore.isLoading"
            @click="showNew = false"
          />
          <Button
            type="submit"
            label="Guardar"
            :icon="consumptionStore.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :loading="consumptionStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<style scoped>
@import '../assets/dashboard.css';
</style>