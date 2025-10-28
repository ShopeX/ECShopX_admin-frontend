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

import { createSetting } from '@shopex/finder'

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
      return '已通过'
    } else if (v == '2') {
      return '未通过'
    } else if (v == '3') {
      return '关闭'
    } else {
      return '待审批'
    }
  }

  return createSetting({
    columns: [
      { name: '创建时间', key: 'create_time', width: 200, formatter: formatDate },
      { name: '申请开通时间', key: 'ex', width: 600 },
      { name: '申请理由', key: 'reason', width: 130 },
      { name: '审批状态', key: 'status', width: 100, formatter: formatterStatus },
      { name: '审批时间', key: 'approve_time', formatter: formatDate },
      { name: '审批备注', key: 'remarks', width: 300 }
    ]
  })
}
