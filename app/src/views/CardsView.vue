<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Cartões</h1>
        <p>Gerencie cartões e centros de cartões.</p>
      </div>
      <Button label="Novo cartão" icon="pi pi-plus" />
    </div>

    <div class="cards-grid">
      <div v-for="card in cards" :key="card.number" class="bank-card">
        <div class="bank-card-top">
          <span>PlanoK</span>
          <i class="pi pi-wifi"></i>
        </div>
        <div class="bank-card-number">{{ card.number }}</div>
        <div class="bank-card-bottom">
          <div>
            <small>TITULAR</small>
            <strong>{{ card.holder }}</strong>
          </div>
          <div>
            <small>VALIDADE</small>
            <strong>{{ card.expiry }}</strong>
          </div>
        </div>
      </div>
    </div>

    <Card>
      <template #title>Cartões independentes</template>
      <template #content>
        <DataTable :value="cards">
          <Column field="holder" header="Titular" />
          <Column field="number" header="Cartão" />
          <Column field="expiry" header="Validade" />
          <Column header="Estado">
            <template #body><Tag value="Ativo" severity="success" /></template>
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

const cards = [
  { number: '**** **** **** 4821', holder: 'Eugénio Cachiombo', expiry: '12/28' },
  { number: '**** **** **** 1934', holder: 'Maria João', expiry: '06/29' }
];
</script>