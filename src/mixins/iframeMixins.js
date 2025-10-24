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

export default {
  data() {
    return {
      iframeTimeOut: null
    }
  },
  methods: {
    createInterval(_this, func) {
      let IS_NOT_IFRAME = sessionStorage.getItem('IS_NOT_IFRAME')
      setTimeout(
        () => {
          func.bind(_this)()
        },
        IS_NOT_IFRAME ? 0 : 3000
      )
    }
  }
}
