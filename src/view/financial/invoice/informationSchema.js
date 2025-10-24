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
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.editRowHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      }
    ],
    columns: [
      {
        name: '开票方名称',
        key: 'seller_company_name',
        width: '140'
      },
      {
        name: '开票方税号',
        key: 'seller_tax_no',
        width: '140'
      },
      {
        name: '开票方电话',
        key: 'seller_phone',
        width: '140'
      },
      // {
      //   name: '开票渠道',
      //   key: 'invoice_apply_bn',
      //   width: '120'
      // },
      {
        name: '开票人',
        key: 'seller_name',
        width: '100'
      },
      {
        name: '收款人',
        key: 'payee',
        width: '100'
      },
      {
        name: '复核人',
        key: 'reviewer',
        width: '100'
      },
      {
        name: '开票方地址',
        key: 'seller_address',
        width: '140'
      },
      {
        name: '添加时间',
        key: 'created',
        render(h, { row }) {
          return <span> {moment(row.created_at * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      // {
      //   label: '开票方类型',
      //   key: 'alipay_fee_type',
      //   type: 'radio',
      //   options: [{ name: '平台', label: 'online' }]
      // },
      {
        label: '开票人',
        key: 'seller_name',
        type: 'input'
      },
      {
        label: '收款人',
        key: 'payee',
        type: 'input'
      },
      {
        label: '复核人',
        key: 'reviewer',
        type: 'input'
      },
      {
        label: '开票方名称',
        key: 'seller_company_name',
        type: 'input',
        required: true
      },
      {
        label: '开票方税号',
        key: 'seller_tax_no',
        type: 'input',
        required: true
      },
      {
        label: '开票方银行',
        key: 'seller_bank_name',
        type: 'input',
        required: true
      },
      {
        label: '开票方银行账号',
        key: 'seller_bank_account',
        type: 'input',
        required: true
      },
      {
        label: '开票方联系电话',
        key: 'seller_phone',
        type: 'input',
        required: true
      },
      {
        label: '开票方联系地址',
        key: 'seller_address',
        type: 'input',
        required: true,
        maxlength: '255',
        tip: '联系地址文字长度，请不要超过255个字'
      }
    ],
    vm
  )
