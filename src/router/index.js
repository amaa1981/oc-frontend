import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: Routing configuration items
 *
 * hidden: true // When true is set, the route will not appear in the sidebar, such as 401, login and other pages, or some Edit pages/edit/1
 * alwaysShow: true // When you declare more than 1 route as children under a route, it will automatically become a nested mode - such as a component page
 *                                  // When there is only one, that sub-route will be displayed in the sidebar as the root route - such as the guide page
 *                                  // If you want to display your root route regardless of the number of children declared under the route
 *                                  // You can set alwaysShow: true so that it will ignore the previously defined rules and always show the root route
 * redirect: noRedirect // When noRedirect is set, the route cannot be clicked in the breadcrumb navigation.
 * name:'router-name' // Set the name of the route, be sure to fill it in otherwise various problems will occur when using <keep-alive>
 * query: '{"id": 1, "name": "ry"}' // Default passing parameters for access routes
 * roles: ['admin', 'common'] // Role permissions to access routing
 * permissions: ['a:a:a', 'b:b:b'] // Access route menu permissions
 * meta : {
    noCache: true                   // If set totrue，will not be <keep-alive> cache(default false)
    title: 'title'                  // Set the name of the route displayed in the sidebar and breadcrumbs
    icon: 'svg-name'                // Set the icon for this route，Corresponding pathsrc/assets/icons/svg
    breadcrumb: false               // If set tofalse，will not be inbreadcrumbShow in breadcrumbs
    activeMenu: '/system/user'      // When the route sets this attribute，will highlight the corresponding sidebar。
  }
 */

// public route
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/data',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '',
        component: () => import('@/views/system/data'),
        name: 'DataCenter',
        meta: { title: 'dataCenter.dataScreen', icon: 'chart' }
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/index'),
  //       name: 'Index',
  //       meta: { title: 'Home', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user' }
      }
    ]
  }
]

// Dynamic routing, dynamic loading based on user permissions
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: 'Assign Roles', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: 'Assign Users', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: 'Dictionary Data', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: 'Job Log', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: 'Edit Generator Config', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// Prevent errors from being reported by clicking multiple routes in succession
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // removeurlin#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
