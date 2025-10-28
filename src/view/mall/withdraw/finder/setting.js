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
      return '提现处理中'
    } else if (val == 'succeeded') {
      return '提现成功'
    } else if (val == 'failed') {
      return '提现失败'
    }
  }
  const formatMoney = (money) => {
    return (money / 100).toFixed(2).toLocaleString()
  }
  return createSetting({
    columns: [
      { name: '提现日期', key: 'create_time', width: 200, formatter: formatDate },
      { name: '提现账户', key: 'user_name', width: 150 },
      { name: '提现卡号', key: 'bank_card', width: 150 },
      { name: '提现类型', key: 'cash_type', width: 150 },
      { name: '提现状态', key: 'status', width: 150, formatter: formatStatus },
      { name: '提现金额', key: 'cash_amt', width: 150, formatter: formatMoney },
      { name: '备注', key: 'remark' }
    ]
  })
}
