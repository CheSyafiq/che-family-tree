import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: '/members',
          name: 'Members',
          component: () => import('../views/Members.vue')
        },
        {
          path: '/tree',
          name: 'FamilyTreeView',
          component: () => import('../views/FamilyTreeView.vue')
        },
        // {
        //   path: '/tree-pure',
        //   name: 'FamilyTreePure',
        //   component: () => import('../views/FamilyTreePure.vue')
        // }
      ]
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const authenticated = isAuthenticated()

  if (requiresAuth && !authenticated) {
    next('/login')
  } else if (requiresGuest && authenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
