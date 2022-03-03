import exportTipCpn from '@/components/export_tips'
import HoverDelete from '@/components/hover_delete'

const exportTip = {
  install: function (Vue) {
    Vue.component('exportTip', exportTipCpn)
    Vue.component('HoverDelete', HoverDelete)
  }
}

export default exportTip
