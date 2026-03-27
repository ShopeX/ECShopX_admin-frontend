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
    if (val === '0') return vm.$t('7526bc04.b720a6')
    if (val === '1') return vm.$t('7526bc04.871a30')
    if (val === '2') return vm.$t('7526bc04.81233d')
    if (val === '3') return vm.$t('7526bc04.5d459d')
    if (val === '4') return vm.$t('7526bc04.3ba621')
    if (val === '5') return vm.$t('7526bc04.1012e0')
    return val
  }
  const formatMoney = (money) => {
    return (money / 100).toFixed(2).toLocaleString()
  }

  // 判断是否为商户
  const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
  const isMerchant = basePath === 'merchant'

  const getColumns = () => {
    if (isMerchant) {
      return [
        { name: vm.$t('7526bc04.5ba072'), key: 'created', width: 200, formatter: formatDate },
        { name: vm.$t('7526bc04.9c19fb'), key: 'merchant_name', width: 120 },
        { name: vm.$t('7526bc04.d69f24'), key: 'merchant_id', width: 100 },
        { name: vm.$t('7526bc04.d47045'), key: 'operator', width: 120 },
        { name: vm.$t('7526bc04.79b414'), key: 'withdraw_type', width: 100 },
        { name: vm.$t('7526bc04.292a28'), key: 'amount', width: 120, formatter: formatMoney },
        {
          name: vm.$t('7526bc04.121a39'),
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
        { name: vm.$t('7526bc04.d22bdd'), key: 'audit_time', width: 200, formatter: formatDate },
        { name: vm.$t('7526bc04.0f92aa'), key: 'audit_remark', width: 150 },
        { name: vm.$t('7526bc04.0ed783'), key: 'status', width: 100, formatter: formatStatus },
        { name: vm.$t('7526bc04.13d5f2'), key: 'failure_reason', width: 150 }
      ]
    } else {
      return [
        { name: vm.$t('7526bc04.5ba072'), key: 'created', width: 200, formatter: formatDate },
        { name: vm.$t('7526bc04.d47045'), key: 'operator', width: 120 },
        { name: vm.$t('7526bc04.bef889'), key: 'distributor_name', width: 120 },
        { name: vm.$t('7526bc04.79b414'), key: 'withdraw_type', width: 100 },
        { name: vm.$t('7526bc04.292a28'), key: 'amount', width: 120, formatter: formatMoney },
        {
          name: vm.$t('7526bc04.121a39'),
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
        { name: vm.$t('7526bc04.d22bdd'), key: 'audit_time', width: 200, formatter: formatDate },
        { name: vm.$t('7526bc04.200d69'), key: 'audit_remark', width: 150 },
        { name: vm.$t('7526bc04.39982f'), key: 'auditor', width: 120 },
        { name: vm.$t('7526bc04.0ed783'), key: 'status', width: 100, formatter: formatStatus },
        { name: vm.$t('7526bc04.470717'), key: 'failure_reason', width: 150 }
      ]
    }
  }

  return createSetting({
    columns: getColumns()
  })
}
