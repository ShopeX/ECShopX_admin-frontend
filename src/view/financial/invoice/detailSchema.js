/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import {
  open_status_map,
  open_status_step_map,
  invoice_source_map,
  invoice_type_code_map
} from './constants'
import moment from 'moment'
export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: vm.$t('75e1c1f2.6ea1fe')
      },
      {
        key: 'create_time',
        label: vm.$t('75e1c1f2.2e3999'),
        display: 'inline',
        component(_, value) {
          return <span> {moment(value.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        key: 'invoice_status',
        label: vm.$t('75e1c1f2.2af9f7'),
        display: 'inline',
        component(_, value) {
          const key = open_status_map[value.invoice_status]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        key: 'invoice_method',
        label: vm.$t('75e1c1f2.352b0b'),
        display: 'inline',
        component(_, value) {
          const key = open_status_step_map[value.invoice_method]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        key: 'invoice_source',
        label: vm.$t('75e1c1f2.26ca20'),
        display: 'inline',
        component(_, value) {
          const key = invoice_source_map[value.invoice_source]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        key: 'update_time',
        label: vm.$t('75e1c1f2.a001a2'),
        display: 'inline',
        component(_, value) {
          return <span> {moment(value.update_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        key: 'user_card_code',
        label: vm.$t('75e1c1f2.6061ba'),
        type: 'text',
        display: 'inline'
      },
      {
        key: 'user_mobile',
        label: vm.$t('75e1c1f2.d8b944'),
        type: 'text',
        display: 'inline'
      },
      {
        key: 'order_id',
        label: vm.$t('75e1c1f2.3e8657'),
        type: 'text',
        display: 'inline'
      },
      {
        key: 'invoice_amount',
        label: vm.$t('75e1c1f2.b432e1'),
        type: 'text',
        display: 'inline',
        component(_, value) {
          return <span> {value.invoice_amount / 100} </span>
        }
      },
      {
        key: 'remark',
        label: vm.$t('2eced1b3.2432b5'),
        type: 'text',
        display: 'inline'
      },
      {
        type: 'group',
        label: vm.$t('75e1c1f2.131871')
      },
      {
        key: 'invoice_type',
        label: vm.$t('75e1c1f2.01b477'),
        type: 'text',
        component(_, value) {
          const typeMap = {
            enterprise: vm.$t('75e1c1f2.04c9e3'),
            individual: vm.$t('75e1c1f2.6a0e04')
          }
          return <span> {typeMap[value.invoice_type]} </span>
        }
      },
      {
        key: 'company_title',
        label: vm.$t('75e1c1f2.6cbd05'),
        type: 'text',
        display: 'inline'
      },
      {
        key: 'invoice_type_code',
        label: vm.$t('75e1c1f2.c532fc'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        },
        component(_, value) {
          const key = invoice_type_code_map[value.invoice_type_code]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        key: 'mobile',
        label: vm.$t('75e1c1f2.0352b7'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'individual'
        }
      },
      {
        key: 'email',
        label: vm.$t('75e1c1f2.2c972c'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'individual'
        }
      },
      {
        key: 'company_tax_number',
        label: vm.$t('75e1c1f2.a22d0a'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_address',
        label: vm.$t('75e1c1f2.e06494'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_telephone',
        label: vm.$t('75e1c1f2.9e1660'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_name',
        label: vm.$t('75e1c1f2.cc5ca0'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_account',
        label: vm.$t('75e1c1f2.c85e1d'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'mobile',
        label: vm.$t('75e1c1f2.0352b7'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        key: 'email',
        label: vm.$t('75e1c1f2.2c972c'),
        type: 'text',
        isShow() {
          return vm.form.invoice_type === 'enterprise'
        }
      },
      {
        type: 'group',
        label: vm.$t('75e1c1f2.009228')
      },
      {
        key: 'invoice_items',
        component(_, value) {
          return (
            <SpFinder
              ref='finder'
              setting={infoTable(vm)}
              data={value.invoice_items}
              no-selection
              show-pager={false}
            />
          )
        }
      },
      {
        type: 'group',
        label: vm.$t('75e1c1f2.7e7830')
      },
      {
        key: 'invoices',
        component() {
          return (
            <SpFinder
              ref='finder'
              fixed-row-action
              setting={afterTable(vm)}
              data={vm.form.invoices}
              no-selection
              show-pager={false}
            >
              <div slot='tableTop'>
                <div class='action-container'>
                  <div style='height: 20px' />
                  <el-button type='primary' plain onClick={() => vm.showPdHandle()}>
                    {vm.$t('75e1c1f2.e58576')}
                  </el-button>
                  {((vm.form.invoice_status == 'success' && vm.form.invoice_method == 'online') ||
                    (vm.form.invoice_status == 'failed' && vm.form.invoice_method != 'online')) && (
                    <el-button type='primary' plain onClick={() => vm.sendEmailHandle()}>
                      {vm.$t('75e1c1f2.40928e')}
                    </el-button>
                  )}
                </div>
              </div>
            </SpFinder>
          )
        }
      }
    ],
    vm
  )

const afterTable = (vm) => ({
  columns: [
    { name: vm.$t('75e1c1f2.4ae540'), key: 'invoice_no', width: 180 },
    { name: vm.$t('75e1c1f2.e0be40'), key: 'invoice_code', width: 100 },
    {
      name: vm.$t('75e1c1f2.c532fc'),
      key: 'invoice_type',
      width: 100,
      render(_, { row }) {
        const colorMap = { blue: vm.$t('75e1c1f2.20166c'), red: vm.$t('75e1c1f2.858904') }
        return <span> {colorMap[row['invoice_type']]} </span>
      }
    },
    {
      name: vm.$t('75e1c1f2.420d8d'),
      key: 'create_time',
      width: 190,
      render(_, { row }) {
        return <span> {moment(row['create_time'] * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
      }
    }
  ]
})

const infoTable = (vm) => ({
  columns: [
    { key: 'item_bn', name: vm.$t('75e1c1f2.58cac1'), width: 180 },
    { key: 'item_name', name: vm.$t('75e1c1f2.1fd1d5'), width: 180 },
    { key: 'spec_info', name: vm.$t('75e1c1f2.ea887b'), width: 80 },
    { key: 'num', name: vm.$t('75e1c1f2.0bf60b'), width: 80 },
    {
      key: 'amount',
      name: vm.$t('75e1c1f2.b432e1'),
      width: 120,
      render(_, { row }) {
        return <span> {row.amount / 100} </span>
      }
    },
    {
      key: 'invoice_tax_rate',
      name: vm.$t('75e1c1f2.2a79a7'),
      width: 100,
      render(_, { row }) {
        return <span> {row.invoice_tax_rate}% </span>
      }
    },
    { key: 'item_spec_desc', name: vm.$t('75e1c1f2.ea887b'), width: 180 },
    { key: 'order_id', name: vm.$t('75e1c1f2.3e8657'), width: 220 }
  ]
})
