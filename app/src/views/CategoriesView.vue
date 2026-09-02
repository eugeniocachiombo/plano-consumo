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
import { useCategoryStore } from '@/stores/category.store';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const categoryStore = useCategoryStore();
const toast = useToast();
const confirm = useConfirm();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  name: ''
});

const fieldErrors = ref({
  name: ''
});

function clearFieldError(field) {
  if (fieldErrors.value[field]) {
    fieldErrors.value[field] = '';
  }
}

function getErrorMessage(errorField) {
  if (!errorField) return '';
  return Array.isArray(errorField) ? errorField[0] : errorField;
}

function openCreateDialog() {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  fieldErrors.value = {};
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
    message: `Tem a certeza que deseja eliminar a categoria "${category.name}"?`,
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

onMounted(async () => {
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
});
</script>

<template>
  <Toast position="top-right" />
  <ConfirmDialog />

  <section class="category-page">
    <div class="page-heading">
      <div>
        <h1>Categorias</h1>
        <p>Organize os tipos de consumo do sistema.</p>
      </div>
      <Button 
        label="Nova categoria" 
        icon="pi pi-plus" 
        class="p-button-primary"
        @click="openCreateDialog" 
      />
    </div>

    <Card>
      <template #content>
        <DataTable 
          :value="categoryStore.categories" 
          :loading="categoryStore.isLoading"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          emptyMessage="Nenhuma categoria encontrada."
        >
          <Column field="id" header="ID" style="width: 100px" />
          <Column field="name" header="Categoria" sortable />
          <Column header="Ações" style="width: 150px; text-align: center">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-text p-button-rounded p-button-warning"
                  aria-label="Editar Categoria"
                  @click="openEditDialog(data)"
                />
                <Button 
                  icon="pi pi-trash" 
                  class="p-button-text p-button-rounded p-button-danger"
                  aria-label="Eliminar Categoria"
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
      :header="isEditing ? 'Editar Categoria' : 'Nova Categoria'" 
      :modal="true"
      class="category-dialog"
      style="width: 100%; max-width: 450px"
    >
      <form @submit.prevent="handleSave" class="form-grid" novalidate>
        <div class="field">
          <label for="category-name" class="required-label">Nome da Categoria</label>
          <InputText 
            id="category-name" 
            v-model="form.name" 
            placeholder="Ex: Alimentação" 
            class="w-full"
            :invalid="!!fieldErrors.name"
            :aria-invalid="!!fieldErrors.name"
            aria-describedby="category-name-error"
            @input="clearFieldError('name')"
            required
            autofocus
          />
          <small id="category-name-error" v-if="fieldErrors.name" class="p-error-message" role="alert">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ getErrorMessage(fieldErrors.name) }}</span>
          </small>
        </div>

        <div class="dialog-footer">
          <Button 
            type="button" 
            label="Cancelar" 
            class="p-button-text" 
            @click="isDialogVisible = false" 
          />
          <Button 
            type="submit" 
            :label="isEditing ? 'Atualizar' : 'Guardar'" 
            icon="pi pi-check" 
            class="p-button-primary" 
            :loading="categoryStore.isLoading"
            :disabled="categoryStore.isLoading"
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
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-heading h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.page-heading p {
  margin: 0.25rem 0 0 0;
  color: var(--text-color-secondary, #6c757d);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
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

.required-label::after {
  content: ' *';
  color: var(--red-500, #ef4444);
}

.p-error-message {
  color: var(--red-500, #ef4444);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.w-full {
  width: 100%;
}
</style>