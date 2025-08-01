import { coreRoutes } from './core'

const dynamicRouteFiles = (() => {
  const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]

  if (basePath == 'shopadmin') {
    return require.context('./shopadmin', false, /\.js$/)
  } else if (basePath == 'supplier') {
    return require.context('./supplier', false, /\.js$/)
  } else if (basePath == 'merchant') {
    return require.context('./merchant', false, /\.js$/)
  } else {
    return require.context('./modules', false, /\.js$/)
  }
})()

function mergeRouteModules(routeModules) {
  const mergedRoutes = []

  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = dynamicRouteFiles(routeModule)?.default ?? []
    mergedRoutes.push(...moduleRoutes)
  }

  return mergedRoutes
}

const dynamicRoutes = mergeRouteModules(
  dynamicRouteFiles.keys().filter((key) => key.startsWith('./'))
)

// 基础路由
const routes = [...coreRoutes]

// 动态路由
const accessRoutes = [...dynamicRoutes]

export { accessRoutes, routes }
