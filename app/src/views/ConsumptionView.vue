<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Consumos</h1>
        <p>Registe e acompanhe todos os consumos.</p>
      </div>
      <Button label="Novo consumo" icon="pi pi-plus" />
    </div>

    <Card>
      <template #content>
        <div class="table-toolbar">
          <InputText v-model="search" placeholder="Pesquisar consumo..." />
          <Select v-model="selectedCategory" :options="categories" placeholder="Categoria" show-clear />
        </div>

        <DataTable :value="filtered" paginator :rows="8" responsive-layout="scroll">
          <Column field="date" header="Data" sortable />
          <Column field="category" header="Categoria" sortable />
          <Column field="description" header="Descrição" />
          <Column header="Valor" sortable>
            <template #body="{ data }">{{ data.value.toLocaleString('pt-AO') }} Kz</template>
          </Column>
          <Column header="Estado">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="data.status === 'Confirmado' ? 'success' : 'warn'" />
            </template>
          </Column>
          <Column header="Ações">
            <template #body>
              <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';

import { dashboardStore } from '@/stores/dashboard';

const search = ref('');
const selectedCategory = ref(null);
const categories = ['Alimentação', 'Bebidas', 'Transporte', 'Lazer', 'Outros'];

const filtered = computed(() => {
  return dashboardStore.consumptions.filter(item => {
    const term = search.value.toLowerCase();
    const matchesText = !term ||
      item.description.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term);

    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value;

    return matchesText && matchesCategory;
  });
});
</script>