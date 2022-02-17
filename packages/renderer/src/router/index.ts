import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'tutorial' },
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
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from) => {
      let userID = localStorage.getItem('userID')
      if (userID !== null) {
        return { path: '/profile/' + userID }
      }
    },
  },
  {
    path: '/profile/:userID',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
