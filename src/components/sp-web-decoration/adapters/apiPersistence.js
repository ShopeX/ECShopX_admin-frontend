/**
 * PC 模板装修：与 ThemeBundle pctemplate 接口对接，存取 ECX 编辑器 DSL。
 * 读取统一走 getDecorationContent，按 page_name 区分 page/header/footer。
 * 保存仍维持 page 与 header/footer 分开调用，兼容现有后端存储。
 */
import { getDecorationContent, saveTemplateContent, saveHeaderOrFooter } from '@/api/webtemplate'
import {
  createHomeDsl,
  createCustomDsl,
  createProductListDsl,
  createGlobalDsl,
  serializeDsl,
  deserializeDsl,
  ensureGlobalDslDefaults,
  createHeaderDsl,
  createFooterDsl,
  splitGlobalDsl
} from '../utils/dsl.js'
import { createGlobalSections } from '../definitions/documents/global.js'

export const DSL_ROW_TYPE = 'ECX_SP_WEB_DECORATION_DSL_V1'
export const DEFAULT_COUNTRY_CODE = 'zh-CN'
const LEGACY_GLOBAL_DECORATION_PAGE_NAME = 'ecx_sp_web_decoration_global'
export const HEADER_DECORATION_PAGE_NAME = 'header'
export const FOOTER_DECORATION_PAGE_NAME = 'footer'

export function getCurrentCountryCode() {
  const lang = window.localStorage.getItem('lang')
  const langMap = {
    zhcn: 'zh-CN',
    en: 'en-CN',
    zhtw: 'zh-TW',
    ar: 'ar-SA'
  }
  return langMap[lang] || DEFAULT_COUNTRY_CODE
}

function createPageFallback(templateId, scene, pageType = 'home') {
  if (pageType === 'custom') {
    return createCustomDsl({ pageId: String(templateId || ''), scene })
  }
  if (pageType === 'product_list') {
    return createProductListDsl({ pageId: String(templateId || 'product_list'), scene })
  }
  const dsl = createHomeDsl({ pageId: String(templateId || ''), scene })
  dsl.pageType = pageType
  return dsl
}

function createGlobalFallback() {
  return createGlobalDsl(createGlobalSections())
}

function createHeaderFallback() {
  return createHeaderDsl()
}

function createFooterFallback() {
  return createFooterDsl()
}

function normalizePageDsl(raw, templateId, scene, pageType = 'home') {
  const fallback = createPageFallback(templateId, scene, pageType)
  if (raw == null) return fallback
  let payload = raw
  if (typeof raw === 'string') {
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      return fallback
    }
  }
  if (typeof payload !== 'object' || payload === null) return fallback
  try {
    const d = deserializeDsl(payload)
    if (!d || typeof d !== 'object') return fallback
    if (typeof d.sections !== 'object' || d.sections === null) return fallback
    if (!Array.isArray(d.order)) d.order = []
    d.pageType = fallback.pageType
    d.pageId = fallback.pageId
    if (!d.meta || typeof d.meta !== 'object') d.meta = { ...(fallback.meta || {}) }
    return d
  } catch (e) {
    console.warn('[decoration] normalizePageDsl', e)
    return fallback
  }
}

function normalizeGlobalDsl(raw) {
  const fallback = createGlobalFallback()
  if (raw == null) return fallback
  let payload = raw
  if (typeof raw === 'string') {
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      return fallback
    }
  }
  if (typeof payload !== 'object' || payload === null) return fallback
  try {
    const d = deserializeDsl(payload)
    if (!d || typeof d !== 'object') return fallback
    if (d.pageType !== 'global') return fallback
    const sections = d.sections || {}
    const keys = Object.keys(sections)
    if (keys.length === 0) return fallback

    if (!Array.isArray(d.order)) d.order = []
    if (d.order.length === 0) {
      const preferred = (fallback.order || []).filter((id) => sections[id])
      d.order = preferred.length ? preferred : keys
    }
    return ensureGlobalDslDefaults(d)
  } catch (e) {
    console.warn('[decoration] normalizeGlobalDsl', e)
    return fallback
  }
}

function normalizeScopedDsl(raw, fallback, pageType) {
  if (raw == null) return fallback
  let payload = raw
  if (typeof raw === 'string') {
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      return fallback
    }
  }
  if (typeof payload !== 'object' || payload === null) return fallback
  try {
    const d = deserializeDsl(payload)
    if (!d || typeof d !== 'object') return fallback
    if (d.pageType !== pageType) return fallback
    if (typeof d.sections !== 'object' || d.sections === null) return fallback
    if (!Array.isArray(d.order)) d.order = fallback.order
    if (!d.pageId) d.pageId = fallback.pageId
    return d
  } catch (e) {
    console.warn(`[decoration] normalize${pageType}Dsl`, e)
    return fallback
  }
}

function unwrapPayload(res) {
  let current = res
  while (current && typeof current === 'object') {
    if (Array.isArray(current)) {
      return current
    }

    if (
      current.data !== undefined &&
      current.headers !== undefined &&
      current.status !== undefined &&
      current.config !== undefined
    ) {
      current = current.data
      continue
    }

    if (
      current.data !== undefined &&
      current.data !== null &&
      current.id === undefined &&
      current.name === undefined &&
      current.config === undefined
    ) {
      current = current.data
      continue
    }

    break
  }
  return current == null ? null : current
}

export function parsePageDslRows(payload, templateId, scene, pageType = 'home') {
  const rows = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? [payload]
      : []
  if (!rows.length) return null

  for (const row of rows) {
    console.log('[sp-web-decoration] page config payload', {
      templateId,
      rowId: row?.id,
      rowName: row?.name,
      config: row?.config
    })
    let cfg
    try {
      cfg = JSON.parse(row?.config || '[]')
    } catch (e) {
      console.warn('[sp-web-decoration] page config parse failed', {
        templateId,
        rowId: row?.id,
        error: e?.message
      })
      continue
    }
    const target = Array.isArray(cfg)
      ? cfg.find((item) => item && (item.type === DSL_ROW_TYPE || (item.pageType && item.sections)))
      : cfg && (cfg.type === DSL_ROW_TYPE || (cfg.pageType && cfg.sections))
        ? cfg
        : null
    const targetDsl = target?.dsl || target
    console.log('[sp-web-decoration] page config parsed target', {
      templateId,
      rowId: row?.id,
      isArray: Array.isArray(cfg),
      hasTarget: Boolean(target),
      targetDsl
    })
    if (!targetDsl) continue
    return {
      dsl: normalizePageDsl(targetDsl, templateId, scene, pageType),
      contentRowId: row.id || target.id || 0,
      source: 'api'
    }
  }

  return null
}

function parseScopedDslRow(row, fallback, pageType) {
  if (!row) return null
  const candidate = row?.config || row?.params || row?.dsl || row
  return {
    dsl: normalizeScopedDsl(candidate, fallback, pageType),
    source: 'api'
  }
}

function parseLegacyGlobalDslRow(row) {
  if (!row) return null
  const candidate = row?.config || row?.params || row?.dsl || row
  return {
    dsl: normalizeGlobalDsl(candidate),
    source: 'api'
  }
}

function createPageLoadFallback(templateId, scene, pageType = 'home') {
  return {
    dsl: createPageFallback(templateId, scene, pageType),
    contentRowId: 0,
    source: 'default'
  }
}

export async function loadPageDslFromApi({ templateId, scene, pageType = 'home' }) {
  const fallback = {
    dsl: createPageFallback(templateId, scene, pageType),
    contentRowId: 0,
    source: 'default'
  }
  if (!templateId) return fallback

  try {
    const raw = await getDecorationContent({
      page_name: 'page',
      theme_pc_template_id: templateId
    })
    const list = unwrapPayload(raw)
    return parsePageDslRows(list, templateId, scene, pageType) || fallback
  } catch (e) {
    console.warn('[decoration] loadPageDslFromApi', e)
  }
  return fallback
}

export function buildPageContentPayload({ normalizedDsl, contentRowId }) {
  const payload = {
    type: DSL_ROW_TYPE,
    ...serializeDsl(normalizedDsl)
  }

  if (contentRowId) {
    payload.id = contentRowId
  }

  return payload
}

async function loadDefaultPageRow({ templateId, scene, pageType }) {
  const raw = await getDecorationContent({
    page_name: 'page',
    theme_pc_template_id: templateId,
    country_code: DEFAULT_COUNTRY_CODE
  })
  const list = unwrapPayload(raw)
  return parsePageDslRows(list, templateId, scene, pageType)
}

async function ensureDefaultPageRow({ templateId, contentRowId, normalizedDsl, scene, pageType }) {
  if (getCurrentCountryCode() === DEFAULT_COUNTRY_CODE) {
    return contentRowId || 0
  }

  const existing = await loadDefaultPageRow({ templateId, scene, pageType })
  if (existing?.contentRowId) {
    return existing.contentRowId
  }

  const payload = buildPageContentPayload({
    normalizedDsl,
    contentRowId: 0
  })

  await saveTemplateContent({
    theme_pc_template_id: templateId,
    config: JSON.stringify([payload]),
    country_code: DEFAULT_COUNTRY_CODE
  })

  const created = await loadDefaultPageRow({ templateId, scene, pageType })
  return created?.contentRowId || contentRowId || 0
}

export async function savePageDslToApi({
  templateId,
  contentRowId,
  dsl,
  scene,
  pageType = 'home'
}) {
  const normalizedDsl = normalizePageDsl(dsl, templateId, scene, pageType)
  const stableContentRowId = await ensureDefaultPageRow({
    templateId,
    contentRowId,
    normalizedDsl,
    scene,
    pageType
  })
  const payload = buildPageContentPayload({
    normalizedDsl,
    contentRowId: stableContentRowId || contentRowId
  })
  const config = JSON.stringify([payload])
  const body = {
    theme_pc_template_id: templateId,
    config
  }

  if (contentRowId) {
    body.id = contentRowId
  }

  await saveTemplateContent(body)

  const latest = await loadPageDslFromApi({
    templateId,
    scene,
    pageType
  })

  return {
    dsl: normalizedDsl,
    contentRowId: latest.contentRowId || stableContentRowId || contentRowId || 0
  }
}

async function loadLegacyGlobalDslFromApi() {
  try {
    const raw = await getDecorationContent({
      page_name: LEGACY_GLOBAL_DECORATION_PAGE_NAME
    })
    const payload = unwrapPayload(raw)
    if (!payload) return { dsl: createGlobalFallback(), source: 'default' }
    const candidate = payload?.config || payload?.params || payload?.dsl || payload
    return {
      dsl: normalizeGlobalDsl(candidate),
      source: 'api'
    }
  } catch (e) {
    console.warn('[decoration] loadLegacyGlobalDslFromApi', e)
    return { dsl: createGlobalFallback(), source: 'default' }
  }
}

export async function loadHeaderDslFromApi() {
  try {
    const raw = await getDecorationContent({
      page_name: HEADER_DECORATION_PAGE_NAME,
      page_type: HEADER_DECORATION_PAGE_NAME
    })
    const payload = unwrapPayload(raw)
    if (!payload) return { dsl: createHeaderFallback(), source: 'default' }
    const candidate = payload?.config || payload?.params || payload?.dsl || payload
    return {
      dsl: normalizeScopedDsl(candidate, createHeaderFallback(), 'header'),
      source: 'api'
    }
  } catch (e) {
    console.warn('[decoration] loadHeaderDslFromApi', e)
    return { dsl: createHeaderFallback(), source: 'default' }
  }
}

export async function loadFooterDslFromApi() {
  try {
    const raw = await getDecorationContent({
      page_name: FOOTER_DECORATION_PAGE_NAME,
      page_type: FOOTER_DECORATION_PAGE_NAME
    })
    const payload = unwrapPayload(raw)
    if (!payload) return { dsl: createFooterFallback(), source: 'default' }
    const candidate = payload?.config || payload?.params || payload?.dsl || payload
    return {
      dsl: normalizeScopedDsl(candidate, createFooterFallback(), 'footer'),
      source: 'api'
    }
  } catch (e) {
    console.warn('[decoration] loadFooterDslFromApi', e)
    return { dsl: createFooterFallback(), source: 'default' }
  }
}

export async function loadHeaderFooterDslFromApi() {
  const [header, footer] = await Promise.all([loadHeaderDslFromApi(), loadFooterDslFromApi()])
  if (header.source !== 'default' || footer.source !== 'default') {
    return {
      headerDsl: header.dsl,
      footerDsl: footer.dsl,
      source: 'api'
    }
  }

  const legacyGlobal = await loadLegacyGlobalDslFromApi()
  if (legacyGlobal.source !== 'default') {
    return {
      ...splitGlobalDsl(legacyGlobal.dsl),
      source: 'legacy-global'
    }
  }

  return {
    headerDsl: header.dsl,
    footerDsl: footer.dsl,
    source: 'default'
  }
}

export async function loadDecorationContentFromApi({ templateId, scene, pageType = 'home' }) {
  const fallbackPage = createPageLoadFallback(templateId, scene, pageType)
  if (!templateId) {
    return {
      page: fallbackPage,
      headerDsl: createHeaderFallback(),
      footerDsl: createFooterFallback(),
      source: 'default'
    }
  }

  try {
    const [page, headerFooter] = await Promise.all([
      loadPageDslFromApi({ templateId, scene, pageType }),
      loadHeaderFooterDslFromApi()
    ])
    if (headerFooter.source === 'legacy-global') {
      return {
        page,
        headerDsl: headerFooter.headerDsl,
        footerDsl: headerFooter.footerDsl,
        source: 'legacy-global'
      }
    }
    if (page.source !== 'default' || headerFooter.source !== 'default') {
      return {
        page,
        headerDsl: headerFooter.headerDsl,
        footerDsl: headerFooter.footerDsl,
        source: 'api'
      }
    }
    return {
      page,
      headerDsl: headerFooter.headerDsl,
      footerDsl: headerFooter.footerDsl,
      source: 'default'
    }
  } catch (e) {
    console.warn('[decoration] loadDecorationContentFromApi fallback', e)
    const [page, headerFooter] = await Promise.all([
      loadPageDslFromApi({ templateId, scene, pageType }),
      loadHeaderFooterDslFromApi()
    ])
    return {
      page,
      headerDsl: headerFooter.headerDsl,
      footerDsl: headerFooter.footerDsl,
      source: headerFooter.source || page.source
    }
  }
}

async function ensureDefaultScopedRow({ pageName, dsl }) {
  if (getCurrentCountryCode() === DEFAULT_COUNTRY_CODE) {
    return
  }

  const raw = await getDecorationContent({
    page_name: pageName,
    page_type: pageName,
    country_code: DEFAULT_COUNTRY_CODE
  })
  const payload = unwrapPayload(raw)
  if (payload?.id || payload?.config) {
    return
  }

  await saveHeaderOrFooter({
    page_name: pageName,
    config: JSON.stringify(serializeDsl(dsl)),
    country_code: DEFAULT_COUNTRY_CODE
  })
}

async function saveScopedDslToApi({ pageName, dsl }) {
  await ensureDefaultScopedRow({ pageName, dsl })
  return saveHeaderOrFooter({
    page_name: pageName,
    config: JSON.stringify(serializeDsl(dsl))
  })
}

export async function saveHeaderDslToApi({ dsl }) {
  await saveScopedDslToApi({
    pageName: HEADER_DECORATION_PAGE_NAME,
    dsl
  })
  return {
    dsl: normalizeScopedDsl(dsl, createHeaderFallback(), 'header')
  }
}

export async function saveFooterDslToApi({ dsl }) {
  await saveScopedDslToApi({
    pageName: FOOTER_DECORATION_PAGE_NAME,
    dsl
  })
  return {
    dsl: normalizeScopedDsl(dsl, createFooterFallback(), 'footer')
  }
}

export default {
  loadDecorationContentFromApi,
  loadPageDslFromApi,
  savePageDslToApi,
  loadHeaderDslFromApi,
  saveHeaderDslToApi,
  loadFooterDslFromApi,
  saveFooterDslToApi,
  loadHeaderFooterDslFromApi
}
