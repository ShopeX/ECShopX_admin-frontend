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

// 提取searchSchema中默认值
export function generatorParams(options, data) {
  const _params = {}
  options.forEach((_schema) => {
    if (_schema.key) {
      if (data) {
        _params[_schema.key] = data[_schema.key]
      } else {
        _params[_schema.key] = _schema.defaultValue
      }
    }
  })
  return _params
}

// 绑定表单schema的this指向
export function bindThisForFormSchema(formSchema, target) {
  formSchema?.forEach((item) => {
    if (item?.component && typeof item.component === 'function') {
      item.component = item.component.bind(target)
    }
    if (item?.validator && typeof item.validator === 'function') {
      item.validator = item.validator.bind(target)
    }
    if (item?.disabled && typeof item.disabled === 'function') {
      item.disabled = item.disabled.bind(target)
    }
    if (item?.isShow && typeof item.isShow === 'function') {
      item.isShow = item.isShow.bind(target)
    }
  })
  return formSchema
}
