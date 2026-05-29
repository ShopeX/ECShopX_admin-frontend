/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export const USERCENTER_LOGIN_STORAGE_KEY = 'ecshopx_usercenter_login'

/** 用户中心登录态有效期：2 小时 */
export const USERCENTER_LOGIN_TTL_MS = 2 * 60 * 60 * 1000

export function setUsercenterLoginSuccess(extra = {}) {
  const loggedInAt = Date.now()
  localStorage.setItem(
    USERCENTER_LOGIN_STORAGE_KEY,
    JSON.stringify({
      loggedIn: true,
      loggedInAt,
      expiresAt: loggedInAt + USERCENTER_LOGIN_TTL_MS,
      ...extra
    })
  )
}

export function getUsercenterLoginState() {
  try {
    const raw = localStorage.getItem(USERCENTER_LOGIN_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data.loggedIn) {
      return null
    }

    const expiresAt =
      data.expiresAt || (data.loggedInAt ? data.loggedInAt + USERCENTER_LOGIN_TTL_MS : 0)
    if (!expiresAt || Date.now() >= expiresAt) {
      clearUsercenterLoginState()
      return null
    }

    return data
  } catch (e) {
    clearUsercenterLoginState()
    return null
  }
}

export function clearUsercenterLoginState() {
  localStorage.removeItem(USERCENTER_LOGIN_STORAGE_KEY)
}

export function isUsercenterLoggedIn() {
  return !!getUsercenterLoginState()
}
