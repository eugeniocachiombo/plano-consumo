<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import { useCategoryStore } from '@/stores/category.store';
import { useToast } from 'primevue/usetoast';

const categoryStore = useCategoryStore();
const toast = useToast();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// Controle do modal de confirmação de eliminação personalizado
const isConfirmDeleteVisible = ref(false);
const categoryToDelete = ref(null);

const rowsPerPage = ref(10);
const searchQuery = ref('');
const isFilterExpandedOnMobile = ref(false);

const form = reactive({
  name: ''
});

const fieldErrors = ref({});

const filteredCategories = computed(() => {
  let list = categoryStore.categories || [];

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((category) => {
      const categoryId = String(category.id || '');
      const categoryName = String(category.name || '').toLowerCase();

      return (
        categoryId.includes(q) ||
        categoryName.includes(q)
      );
    });
  }

  return list;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchQuery.value && searchQuery.value.trim() !== '') count++;
  return count;
});

function clearAllFilters() {
  searchQuery.value = '';
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
  form.name = '';
  fieldErrors.value = {};
}

function openCreateDialog() {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  isDialogVisible.value = true;
}

function openEditDialog(category) {
  isEditing.value = true;
  editingId.value = category.id;
  form.name = category.name || '';
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

function validateForm() {
  const errors = {};
  if (!form.name || !form.name.trim()) {
    errors.name = 'Informe o nome da categoria.';
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function handleSave() {
  if (categoryStore.isLoading) return;

  try {
    const payload = {
      name: form.name.trim()
    };

    if (isEditing.value) {
      await categoryStore.update(editingId.value, payload);
      isDialogVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria actualizada com sucesso.',
        life: 3500
      });
    } else {
      await categoryStore.create(payload);
      isDialogVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria criada com sucesso.',
        life: 3500
      });
    }

    
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

function confirmDelete(category) {
  categoryToDelete.value = category;
  isConfirmDeleteVisible.value = true;
}

async function executeDelete() {
  if (!categoryToDelete.value || categoryStore.isLoading) return;

  try {
    await categoryStore.remove(categoryToDelete.value.id);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria eliminada com sucesso.',
      life: 3500
    });
    isConfirmDeleteVisible.value = false;
    categoryToDelete.value = null;
  } catch (error) {
    const responseData = error?.response?.data;
    toast.add({
      severity: 'error',
      summary: 'Erro ao Eliminar',
      detail: responseData?.message || 'Não foi possível eliminar a categoria.',
      life: 5000
    });
  }
}

async function reloadData() {
  try {
    await categoryStore.list();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro de Carregamento',
      detail: 'Não foi possível carregar os dados das categorias.',
      life: 5000
    });
  }
}

onMounted(async () => {
  await reloadData();
});
</script>

<template>
  <section class="category-page">
    <header class="page-heading">
      <div class="heading-content">
        <div class="title-with-badge">
          <h1>Categorias</h1>
          <Tag
            v-if="categoryStore.categories"
            :value="categoryStore.categories.length"
            severity="info"
            class="count-badge"
            aria-label="Total de categorias"
          />
        </div>
        <p>Gerencie as categorias de consumo do seu perfil.</p>
      </div>
      <div class="heading-actions">
        <Button
          label="Nova categoria"
          icon="pi pi-plus"
          class="p-button-primary btn-add"
          :disabled="categoryStore.isLoading"
          @click="openCreateDialog"
        />
      </div>
    </header>

    <div class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-primary-soft">
          <i class="pi pi-tags"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Total de Categorias</span>
          <span class="kpi-value">{{ categoryStore.categories?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-info-soft">
          <i class="pi pi-list"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Categorias Exibidas</span>
          <span class="kpi-value">{{ filteredCategories.length }} / {{ categoryStore.categories?.length || 0 }}</span>
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
          :value="filteredCategories"
          :loading="categoryStore.isLoading"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="A mostrar {first} até {last} de {totalRecords} categorias"
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
                    placeholder="Pesquisar por ID ou nome..."
                    class="search-input theme-input"
                    aria-label="Pesquisar categorias"
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
                    aria-label="Actualizar lista de categorias"
                    :loading="categoryStore.isLoading"
                    @click="reloadData"
                  />
                </div>
              </div>

              <div v-if="activeFiltersCount > 0" class="active-chips-bar">
                <span class="chips-title">Filtros aplicados:</span>
                <Tag v-if="searchQuery" severity="info" class="filter-chip">
                  <span>Pesquisa: "{{ searchQuery }}"</span>
                  <i class="pi pi-times chip-remove" @click="searchQuery = ''"></i>
                </Tag>
              </div>
            </div>
          </template>

          <template #loading>
            <div class="table-loading-state">
              <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
              <span>A carregar categorias...</span>
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
                  Não encontramos nenhuma categoria correspondente aos filtros seleccionados.
                </p>
                <Button
                  label="Limpar Filtros"
                  icon="pi pi-filter-slash"
                  class="p-button-outlined p-button-sm mt-3"
                  @click="clearAllFilters"
                />
              </template>

              <template v-else>
                <p class="empty-title">Ainda não existem categorias</p>
                <p class="empty-subtitle">
                  Comece por organizar as suas despesas adicionando a sua primeira categoria.
                </p>
                <Button
                  label="Criar Nova Categoria"
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

          <Column field="name" header="Nome da Categoria" sortable>
            <template #body="{ data }">
              <span class="category-name-cell font-medium">{{ data.name }}</span>
            </template>
          </Column>

          <Column header="Acções" style="width: 140px; text-align: center">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded p-button-warning action-btn"
                  v-tooltip.top="'Editar'"
                  aria-label="Editar Categoria"
                  @click="openEditDialog(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-rounded p-button-danger action-btn"
                  v-tooltip.top="'Eliminar'"
                  aria-label="Eliminar Categoria"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Modal Form (Criar/Editar) -->
    <Dialog
      v-model:visible="isDialogVisible"
      :header="isEditing ? 'Editar Categoria' : 'Nova Categoria'"
      :modal="true"
      :dismissableMask="!categoryStore.isLoading"
      :closable="!categoryStore.isLoading"
      append-to="self"
      class="category-dialog theme-adapted-dialog"
      style="width: 100%; max-width: 500px"
    >
      <form @submit.prevent="handleSave" class="form-grid" novalidate>
        <div class="field">
          <label for="category-name" class="required-label font-medium text-sm">Nome da Categoria</label>
          <InputText
            id="category-name"
            v-model="form.name"
            placeholder="Ex: Alimentação, Transportes..."
            class="w-full search-input-field theme-input"
            :class="{ 'p-invalid': !!fieldErrors.name }"
            :invalid="!!fieldErrors.name"
            :disabled="categoryStore.isLoading"
            aria-describedby="category-name-error"
            @input="clearFieldError('name')"
            @update:modelValue="clearFieldError('name')"
          />
          <small
            id="category-name-error"
            v-if="fieldErrors.name"
            class="p-error-message"
            role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.name) }}</span>
          </small>
        </div>

        <div class="dialog-footer">
          <Button
            type="button"
            label="Cancelar"
            class="p-button-text p-button-secondary"
            :disabled="categoryStore.isLoading"
            @click="isDialogVisible = false"
          />
          <Button
            type="submit"
            :label="isEditing ? 'Actualizar' : 'Guardar'"
            :icon="categoryStore.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            class="p-button-primary"
            :loading="categoryStore.isLoading"
          />
        </div>
      </form>
    </Dialog>

    <!-- Modal de Confirmação de Eliminação Personalizado -->
    <Dialog
      v-model:visible="isConfirmDeleteVisible"
      header="Confirmar Eliminação"
      :modal="true"
      :dismissableMask="!categoryStore.isLoading"
      :closable="!categoryStore.isLoading"
      append-to="self"
      class="theme-adapted-dialog"
      style="width: 100%; max-width: 450px"
    >
      <div class="flex items-start gap-4 py-2">
        <i class="pi pi-exclamation-triangle text-amber-500 text-3xl flex-shrink-0 mt-1"></i>
        <div class="space-y-1" v-if="categoryToDelete">
          <p class="text-sm leading-relaxed">
            Tem a certeza que deseja eliminar a categoria
            <strong>"{{ categoryToDelete.name }}"</strong>?
          </p>
          <p class="text-xs text-red-400 font-medium pt-1">Esta acção é irreversível.</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button
            label="Cancelar"
            class="p-button-text p-button-secondary"
            :disabled="categoryStore.isLoading"
            @click="isConfirmDeleteVisible = false"
          />
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            class="p-button-danger"
            :loading="categoryStore.isLoading"
            @click="executeDelete"
          />
        </div>
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
  @import '../assets/crud.css';
  @import '../assets/mobile.css';
</style>