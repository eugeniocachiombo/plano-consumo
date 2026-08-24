<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Planos de consumo</h1>
        <p>Configure os limites mensais disponíveis para os utilizadores.</p>
      </div>
      <Button label="Novo plano" icon="pi pi-plus" />
    </div>

    <div class="plans-grid">
      <Card v-for="plan in plans" :key="plan.name" :class="{ 'current-plan': plan.current }">
        <template #content>
          <div class="plan-card">
            <Tag v-if="plan.current" value="PLANO ATUAL" />
            <h2>{{ plan.name }}</h2>
            <div class="plan-price">{{ plan.amount.toLocaleString('pt-AO') }} Kz</div>
            <small>por mês</small>
            <ul>
              <li v-for="feature in plan.features" :key="feature">
                <i class="pi pi-check"></i>
                {{ feature }}
              </li>
            </ul>
            <Button :label="plan.current ? 'Plano atual' : 'Selecionar'" class="w-full" />
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const plans = [
  {
    name: 'Plano Básico',
    amount: 5000,
    features: ['Consumo mensal', 'Relatório básico', '3 categorias']
  },
  {
    name: 'Plano Standard',
    amount: 10000,
    current: true,
    features: ['Consumo mensal', 'Dashboard completo', 'Categorias ilimitadas']
  },
  {
    name: 'Plano Premium',
    amount: 20000,
    features: ['Todos os recursos', 'Relatórios avançados', 'Suporte prioritário']
  }
];
</script>