<script setup>
import { ref, reactive, onMounted } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Tag from 'primevue/tag';
import { useCategoryStore } from '@/stores/category.store';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const categoryStore = useCategoryStore();
const toast = useToast();
const confirm = useConfirm();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const searchQuery = ref('');
const rowsPerPage = ref(10);

const form = reactive({
  name: ''
});

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
  form.name = category.name;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

async function handleSave() {
  if (categoryStore.isLoading) return;

  fieldErrors.value = {};

  try {
    const payload = {
      name: form.name.trim()
    };

    if (isEditing.value) {
      await categoryStore.update(editingId.value, payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria atualizada com sucesso.',
        life: 3000
      });
    } else {
      await categoryStore.create(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria criada com sucesso.',
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

function confirmDelete(category) {
  confirm.require({
    message: `Tem a certeza que deseja eliminar a categoria "${category.name}"? Esta acção não pode ser desfeita.`,
    header: 'Confirmar Eliminação',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await categoryStore.remove(category.id);
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
          detail: responseData?.message || 'Não foi possível eliminar a categoria.',
          life: 4000
        });
      }
    }
  });
}

async function reloadCategories() {
  try {
    await categoryStore.list();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar as categorias.',
      life: 4000
    });
  }
}

onMounted(async () => {
  await reloadCategories();
});
</script>

<template>
  <Toast position="top-right" />

  <ConfirmDialog class="custom-dark-dialog" append-to="self" />

  <section class="category-page">
    <!-- Cabeçalho da Página -->
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
        <p>Organize e gira os tipos de consumo e despesas do sistema.</p>
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

    <!-- Card da Tabela e Conteúdo -->
    <Card class="table-card border-none shadow-1">
      <template #content>
        <DataTable
          :value="categoryStore.categories"
          :loading="categoryStore.isLoading"
          :globalFilterFields="['name', 'id']"
          :filters="{ global: { value: searchQuery, matchMode: 'contains' } }"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="A mostrar {first} até {last} de {totalRecords} categorias"
          emptyMessage="Nenhuma categoria encontrada."
          class="custom-datatable p-datatable-sm"
          dataKey="id"
        >
          <template #header>
            <div class="table-header">
              <div class="search-container">
                <i class="pi pi-search search-icon" aria-hidden="true" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Pesquisar por ID ou nome..."
                  class="search-input"
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
              <Button
                icon="pi pi-refresh"
                class="p-button-text p-button-secondary p-button-rounded refresh-btn"
                v-tooltip.top="'Atualizar lista'"
                aria-label="Atualizar lista de categorias"
                :loading="categoryStore.isLoading"
                @click="reloadCategories"
              />
            </div>
          </template>

          <template #loading>
            <div class="table-loading-state">
              <i class="pi pi-spin pi-spinner text-2xl text-primary mb-2"></i>
              <span>A carregar categorias...</span>
            </div>
          </template>

          <template #empty>
            <div class="empty-state">
              <div class="empty-icon-wrapper">
                <i class="pi pi-folder-open"></i>
              </div>
              <p class="empty-title">Nenhuma categoria encontrada</p>
              <p class="empty-subtitle" v-if="searchQuery">
                Nenhum resultado corresponde à pesquisa "<strong>{{ searchQuery }}</strong>".
              </p>
              <p class="empty-subtitle" v-else>
                Comece por adicionar a primeira categoria ao sistema.
              </p>
              <Button
                v-if="!searchQuery"
                label="Criar Categoria"
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

          <Column field="name" header="Categoria" sortable>
            <template #body="{ data }">
              <span class="category-name-cell">{{ data.name }}</span>
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

    <!-- Dialog de Criação / Edição -->
    <Dialog
      v-model:visible="isDialogVisible"
      :header="isEditing ? 'Editar Categoria' : 'Nova Categoria'"
      :modal="true"
      :dismissableMask="!categoryStore.isLoading"
      :closable="!categoryStore.isLoading"
      append-to="self"
      class="category-dialog custom-dark-dialog"
      style="width: 100%; max-width: 460px"
    >
      <form @submit.prevent="handleSave" class="form-grid" novalidate>
        <div class="field">
          <label for="category-name" class="required-label font-medium text-sm">Nome da Categoria</label>
          <div class="input-wrapper">
            <InputText
              id="category-name"
              v-model="form.name"
              placeholder="Ex: Alimentação, Transporte, Saúde"
              class="w-full search-input-field"
              :class="{ 'p-invalid': !!fieldErrors.name }"
              :invalid="!!fieldErrors.name"
              :aria-invalid="!!fieldErrors.name"
              aria-describedby="category-name-error"
              :disabled="categoryStore.isLoading"
              @input="clearFieldError('name')"
              required
              autofocus
            />
          </div>
          <small id="category-name-error" v-if="fieldErrors.name" class="p-error-message" role="alert">
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
            :label="isEditing ? 'Atualizar' : 'Guardar'"
            :icon="categoryStore.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            class="p-button-primary"
            :loading="categoryStore.isLoading"
            :disabled="categoryStore.isLoading || !form.name.trim()"
          />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 200ms ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding-bottom: 0.25rem;
}

.heading-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-heading h1 {
  font-size: 1.625rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
  color: var(--text-color);
}

.count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.15rem 0.6rem;
}

.page-heading p {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--text-color-secondary);
}

.btn-add {
  font-weight: 600;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.btn-add:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-add:not(:disabled):active {
  transform: translateY(0);
}

.table-card {
  border-radius: 12px;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  overflow: hidden;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

:deep(.p-card-body) {
  padding: 0;
  background: var(--surface-card);
}

:deep(.p-card-content) {
  padding: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-section);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--text-color-secondary);
  pointer-events: none;
  font-size: 0.9rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 2.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 150ms ease;
  background: var(--surface-ground);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
}

.search-input:focus {
  box-shadow: 0 0 0 3px var(--primary-color-focus, rgba(59, 130, 246, 0.15));
}

.clear-search-btn {
  position: absolute;
  right: 0.25rem;
  width: 1.75rem !important;
  height: 1.75rem !important;
  padding: 0 !important;
  color: var(--text-color-secondary);
}

.refresh-btn {
  width: 2.25rem !important;
  height: 2.25rem !important;
  transition: transform 200ms ease;
}

.refresh-btn:hover {
  transform: rotate(45deg);
}

.custom-datatable :deep(.p-datatable-header) {
  background: var(--surface-section);
  border-color: var(--surface-border);
  padding: 0;
}

.custom-datatable :deep(.p-datatable-thead > tr > th) {
  background: var(--surface-section);
  color: var(--text-color-secondary);
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--surface-border);
}

.custom-datatable :deep(.p-datatable-tbody > tr) {
  background: var(--surface-card);
  color: var(--text-color);
  transition: background-color 150ms ease;
}

.custom-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: middle;
}

.custom-datatable :deep(.p-datatable-tbody > tr:hover) {
  background-color: var(--surface-hover);
}

.custom-datatable :deep(.p-paginator) {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  color: var(--text-color-secondary);
  padding: 0.75rem 1rem;
}

.custom-datatable :deep(.p-paginator-current) {
  color: var(--text-color-secondary);
}

.custom-datatable :deep(.p-paginator-first),
.custom-datatable :deep(.p-paginator-prev),
.custom-datatable :deep(.p-paginator-next),
.custom-datatable :deep(.p-paginator-last),
.custom-datatable :deep(.p-paginator-page) {
  background: transparent;
  color: var(--text-color-secondary);
  border: none;
  border-radius: 6px;
  min-width: 2.25rem;
  height: 2.25rem;
  margin: 0 0.125rem;
  transition: background-color 150ms ease, color 150ms ease;
}

.custom-datatable :deep(.p-paginator-page:hover),
.custom-datatable :deep(.p-paginator-first:hover),
.custom-datatable :deep(.p-paginator-prev:hover),
.custom-datatable :deep(.p-paginator-next:hover),
.custom-datatable :deep(.p-paginator-last:hover) {
  background: var(--surface-hover);
  color: var(--text-color);
}

.custom-datatable :deep(.p-paginator-page.p-highlight) {
  background: var(--primary-color);
  color: var(--primary-color-text, #ffffff);
}

.custom-datatable :deep(.p-paginator-rpp-options.p-dropdown),
.custom-datatable :deep(.p-select) {
  background: var(--surface-ground) !important;
  border: 1px solid var(--surface-border) !important;
  border-radius: 6px;
  height: 2.25rem;
}

.custom-datatable :deep(.p-paginator-rpp-options.p-dropdown .p-dropdown-label),
.custom-datatable :deep(.p-select-label) {
  color: var(--text-color) !important;
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
}

.custom-datatable :deep(.p-paginator-rpp-options.p-dropdown .p-dropdown-trigger),
.custom-datatable :deep(.p-select-dropdown) {
  color: var(--text-color-secondary) !important;
  width: 2rem;
}

.id-badge {
  font-family: var(--font-family-monospace, monospace);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  background: var(--surface-ground);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
}

.category-name-cell {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9375rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.action-btn {
  width: 2rem !important;
  height: 2rem !important;
  transition: transform 150ms ease, background-color 150ms ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.table-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  background: var(--surface-card);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: var(--surface-card);
}

.empty-icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--surface-ground);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-icon-wrapper i {
  font-size: 1.5rem;
  color: var(--text-color-secondary);
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
}

.empty-subtitle {
  font-size: 0.875rem;
  margin: 0;
  color: var(--text-color-secondary);
  max-width: 360px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.required-label {
  color: var(--text-color);
}

.required-label::after {
  content: ' *';
  color: var(--red-500, #ef4444);
}

.input-wrapper {
  position: relative;
}

.search-input-field {
  background: var(--surface-ground) !important;
  color: var(--text-color) !important;
  border: 1px solid var(--surface-border) !important;
}

.search-input-field:focus {
  border-color: var(--primary-color) !important;
}

.p-error-message {
  color: var(--red-500, #ef4444);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  margin-top: 0.15rem;
  animation: fadeIn 150ms ease;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-border);
}

.w-full {
  width: 100%;
}

@media (max-width: 640px) {
  .page-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .heading-actions {
    width: 100%;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: 100%;
  }

  .custom-datatable :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.875rem;
  }
}
</style>

<style>
/* Fundo/borda/cor do dialog: cobre .p-dialog (v3/v4) e a classe custom */
.p-dialog,
.p-confirm-dialog,
.p-confirmdialog,
.custom-dark-dialog.p-dialog {
  background: var(--surface-card, #1e293b) !important;
  border: 1px solid var(--surface-border, #334155) !important;
  color: var(--text-color, #f8fafc) !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.p-dialog .p-dialog-header,
.custom-dark-dialog .p-dialog-header {
  background: var(--surface-card, #1e293b) !important;
  color: var(--text-color, #f8fafc) !important;
  border-bottom: 1px solid var(--surface-border, #334155) !important;
  padding: 1.25rem 1.5rem !important;
}

.p-dialog .p-dialog-title,
.custom-dark-dialog .p-dialog-header .p-dialog-title {
  color: var(--text-color, #f8fafc) !important;
  font-weight: 600 !important;
}

/* Botões do header: cobre nomenclatura antiga (p-dialog-header-icon)
   e a nova do PrimeVue 4 (p-dialog-close-button / p-dialog-maximize-button) */
.p-dialog .p-dialog-header-icon,
.p-dialog .p-dialog-close-button,
.p-dialog .p-dialog-maximize-button,
.custom-dark-dialog .p-dialog-header-actions button {
  color: var(--text-color-secondary, #94a3b8) !important;
}

.p-dialog .p-dialog-header-icon:hover,
.p-dialog .p-dialog-close-button:hover,
.p-dialog .p-dialog-maximize-button:hover,
.custom-dark-dialog .p-dialog-header-actions button:hover {
  background: var(--surface-hover, #334155) !important;
  color: var(--text-color, #f8fafc) !important;
}

.p-dialog .p-dialog-content,
.custom-dark-dialog .p-dialog-content {
  background: var(--surface-card, #1e293b) !important;
  color: var(--text-color, #f8fafc) !important;
  padding: 1.25rem 1.5rem !important;
}

.p-dialog .p-dialog-footer,
.custom-dark-dialog .p-dialog-footer {
  background: var(--surface-card, #1e293b) !important;
  border-top: 1px solid var(--surface-border, #334155) !important;
  padding: 1rem 1.5rem !important;
}

.p-confirm-dialog-message,
.p-confirmdialog-message {
  color: var(--text-color, #f8fafc) !important;
}

.p-dropdown-panel,
.p-select-overlay,
.p-popover {
  background: var(--surface-card, #1e293b) !important;
  border: 1px solid var(--surface-border, #334155) !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.p-dropdown-panel .p-dropdown-items,
.p-select-overlay .p-select-list {
  padding: 0.35rem !important;
  background: var(--surface-card, #1e293b) !important;
}

.p-dropdown-panel .p-dropdown-item,
.p-select-overlay .p-select-option {
  color: var(--text-color, #f8fafc) !important;
  background: transparent !important;
  border-radius: 6px !important;
  padding: 0.5rem 0.75rem !important;
  margin-bottom: 2px !important;
}

.p-dropdown-panel .p-dropdown-item:hover,
.p-select-overlay .p-select-option:hover {
  background: var(--surface-hover, #334155) !important;
  color: var(--text-color, #f8fafc) !important;
}

.p-dropdown-panel .p-dropdown-item.p-highlight,
.p-select-overlay .p-select-option.p-selected {
  background: var(--primary-color, #3b82f6) !important;
  color: var(--primary-color-text, #ffffff) !important;
}
</style>