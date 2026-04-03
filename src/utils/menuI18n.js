/**
 * 侧栏菜单 name 来自权限接口，常为中文；与路由 meta.title（i18n key）对齐后可随语言切换。
 * @param {import('vue').default} vm 组件实例（需有 $router、$t、$te）
 * @param {object} menuItem accessMenus 中的项，含 permission / alias_name / name
 * @returns {string}
 */
export function getMenuDisplayName(vm, menuItem) {
  if (!menuItem) return ''
  let route = null
  if (menuItem.permission) {
    route = vm.$router.getRoutes().find((r) => {
      const perms = r.meta?.permissions
      return Array.isArray(perms) && perms.includes(menuItem.permission)
    })
  }
  if (!route && menuItem.alias_name) {
    route = vm.$router.getRoutes().find((r) => r.meta?.aliasName === menuItem.alias_name)
  }
  const key = route?.meta?.title
  if (key && typeof key === 'string' && vm.$te(key)) {
    return vm.$t(key)
  }
  return menuItem.name || ''
}
