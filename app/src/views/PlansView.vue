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

const searchQuery = ref('');
const rowsPerPage = ref(10);

const form = reactive({
  amount: null,
  month: null,
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
  form.month = null;
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
  form.amount = Number(plan.amount);
  form.month = plan.month;
  form.year = plan.year;
  form.categoryId = plan.categoryId;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

async function handleSave() {
  if (consumptionPlanStore.isLoading) return;

  fieldErrors.value = {};

  try {
    const payload = {
      amount: form.amount !== null && form.amount !== undefined ? Number(form.amount) : null,
      month: form.month !== null && form.month !== undefined ? Number(form.month) : null,
      year: form.year !== null && form.year !== undefined ? Number(form.year) : null,
      categoryId: form.categoryId !== null && form.categoryId !== undefined ? Number(form.categoryId) : null
    };

    if (isEditing.value) {
      await consumptionPlanStore.update(editingId.value, payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Plano de consumo atualizado com sucesso.',
        life: 3000
      });
    } else {
      await consumptionPlanStore.create(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Plano de consumo criado com sucesso.',
        life: 3000
      });
    }

    isDialogVisible.value = false;
  } catch (error) {
    const responseData = error?.response?.data;

    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }

    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: responseData?.message || 'Por favor, verifique os campos destacados.',
      life: 4000
    });
  }
}

function confirmDelete(plan) {
  confirm.require({
    message: 'Tem a certeza que deseja eliminar este plano de consumo? Esta acção não pode ser desfeita.',
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
          detail: 'Registo apagado com sucesso.',
          life: 3000
        });
      } catch (error) {
        const responseData = error?.response?.data;
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: responseData?.message || 'Não foi possível eliminar o plano de consumo.',
          life: 4000
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
      summary: 'Erro',
      detail: 'Não foi possível carregar os dados.',
      life: 4000
    });
  }
}

function formatCurrency(value) {
  if (value === null || value === undefined) return '0,00 Kz';
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  }).format(value);
}

function getMonthName(monthNumber) {
  const found = monthsOptions.find((m) => m.value === monthNumber);
  return found ? found.label : String(monthNumber);
}

function getCategoryName(categoryId, rowData) {
  if (rowData?.category?.name) return rowData.category.name;
  const list = categoryStore.categories || [];
  const cat = list.find((c) => c.id === categoryId);
  return cat ? cat.name : `Categoria #${categoryId}`;
}

onMounted(async () => {
  await reloadData();
});
</script>

<template>
  <Toast position="top-right" />

  <ConfirmDialog class="custom-dark-dialog" append-to="self" />

  <section class="consumption-plan-page">
    <!-- Cabeçalho da Página -->
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

    <!-- Card da Tabela e Conteúdo -->
    <Card class="table-card border-none shadow-1">
      <template #content>
        <DataTable
          :value="consumptionPlanStore.consumptionPlans"
          :loading="consumptionPlanStore.isLoading"
          :globalFilterFields="['id', 'amount', 'year']"
          :filters="{ global: { value: searchQuery, matchMode: 'contains' } }"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="A mostrar {first} até {last} de {totalRecords} planos"
          emptyMessage="Nenhum plano de consumo encontrado."
          class="custom-datatable p-datatable-sm"
          dataKey="id"
        >
          <template #header>
            <div class="table-header">
              <div class="search-container">
                <i class="pi pi-search search-icon" aria-hidden="true" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Pesquisar por ID, montante ou ano..."
                  class="search-input dark-field"
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
              <Button
                icon="pi pi-refresh"
                class="p-button-text p-button-secondary p-button-rounded refresh-btn"
                v-tooltip.top="'Actualizar lista'"
                aria-label="Actualizar lista de planos de consumo"
                :loading="consumptionPlanStore.isLoading"
                @click="reloadData"
              />
            </div>
          </template>

          <template #loading>
            <div class="table-loading-state">
              <i class="pi pi-spin pi-spinner text-2xl text-primary mb-2"></i>
              <span>A carregar os seus planos de consumo...</span>
            </div>
          </template>

          <template #empty>
            <div class="empty-state">
              <div class="empty-icon-wrapper">
                <i class="pi pi-folder-open"></i>
              </div>
              <p class="empty-title">Nenhum plano de consumo encontrado</p>
              <p class="empty-subtitle" v-if="searchQuery">
                Nenhum resultado corresponde à pesquisa "<strong>{{ searchQuery }}</strong>".
              </p>
              <p class="empty-subtitle" v-else>
                Comece por adicionar o seu primeiro plano de consumo.
              </p>
              <Button
                v-if="!searchQuery"
                label="Criar Plano"
                icon="pi pi-plus"
                class="p-button-outlined p-button-sm mt-3"
                @click="openCreateDialog"
              />
              <Button
                v-else
                label="Limpar Pesquisa"
                icon="pi pi-filter-slash"
                class="p-button-text p-button-sm mt-3"
                @click="searchQuery = ''"
              />
            </div>
          </template>

          <Column field="id" header="ID" style="width: 110px" sortable>
            <template #body="{ data }">
              <span class="id-badge">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="categoryId" header="Categoria" sortable>
            <template #body="{ data }">
              <span class="font-medium">{{ getCategoryName(data.categoryId, data) }}</span>
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
              <span class="font-semibold text-green-400">
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

    <!-- Dialog de Criação / Edição -->
    <Dialog
      v-model:visible="isDialogVisible"
      :header="isEditing ? 'Editar Plano de Consumo' : 'Novo Plano de Consumo'"
      :modal="true"
      :dismissableMask="!consumptionPlanStore.isLoading"
      :closable="!consumptionPlanStore.isLoading"
      append-to="self"
      class="consumption-plan-dialog custom-dark-dialog"
      style="width: 100%; max-width: 500px"
    >
      <form @submit.prevent="handleSave" class="w-full flex flex-col gap-5 pt-2" novalidate>
        <!-- Categoria -->
        <div class="w-full flex flex-col gap-1.5">
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
            class="w-full search-input-field custom-dark-input"
            panelClass="custom-dark-dropdown-panel"
            :class="{ 'p-invalid': !!fieldErrors.categoryId }"
            :invalid="!!fieldErrors.categoryId"
            :disabled="consumptionPlanStore.isLoading"
            aria-describedby="plan-category-error"
            @change="clearFieldError('categoryId')"
            @update:modelValue="clearFieldError('categoryId')"
          />
          <small id="plan-category-error" v-if="fieldErrors.categoryId" class="p-error-message text-red-400 text-xs flex items-center gap-1 mt-1" role="alert">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.categoryId) }}</span>
          </small>
        </div>

        <!-- Mês + Ano -->
        <div class="w-full flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2 flex flex-col gap-1.5">
            <label for="plan-month" class="required-label font-medium text-sm">Mês</label>
            <Dropdown
              id="plan-month"
              v-model="form.month"
              :options="monthsOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Mês"
              class="w-full search-input-field custom-dark-input"
              panelClass="custom-dark-dropdown-panel"
              :class="{ 'p-invalid': !!fieldErrors.month }"
              :invalid="!!fieldErrors.month"
              :disabled="consumptionPlanStore.isLoading"
              aria-describedby="plan-month-error"
              @change="clearFieldError('month')"
              @update:modelValue="clearFieldError('month')"
            />
            <small id="plan-month-error" v-if="fieldErrors.month" class="p-error-message text-red-400 text-xs flex items-center gap-1 mt-1" role="alert">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getErrorMessage(fieldErrors.month) }}</span>
            </small>
          </div>

          <div class="w-full sm:w-1/2 flex flex-col gap-1.5">
            <label for="plan-year" class="required-label font-medium text-sm">Ano</label>
            <InputNumber
              id="plan-year"
              v-model="form.year"
              :useGrouping="false"
              :min="2000"
              :max="2100"
              disabled
              placeholder="Ex: 2026"
              class="w-full search-input-field custom-dark-input"
              inputClass="custom-dark-input-element w-full"
              :class="{ 'p-invalid': !!fieldErrors.year }"
              :invalid="!!fieldErrors.year"
              :disabled="consumptionPlanStore.isLoading"
              aria-describedby="plan-year-error"
              @update:modelValue="clearFieldError('year')"
            />
            <small id="plan-year-error" v-if="fieldErrors.year" class="p-error-message text-red-400 text-xs flex items-center gap-1 mt-1" role="alert">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getErrorMessage(fieldErrors.year) }}</span>
            </small>
          </div>
        </div>

        <!-- Montante -->
        <div class="w-full flex flex-col gap-1.5">
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
            class="w-full search-input-field custom-dark-input"
            inputClass="custom-dark-input-element w-full"
            :class="{ 'p-invalid': !!fieldErrors.amount }"
            :invalid="!!fieldErrors.amount"
            :disabled="consumptionPlanStore.isLoading"
            aria-describedby="plan-amount-error"
            @update:modelValue="clearFieldError('amount')"
          />
          <small id="plan-amount-error" v-if="fieldErrors.amount" class="p-error-message text-red-400 text-xs flex items-center gap-1 mt-1" role="alert">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.amount) }}</span>
          </small>
        </div>

        <!-- Ações -->
        <div class="w-full flex justify-end gap-3 pt-3 mt-1 border-t border-[var(--surface-border)]">
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
  @import "../assets/table.css";
  @import "../assets/dialog.css";
</style>