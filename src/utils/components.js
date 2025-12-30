/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import exportTipCpn from '@/components/export_tips'
import HoverDelete from '@/components/hover_delete'

const exportTip = {
  install: function (Vue) {
    Vue.component('ExportTip', exportTipCpn)
    Vue.component('HoverDelete', HoverDelete)
  }
}

export default exportTip
