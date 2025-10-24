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

import bbc from './products/bbc'
import yd from './products/yd'
import b2c from './products/b2c'
import ng from './products/ng'
import shuyun from './products/shuyun'

const PRODUCTS_CONFIG = {
  yd: yd,
  bbc: bbc,
  b2c: b2c,
  ng: ng,
  shuyun: shuyun
}

const DEFAULT_CONFIG = {
  recoder_number: '沪ICP备05002918号',
  ...PRODUCTS_CONFIG[process.env.VUE_APP_PLATFORM]
}

export default DEFAULT_CONFIG
