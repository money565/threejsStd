import { useUserStore } from '@/stores/user'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/layouts/index.vue'),
      children: [],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        isWhite: true,
      },
      children: [],
    },
  ],
})

router.beforeEach(async (to, from, next) => { // 菜单按钮按下
  const useUser = useUserStore()
  if (useUser.getToken) {
    next()
  }
  else {
    if (to.meta.isWhite) {
      next()
    }
    else {
      next({
        path: '/login',
        query: {
          redirectPath: to.fullPath,
        },
      })
    }
  }
})
export default router
