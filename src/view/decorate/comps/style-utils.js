/**
 * 样式计算工具函数
 * 用于统一处理组件的外边距、内边距和背景样式
 */

/**
 * 计算外层样式（outerStyle）
 * 支持两种数据格式：
 * 1. 使用 outerMargin + outerBackground（shop, classify, store-alphabet）
 * 2. 使用 outerMargin 中直接存储背景数据（speedkill, group, ranking, hotranking, goods）
 */
export function getOuterStyle(value) {
  const { outerMargin = {}, outerBackground } = value || {}

  // 如果存在 outerBackground，使用新的格式
  if (outerBackground) {
    return {
      paddingTop: (outerMargin.paddedt || 0) + 'px',
      paddingBottom: (outerMargin.paddedb || 0) + 'px',
      paddingLeft: (outerMargin.paddedl || 0) + 'px',
      paddingRight: (outerMargin.paddedr || 0) + 'px',
      backgroundColor: outerBackground.color || undefined,
      backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : undefined,
      backgroundSize: outerBackground.image ? 'cover' : undefined,
      backgroundPosition: outerBackground.image ? 'center' : undefined,
      backgroundRepeat: outerBackground.image ? 'no-repeat' : undefined
    }
  }

  // 否则使用 CompStyle 格式（背景数据存储在 outerMargin 中）
  const bgType = outerMargin.bgType
  let bgColor = ''
  let bgImage = 'none'

  // 渐变背景
  if (bgType === 'gradient') {
    bgImage = `linear-gradient(to bottom, ${outerMargin.startColor}, ${outerMargin.endColor})`
  }
  // 图片背景
  else if (bgType === 'pic') {
    bgImage = outerMargin.bgPic ? `url(${outerMargin.bgPic})` : 'none'
    bgColor = ''
  }
  // 单色背景
  else if (bgType === 'color' || !bgType) {
    bgColor = outerMargin.bgColor || ''
  }

  return {
    paddingTop: (outerMargin.paddedt || 0) + 'px',
    paddingBottom: (outerMargin.paddedb || 0) + 'px',
    paddingLeft: (outerMargin.paddedl || 0) + 'px',
    paddingRight: (outerMargin.paddedr || 0) + 'px',
    backgroundColor: bgColor || undefined,
    backgroundImage: bgImage !== 'none' ? bgImage : undefined,
    backgroundSize: bgImage !== 'none' ? 'cover' : undefined,
    backgroundPosition: bgImage !== 'none' ? 'center' : undefined,
    backgroundRepeat: bgImage !== 'none' ? 'no-repeat' : undefined
  }
}

/**
 * 计算内层样式（innerStyle）
 * 支持两种数据格式：
 * 1. 使用 innerPadding + innerBackground（shop, classify, store-alphabet）
 * 2. 使用 innerPadding 中直接存储背景数据（speedkill, group, ranking, hotranking, goods）
 */
export function getInnerStyle(value) {
  const { innerPadding = {}, innerBackground } = value || {}

  // 如果存在 innerBackground，使用新的格式
  if (innerBackground) {
    return {
      paddingLeft: (innerPadding.paddedl || 0) + 'px',
      paddingRight: (innerPadding.paddedr || 0) + 'px',
      paddingTop: (innerPadding.paddedt || 0) + 'px',
      paddingBottom: (innerPadding.paddedb || 0) + 'px',
      backgroundColor: innerBackground?.type === 'solid' ? innerBackground.color : undefined,
      backgroundImage:
        innerBackground?.type === 'gradient'
          ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})`
          : undefined
    }
  }

  // 否则使用 CompStyle 格式（背景数据存储在 innerPadding 中）
  const bgType = innerPadding.bgType
  let bgColor = ''
  let bgImage = 'none'

  // 渐变背景
  if (bgType === 'gradient') {
    bgImage = `linear-gradient(to bottom, ${innerPadding.startColor}, ${innerPadding.endColor})`
  }
  // 图片背景
  else if (bgType === 'pic') {
    bgImage = innerPadding.bgPic ? `url(${innerPadding.bgPic})` : 'none'
    bgColor = ''
  }
  // 单色背景
  else if (bgType === 'color' || !bgType) {
    bgColor = innerPadding.bgColor || ''
  }

  return {
    paddingLeft: (innerPadding.paddedl || 0) + 'px',
    paddingRight: (innerPadding.paddedr || 0) + 'px',
    paddingTop: (innerPadding.paddedt || 0) + 'px',
    paddingBottom: (innerPadding.paddedb || 0) + 'px',
    backgroundColor: bgColor || undefined,
    backgroundImage: bgImage !== 'none' ? bgImage : undefined,
    backgroundSize: bgImage !== 'none' ? 'cover' : undefined,
    backgroundPosition: bgImage !== 'none' ? 'center' : undefined,
    backgroundRepeat: bgImage !== 'none' ? 'no-repeat' : undefined
  }
}
