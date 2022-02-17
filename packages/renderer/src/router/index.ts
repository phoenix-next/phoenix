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
  {
    path: '/contest',
    name: 'contest',
    component: () => import('../views/Contest.vue'),
  },
  {
    path: '/forum',
    name: 'forum',
    component: () => import('../views/Forum.vue'),
  },
  {
    path: '/problem',
    name: 'problem',
    component: () => import('../views/Problem.vue'),
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/Team.vue'),
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('../views/Tutorial.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
