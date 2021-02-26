import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/mall'
  },
  {
    path: '/:id/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/manage/Manage.vue')
  },
  {
    path: '/mall',
    name: 'Mall',
    component: () => import('../views/user/Home.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
