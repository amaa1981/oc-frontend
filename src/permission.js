import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/data' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true
        // Determine whether the current user has finished pulling user_info information
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // Generate accessible routing tables based on roles permissions
            router.addRoutes(accessRoutes) // Dynamically add accessible routing tables
            next({ ...to, replace: true }) // hackmethod make sureaddRoutesCompleted
          })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // No token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the whitelist without login, enter directly
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // Otherwise all redirect to login page
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
