import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import ForumOverviewVue from '../views/Forum/ForumOverview.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'tutorial' }
  },
  {
    path: '/contest',
    name: 'contest',
    meta: { requiresAuth: true },
    component: () => import('../views/Contest.vue')
  },
  {
    path: '/forum',
    name: 'forumIndex',
    meta: { requiresAuth: true },
    component: () => import('../views/Forum/Index.vue'),
    children: [
      {
        path: '',
        name: 'forumOverview',
        component: () => import('../views/Forum/ForumOverview.vue')
      },
      {
        path: ':id',
        name: 'forumDetail',
        component: () => import('../views/Forum/ForumDetail.vue')
      }
    ]
  },
  {
    path: '/problem',
    name: 'problemIndex',
    meta: { requiresAuth: true },
    component: () => import('../views/problem/Index.vue'),
    children: [
      {
        path: '',
        name: 'problemOverview',
        component: () => import('../views/problem/ProblemOverview.vue')
      },
      {
        path: 'create',
        name: 'createProblem',
        component: () => import('../views/problem/CreateProblem.vue')
      },
      {
        path: ':id',
        name: 'problemDetail',
        component: () => import('../views/problem/ProblemDetail.vue')
      }
    ]
  },
  {
    path: '/team',
    name: 'team',
    meta: { requiresAuth: true },
    component: () => import('../views/Team.vue')
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('../views/Tutorial.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting.vue')
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
    }
  },
  {
    path: '/profile/:userID',
    name: 'profile',
    meta: { requiresAuth: true },
    component: () => import('../views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    window.$message.warning('您还没有登录，请先登录')
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
