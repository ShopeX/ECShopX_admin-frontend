/**
 * 侧栏菜单 name 来自权限接口，常为中文；与路由 meta.title 对齐后可随语言切换。
 *
 * meta.title 支持两种写法：
 * - i18n 键（如 `738edee2.ff36f6`）→ 运行时 `$t`
 * - 路由注册时 `i18n.t(key)` 的译文 → 切换语言整页重载后直接使用
 *
 * @param {import('vue').default} vm 组件实例（需有 $router、$t、$te）
 * @param {object} menuItem accessMenus 中的项，含 permission / alias_name / name
 * @returns {string}
 */
const I18N_KEY_PATTERN = /^[a-f0-9]{8}\.[a-f0-9]{6}$/

function normalizeAlias(alias) {
  return alias ? String(alias).replace(/\//g, '') : ''
}

function isI18nKey(value) {
  return typeof value === 'string' && I18N_KEY_PATTERN.test(value)
}

function resolveTitle(vm, title) {
  if (!title || typeof title !== 'string') return null

  if (isI18nKey(title)) {
    return vm.$te(title) ? vm.$t(title) : null
  }

  // 路由注册时 i18n.t() 已解析的文案
  return title
}

function findRouteForMenu(vm, menuItem) {
  const routes = vm.$router.getRoutes()
  let candidates = []
  const alias = normalizeAlias(menuItem.alias_name)

  if (menuItem.permission) {
    candidates = routes.filter((route) => {
      const perms = route.meta?.permissions
      return Array.isArray(perms) && perms.includes(menuItem.permission)
    })
  }

  // 多路由共用同一 permission 时，用 aliasName 精确匹配（如 publicsetting vs mailService）
  if (alias && candidates.length > 1) {
    const byAlias = candidates.filter(
      (route) => normalizeAlias(route.meta?.aliasName) === alias
    )
    if (byAlias.length) {
      candidates = byAlias
    }
  }

  if (candidates.length === 0 && alias) {
    candidates = routes.filter((route) => normalizeAlias(route.meta?.aliasName) === alias)
  }
  if (candidates.length === 0 && alias) {
    candidates = routes.filter((route) => {
      const perms = route.meta?.permissions
      return (
        Array.isArray(perms) &&
        perms.some((perm) => perm === alias || perm.endsWith('.' + alias))
      )
    })
  }

  if (candidates.length === 0) return null

  return (
    candidates.find((route) => alias && normalizeAlias(route.meta?.aliasName) === alias) ||
    candidates.find((route) => route.name === 'webMenu') ||
    candidates.find((route) => isI18nKey(route.meta?.title)) ||
    candidates.find(
      (route) => !String(route.path).includes(':') && !String(route.path).includes('create')
    ) ||
    candidates[0]
  )
}

export function getMenuDisplayName(vm, menuItem) {
  if (!menuItem) return ''

  const route = findRouteForMenu(vm, menuItem)
  const fromRoute = resolveTitle(vm, route?.meta?.title)
  if (fromRoute) return fromRoute

  return menuItem.name || ''
}
