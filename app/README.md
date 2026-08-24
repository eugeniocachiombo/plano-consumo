# PlanoK — Sakai / PrimeVue Adaptado

Interface de gestão de planos de consumo adaptada ao estilo de um dashboard administrativo Sakai, usando Vue 3 + Vite + PrimeVue 4.

## Stack

- Vue 3
- Vite
- PrimeVue 4.5.5
- PrimeIcons
- PrimeUIX Themes / Aura
- Vue Router
- CSS responsivo
- JavaScript

O projeto está organizado para você poder posteriormente ligar uma API Laravel, Node/Express, PHP ou outra API REST.

## Instalação

```bash
npm install
npm run dev
```

Abra:

http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Estrutura

```text
src/
├── assets/
│   └── styles.css
├── components/
│   ├── AppMenu.vue
│   ├── AppTopbar.vue
│   ├── ConsumptionChart.vue
│   └── StatCard.vue
├── layout/
│   └── AppLayout.vue
├── router/
│   └── index.js
├── services/
│   └── api.js
├── stores/
│   └── dashboard.js
├── views/
│   ├── CardsView.vue
│   ├── CategoriesView.vue
│   ├── ConsumptionView.vue
│   ├── DashboardView.vue
│   ├── PlansView.vue
│   └── UsersView.vue
├── App.vue
└── main.js
```

## Funcionalidades preparadas

- Dashboard
- Menu lateral estilo admin
- Topbar
- Tema claro/escuro
- Responsividade
- Planos de consumo
- Consumos
- Categorias
- Cartões
- Utilizadores
- Resumo mensal
- Gráfico visual de consumo
- Tabelas PrimeVue
- Serviço Axios-ready para futura API

## Próximos passos recomendados

1. Criar autenticação.
2. Ligar `src/services/api.js` à API.
3. Substituir os dados mock por endpoints.
4. Criar CRUD de planos.
5. Criar CRUD de categorias.
6. Criar CRUD de consumos.
7. Implementar cartões e centros de cartões.
8. Adicionar permissões por utilizador.
