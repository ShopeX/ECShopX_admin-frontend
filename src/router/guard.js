import { useNProgress } from '@/composables'
import store from '@/store'
import { generateAccess } from './access'
import { accessRoutes, routes as coreRoutes } from './routes'
import { IS_ADMIN, IS_DISTRIBUTOR, IS_MERCHANT, IS_SUPPLIER, traverseTreeValues } from '@/utils'

const coreRoutesNames = traverseTreeValues(coreRoutes, item => item.path)

const { startProgress, stopProgress } = useNProgress()

function setupCommonGuard(router) {
  router.beforeEach((to, from, next) => {
    startProgress()
    next()
  })

  router.afterEach((to, from, next) => {
    stopProgress()
  })
}

function setupAccessGuard(router) {
  router.beforeEach(async (to, from, next) => {
    console.log('traverseTreeValues', coreRoutesNames)

    if (coreRoutesNames.includes(to.path)) {
      next()
      return
    }

    console.log('setupAccessGuard beforeEach', to, from)
    const hasToken = store.state.user.token
    if (!hasToken) {
      if (/\/login$/.test(to.path)) {
        next()
      } else if (
        /^https?:\/\/[^/]+\/(shopadmin|supplier|merchant)(\/.*)?$/.test(location.origin + to.path)
      ) {
        const basePath = to.path.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
        next(`/${basePath}/login`)
      } else {
        next('/login')
      }
      return
    }

    const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
    console.log('xxxxxxxxxxxx', store.state.user.login_type)
    debugger
    if ((basePath == null && !IS_ADMIN()) || (basePath == 'shopadmin' && !IS_DISTRIBUTOR())) {
      store.commit('user/logout')
      next(basePath ? `/${basePath}/login` : '/login')
      return
    }
    // 菜单已加载标志
    if (store.state.access.isAccessChecked) {
      // to.path如果访问的不在路由中，重定向到路由默认菜单的第一个

      next()
      return
    }

    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      router,
      routes: accessRoutes
    })

    store.commit('access/setIsAccessChecked', true)

    // return {
    //   path: '/dashboard',
    //   replace: true
    // }

    // 检查目标路径是否在可访问路由中
    const isPathAccessible = (path, routes, parentPath = '') => {
      return routes.some(route => route.path === path)
    }

    // 获取第一个可访问路由的路径
    const getFirstRoutePath = () => {
      const routes = router.getRoutes()
      const [firstPermission] = store.state.access.permissions

      const firstRoute = routes.find(route => route?.meta?.permissions?.includes(firstPermission))
      if (firstRoute) {
        return firstRoute.path
      }

      return '/'
    }
    // 如果目标路径不可访问，重定向到第一个可访问路由
    if (!isPathAccessible(to.path, router.getRoutes())) {
      const firstPath = getFirstRoutePath()
      next(firstPath)
      return
    } else if (to.path === '/shopadmin') {
      next('/shopadmin/shoplist')
      return
    }
    next(to)
  })
}

function createRouterGuard(router) {
  setupCommonGuard(router)

  setupAccessGuard(router)
}

export { createRouterGuard }
