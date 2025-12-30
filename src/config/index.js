/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import bbc from './products/bbc'
import b2c from './products/b2c'

const PRODUCTS_CONFIG = {
  bbc: bbc,
  b2c: b2c
}

const DEFAULT_CONFIG = {
  recoder_number: '',
  ...PRODUCTS_CONFIG[process.env.VUE_APP_PLATFORM]
}

export default DEFAULT_CONFIG
