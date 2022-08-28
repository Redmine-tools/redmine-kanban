import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/pages/Login.vue'),
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import(/* webpackChunkName: "ProjectPick" */ '@/pages/Setup.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/kanban',
    name: 'KanbanView',
    component: () => import(/* webpackChunkName: "Kanban" */ '@/pages/KanbanView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '@/pages/NotFound.vue'),
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' && store.state.user.api_key) {
    next({ name: 'Setup' });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.user.api_key) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
