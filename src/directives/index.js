/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const install = function (Vue) {
  Vue.directive('scroll', {
    bind(el, binding) {
      const SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      if (!SCROLL_DOM) return

      const scrollHandler = function () {
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= 1) {
          binding.value(true)
        }
      }

      el.__scrollHandler__ = scrollHandler
      el.__scrollDom__ = SCROLL_DOM
      SCROLL_DOM.addEventListener('scroll', scrollHandler)
    },
    unbind(el) {
      if (el.__scrollDom__ && el.__scrollHandler__) {
        el.__scrollDom__.removeEventListener('scroll', el.__scrollHandler__)
      }
      delete el.__scrollHandler__
      delete el.__scrollDom__
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
