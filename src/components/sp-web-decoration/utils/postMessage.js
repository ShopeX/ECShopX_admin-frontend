import { normalizeDecorationPageType, resolveDecorationPreviewPath } from './pageTypes'

const ADMIN_TO_WEB_LOCALE_PREFIX = {
  en: '/en',
  ar: '/ar',
  zhcn: '',
  zhtw: 'zh-TW',
}

function getCurrentAdminLang() {
  if (typeof window === 'undefined') return ''
  try {
    return String(window.localStorage?.getItem('lang') || '').toLowerCase()
  } catch {
    return ''
  }
}

function resolveWebLocalePrefix(lang = getCurrentAdminLang()) {
  return ADMIN_TO_WEB_LOCALE_PREFIX[lang] || ''
}

function joinPreviewPath(localePrefix, routePath) {
  const prefix = String(localePrefix || '').replace(/\/+$/, '')
  const path = String(routePath || '/')
  if (!prefix) return path || '/'
  const suffix = path.replace(/^\/+/, '')
  return suffix ? `${prefix}/${suffix}` : prefix
}

function resolvePreviewWebsiteOrigin(websiteUrl) {
  if (!websiteUrl) return ''
  try {
    const baseHref =
      typeof window !== 'undefined' && window.location?.href
        ? window.location.href
        : 'http://localhost/'
    return new URL(websiteUrl, baseHref).origin
  } catch {
    return ''
  }
}

function isLoopbackHostname(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]'
  )
}

function isDevEnv() {
  return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development'
}

function isAllowedPreviewOrigin(eventOrigin, expectedOrigin) {
  if (!eventOrigin) return false
  if (!expectedOrigin) {
    if (!isDevEnv()) return false
    try {
      const { protocol, hostname } = new URL(eventOrigin)
      if (protocol !== 'http:' && protocol !== 'https:') return false
      return isLoopbackHostname(hostname)
    } catch {
      return false
    }
  }
  if (eventOrigin === expectedOrigin) return true
  if (!isDevEnv()) return false
  try {
    const a = new URL(eventOrigin)
    const b = new URL(expectedOrigin)
    if (a.protocol !== b.protocol) return false
    if (a.port !== b.port) return false
    return isLoopbackHostname(a.hostname) && isLoopbackHostname(b.hostname)
  } catch {
    return false
  }
}

export function createDecorationMessenger(websiteUrl) {
  const previewOrigin = resolvePreviewWebsiteOrigin(websiteUrl)

  function getPreviewUrl({ templateId, pageType = 'home' }) {
    if (!websiteUrl) return ''
    const normalizedPageType = normalizeDecorationPageType(pageType)
    const pageId = templateId || normalizedPageType
    try {
      const base =
        typeof window !== 'undefined' && window.location?.href
          ? new URL(websiteUrl, window.location.href)
          : new URL(websiteUrl)
      if (!base.pathname || base.pathname === '') {
        base.pathname = '/'
      }
      const routePath = resolveDecorationPreviewPath(normalizedPageType, pageId)
      base.pathname = joinPreviewPath(resolveWebLocalePrefix(), routePath)
      base.searchParams.set('designMode', '1')
      base.searchParams.set('pageType', normalizedPageType)
      base.searchParams.set('pageId', String(pageId))
      return base.toString()
    } catch {
      const originOnly = String(websiteUrl).split('?')[0].replace(/\/+$/, '') || ''
      const qs = new URLSearchParams({
        designMode: '1',
        pageType: String(normalizedPageType),
        pageId: String(pageId)
      })
      const routePath = resolveDecorationPreviewPath(normalizedPageType, pageId)
      const path = joinPreviewPath(resolveWebLocalePrefix(), routePath).replace(/\/$/, '')
      return `${originOnly}${path}/?${qs.toString()}`
    }
  }

  function send(type, iframeWindow, payload) {
    if (!iframeWindow || typeof iframeWindow.postMessage !== 'function') return
    const target = previewOrigin || (isDevEnv() ? '*' : '')
    if (!target) {
      console.warn(
        '[sp-web-decoration] Cannot send message to preview iframe: missing storefront origin (check VUE_APP_WEBSITE)'
      )
      return
    }
    try {
      iframeWindow.postMessage({ type, payload }, target)
    } catch (err) {
      console.warn('[sp-web-decoration] postMessage failed:', err)
    }
  }

  function sendInit(iframeWindow, payload) {
    send('DECORATION_INIT', iframeWindow, payload)
  }

  function sendUpdate(iframeWindow, payload) {
    send('DECORATION_UPDATE', iframeWindow, payload)
  }

  function sendMessage(iframeWindow, type, payload) {
    send(type, iframeWindow, payload)
  }

  function isAllowedOrigin(origin) {
    return isAllowedPreviewOrigin(origin, previewOrigin)
  }

  function onMessage(handler) {
    if (typeof window === 'undefined') return () => {}
    const listener = (event) => {
      const allowed = isAllowedOrigin(event.origin)
      if (isDevEnv()) {
        console.log('[sp-web-decoration] raw message', {
          origin: event.origin,
          expectedOrigin: previewOrigin,
          allowed,
          type: event.data?.type
        })
      }
      if (!allowed) return
      handler(event)
    }
    window.addEventListener('message', listener)
    return () => {
      window.removeEventListener('message', listener)
    }
  }

  return {
    previewOrigin,
    getPreviewUrl,
    sendInit,
    sendUpdate,
    sendMessage,
    isAllowedOrigin,
    onMessage
  }
}

export default {
  createDecorationMessenger
}
