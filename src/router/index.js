import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
// eslint-disable-next-line import/no-cycle
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import auth from '@/router/routes/auth'
import settings from '@/router/routes/settings'
import helpdesk from '@/router/routes/helpdesk'
import gestion_pc from '@/router/routes/gestion_pc'

// eslint-disable-next-line import/no-cycle
// import useJwt from '@/auth/jwt/useJwt'

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'dashboard' } },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/dashboard.vue'),
      meta: {
        resource: 'dashboard',
        pageTitle: 'Dashboard',
      },
    },
    ...auth,
    ...settings,
    ...helpdesk,
    ...gestion_pc,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to)) {
    if (!isLoggedIn) {
      // useJwt.deleteToken()
      // localStorage.removeItem('userData')
      return next({ name: 'auth-login' })
    }
    return next({ name: 'misc-not-authorized' })
  }

  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    // const userData = getUserData()
    // return next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
    return next({ name: 'dashboard' })
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
  // console.clear()
})

export default router
