import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import AlarmLayout from '@/views/system/alarmmanger/index'
import ConfigLayout from '@/views/system/config/index'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // Generate route
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // Request routing data from the backend
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          // Insert layout wrapper only for actual routing, does not affect sidebar
          wrapAlarmLayout(rewriteRoutes)
          wrapConfigLayout(rewriteRoutes)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(asyncRoutes);
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// Traverse the routing string sent from the background and convert it into a component object
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Special handling of Layout ParentView component
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else if (route.path === '/alarmmanger') {
        // The top level of alarmmanger must use Layout, ignoring the backend Back component.
        route.component = Layout
      } else if (route.path === '/backgroundManage') {
        // The top level of backgroundManage must use Layout
        route.component = Layout
      } else if (typeof route.component === 'string') {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

// Only for actual routing (non-sidebar) Insert AlarmLayout middle layer
function wrapAlarmLayout(routes) {
  routes.forEach(route => {
    if (route.path === '/alarmmanger' && route.children && route.children.length) {
      route.children = [{
        path: '',
        component: AlarmLayout,
        meta: route.meta || {},
        children: route.children
      }]
    }
  })
}

// Insert ConfigLayout middle layer only for actual routing (not sidebar)
function wrapConfigLayout(routes) {
  routes.forEach(route => {
    if (route.path === '/backgroundManage' && route.children && route.children.length) {
      route.children = [{
        path: '',
        component: ConfigLayout,
        meta: route.meta || {},
        children: route.children
      }]
    }
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    // alarmmanger / backgroundManage retains nested structure, does not flatten
    if ((el.path === 'alarmmanger' || el.path === 'backgroundManage') && el.children && el.children.length) {
      children.push(el)
      return
    }
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// Dynamic route traversal to verify whether permissions are available
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  // Uniformly use the require method to load to avoid dynamic import path resolution problems in the production environment
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
