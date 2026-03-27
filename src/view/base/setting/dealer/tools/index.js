/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
/** i18n: pass (t, nameKey, trigger, 'select'|'input'). Legacy: (name, trigger). */
export const requiredRules = (tOrName, nameKeyOrTrigger, triggerOrBlank, type) => {
  if (typeof tOrName === 'function') {
    const t = tOrName
    const nameKey = nameKeyOrTrigger
    const trigger = triggerOrBlank || 'blur'
    const key = type === 'select' ? 'be04df32.380b9c' : 'be04df32.39c5e1'
    return { required: true, message: () => t(key, { name: t(nameKey) }), trigger }
  }
  const name = tOrName
  const trigger = nameKeyOrTrigger || 'blur'
  if (trigger === 'change') {
    return { required: true, message: `请选择${name}`, trigger }
  }
  return { required: true, message: `请输入${name}`, trigger }
}
/** i18n: pass (t, size). Legacy: (size). */
export const MaxRules = (tOrSize, size) => {
  if (typeof tOrSize === 'function' && size !== undefined) {
    const t = tOrSize
    return { max: size, message: () => t('be04df32.8bdf7c', { size }), trigger: 'blur' }
  }
  const maxSize = size !== undefined ? size : tOrSize
  return { max: maxSize, message: `长度最多在${maxSize}个字符`, trigger: 'blur' }
}

export const identityCardRules = () => {}
