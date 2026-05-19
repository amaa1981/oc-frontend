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
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          // 仅对实际路由插入 layout 包装，不影响侧边栏
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

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else if (route.path === '/alarmmanger') {
        // alarmmanger 顶层必须使用 Layout，忽略后端返回的 component
        route.component = Layout
      } else if (route.path === '/backgroundManage') {
        // backgroundManage 顶层必须使用 Layout
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

// 仅对实际路由（非侧边栏）插入 AlarmLayout 中间层
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

// 仅对实际路由（非侧边栏）插入 ConfigLayout 中间层
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
    // alarmmanger / backgroundManage 保留嵌套结构，不扁平化
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

// 动态路由遍历，验证是否具备权限
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
  // 统一使用 require 方式加载，避免生产环境动态 import 路径解析问题
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
