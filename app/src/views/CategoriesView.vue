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
  @import "@/assets/table.css";
  @import "@/assets/dialog.css";
</style>