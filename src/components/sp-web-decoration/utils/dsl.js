import { createTemplateDocumentDsl } from '../definitions/documents/template.js'
import { createCustomDocumentDsl } from '../definitions/documents/custom.js'
import { createProductListDocumentDsl } from '../definitions/documents/product-list.js'
import { createHeaderDocumentDsl } from '../definitions/documents/header.js'
import { createFooterDocumentDsl } from '../definitions/documents/footer.js'
import { createGlobalSections } from '../definitions/documents/global.js'
import { createTypedSection } from '../definitions/factory.js'
import { generateBlockId } from './nanoid.js'

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

const HIDDEN_SECTION_TYPES = ['announcement-bar']

function isHiddenSectionType(type) {
  return HIDDEN_SECTION_TYPES.includes(type)
}

function filterVisibleSectionIds(order = [], sections = {}) {
  return (Array.isArray(order) ? order : []).filter((id) => {
    const section = sections?.[id]
    return !section || !isHiddenSectionType(section.type)
  })
}

function normalizeSectionShape(section, fallbackId) {
  const nextSection = cloneValue(section || {})
  if (fallbackId && !nextSection.id) nextSection.id = fallbackId
  if (!nextSection.blockOrder && Array.isArray(nextSection.block_order)) {
    nextSection.blockOrder = cloneValue(nextSection.block_order)
  }
  delete nextSection.block_order
  return nextSection
}

export function createHomeDsl({ pageId = '', scene = '1001' } = {}) {
  return createTemplateDocumentDsl({ pageId, scene })
}

export function createCustomDsl({ pageId = '', scene = '1001' } = {}) {
  return createCustomDocumentDsl({ pageId, scene })
}

export function createProductListDsl({ pageId = '', scene = '1001' } = {}) {
  return createProductListDocumentDsl({ pageId, scene })
}

export function createGlobalDsl(sections) {
  let source = sections
  if (source == null) {
    source = createGlobalSections()
  }
  const resolvedSections = cloneValue(source)
  const order = ['header']
  if (resolvedSections.footer) order.push('footer')
  return {
    pageType: 'global',
    pageId: 'global',
    sections: resolvedSections,
    order
  }
}

function createDefaultHeaderSection() {
  return createTypedSection('header', { fixedId: 'header' })
}

function createDefaultHeaderDsl() {
  return createHeaderDocumentDsl()
}

function createDefaultFooterSection() {
  return cloneValue(createFooterDocumentDsl().sections.footer)
}

function createScopedGlobalDsl({ pageId, section }) {
  const sectionId = section.id || pageId
  return {
    pageType: pageId,
    pageId,
    sections: {
      [sectionId]: cloneValue({ ...section, id: sectionId })
    },
    order: [sectionId]
  }
}

export function createHeaderDsl(section, extraSections = {}, extraOrder = []) {
  if (!section && Object.keys(extraSections || {}).length === 0 && extraOrder.length === 0) {
    return createDefaultHeaderDsl()
  }
  const header = section || createDefaultHeaderSection()
  const sections = {
    header: normalizeSectionShape({ ...header, id: 'header' }, 'header')
  }
  filterVisibleSectionIds(extraOrder, extraSections).forEach((id) => {
    if (id !== 'header' && id !== 'footer' && extraSections[id]) {
      sections[id] = normalizeSectionShape(extraSections[id], id)
    }
  })
  return {
    pageType: 'header',
    pageId: 'header',
    sections,
    order: [
      'header',
      ...filterVisibleSectionIds(extraOrder, extraSections).filter(
        (id) => id !== 'header' && id !== 'footer'
      )
    ]
  }
}

export function createFooterDsl(section, extraSections = {}, extraOrder = []) {
  const footer = section || createDefaultFooterSection()
  const sections = {}
  extraOrder.forEach((id) => {
    if (id !== 'footer' && extraSections[id]) {
      sections[id] = normalizeSectionShape(extraSections[id], id)
    }
  })
  sections.footer = normalizeSectionShape({ ...footer, id: 'footer' }, 'footer')
  return {
    pageType: 'footer',
    pageId: 'footer',
    sections,
    order: [...extraOrder.filter((id) => id !== 'footer'), 'footer']
  }
}

export function ensureGlobalDslDefaults(dsl) {
  const fallback = createGlobalDsl()
  if (!dsl || typeof dsl !== 'object') return fallback

  const nextDsl = cloneValue(dsl)
  if (!nextDsl.pageType) nextDsl.pageType = fallback.pageType
  if (nextDsl.pageId === undefined || nextDsl.pageId === null) nextDsl.pageId = fallback.pageId
  if (!nextDsl.sections || typeof nextDsl.sections !== 'object') nextDsl.sections = {}
  if (!Array.isArray(nextDsl.order)) nextDsl.order = []

  const defaultHeader = createDefaultHeaderSection()
  const header = nextDsl.sections.header
  if (!header || header.type !== 'header') {
    nextDsl.sections.header = defaultHeader
  } else {
    const settingsKeys =
      header.settings && typeof header.settings === 'object' ? Object.keys(header.settings) : []
    const blockKeys =
      header.blocks && typeof header.blocks === 'object' ? Object.keys(header.blocks) : []
    const blockOrderLength = Array.isArray(header.blockOrder) ? header.blockOrder.length : 0
    if (settingsKeys.length === 0 && blockKeys.length === 0 && blockOrderLength === 0) {
      nextDsl.sections.header = defaultHeader
    } else {
      if (settingsKeys.length === 0) {
        nextDsl.sections.header.settings = cloneValue(defaultHeader.settings)
      }
      if (blockKeys.length === 0 || blockOrderLength === 0) {
        nextDsl.sections.header.blocks = cloneValue(defaultHeader.blocks)
        nextDsl.sections.header.blockOrder = cloneValue(defaultHeader.blockOrder)
      }
    }
  }

  if (!nextDsl.order.includes('header')) {
    const footerIndex = nextDsl.order.indexOf('footer')
    if (footerIndex >= 0) {
      nextDsl.order.splice(footerIndex, 0, 'header')
    } else {
      nextDsl.order.unshift('header')
    }
  }

  return nextDsl
}

export function splitGlobalDsl(globalDsl) {
  const normalizedGlobalDsl = ensureGlobalDslDefaults(globalDsl)
  const { header, footer } = normalizedGlobalDsl.sections || {}
  const globalOrder = normalizedGlobalDsl.order || []
  const footerIndex = globalOrder.indexOf('footer')
  const headerOrder = filterVisibleSectionIds(
    (footerIndex >= 0 ? globalOrder.slice(0, footerIndex) : globalOrder).filter(
      (id) => id !== 'footer'
    ),
    normalizedGlobalDsl.sections
  )
  const footerOrder =
    footerIndex >= 0 ? globalOrder.slice(footerIndex).filter((id) => id !== 'footer') : []
  const headerSections = {}
  headerOrder.forEach((id) => {
    if (id !== 'header' && normalizedGlobalDsl.sections?.[id]) {
      headerSections[id] = cloneValue(normalizedGlobalDsl.sections[id])
    }
  })
  const footerSections = {}
  footerOrder.forEach((id) => {
    if (normalizedGlobalDsl.sections?.[id]) {
      footerSections[id] = cloneValue(normalizedGlobalDsl.sections[id])
    }
  })
  const headerDsl = createHeaderDsl(header, headerSections, headerOrder)
  const footerDsl = footer
    ? createFooterDsl(footer, footerSections, footerOrder)
    : createFooterDsl()
  return {
    headerDsl,
    footerDsl
  }
}

export function insertSection(dsl, section, index) {
  const nextDsl = cloneValue(dsl)
  const nextIndex =
    typeof index === 'number' && index >= 0 && index <= nextDsl.order.length
      ? index
      : nextDsl.order.length
  nextDsl.sections[section.id] = cloneValue(section)
  nextDsl.order.splice(nextIndex, 0, section.id)
  return nextDsl
}

export function updateSectionSettings(dsl, sectionId, patch) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].settings = {
    ...nextDsl.sections[sectionId].settings,
    ...cloneValue(patch)
  }
  return nextDsl
}

export function insertBlock(dsl, sectionId, block, insertIndex) {
  if (!dsl.sections[sectionId] || !block?.id) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blocks = {
    ...(nextDsl.sections[sectionId].blocks || {}),
    [block.id]: cloneValue(block)
  }
  const prevOrder = nextDsl.sections[sectionId].blockOrder || []
  const order = prevOrder.slice()
  if (
    typeof insertIndex === 'number' &&
    !Number.isNaN(insertIndex) &&
    insertIndex >= 0 &&
    insertIndex <= order.length
  ) {
    order.splice(insertIndex, 0, block.id)
  } else {
    order.push(block.id)
  }
  nextDsl.sections[sectionId].blockOrder = order
  return nextDsl
}

export function updateBlockSettings(dsl, sectionId, blockId, patch) {
  const section = dsl.sections[sectionId]
  if (!section?.blocks?.[blockId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blocks[blockId].settings = {
    ...nextDsl.sections[sectionId].blocks[blockId].settings,
    ...cloneValue(patch)
  }
  return nextDsl
}

export function removeBlock(dsl, sectionId, blockId) {
  const section = dsl.sections[sectionId]
  if (!section?.blocks?.[blockId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  delete nextDsl.sections[sectionId].blocks[blockId]
  nextDsl.sections[sectionId].blockOrder = (nextDsl.sections[sectionId].blockOrder || []).filter(
    (id) => id !== blockId
  )
  return nextDsl
}

export function duplicateBlock(dsl, sectionId, blockId) {
  const section = dsl.sections[sectionId]
  const sourceBlock = section?.blocks?.[blockId]
  if (!sourceBlock) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  const duplicatedBlock = cloneValue(sourceBlock)
  duplicatedBlock.id = generateBlockId(sourceBlock.type)
  nextDsl.sections[sectionId].blocks[duplicatedBlock.id] = duplicatedBlock
  const order = (nextDsl.sections[sectionId].blockOrder || []).slice()
  const sourceIndex = order.indexOf(blockId)
  order.splice(sourceIndex >= 0 ? sourceIndex + 1 : order.length, 0, duplicatedBlock.id)
  nextDsl.sections[sectionId].blockOrder = order
  return nextDsl
}

export function replaceBlockOrder(dsl, sectionId, blockOrder) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blockOrder = blockOrder.slice()
  return nextDsl
}

export function removeSection(dsl, sectionId) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  delete nextDsl.sections[sectionId]
  nextDsl.order = nextDsl.order.filter((id) => id !== sectionId)
  return nextDsl
}

export function duplicateSection(dsl, sectionId, createDefaultSection) {
  const sourceSection = dsl.sections[sectionId]
  if (!sourceSection) return cloneValue(dsl)
  const duplicatedSection = createDefaultSection(sourceSection.type)
  duplicatedSection.disabled = sourceSection.disabled
  duplicatedSection.settings = cloneValue(sourceSection.settings)
  duplicatedSection.blocks = cloneValue(sourceSection.blocks || {})
  duplicatedSection.blockOrder = cloneValue(sourceSection.blockOrder || [])
  duplicatedSection.title = sourceSection.title
  duplicatedSection.titleKey = sourceSection.titleKey

  const nextDsl = cloneValue(dsl)
  const sourceIndex = nextDsl.order.findIndex((id) => id === sectionId)
  nextDsl.sections[duplicatedSection.id] = duplicatedSection
  nextDsl.order.splice(sourceIndex + 1, 0, duplicatedSection.id)
  return nextDsl
}

export function moveSection(dsl, sectionId, targetIndex) {
  const currentIndex = dsl.order.findIndex((id) => id === sectionId)
  if (currentIndex === -1) return cloneValue(dsl)

  const normalizedTargetIndex = Math.max(0, Math.min(targetIndex, dsl.order.length - 1))
  if (currentIndex === normalizedTargetIndex) {
    return cloneValue(dsl)
  }

  const nextDsl = cloneValue(dsl)
  nextDsl.order.splice(currentIndex, 1)
  nextDsl.order.splice(normalizedTargetIndex, 0, sectionId)
  return nextDsl
}

export function replaceSection(dsl, sectionId, nextSection) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId] = cloneValue(nextSection)
  return nextDsl
}

export function composePreviewDsl({ pageType = 'home', pageId = '', dsl, headerDsl, footerDsl }) {
  const headerOrder = Array.isArray(headerDsl?.order)
    ? headerDsl.order.filter((id) => id !== 'footer')
    : []
  const footerOrder = Array.isArray(footerDsl?.order) ? footerDsl.order.slice() : []
  return {
    pageType,
    pageId,
    sections: {
      ...(headerDsl?.sections || {}),
      ...(footerDsl?.sections || {}),
      ...(dsl?.sections || {})
    },
    order: [...headerOrder, ...(dsl?.order || []).slice(), ...footerOrder],
    meta: cloneValue(dsl?.meta || {})
  }
}

export function serializeDsl(dsl) {
  const nextDsl = cloneValue(dsl)
  Object.keys(nextDsl.sections || {}).forEach((sectionId) => {
    const section = nextDsl.sections[sectionId]
    Object.keys(section.blocks || {}).forEach((blockId) => {
      const block = section.blocks[blockId]
      if (block?.type === 'product-tab' && block.settings) {
        delete block.settings.size
        delete block.settings.size_override
      }
    })
    section.block_order = cloneValue(section.blockOrder || [])
  })
  return nextDsl
}

export function deserializeDsl(dsl) {
  const nextDsl = cloneValue(dsl)
  Object.keys(nextDsl.sections || {}).forEach((sectionId) => {
    const section = nextDsl.sections[sectionId]
    if (!section.blockOrder && Array.isArray(section.block_order)) {
      section.blockOrder = cloneValue(section.block_order)
    }
    delete section.block_order
  })
  return nextDsl
}

export default {
  createHomeDsl,
  createCustomDsl,
  createProductListDsl,
  createGlobalDsl,
  insertSection,
  updateSectionSettings,
  insertBlock,
  updateBlockSettings,
  removeBlock,
  duplicateBlock,
  replaceBlockOrder,
  removeSection,
  duplicateSection,
  moveSection,
  replaceSection,
  composePreviewDsl,
  serializeDsl,
  deserializeDsl,
  ensureGlobalDslDefaults,
  splitGlobalDsl,
  createHeaderDsl,
  createFooterDsl
}
