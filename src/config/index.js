/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
