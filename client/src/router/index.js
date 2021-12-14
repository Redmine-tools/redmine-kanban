import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store"

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/pages/Login')
  },
  {
    path: '/project_pick',
    name: 'ProjectPick',
    component: () => import(/* webpackChunkName: "ProjectPick" */ '@/components/ProjectPick'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/query_pick',
    name: 'QueryPick',
    component: () => import(/* webpackChunkName: "QueriesPick" */ '@/components/QueriesPick'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kanban',
    name: 'Kanban',
    component: () => import(/* webpackChunkName: "Kanban" */ '@/pages/Kanban'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '@/pages/NotFound')
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user.api_key) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
