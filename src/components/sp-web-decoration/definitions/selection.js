import { i18nValue } from '../utils/i18n.js'

export function isGlobalSectionId({ headerDsl, footerDsl } = {}, sectionId) {
  return Boolean(
    sectionId && (headerDsl?.sections?.[sectionId] || footerDsl?.sections?.[sectionId])
  )
}

export function findSectionIdByType(dsl, type) {
  const order = Array.isArray(dsl?.order) ? dsl.order : []
  for (const id of order) {
    const section = dsl?.sections?.[id]
    if (section && section.type === type) {
      return id
    }
  }
  return ''
}

export function firstOrderedSectionId(dsl) {
  const order = Array.isArray(dsl?.order) ? dsl.order : []
  return order[0] || ''
}

export const selectionManifest = {
  defaults: {
    selectedSectionId: '',
    selectedBlockId: '',
    expandedSectionIds: []
  },
  ruleOrder: ['header', 'footer', 'carousel', 'product-shelf', 'image-hotspot'],
  fallbackKey: 'fallback'
}

export const selectionRules = {
  header: {
    id: 'header',
    label: i18nValue('f5e431be.917f14', '标头'),
    strategy: 'globalSectionIfExists',
    globalSectionId: 'header'
  },
  footer: {
    id: 'footer',
    label: i18nValue('f5e431be.4eb88f', '页脚'),
    strategy: 'globalSectionIfExists',
    globalSectionId: 'footer'
  },
  carousel: {
    id: 'carousel',
    label: i18nValue('f5e431be.40bdf1', '幻灯片'),
    strategy: 'firstCarouselSection'
  },
  'product-shelf': {
    id: 'product-shelf',
    label: i18nValue('f5e431be.6c3721', '产品系列列表'),
    strategy: 'firstPageSectionOfType',
    sectionType: 'product-shelf'
  },
  'image-hotspot': {
    id: 'image-hotspot',
    label: i18nValue('f5e431be.0548c9', '图片横幅'),
    strategy: 'firstPageSectionOfType',
    sectionType: 'image-hotspot'
  },
  fallback: {
    id: 'fallback',
    label: i18nValue('f5e431be.b86993', '页面分区顺序第一项'),
    strategy: 'firstPageSectionInOrder'
  }
}

export const CAROUSEL_FAMILY_SECTION_TYPES = ['main-carousel', 'carousel']

export function findCarouselFamilySectionId(dsl) {
  for (const type of CAROUSEL_FAMILY_SECTION_TYPES) {
    const id = findSectionIdByType(dsl, type)
    if (id) return id
  }
  return ''
}

function getOrderedSectionRules() {
  const order = Array.isArray(selectionManifest.ruleOrder) ? selectionManifest.ruleOrder : []
  return order.map((key) => {
    const rule = selectionRules[key]
    if (!rule) {
      throw new Error(`[sp-web-decoration] selection rule "${key}" missing`)
    }
    return rule
  })
}

function getFallbackSectionRule() {
  const key = selectionManifest.fallbackKey || 'fallback'
  const rule = selectionRules[key]
  if (!rule) {
    throw new Error(`[sp-web-decoration] fallback selection rule "${key}" missing`)
  }
  return rule
}

function applyRule(rule, { dsl, headerDsl, footerDsl }) {
  if (!rule || !rule.strategy) return null

  if (rule.strategy === 'globalSectionIfExists') {
    const sectionId = rule.globalSectionId
    if (isGlobalSectionId({ headerDsl, footerDsl }, sectionId)) {
      return { sectionId, blockId: '' }
    }
    return null
  }

  if (rule.strategy === 'firstPageSectionOfType') {
    const sectionId = findSectionIdByType(dsl, rule.sectionType)
    return sectionId ? { sectionId, blockId: '' } : null
  }

  if (rule.strategy === 'firstCarouselSection') {
    const sectionId = findCarouselFamilySectionId(dsl)
    return sectionId ? { sectionId, blockId: '' } : null
  }

  return null
}

function applyFallback(fallback, { dsl }) {
  if (fallback?.strategy === 'firstPageSectionInOrder') {
    const sectionId = firstOrderedSectionId(dsl || {})
    return { sectionId, blockId: '' }
  }
  return { sectionId: '', blockId: '' }
}

function finalizeSection(partial, { headerDsl, footerDsl }, defaults) {
  const selectedSectionId = partial.sectionId || ''
  const selectedBlockId =
    partial.blockId !== undefined && partial.blockId !== null
      ? partial.blockId
      : defaults.selectedBlockId || ''
  const expandedSectionIds = Array.isArray(defaults.expandedSectionIds)
    ? defaults.expandedSectionIds.slice()
    : []

  let editingScope = 'global'
  if (selectedSectionId) {
    editingScope = isGlobalSectionId({ headerDsl, footerDsl }, selectedSectionId)
      ? 'global'
      : 'page'
  }

  return {
    selectedSectionId,
    selectedBlockId,
    expandedSectionIds,
    editingScope
  }
}

export function getInitialEditorSelection({ dsl, headerDsl, footerDsl }) {
  const defaults = selectionManifest.defaults || {}
  const rules = getOrderedSectionRules()

  for (const rule of rules) {
    const hit = applyRule(rule, { dsl, headerDsl, footerDsl })
    if (hit && hit.sectionId) {
      return finalizeSection(hit, { headerDsl, footerDsl }, defaults)
    }
  }

  const fallback = applyFallback(getFallbackSectionRule(), { dsl })
  return finalizeSection(fallback, { headerDsl, footerDsl }, defaults)
}

export default {
  isGlobalSectionId,
  findSectionIdByType,
  firstOrderedSectionId,
  CAROUSEL_FAMILY_SECTION_TYPES,
  findCarouselFamilySectionId,
  selectionManifest,
  selectionRules,
  getInitialEditorSelection
}
