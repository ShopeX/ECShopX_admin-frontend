import { generateSectionId, generateBlockId } from '../utils/nanoid.js'
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
  return {
    id,
    type: blockType,
    disabled: Boolean(options.disabled),
    title: definition.name || '',
    settings: {
      ...cloneValue(getBlockDefaultSettings(blockType) || {}),
      ...cloneValue(options.settings || {})
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

  return {
    id: sectionId,
    type: definition.type,
    title: definition.name || '',
    disabled: Boolean(options.disabled),
    settings: {
      ...cloneValue(getSectionDefaultSettings(type) || {}),
      ...cloneValue(options.settings || {})
    },
    blocks,
    blockOrder
  }
}

export default {
  createTypedSection,
  createTypedBlock
}
