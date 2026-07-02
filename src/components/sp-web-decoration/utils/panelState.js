import {
  getTypedBlockDefinition,
  getBlockDefaultSettings,
  getBlockSchemaFields,
  getSectionDefaultSettings,
  getSectionSchemaFields
} from '../definitions/registry.js'
import { normalizeBySchema } from './schemaNormalize.js'

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeWithDefaults(defaults = {}, settings = {}) {
  return {
    ...cloneValue(defaults),
    ...cloneValue(settings)
  }
}

function clampCoordinate(value) {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return 0
  if (numericValue < 0) return 0
  if (numericValue > 100) return 100
  return numericValue
}

function normalizeProductShelfCompatibleSettings(settings) {
  const nextSettings = { ...settings }

  nextSettings.itemIds = Array.isArray(nextSettings.itemIds)
    ? nextSettings.itemIds.filter(Boolean).slice(0, nextSettings.limit || 8)
    : []

  return nextSettings
}

export function normalizeProductTabShelfSettings(settings = {}) {
  return mergeWithDefaults(getSectionDefaultSettings('product-tab-shelf'), settings)
}

export function normalizeProductTabBlockSettings(settings = {}) {
  const nextSettings = mergeWithDefaults(getBlockDefaultSettings('product-tab'), settings)
  nextSettings.product_ids = Array.isArray(nextSettings.product_ids)
    ? nextSettings.product_ids.filter(Boolean)
    : []
  nextSettings.product_snapshots = Array.isArray(nextSettings.product_snapshots)
    ? nextSettings.product_snapshots.filter((product) =>
        nextSettings.product_ids.includes(product?.item_id)
      )
    : []
  nextSettings.limit = Number.isFinite(Number(nextSettings.limit))
    ? Math.min(24, Math.max(2, Number(nextSettings.limit)))
    : 8
  delete nextSettings.size
  delete nextSettings.size_override
  if (nextSettings.columns !== undefined) {
    nextSettings.columns = [2, 3, 4].includes(Number(nextSettings.columns))
      ? Number(nextSettings.columns)
      : undefined
  }

  return nextSettings
}

function normalizeHotspotCompatibleSettings(settings) {
  const nextSettings = { ...settings }

  nextSettings.x = clampCoordinate(nextSettings.x)
  nextSettings.y = clampCoordinate(nextSettings.y)
  nextSettings.shape = nextSettings.shape === 'rect' ? 'rect' : 'circle'

  return nextSettings
}

function normalizeSectionSettings(type, settings = {}) {
  const fields = getSectionSchemaFields(type)
  const nextSettings = fields
    ? normalizeBySchema(fields, settings)
    : mergeWithDefaults(getSectionDefaultSettings(type), settings)

  if (type === 'product-shelf') return normalizeProductShelfCompatibleSettings(nextSettings)
  if (type === 'product-tab-shelf') return normalizeProductTabShelfSettings(nextSettings)
  return nextSettings
}

function normalizeBlockSettingsValue(type, settings = {}) {
  const fields = getBlockSchemaFields(type)
  const nextSettings = fields
    ? normalizeBySchema(fields, settings)
    : mergeWithDefaults(getBlockDefaultSettings(type), settings)

  if (type === 'hotspot') return normalizeHotspotCompatibleSettings(nextSettings)
  if (type === 'product-tab') return normalizeProductTabBlockSettings(nextSettings)
  if (type === 'footer-menu' || type === 'footer-image' || type === 'footer-text') {
    const span = Number(nextSettings.column_span)
    nextSettings.column_span = Number.isFinite(span)
      ? Math.min(12, Math.max(1, Math.round(span)))
      : 12
  }
  return nextSettings
}

export function normalizeTypedSectionSettings(type, settings = {}) {
  return normalizeSectionSettings(type, settings)
}

export function normalizeTypedBlockSettings(type, settings = {}) {
  return normalizeBlockSettingsValue(type, settings)
}

function normalizeBlockSettings(block) {
  if (!block) return block

  return {
    ...block,
    settings: normalizeBlockSettingsValue(block.type, block.settings)
  }
}

export function normalizeSection(section) {
  if (!section) return section

  const nextSection = cloneValue(section)
  nextSection.blockOrder = Array.isArray(nextSection.blockOrder)
    ? nextSection.blockOrder.slice()
    : Array.isArray(nextSection.block_order)
    ? nextSection.block_order.slice()
    : []
  nextSection.blocks = nextSection.blocks || {}
  nextSection.settings = normalizeSectionSettings(nextSection.type, nextSection.settings)

  Object.keys(nextSection.blocks).forEach((blockId) => {
    nextSection.blocks[blockId] = normalizeBlockSettings(nextSection.blocks[blockId])
  })

  return nextSection
}

export function updateSectionBlock(section, blockId, patch) {
  const nextSection = normalizeSection(section)
  if (!nextSection?.blocks?.[blockId]) return nextSection

  nextSection.blocks[blockId] = normalizeBlockSettings({
    ...nextSection.blocks[blockId],
    settings: {
      ...nextSection.blocks[blockId].settings,
      ...cloneValue(patch)
    }
  })

  return nextSection
}

export function addSectionBlock(section, createBlock, settings = {}) {
  const nextSection = normalizeSection(section)
  const block = createBlock()
  block.settings = {
    ...block.settings,
    ...cloneValue(settings)
  }

  nextSection.blocks[block.id] = normalizeBlockSettings(block)
  nextSection.blockOrder = [...nextSection.blockOrder, block.id]

  return {
    section: nextSection,
    blockId: block.id
  }
}

export function removeSectionBlock(section, blockId) {
  const nextSection = normalizeSection(section)
  if (!nextSection?.blocks?.[blockId]) return nextSection

  delete nextSection.blocks[blockId]
  nextSection.blockOrder = nextSection.blockOrder.filter((id) => id !== blockId)

  return nextSection
}

export function moveSectionBlock(section, blockId, targetIndex) {
  const nextSection = normalizeSection(section)
  const currentIndex = nextSection.blockOrder.findIndex((id) => id === blockId)
  if (currentIndex === -1) return nextSection

  const normalizedIndex = Math.max(0, Math.min(targetIndex, nextSection.blockOrder.length - 1))
  if (currentIndex === normalizedIndex) return nextSection

  nextSection.blockOrder.splice(currentIndex, 1)
  nextSection.blockOrder.splice(normalizedIndex, 0, blockId)

  return nextSection
}

export function sanitizeProductItemIds(itemIds, limit) {
  const max = Number(limit) > 0 ? Number(limit) : Infinity
  const uniqueIds = []

  ;(Array.isArray(itemIds) ? itemIds : []).forEach((itemId) => {
    if (!itemId || uniqueIds.includes(itemId)) return
    if (uniqueIds.length >= max) return
    uniqueIds.push(itemId)
  })

  return uniqueIds
}

export function createDefaultBlock(type, id) {
  const definition = getTypedBlockDefinition(type)
  return {
    id,
    type,
    disabled: false,
    settings: cloneValue(getBlockDefaultSettings(type) || {})
  }
}

export default {
  normalizeTypedSectionSettings,
  normalizeTypedBlockSettings,
  normalizeProductTabShelfSettings,
  normalizeProductTabBlockSettings,
  normalizeSection,
  updateSectionBlock,
  addSectionBlock,
  removeSectionBlock,
  moveSectionBlock,
  sanitizeProductItemIds,
  createDefaultBlock
}
