/**
 * 公共转换工具函数
 * 用于处理挂件配置的 transformIn 和 transformOut 中的公共逻辑
 */
import { pickBy } from '@/utils'

/**
 * 将 rpx 转换为 px（除以2）
 * @param {Object} marginObj - 包含 paddedt, paddedb, paddedl, paddedr 的对象
 * @returns {Object} 转换后的对象，保留其他字段
 */
export function convertRpxToPx(marginObj) {
  if (!marginObj) return marginObj

  return {
    ...marginObj,
    paddedt: (marginObj.paddedt || 0) / 2,
    paddedb: (marginObj.paddedb || 0) / 2,
    paddedl: (marginObj.paddedl || 0) / 2,
    paddedr: (marginObj.paddedr || 0) / 2
  }
}

/**
 * 将 px 转换为 rpx（乘以2）
 * @param {Object} marginObj - 包含 paddedt, paddedb, paddedl, paddedr 的对象
 * @returns {Object} 转换后的对象，保留其他字段（如 bgType, bgColor, bgPic 等）
 */
export function convertPxToRpx(marginObj) {
  if (!marginObj) return marginObj

  const { paddedt, paddedb, paddedl, paddedr, ...otherFields } = marginObj
  return {
    ...otherFields,
    paddedt: (paddedt || 0) * 2,
    paddedb: (paddedb || 0) * 2,
    paddedl: (paddedl || 0) * 2,
    paddedr: (paddedr || 0) * 2
  }
}

/**
 * 处理 transformIn 中的 base 数据转换
 * 将 outerMargin 和 innerPadding 从 rpx 转换为 px
 * @param {Object} base - base 对象
 * @param {Array} styleKeys - 需要转换的样式键数组，如 ['outerMargin', 'innerPadding']
 * @returns {Object} 转换后的 base 对象
 */
export function transformInBase(base, styleKeys = ['outerMargin', 'innerPadding']) {
  if (!base) return base

  const result = { ...base }

  styleKeys.forEach((key) => {
    if (base[key]) {
      result[key] = convertRpxToPx(base[key])
    }
  })

  return result
}

/**
 * 处理 transformOut 中的 base 数据转换
 * 将 outerMargin 和 innerPadding 从 px 转换为 rpx，并提取指定的字段
 * @param {Object} value - 挂件的 value 对象
 * @param {Array} baseKeys - base 中需要提取的键数组，如 ['outerMargin', 'innerPadding', 'outerBackground', 'innerBackground']
 * @param {Array} styleKeys - 需要转换的样式键数组，如 ['outerMargin', 'innerPadding']
 * @returns {Object} 转换后的 base 数据
 */
export function transformOutBase(
  value,
  baseKeys = ['outerMargin', 'innerPadding'],
  styleKeys = ['outerMargin', 'innerPadding']
) {
  const baseData = pickBy(
    value,
    baseKeys.reduce((acc, key) => {
      acc[key] = key
      return acc
    }, {})
  )

  // 转换样式键（rpx 转换）
  styleKeys.forEach((key) => {
    if (baseData[key]) {
      baseData[key] = convertPxToRpx(baseData[key])
    }
  })

  return baseData
}

/**
 * 创建标准的 transformIn 函数
 * @param {Function} customTransformIn - 自定义的 transformIn 函数
 * @param {Array} styleKeys - 需要转换的样式键数组
 * @returns {Function} 包装后的 transformIn 函数
 */
export function createTransformIn(customTransformIn, styleKeys = ['outerMargin', 'innerPadding']) {
  return (v, ...args) => {
    const { base, ...rest } = v
    const transformedBase = transformInBase(base, styleKeys)

    if (customTransformIn) {
      return customTransformIn({ ...rest, base: transformedBase }, ...args)
    }

    return {
      ...rest,
      ...transformedBase
    }
  }
}

/**
 * 创建标准的 transformOut base 处理函数
 * @param {Array} baseKeys - base 中需要提取的键数组
 * @param {Array} styleKeys - 需要转换的样式键数组
 * @returns {Function} base 处理函数
 */
export function createTransformOutBase(
  baseKeys = ['outerMargin', 'innerPadding'],
  styleKeys = ['outerMargin', 'innerPadding']
) {
  return (v) => {
    return transformOutBase(v, baseKeys, styleKeys)
  }
}
