import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HelloWorld1.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Helloworld2.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
