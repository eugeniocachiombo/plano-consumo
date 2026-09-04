import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.store";

const routes = [
  {
    path: "/",
    name: "landpage",
    component: () => import("@/views/LandingPage.vue"),
    meta: {
      requiresGuest: true,
      title: 'Plano de Consumo — Controle os seus gastos',
      lang: 'pt-AO'
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/cadastro",
    name: "signup",
    component: () => import("@/views/auth/SignupView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/",
    component: () => import("@/layout/AppLayout.vue"),
    meta: { requiresAuth: true }, // Aplica autenticação a todas as rotas filhas
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "consumos",
        name: "consumos",
        component: () => import("@/views/ConsumptionView.vue"),
      },
      {
        path: "planos",
        name: "planos",
        component: () => import("@/views/PlansView.vue"),
      },
      {
        path: "categorias",
        name: "categorias",
        component: () => import("@/views/CategoriesView.vue"),
      },
      {
        path: "cartoes",
        name: "cartoes",
        component: () => import("@/views/CardsView.vue"),
      },
      {
        path: "utilizadores",
        name: "utilizadores",
        component: () => import("@/views/UsersView.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Middleware Global (Navigation Guard)
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  // Só está autenticado se possuir TOKEN e USER_ID
  const isAuthenticated =
    (userStore.isAuthenticated || !!token) && !!userID;

  // Rota requer autenticação e o utilizador não está autenticado
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    return next({
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    });
  }

  // Rota exclusiva para visitantes e o utilizador já está autenticado
  if (
    to.matched.some((record) => record.meta.requiresGuest) &&
    isAuthenticated
  ) {
    return next({ name: "dashboard" });
  }

  next();
});

export default router;