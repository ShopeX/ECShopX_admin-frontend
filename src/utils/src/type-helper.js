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

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function isFunction(val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber(val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isObject(val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isArray(val) {
  return Array.isArray(val)
}

export function isBoolean(val) {
  return isPrimitiveType(val, '[object Boolean]')
}

export function isString(val) {
  return isPrimitiveType(val, '[object String]')
}
