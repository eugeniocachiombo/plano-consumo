<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import { useConsumptionPlanStore } from '@/stores/consumption-plan.store';
import { useCategoryStore } from '@/stores/category.store';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const consumptionPlanStore = useConsumptionPlanStore();
const categoryStore = useCategoryStore();

const toast = useToast();
const confirm = useConfirm();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const rowsPerPage = ref(10);

const searchQuery = ref('');
const selectedCategoryFilter = ref(null);
const selectedMonthFilter = ref(null);
const selectedYearFilter = ref(null);
const isFilterExpandedOnMobile = ref(false);

const getCurrentMonth = () => new Date().getMonth() + 1;

const form = reactive({
  amount: null,
  month: getCurrentMonth(),
  year: new Date().getFullYear(),
  categoryId: null
});

const fieldErrors = ref({});

const monthsOptions = [
  { label: 'Janeiro', value: 1 },
  { label: 'Fevereiro', value: 2 },
  { label: 'Março', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Maio', value: 5 },
  { label: 'Junho', value: 6 },
  { label: 'Julho', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Setembro', value: 9 },
  { label: 'Outubro', value: 10 },
  { label: 'Novembro', value: 11 },
  { label: 'Dezembro', value: 12 }
];

const categoriesOptions = computed(() => {
  return (categoryStore.categories || []).map((c) => ({
    label: c.name,
    value: c.id
  }));
});

const yearsOptions = computed(() => {
  const plans = consumptionPlanStore.consumptionPlans || [];
  const yearsSet = new Set(plans.map((p) => Number(p.year)).filter((y) => !isNaN(y) && y > 0));
  
  const currentYear = new Date().getFullYear();
  yearsSet.add(currentYear);

  return Array.from(yearsSet)
    .sort((a, b) => b - a)
    .map((y) => ({ label: String(y), value: y }));
});

const formYearsOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = currentYear; year > currentYear - 5; year--) {
    years.push({ label: String(year), value: year });
  }

  if (form.year && !years.some((y) => y.value === form.year)) {
    years.push({ label: String(form.year), value: form.year });
    years.sort((a, b) => b.value - a.value);
  }

  return years;
});

const filteredPlans = computed(() => {
  let list = consumptionPlanStore.consumptionPlans || [];

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((plan) => {
      const planId = String(plan.id || '');
      const amount = String(plan.amount || '');
      const year = String(plan.year || '');
      const categoryName = getCategoryName(plan.categoryId, plan).toLowerCase();
      const monthName = getMonthName(plan.month).toLowerCase();

      return (
        planId.includes(q) ||
        amount.includes(q) ||
        year.includes(q) ||
        categoryName.includes(q) ||
        monthName.includes(q)
      );
    });
  }

  if (selectedCategoryFilter.value !== null) {
    list = list.filter((plan) => Number(plan.categoryId) === Number(selectedCategoryFilter.value));
  }

  if (selectedMonthFilter.value !== null) {
    list = list.filter((plan) => Number(plan.month) === Number(selectedMonthFilter.value));
  }

  if (selectedYearFilter.value !== null) {
    list = list.filter((plan) => Number(plan.year) === Number(selectedYearFilter.value));
  }

  return list;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchQuery.value && searchQuery.value.trim() !== '') count++;
  if (selectedCategoryFilter.value !== null) count++;
  if (selectedMonthFilter.value !== null) count++;
  if (selectedYearFilter.value !== null) count++;
  return count;
});

const totalPlannedAmount = computed(() => {
  return filteredPlans.value.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
});

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategoryFilter.value = null;
  selectedMonthFilter.value = null;
  selectedYearFilter.value = null;
}

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
  form.amount = null;
  form.month = getCurrentMonth();
  form.year = new Date().getFullYear();
  form.categoryId = null;
  fieldErrors.value = {};
}

function openCreateDialog() {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  isDialogVisible.value = true;
}

function openEditDialog(plan) {
  isEditing.value = true;
  editingId.value = plan.id;
  form.amount = plan.amount !== null && plan.amount !== undefined ? Number(plan.amount) : null;
  form.month = plan.month ? Number(plan.month) : getCurrentMonth();
  form.year = plan.year ? Number(plan.year) : new Date().getFullYear();
  form.categoryId = plan.categoryId ? Number(plan.categoryId) : null;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

function validateForm() {
  const errors = {};
  if (!form.categoryId) errors.categoryId = 'Selecione uma categoria.';
  if (!form.month) errors.month = 'Selecione um mês.';
  if (!form.year) errors.year = 'Selecione um ano válido.';
  if (form.amount === null || form.amount === undefined || isNaN(form.amount) || form.amount <= 0) {
    errors.amount = 'Informe um montante válido maior que 0.';
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function handleSave() {
  if (consumptionPlanStore.isLoading) return;

  // if (!validateForm()) return;

  try {
    const payload = {
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year),
      categoryId: Number(form.categoryId)
    };

    if (isEditing.value) {
      await consumptionPlanStore.update(editingId.value, payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Plano de consumo actualizado com sucesso.',
        life: 3500
      });
    } else {
      await consumptionPlanStore.create(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Plano de consumo criado com sucesso.',
        life: 3500
      });
    }

    isDialogVisible.value = false;
  } catch (error) {
    const responseData = error?.response?.data;

    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }

    console.log("ok")

    toast.add({
      severity: 'error',
      summary: 'Erro na Operação',
      detail: responseData?.message || 'Por favor, verifique os campos destacados e tente novamente.',
      life: 5000
    });
  }
}

function confirmDelete(plan) {
  const categoryName = getCategoryName(plan.categoryId, plan);
  const period = `${getMonthName(plan.month)} / ${plan.year}`;

  confirm.require({
    message: `Tem a certeza que deseja eliminar o plano de consumo da categoria "${categoryName}" referente a ${period}? Esta acção é irreversível.`,
    header: 'Confirmar Eliminação',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await consumptionPlanStore.remove(plan.id);
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Plano de consumo eliminado com sucesso.',
          life: 3500
        });
      } catch (error) {
        const responseData = error?.response?.data;
        toast.add({
          severity: 'error',
          summary: 'Erro ao Eliminar',
          detail: responseData?.message || 'Não foi possível eliminar o plano de consumo.',
          life: 5000
        });
      }
    }
  });
}

async function reloadData() {
  try {
    await Promise.all([
      consumptionPlanStore.list(),
      categoryStore.list()
    ]);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro de Carregamento',
      detail: 'Não foi possível carregar os dados dos planos.',
      life: 5000
    });
  }
}

function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return '0,00 Kz';
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  }).format(Number(value));
}

function getMonthName(monthNumber) {
  const found = monthsOptions.find((m) => m.value === Number(monthNumber));
  return found ? found.label : String(monthNumber || '');
}

function getCategoryName(categoryId, rowData) {
  if (rowData?.category?.name) return rowData.category.name;
  const list = categoryStore.categories || [];
  const cat = list.find((c) => Number(c.id) === Number(categoryId));
  return cat ? cat.name : `Categoria #${categoryId}`;
}

onMounted(async () => {
  await reloadData();
});
</script>

<template>
  <Toast position="top-right" />

  <ConfirmDialog class="theme-adapted-dialog" append-to="self" />

  <section class="consumption-plan-page category-page">
    <header class="page-heading">
      <div class="heading-content">
        <div class="title-with-badge">
          <h1>Planos de Consumo</h1>
          <Tag
            v-if="consumptionPlanStore.consumptionPlans"
            :value="consumptionPlanStore.consumptionPlans.length"
            severity="info"
            class="count-badge"
            aria-label="Total de planos de consumo"
          />
        </div>
        <p>Planeie e monitorize a previsão de despesas e orçamentos do seu perfil.</p>
      </div>
      <div class="heading-actions">
        <Button
          label="Novo plano"
          icon="pi pi-plus"
          class="p-button-primary btn-add"
          :disabled="consumptionPlanStore.isLoading"
          @click="openCreateDialog"
        />
      </div>
    </header>

    <div class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-primary-soft">
          <i class="pi pi-wallet"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Total Planeado (Filtrado)</span>
          <span class="kpi-value text-green-value">{{ formatCurrency(totalPlannedAmount) }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-info-soft">
          <i class="pi pi-list"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Planos Exibidos</span>
          <span class="kpi-value">{{ filteredPlans.length }} / {{ consumptionPlanStore.consumptionPlans?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-warning-soft">
          <i class="pi pi-filter"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Filtros Activos</span>
          <span class="kpi-value">
            {{ activeFiltersCount > 0 ? `${activeFiltersCount} aplicado(s)` : 'Nenhum' }}
          </span>
        </div>
      </div>
    </div>

    <Card class="table-card border-none shadow-1">
      <template #content>
        <DataTable
          :value="filteredPlans"
          :loading="consumptionPlanStore.isLoading"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="A mostrar {first} até {last} de {totalRecords} planos"
          class="custom-datatable p-datatable-sm"
          dataKey="id"
        >
          <template #header>
            <div class="table-header-wrapper table-header">
              <div class="filter-top-row">
                <div class="search-container">
                  <i class="pi pi-search search-icon" aria-hidden="true" />
                  <InputText
                    v-model="searchQuery"
                    placeholder="Pesquisar por ID, categoria, mês, ano ou montante..."
                    class="search-input theme-input"
                    aria-label="Pesquisar planos de consumo"
                  />
                  <Button
                    v-if="searchQuery"
                    icon="pi pi-times"
                    class="p-button-text p-button-rounded clear-search-btn"
                    aria-label="Limpar pesquisa"
                    @click="searchQuery = ''"
                  />
                </div>

                <div class="toolbar-actions">
                  <Button
                    class="p-button-outlined p-button-secondary filter-toggle-btn sm:hidden"
                    :class="{ 'filter-active': activeFiltersCount > 0 }"
                    @click="isFilterExpandedOnMobile = !isFilterExpandedOnMobile"
                  >
                    <i class="pi pi-filter"></i>
                    <span>Filtros</span>
                    <Badge v-if="activeFiltersCount > 0" :value="activeFiltersCount" severity="info" />
                  </Button>

                  <Button
                    icon="pi pi-refresh"
                    class="p-button-text p-button-secondary p-button-rounded refresh-btn"
                    v-tooltip.top="'Actualizar lista'"
                    aria-label="Actualizar lista de planos de consumo"
                    :loading="consumptionPlanStore.isLoading"
                    @click="reloadData"
                  />
                </div>
              </div>

              <div class="filter-selectors-grid" :class="{ 'mobile-hidden': !isFilterExpandedOnMobile }">
                <div class="filter-item">
                  <label class="filter-label font-medium text-xs">Categoria</label>
                  <Dropdown
                    v-model="selectedCategoryFilter"
                    :options="categoriesOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todas as categorias"
                    showClear
                    filter
                    class="search-input-field theme-input"
                    panelClass="theme-dropdown-panel"
                  />
                </div>

                <div class="filter-item">
                  <label class="filter-label font-medium text-xs">Mês</label>
                  <Dropdown
                    v-model="selectedMonthFilter"
                    :options="monthsOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos os meses"
                    showClear
                    class="search-input-field theme-input"
                    panelClass="theme-dropdown-panel"
                  />
                </div>

                <div class="filter-item">
                  <label class="filter-label font-medium text-xs">Ano</label>
                  <Dropdown
                    v-model="selectedYearFilter"
                    :options="yearsOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos os anos"
                    showClear
                    class="search-input-field theme-input"
                    panelClass="theme-dropdown-panel"
                  />
                </div>

                <div class="filter-item filter-action-item">
                  <Button
                    v-if="activeFiltersCount > 0"
                    label="Limpar Filtros"
                    icon="pi pi-filter-slash"
                    class="p-button-text p-button-danger p-button-sm btn-clear-filters"
                    @click="clearAllFilters"
                  />
                </div>
              </div>

              <div v-if="activeFiltersCount > 0" class="active-chips-bar">
                <span class="chips-title">Filtros aplicados:</span>
                <Tag v-if="searchQuery" severity="info" class="filter-chip">
                  <span>Pesquisa: "{{ searchQuery }}"</span>
                  <i class="pi pi-times chip-remove" @click="searchQuery = ''"></i>
                </Tag>
                <Tag v-if="selectedCategoryFilter !== null" severity="info" class="filter-chip">
                  <span>Cat: {{ getCategoryName(selectedCategoryFilter) }}</span>
                  <i class="pi pi-times chip-remove" @click="selectedCategoryFilter = null"></i>
                </Tag>
                <Tag v-if="selectedMonthFilter !== null" severity="info" class="filter-chip">
                  <span>Mês: {{ getMonthName(selectedMonthFilter) }}</span>
                  <i class="pi pi-times chip-remove" @click="selectedMonthFilter = null"></i>
                </Tag>
                <Tag v-if="selectedYearFilter !== null" severity="info" class="filter-chip">
                  <span>Ano: {{ selectedYearFilter }}</span>
                  <i class="pi pi-times chip-remove" @click="selectedYearFilter = null"></i>
                </Tag>
              </div>
            </div>
          </template>

          <template #loading>
            <div class="table-loading-state">
              <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
              <span>A carregar planos de consumo...</span>
            </div>
          </template>

          <template #empty>
            <div class="empty-state">
              <div class="empty-icon-wrapper">
                <i :class="activeFiltersCount > 0 ? 'pi pi-filter-slash' : 'pi pi-folder-open'"></i>
              </div>

              <template v-if="activeFiltersCount > 0">
                <p class="empty-title">Nenhum resultado encontrado</p>
                <p class="empty-subtitle">
                  Não encontramos nenhum plano de consumo correspondente aos filtros seleccionados.
                </p>
                <Button
                  label="Limpar Filtros"
                  icon="pi pi-filter-slash"
                  class="p-button-outlined p-button-sm mt-3"
                  @click="clearAllFilters"
                />
              </template>

              <template v-else>
                <p class="empty-title">Ainda não existem planos de consumo</p>
                <p class="empty-subtitle">
                  Comece por planear os seus orçamentos mensais adicionando o seu primeiro registo.
                </p>
                <Button
                  label="Criar Novo Plano"
                  icon="pi pi-plus"
                  class="p-button-primary p-button-sm mt-3"
                  @click="openCreateDialog"
                />
              </template>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 110px" sortable>
            <template #body="{ data }">
              <span class="id-badge">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="categoryId" header="Categoria" sortable>
            <template #body="{ data }">
              <span class="category-name-cell">{{ getCategoryName(data.categoryId, data) }}</span>
            </template>
          </Column>

          <Column field="month" header="Mês" sortable style="width: 140px">
            <template #body="{ data }">
              {{ getMonthName(data.month) }}
            </template>
          </Column>

          <Column field="year" header="Ano" sortable style="width: 110px">
            <template #body="{ data }">
              {{ data.year }}
            </template>
          </Column>

          <Column field="amount" header="Montante Planeado" sortable>
            <template #body="{ data }">
              <span class="font-semibold text-green-value">
                {{ formatCurrency(data.amount) }}
              </span>
            </template>
          </Column>

          <Column header="Acções" style="width: 140px; text-align: center">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded p-button-warning action-btn"
                  v-tooltip.top="'Editar'"
                  aria-label="Editar Plano de Consumo"
                  @click="openEditDialog(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-rounded p-button-danger action-btn"
                  v-tooltip.top="'Eliminar'"
                  aria-label="Eliminar Plano de Consumo"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="isDialogVisible"
      :header="isEditing ? 'Editar Plano de Consumo' : 'Novo Plano de Consumo'"
      :modal="true"
      :dismissableMask="!consumptionPlanStore.isLoading"
      :closable="!consumptionPlanStore.isLoading"
      append-to="self"
      class="consumption-plan-dialog theme-adapted-dialog"
      style="width: 100%; max-width: 500px"
    >
      <form @submit.prevent="handleSave" class="form-grid" novalidate>
        <div class="field">
          <label for="plan-category" class="required-label font-medium text-sm">Categoria</label>
          <Dropdown
            id="plan-category"
            v-model="form.categoryId"
            :options="categoriesOptions"
            optionLabel="label"
            optionValue="value"
            filter
            showClear
            placeholder="Selecione uma categoria"
            class="w-full search-input-field theme-input"
            panelClass="theme-dropdown-panel"
            :class="{ 'p-invalid': !!fieldErrors.categoryId }"
            :invalid="!!fieldErrors.categoryId"
            :disabled="consumptionPlanStore.isLoading"
            aria-describedby="plan-category-error"
            @change="clearFieldError('categoryId')"
            @update:modelValue="clearFieldError('categoryId')"
          />
          <small
            id="plan-category-error"
            v-if="fieldErrors.categoryId"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.categoryId) }}</span>
          </small>
        </div>

        <div class="w-full flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2 field">
            <label for="plan-month" class="required-label font-medium text-sm">Mês</label>
            <Dropdown
              id="plan-month"
              v-model="form.month"
              :options="monthsOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Mês"
              class="w-full search-input-field theme-input"
              panelClass="theme-dropdown-panel"
              :class="{ 'p-invalid': !!fieldErrors.month }"
              :invalid="!!fieldErrors.month"
              :disabled="consumptionPlanStore.isLoading"
              aria-describedby="plan-month-error"
              @change="clearFieldError('month')"
              @update:modelValue="clearFieldError('month')"
            />
            <small
              id="plan-month-error"
              v-if="fieldErrors.month"
              class="p-error-message"
              role="alert"
            >
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getErrorMessage(fieldErrors.month) }}</span>
            </small>
          </div>

          <div class="w-full sm:w-1/2 field">
            <label for="plan-year" class="required-label font-medium text-sm">Ano</label>
            <Dropdown
              id="plan-year"
              v-model="form.year"
              :options="formYearsOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione o ano"
              class="w-full search-input-field theme-input"
              panelClass="theme-dropdown-panel"
              :class="{ 'p-invalid': !!fieldErrors.year }"
              :invalid="!!fieldErrors.year"
              :disabled="consumptionPlanStore.isLoading"
              aria-describedby="plan-year-error"
              @change="clearFieldError('year')"
              @update:modelValue="clearFieldError('year')"
            />
            <small
              id="plan-year-error"
              v-if="fieldErrors.year"
              class="p-error-message"
              role="alert"
            >
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getErrorMessage(fieldErrors.year) }}</span>
            </small>
          </div>
        </div>

        <div class="field">
          <label for="plan-amount" class="required-label font-medium text-sm">Montante Planeado (Kz)</label>
          <InputNumber
            id="plan-amount"
            v-model="form.amount"
            mode="currency"
            currency="AOA"
            locale="pt-AO"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            placeholder="0,00"
            class="w-full search-input-field theme-input"
            inputClass="theme-input-element w-full"
            :class="{ 'p-invalid': !!fieldErrors.amount }"
            :invalid="!!fieldErrors.amount"
            :disabled="consumptionPlanStore.isLoading"
            aria-describedby="plan-amount-error"
            @update:modelValue="clearFieldError('amount')"
          />
          <small
            id="plan-amount-error"
            v-if="fieldErrors.amount"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.amount) }}</span>
          </small>
        </div>

        <div class="dialog-footer">
          <Button
            type="button"
            label="Cancelar"
            class="p-button-text p-button-secondary"
            :disabled="consumptionPlanStore.isLoading"
            @click="isDialogVisible = false"
          />
          <Button
            type="submit"
            :label="isEditing ? 'Actualizar' : 'Guardar'"
            :icon="consumptionPlanStore.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            class="p-button-primary"
            :loading="consumptionPlanStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<style scoped>
  @import '../assets/crud.css';
  @import '../assets/mobile.css';
</style>