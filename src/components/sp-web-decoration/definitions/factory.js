import { generateSectionId, generateBlockId } from '../utils/nanoid.js'
import { resolveDecorationI18nValue } from '../utils/i18n.js'
import {
  getTypedSectionDefinition,
  getTypedBlockDefinition,
  getAllowedBlockTypes,
  getSectionDefaultSettings,
  getBlockDefaultSettings
} from './registry.js'

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

export function createTypedBlock(sectionType, blockType, options = {}) {
  const allowed = getAllowedBlockTypes(sectionType)
  if (!allowed.includes(blockType)) {
    throw new Error(`Block type ${blockType} is not allowed in section ${sectionType}`)
  }

  const definition = getTypedBlockDefinition(blockType)
  if (!definition) {
    throw new Error(`Unknown decoration block type: ${blockType}`)
  }

  const id = options.id || generateBlockId(blockType)
  const defaultSettings = resolveDecorationI18nValue(
    cloneValue(getBlockDefaultSettings(blockType) || {})
  )
  const optionSettings = resolveDecorationI18nValue(cloneValue(options.settings || {}))
  return {
    id,
    type: blockType,
    disabled: Boolean(options.disabled),
    title: resolveDecorationI18nValue(definition.name || ''),
    settings: {
      ...defaultSettings,
      ...optionSettings
    }
  }
}

export function createTypedSection(type, options = {}) {
  const definition = getTypedSectionDefinition(type)
  if (!definition) {
    throw new Error(`Unknown decoration section type: ${type}`)
  }

  const sectionId = options.fixedId || definition.fixedId || options.id || generateSectionId(type)
  const defaults = Array.isArray(options.blocks)
    ? options.blocks
    : Array.isArray(definition.defaultBlocks)
    ? definition.defaultBlocks
    : []
  const blocks = {}
  const blockOrder = []

  defaults.forEach((item) => {
    if (!item?.type) return
    const block = createTypedBlock(type, item.type, {
      id: item.id,
      settings: item.settings,
      disabled: item.disabled
    })
    blocks[block.id] = block
    blockOrder.push(block.id)
  })

  const defaultSettings = resolveDecorationI18nValue(
    cloneValue(getSectionDefaultSettings(type) || {})
  )
  const optionSettings = resolveDecorationI18nValue(cloneValue(options.settings || {}))

  return {
    id: sectionId,
    type: definition.type,
    title: resolveDecorationI18nValue(definition.name || ''),
    disabled: Boolean(options.disabled),
    settings: {
      ...defaultSettings,
      ...optionSettings
    },
    blocks,
    blockOrder
  }
}

export default {
  createTypedSection,
  createTypedBlock
}
