<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Categorias</h1>
        <p>Organize os tipos de consumo do sistema.</p>
      </div>
      <Button label="Nova categoria" icon="pi pi-plus" />
    </div>

    <Card>
      <template #content>
        <DataTable :value="categories">
          <Column field="name" header="Categoria" />
          <Column field="description" header="Descrição" />
          <Column field="limit" header="Limite mensal">
            <template #body="{ data }">{{ data.limit.toLocaleString('pt-AO') }} Kz</template>
          </Column>
          <Column header="Estado">
            <template #body="{ data }">
              <Tag value="Ativa" severity="success" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </section>
</template>

<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Tag from 'primevue/tag';

const categories = [
  { name: 'Alimentação', description: 'Refeições e alimentação', limit: 4000 },
  { name: 'Bebidas', description: 'Água e outras bebidas', limit: 1500 },
  { name: 'Transporte', description: 'Táxi e deslocações', limit: 3000 },
  { name: 'Lazer', description: 'Cinema, jogos e entretenimento', limit: 2000 },
  { name: 'Outros', description: 'Despesas diversas', limit: 1000 }
];
</script>