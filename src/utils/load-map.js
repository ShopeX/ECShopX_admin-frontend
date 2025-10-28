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

export const loadMap = () => {
  return new Promise((resolve, reject) => {
    window.init = () => {
      resolve()
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//map.qq.com/api/js?v=2.exp&key=${process.env.VUE_APP_MAP_KEY}&callback=init`
    document.body.appendChild(script)
  })
}

export default {}
