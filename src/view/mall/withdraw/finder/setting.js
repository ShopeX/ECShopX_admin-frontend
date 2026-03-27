/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import { Message, MessageBox } from 'element-ui'
export default (vm) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }
  const formatStatus = (val) => {
    if (val == 'pending') {
      return vm.$t('6d0e9bce.2e89ce')
    } else if (val == 'succeeded') {
      return vm.$t('6d0e9bce.dca060')
    } else if (val == 'failed') {
      return vm.$t('6d0e9bce.f285c5')
    }
  }
  const formatMoney = (money) => {
    return (money / 100).toFixed(2).toLocaleString()
  }
  return createSetting({
    columns: [
      { name: vm.$t('6d0e9bce.9c40d4'), key: 'create_time', width: 200, formatter: formatDate },
      { name: vm.$t('6d0e9bce.24f1fc'), key: 'user_name', width: 150 },
      { name: vm.$t('6d0e9bce.2c47bd'), key: 'bank_card', width: 150 },
      { name: vm.$t('6d0e9bce.79b414'), key: 'cash_type', width: 150 },
      { name: vm.$t('6d0e9bce.0ed783'), key: 'status', width: 150, formatter: formatStatus },
      { name: vm.$t('6d0e9bce.292a28'), key: 'cash_amt', width: 150, formatter: formatMoney },
      { name: vm.$t('6d0e9bce.2432b5'), key: 'remark' }
    ]
  })
}
