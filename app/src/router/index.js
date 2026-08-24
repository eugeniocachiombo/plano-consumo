import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'consumos',
        name: 'consumos',
        component: () => import('@/views/ConsumptionView.vue')
      },
      {
        path: 'planos',
        name: 'planos',
        component: () => import('@/views/PlansView.vue')
      },
      {
        path: 'categorias',
        name: 'categorias',
        component: () => import('@/views/CategoriesView.vue')
      },
      {
        path: 'cartoes',
        name: 'cartoes',
        component: () => import('@/views/CardsView.vue')
      },
      {
        path: 'utilizadores',
        name: 'utilizadores',
        component: () => import('@/views/UsersView.vue')
      }
    ]
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});