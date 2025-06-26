import store from '@/store'
import { getBasePath } from '@/utils'
import { fallbackNotFoundRoute } from './routes/core'

/**
 * 获取树形结构中所有叶子节点的路径
 * @param tree 树形结构数据
 * @param fieldName 需要提取的字段名称
 * @param childrenKey 子节点的键名，默认为 'children'
 * @param parentPath 父节点路径，用于递归
 * @returns 所有叶子节点路径的数组
 */
function getAllPermissions(tree, fieldName, childrenKey = 'children', parentPath = []) {
  let paths = []

  for (const node of tree) {
    // 当前节点的值
    const currentValue = String(node[fieldName] || '')
    // 当前路径
    const currentPath = currentValue != '' ? [...parentPath, currentValue] : parentPath

    // 判断是否有子节点
    const hasChildren =
      node[childrenKey] && Array.isArray(node[childrenKey]) && node[childrenKey].length > 0

    if (!hasChildren) {
      // 如果是叶子节点（没有子节点），才添加到结果中
      node.permission = currentPath.join('.')
      paths.push(currentPath.join('.'))
    } else {
      // 如果有子节点，递归处理
      const childPaths = getAllPermissions(node[childrenKey], fieldName, childrenKey, currentPath)
      paths = [...paths, ...childPaths]
    }
  }

  return paths
}

function filterTreeByLeafPermissions(treeData, permissions, childrenKey = 'children') {
  if (!Array.isArray(treeData) || treeData.length === 0) return []

  return treeData
    .map(node => {
      // 深拷贝节点避免修改原数据
      const newNode = { ...node }

      // 如果有子节点，递归处理
      if (newNode[childrenKey] && newNode[childrenKey].length > 0) {
        // 如果处理后子节点为空数组，且当前节点在权限列表中，则保留该节点
        if (
          // newNode[childrenKey].length === 0 &&
          newNode.meta?.permissions?.some(item => permissions.includes(item))
        ) {
          return newNode
        }

        newNode[childrenKey] = filterTreeByLeafPermissions(
          newNode[childrenKey],
          permissions,
          childrenKey
        )

        // 返回处理后的非空节点
        return newNode[childrenKey].length > 0 ? newNode : undefined
      }
      // 如果是叶子节点且在权限列表中，则保留
      else if (newNode.meta?.permissions?.some(item => permissions.includes(item))) {
        return newNode
      }

      // 其他情况过滤掉
      return undefined
    })
    .filter(Boolean) // 过滤掉undefined的节点
}

function generateRoutes(options) {
  const { routes } = options
  const accessMenus = store.state.user.accessMenus
  // 权限中的所有aliasName
  const permissions = getAllPermissions(accessMenus, 'alias_name')
  store.commit('access/setPermissions', { permissions })
  const accessRoutes = filterTreeByLeafPermissions(routes, permissions)
  console.log('paths:', accessRoutes)
  return accessRoutes
}

async function generateAccess(options) {
  const { router, routes } = options

  // 生成路由
  const accessibleRoutes = await generateRoutes(options)
  accessibleRoutes.forEach(route => {
    router.addRoute(route)
  })

  const basePath = getBasePath()

  fallbackNotFoundRoute.path = basePath ? `/${basePath}` : '/'
  console.log('fallbackNotFoundRoute', fallbackNotFoundRoute)
  router.addRoute(fallbackNotFoundRoute)

  const accessibleMenus = () => {}

  return {
    accessibleMenus,
    accessibleRoutes
  }
}

export { generateAccess }
