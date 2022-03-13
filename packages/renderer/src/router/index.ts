import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'tutorialOverview' }
  },
  {
    path: '/contest',
    name: 'contestIndex',
    meta: { requiresAuth: true },
    component: () => import('../views/contest/Index.vue'),
    children: [
      {
        path: '',
        name: 'contestOverview',
        component: () => import('../views/contest/ContestOverview.vue')
      },
      {
        path: 'create',
        name: 'createContest',
        component: () => import('../views/contest/CreateContest.vue')
      },
      {
        path: ':id',
        name: 'contestDetail',
        component: () => import('../views/contest/ContestDetail.vue')
      }
    ]
  },
  {
    path: '/forum',
    name: 'forumIndex',
    meta: { requiresAuth: true },
    component: () => import('../views/forum/Index.vue'),
    children: [
      {
        path: '',
        name: 'forumOverview',
        component: () => import('../views/forum/ForumOverview.vue')
      },
      {
        path: ':id',
        name: 'forumDetail',
        component: () => import('../views/forum/ForumDetail.vue')
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
    name: 'teamIndex',
    meta: { requiresAuth: true },
    component: () => import('../views/team/Index.vue'),
    children: [
      {
        path: '',
        name: 'teamOverview',
        component: () => import('../views/team/teamOverview.vue')
      },
      {
        path: ':id',
        name: 'teamDetail',
        component: () => import('../views/team/teamDetail.vue')
      }
    ]
  },
  {
    path: '/tutorial',
    name: 'tutorialIndex',
    component: () => import('../views/tutorial/Index.vue'),
    children: [
      {
        path: '',
        name: 'tutorialOverview',
        component: () => import('../views/tutorial/TutorialOverview.vue')
      },
      {
        path: 'create',
        name: 'createTutorial',
        meta: { requiresAuth: true },
        component: () => import('../views/tutorial/CreateTutorial.vue')
      },
      {
        path: ':id',
        name: 'tutorialDetail',
        component: () => import('../views/tutorial/TutorialDetail.vue')
      }
    ]
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
        return { path: '/profile' }
      }
    }
  },
  {
    path: '/profile',
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
