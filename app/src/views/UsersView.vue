<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Utilizadores</h1>
        <p>Gerencie os utilizadores do sistema.</p>
      </div>
      <Button label="Novo utilizador" icon="pi pi-plus" />
    </div>

    <Card>
      <template #content>
        <DataTable :value="users" paginator :rows="8">
          <Column header="Utilizador">
            <template #body="{ data }">
              <div class="user-cell">
                <div class="avatar">{{ initials(data.name) }}</div>
                <div>
                  <strong>{{ data.name }}</strong>
                  <small>{{ data.email }}</small>
                </div>
              </div>
            </template>
          </Column>
          <Column field="username" header="Username" />
          <Column field="plan" header="Plano" />
          <Column header="Estado">
            <template #body>
              <Tag value="Ativo" severity="success" />
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

const users = [
  { name: 'Eugénio Cachiombo', email: 'eugenio@example.com', username: 'eugenio', plan: 'Standard' },
  { name: 'Maria João', email: 'maria@example.com', username: 'maria', plan: 'Premium' },
  { name: 'Carlos Manuel', email: 'carlos@example.com', username: 'carlos', plan: 'Básico' }
];

function initials(name) {
  return name.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase();
}
</script>