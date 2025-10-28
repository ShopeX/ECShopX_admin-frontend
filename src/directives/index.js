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

const install = function (Vue) {
  Vue.directive('scroll', {
    bind(el, binding) {
      let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      SCROLL_DOM.addEventListener('scroll', function () {
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance === 0) {
          binding.value(true)
        }
      })
    }
  })

  Vue.directive('debounce', function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (!el.disabled) {
        el.disabled = true
        binding.value(binding.arg)
        timer = setTimeout(() => {
          el.disabled = false
        }, 2000)
      }
    })
  })
}

export { install }
