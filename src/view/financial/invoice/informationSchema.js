/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: vm.$t('bf37b718.95b351'),
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
        name: vm.$t('bf37b718.29b041'),
        key: 'seller_company_name',
        width: '140'
      },
      {
        name: vm.$t('bf37b718.ca2be5'),
        key: 'seller_tax_no',
        width: '140'
      },
      {
        name: vm.$t('bf37b718.eff7dc'),
        key: 'seller_phone',
        width: '140'
      },
      // {
      //   name: '开票渠道',
      //   key: 'invoice_apply_bn',
      //   width: '120'
      // },
      {
        name: vm.$t('bf37b718.68346c'),
        key: 'seller_name',
        width: '100'
      },
      {
        name: vm.$t('bf37b718.ba2c38'),
        key: 'payee',
        width: '100'
      },
      {
        name: vm.$t('bf37b718.24045b'),
        key: 'reviewer',
        width: '100'
      },
      {
        name: vm.$t('bf37b718.210c86'),
        key: 'seller_address',
        width: '140'
      },
      {
        name: vm.$t('bf37b718.ffc7ed'),
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
        label: vm.$t('bf37b718.68346c'),
        key: 'seller_name',
        type: 'input'
      },
      {
        label: vm.$t('bf37b718.ba2c38'),
        key: 'payee',
        type: 'input'
      },
      {
        label: vm.$t('bf37b718.24045b'),
        key: 'reviewer',
        type: 'input'
      },
      {
        label: vm.$t('bf37b718.29b041'),
        key: 'seller_company_name',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('bf37b718.ca2be5'),
        key: 'seller_tax_no',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('bf37b718.b6c084'),
        key: 'seller_bank_name',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('bf37b718.0f7f38'),
        key: 'seller_bank_account',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('bf37b718.f42347'),
        key: 'seller_phone',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('bf37b718.f3d911'),
        key: 'seller_address',
        type: 'input',
        required: true,
        maxlength: '255',
        tip: vm.$t('bf37b718.2e9c59')
      }
    ],
    vm
  )
