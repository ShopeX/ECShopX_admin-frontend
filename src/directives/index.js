import Vue from 'vue'
export default () => {
  Vue.directive('scroll', {
    bind (el, binding) {
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
