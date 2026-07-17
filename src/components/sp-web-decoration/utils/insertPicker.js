import {
  getSectionBlockTypes,
  getTypedBlockDefinition as getBlockDefinition,
  getTypedSectionDefinition as getSectionDefinition
} from '../definitions/registry.js'
import { resolveDecorationI18nValue } from './i18n.js'

function normalizePickerItem(item) {
  return {
    ...item,
    label: resolveDecorationI18nValue(item.label || item.title || item.type)
  }
}

export function createSectionPickerItems(sectionDefinitions) {
  return (sectionDefinitions || []).map((definition) =>
    normalizePickerItem({
      key: definition.type,
      type: definition.type,
      label: definition.name
    })
  )
}

/** 按固定 type 列表生成「添加分区」项（含全局分区如 announcement-bar） */
export function createSectionPickerItemsForTypes(types) {
  return (types || [])
    .map((type) => {
      const definition = getSectionDefinition(type)
      if (!definition) return null
      return normalizePickerItem({
        key: definition.type,
        type: definition.type,
        label: definition.name
      })
    })
    .filter(Boolean)
}

export function createBlockPickerItems(sectionType) {
  return getSectionBlockTypes(sectionType).map((blockType) => {
    const definition = getBlockDefinition(blockType)
    return normalizePickerItem({
      key: blockType,
      type: blockType,
      label: definition?.name
    })
  })
}

export default {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
}
