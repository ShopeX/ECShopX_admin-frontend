// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

// 身份验证
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
