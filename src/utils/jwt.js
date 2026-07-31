/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/**
 * 解析 JWT payload（兼容 base64url：- _ 与缺省 padding）
 * @param {string} token
 * @returns {object}
 */
export function decodeJwtPayload(token) {
  const base64Url = String(token || '').split('.')[1] || ''
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return JSON.parse(atob(padded))
}
