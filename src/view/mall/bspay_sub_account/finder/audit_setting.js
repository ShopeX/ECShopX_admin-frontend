/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
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
      '0': vm.$t('f92af54b.b720a6'),
      '1': vm.$t('f92af54b.871a30'),
      '2': vm.$t('f92af54b.81233d'),
      '3': vm.$t('f92af54b.5d459d'),
      '4': vm.$t('f92af54b.3ba621'),
      '5': vm.$t('f92af54b.1012e0')
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
      { name: vm.$t('f92af54b.5ba072'), key: 'created', width: 200, formatter: formatDate },
      { name: vm.$t('f92af54b.d47045'), key: 'operator', width: 120 },
      { name: vm.$t('f92af54b.bef889'), key: 'distributor_name', width: 120 },
      { name: vm.$t('f92af54b.d1cabf'), key: 'distributor_id', width: 100 },
      { name: vm.$t('f92af54b.9c19fb'), key: 'merchant_name', width: 120 },
      { name: vm.$t('f92af54b.d69f24'), key: 'merchant_id', width: 100 },
      {
        name: vm.$t('f92af54b.79b414'),
        key: 'withdraw_type',
        width: 100,
        formatter: formatWithdrawType
      },
      { name: vm.$t('f92af54b.292a28'), key: 'amount', width: 120, formatter: formatMoney },
      {
        name: vm.$t('f92af54b.121a39'),
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
      { name: vm.$t('f92af54b.d22bdd'), key: 'audit_time', width: 200, formatter: formatDate },
      { name: vm.$t('f92af54b.200d69'), key: 'audit_remark', width: 150 },
      { name: vm.$t('f92af54b.39982f'), key: 'auditor', width: 120 },
      { name: vm.$t('f92af54b.0ed783'), key: 'status', width: 100, formatter: formatStatus },
      { name: vm.$t('f92af54b.470717'), key: 'failure_reason', width: 150 },
      {
        name: vm.$t('f92af54b.2b6bc0'),
        key: 'action',
        width: 150,
        fixed: 'right',
        render: (h, { row }) => {
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
                vm.$t('f92af54b.23c1f3')
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
                vm.$t('f92af54b.7173f8')
              )
            ])
          }
          return h('span', '-')
        }
      }
    ]
  })
}
