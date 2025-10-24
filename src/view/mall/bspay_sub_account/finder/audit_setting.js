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
    var date = new Date(timestamp * 1000)
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }

  const formatStatus = (val) => {
    const statusMap = {
      '0': '审核中',
      '1': '审核通过',
      '2': '已拒绝',
      '3': '处理中',
      '4': '处理成功',
      '5': '处理失败'
    }
    return statusMap[val] || val
  }

  const formatMoney = (money) => {
    if (!money) return '0.00'
    return (money / 100).toFixed(2).toLocaleString()
  }

  const formatWithdrawType = (type) => {
    const typeMap = {
      'D0': 'D0',
      'D1': 'D1',
      'T1': 'T1'
    }
    return typeMap[type] || type
  }

  return createSetting({
    columns: [
      { name: '申请时间', key: 'created', width: 200, formatter: formatDate },
      { name: '申请人账号', key: 'operator', width: 120 },
      { name: '申请店铺', key: 'distributor_name', width: 120 },
      { name: '店铺id', key: 'distributor_id', width: 100 },
      { name: '申请商户', key: 'merchant_name', width: 120 },
      { name: '商户id', key: 'merchant_id', width: 100 },
      { name: '提现类型', key: 'withdraw_type', width: 100, formatter: formatWithdrawType },
      { name: '提现金额', key: 'amount', width: 120, formatter: formatMoney },
      {
        name: '查看发票',
        key: 'invoice_file',
        width: 100,
        render: (h, { row }) => {
          if (!row.invoice_file) return h('span', '-')
          return h('el-image', {
            props: {
              src: row.invoice_file,
              'preview-src-list': [row.invoice_file],
              fit: 'cover'
            },
            style: {
              width: '50px',
              height: '50px'
            }
          })
        }
      },
      { name: '审批时间', key: 'audit_time', width: 200, formatter: formatDate },
      { name: '审核备注', key: 'audit_remark', width: 150 },
      { name: '审核人账号', key: 'auditor', width: 120 },
      { name: '提现状态', key: 'status', width: 100, formatter: formatStatus },
      { name: '提现进度', key: 'failure_reason', width: 150 },
      {
        name: '操作',
        key: 'action',
        width: 150,
        fixed: 'right',
        render: (h, { row }) => {
          // 只有在审核中状态时才显示审核按钮
          if (row.status === '0') {
            return h('div', [
              h(
                'el-button',
                {
                  props: {
                    type: 'primary',
                    size: 'mini'
                  },
                  on: {
                    click: () => vm.handleAudit(row, 'approve')
                  }
                },
                '通过'
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'danger',
                    size: 'mini'
                  },
                  style: {
                    marginLeft: '8px'
                  },
                  on: {
                    click: () => vm.handleAudit(row, 'reject')
                  }
                },
                '拒绝'
              )
            ])
          }
          return h('span', '-')
        }
      }
    ]
  })
}
