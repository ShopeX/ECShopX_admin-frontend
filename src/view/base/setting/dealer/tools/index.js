/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const requiredRules = (name, trigger = 'blur') => {
  if (trigger == 'change') {
    return { required: true, message: `请选择${name}`, trigger }
  } else {
    return { required: true, message: `请输入${name}`, trigger }
  }
}
export const MaxRules = (size) => {
  return { max: size, message: `长度最多在${size}个字符`, trigger: 'blur' }
}

export const identityCardRules = () => {}
