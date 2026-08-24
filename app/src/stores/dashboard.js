import { reactive } from 'vue';

export const dashboardStore = reactive({
  currentMonth: 'Agosto 2026',
  plan: {
    name: 'Plano Standard',
    amount: 10000
  },
  spent: 6000,
  remaining: 4000,
  categories: [
    { name: 'Alimentação', value: 2000, percent: 30 },
    { name: 'Transporte', value: 2000, percent: 16 },
    { name: 'Bebidas', value: 1000, percent: 10 },
    { name: 'Lazer', value: 1000, percent: 8 }
  ],
  consumptions: [
    { id: 1, date: '24/08/2026', category: 'Alimentação', description: 'Almoço', value: 2000, status: 'Confirmado' },
    { id: 2, date: '23/08/2026', category: 'Transporte', description: 'Táxi', value: 1500, status: 'Confirmado' },
    { id: 3, date: '22/08/2026', category: 'Bebidas', description: 'Água', value: 500, status: 'Pendente' },
    { id: 4, date: '20/08/2026', category: 'Alimentação', description: 'Jantar', value: 1000, status: 'Confirmado' },
    { id: 5, date: '18/08/2026', category: 'Lazer', description: 'Cinema', value: 1000, status: 'Confirmado' }
  ]
});