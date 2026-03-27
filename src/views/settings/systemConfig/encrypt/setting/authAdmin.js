/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'

export default (vm) => {
  const formatDate = (timestamp) => {
    if (timestamp == '0') {
      return '-'
    }
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }
  const formatterStatus = (v) => {
    if (v == '1') {
      return vm.$t('35844927.ecfa64')
    } else if (v == '2') {
      return vm.$t('35844927.4fcdbf')
    } else if (v == '3') {
      return vm.$t('35844927.b15d91')
    } else {
      return vm.$t('35844927.b0bf01')
    }
  }

  return createSetting({
    columns: [
      { name: vm.$t('35844927.eca37c'), key: 'create_time', width: 200, formatter: formatDate },
      { name: vm.$t('35844927.a28861'), key: 'ex', width: 580 },
      { name: vm.$t('35844927.c5ae2e'), key: 'reason', width: 130 },
      { name: vm.$t('35844927.d352ae'), key: 'status', width: 100, formatter: formatterStatus },
      { name: vm.$t('35844927.d22bdd'), key: 'approve_time', formatter: formatDate },
      { name: vm.$t('35844927.4985b0'), key: 'remarks', width: 150 }
    ]
  })
}
