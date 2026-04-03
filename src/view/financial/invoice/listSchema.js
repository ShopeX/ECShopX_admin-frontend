/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import {
  open_status_map,
  open_status_arr,
  open_status_step_map,
  invoice_type_code_map,
  invoice_source_map,
  invoice_log_type_map
} from './constants'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: vm.$t('2eced1b3.f26225'),
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.$router.push({
                path: `${vm.$route.path}/detail`,
                query: {
                  id: row.id
                }
              })
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: vm.$t('2eced1b3.95b351'),
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
        },
        visible: (val) => {
          //线下并且不能是开票失败才战死后
          return val.invoice_method != 'online' && val.invoice_status != 'failed'
        }
      },
      {
        name: vm.$t('2eced1b3.40928e'),
        key: 'pushPack',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.pushEmailHandle(row)
            },
            1000,
            {
              leading: true
            }
          )
        },
        visible: (val) => {
          //开票成功的线上  开票失败的线下 展示
          return (
            (val.invoice_status == 'success' && val.invoice_method == 'online') ||
            (val.invoice_status == 'failed' && val.invoice_method != 'online')
          )
        }
      },
      {
        name: vm.$t('2eced1b3.2432b5'),
        key: 'remark',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.remarkHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: vm.$t('2eced1b3.456d29'),
        key: 'linkPath',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.showLogHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: vm.$t('2eced1b3.556256'),
        key: 'reInvoice',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.reInvoiceHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible: (val) => {
          return val.invoice_status == 'failed'
        }
      }
    ],
    columns: [
      {
        name: vm.$t('2eced1b3.90e5bc'),
        key: 'invoice_apply_bn',
        width: '200'
      },
      {
        name: vm.$t('2eced1b3.1e8dc2'),
        key: 'order_id',
        width: '180',
        render(_, { row }) {
          return (
            <div>
              <div class='order-num'>
                {row.order_id}
                <el-tooltip effect='dark' content={vm.$t('2eced1b3.79d3ab')} placement='top-start'>
                  <i
                    class='el-icon-document-copy'
                    style={{ marginLeft: '6px' }}
                    onClick={() => {
                      vm.$copyText(row.order_id).then((res) => {
                        vm.onCopySuccess()
                      })
                    }}
                  />
                </el-tooltip>
              </div>
              <div class='order-store'>
                <el-tooltip effect='dark' content={vm.$t('2eced1b3.8a0cc2')} placement='top-start'>
                  <i class='el-icon-office-building' />
                </el-tooltip>
                {row.distributor_name}
              </div>
              <div class='order-time'>
                <el-tooltip effect='dark' content={vm.$t('2eced1b3.2240cc')} placement='top-start'>
                  <i class='el-icon-time' style={{ marginRight: '6px' }} />
                </el-tooltip>
                {moment(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          )
        }
      },
      {
        name: vm.$t('2eced1b3.350fd3'),
        key: 'order_holder',
        width: '120',
        render(_, { row }) {
          return <span> {vm.getOrderCategoryName(row.order_holder)} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.ec29b1'),
        key: 'invoice_amount',
        width: '120',
        render(_, { row }) {
          return <span> {row.invoice_amount / 100} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.2af9f7'),
        key: 'invoice_status',
        width: '120',
        render(h, { row }) {
          const key = open_status_map[row.invoice_status]
          if (row.invoice_status === 'success') {
            return <span style={{ color: 'green' }}> {key ? vm.$t(key) : ''} </span>
          } else if (row.invoice_status === 'failed') {
            return <span style={{ color: 'red' }}> {key ? vm.$t(key) : ''} </span>
          } else {
            return <span> {key ? vm.$t(key) : ''} </span>
          }
        }
      },
      {
        name: vm.$t('2eced1b3.01b477'),
        key: 'invoice_type',
        width: '120',
        render(_, { row }) {
          const typeMap = {
            enterprise: vm.$t('2eced1b3.04c9e3'),
            individual: vm.$t('2eced1b3.6a0e04')
          }
          return <span> {typeMap[row.invoice_type]} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.6cbd05'),
        key: 'company_title',
        width: '120'
      },
      {
        name: vm.$t('2eced1b3.9c1f61'),
        key: 'invoice_type_code',
        width: '120',
        render(h, { row }) {
          const key = invoice_type_code_map[row.invoice_type_code]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.352b0b'),
        key: 'invoice_method',
        width: '120',
        render(h, { row }) {
          const key = open_status_step_map[row.invoice_method]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.26ca20'),
        key: 'invoice_source',
        render(h, { row }) {
          const key = invoice_source_map[row.invoice_source]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.6061ba'),
        key: 'user_card_code',
        width: '100'
      },
      {
        name: vm.$t('2eced1b3.2432b5'),
        key: 'remark',
        width: '120'
      },
      {
        name: vm.$t('2eced1b3.eca37c'),
        key: 'created',
        width: '120',
        render(h, { row }) {
          return <span> {moment(row.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.a001a2'),
        key: 'updated',
        width: '120',
        render(h, { row }) {
          return <span> {moment(row.update_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        key: 'invoice_status',
        label: vm.$t('2eced1b3.a03d7f'),
        type: 'select',
        defaultValue: '',
        options: open_status_arr.map((item) => ({
          ...item,
          label: vm.$t(item.i18nKey),
          title: vm.$t(item.i18nKey)
        }))
      },
      {
        key: 'invoice_type',
        label: vm.$t('2eced1b3.01b477'),
        defaultValue: 'individual',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type']}>
                <el-radio label='individual'>{vm.$t('2eced1b3.6a0e04')}</el-radio>
                <el-radio label='enterprise'>{vm.$t('2eced1b3.41716f')}</el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        key: 'invoice_type_code',
        label: vm.$t('2eced1b3.9c1f61'),
        defaultValue: '02',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type_code']}>
                <el-radio label='02'>{vm.$t('364a6013.8a487a')}</el-radio>
                <el-radio label='01'>{vm.$t('364a6013.515a32')}</el-radio>
              </el-radio-group>
            </div>
          )
        },
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_title',
        label: vm.$t('2eced1b3.240af5'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'individual'
        }
      },
      {
        key: 'company_title',
        label: vm.$t('2eced1b3.e29d27'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_tax_number',
        label: vm.$t('2eced1b3.a22d0a'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'email',
        label: vm.$t('2eced1b3.4b5787'),
        type: 'input',
        defaultValue: ''
      },
      {
        key: 'mobile',
        label: vm.$t('2eced1b3.69af7e'),
        type: 'input',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value['mobile']} placeholder={vm.$t('2eced1b3.a11cc7')} />
            </div>
          )
        }
      },
      {
        key: 'company_address',
        label: vm.$t('2eced1b3.e06494'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_telephone',
        label: vm.$t('2eced1b3.9e1660'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_name',
        label: vm.$t('2eced1b3.cc5ca0'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_account',
        label: vm.$t('2eced1b3.0905fd'),
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      }
    ],
    vm
  )

export const remarkSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        key: 'remark',
        label: '',
        type: 'textarea',
        defaultValue: ''
      }
    ],
    vm
  )

export const confirmSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        key: 'email',
        label: vm.$t('2eced1b3.3bc5e6'),
        type: 'input',
        defaultValue: '',
        required: true,
        message: vm.$t('2eced1b3.dbf6d0'),
        tip: vm.$t('2eced1b3.a1f8da')
      }
    ],
    vm
  )

export const logTableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: vm.$t('2eced1b3.de9cc3'),
        key: 'operator_type',
        render(h, { row }) {
          const key = invoice_log_type_map[row.operator_type]
          return <span> {key ? vm.$t(key) : ''} </span>
        }
      },
      {
        name: vm.$t('2eced1b3.2f2786'),
        key: 'operator_content',
        width: 400,
        render(_, { row }) {
          if (typeof row.operator_content === 'string') {
            return <span> {row.operator_content} </span>
          }
          return (
            <SpFinder
              ref='finder'
              fixed-row-action
              row-actions-width='200px'
              data={row.operator_content}
              no-selection
              show-pager={false}
              setting={vm.innerTableSchema}
              row-actions-fixed-align='left'
            />
          )
        }
      },
      {
        name: vm.$t('2eced1b3.f9ac4b'),
        key: 'operator'
      },
      {
        name: vm.$t('2eced1b3.19fcb9'),
        key: 'update_time',
        render(h, { row }) {
          return <span> {moment(row.update_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

// 嵌套在日志里面的表格信息
export const innerTableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: vm.$t('2eced1b3.86ae34'),
        key: 'oldValue'
      },
      {
        name: vm.$t('2eced1b3.79bf6b'),
        key: 'newValue'
      }
    ]
  })
