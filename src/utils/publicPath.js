/**
 * 静态资源 / 应用路径（适配宝塔同域 /admin/ 等子路径部署）
 * 构建时由 VUE_APP_PUBLIC_PATH 注入，本地开发默认为 /
 */

export function getPublicPath() {
  const p = process.env.VUE_APP_PUBLIC_PATH || '/'
  if (!p || p === '/') return ''
  return String(p).replace(/\/+$/, '')
}

/**
 * @param {string} path 相对 public 的路径，如 images/logo.png 或 /images/logo.png
 * @returns {string}
 */
export function resolvePublicAsset(path = '') {
  const clean = String(path || '').replace(/^\/+/, '')
  const base = getPublicPath()
  if (!clean) return base ? `${base}/` : '/'
  return base ? `${base}/${clean}` : `/${clean}`
}

/**
 * 带 publicPath 前缀的应用内跳转地址（如 login、shopadmin）
 * @param {string} path
 * @returns {string}
 */
export function resolveAppPath(path = '/') {
  return resolvePublicAsset(path)
}
