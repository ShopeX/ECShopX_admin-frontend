import exportTipCpn from '@/components/export_tips'

const exportTip = {
  install: function (Vue) {
    Vue.component('exportTip', exportTipCpn)
  }
}

export default exportTip
