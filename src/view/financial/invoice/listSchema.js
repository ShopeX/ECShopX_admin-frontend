import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import {
  open_status_map,
  open_status_arr,
  open_status_step_map,
  invoice_type_code_map,
  invoice_source_map,
  invoice_source_arr,
  invoice_log_type_map
} from './constants'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '详情',
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
        },
        visible: (val) => {
          //线下并且不能是开票失败才战死后
          return val.invoice_method != 'online' && val.invoice_status != 'failed'
        }
      },
      {
        name: '重发至邮箱',
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
          return (val.invoice_status == 'success' && val.invoice_method == 'online') || (val.invoice_status == 'failed' && val.invoice_method != 'online')
        }
      },
      {
        name: '备注',
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
        name: '日志',
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
        name: '重推开票',
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
        name: '开票申请流水',
        key: 'invoice_apply_bn',
        width: '200'
      },
      {
        name: '订单号',
        key: 'order_id',
        width: '180',
        render(_, { row }) {
          return (
            <div>
              <div class='order-num'>
                {row.order_id}
                <el-tooltip effect='dark' content='复制' placement='top-start'>
                  <i
                    class='el-icon-document-copy'
                    style={{marginLeft:'6px'}}
                    onClick={() => {
                      vm.$copyText(row.order_id).then((res) => {
                        vm.onCopySuccess()
                      })
                    }}
                  />
                </el-tooltip>
              </div>
              <div class='order-store'>
                <el-tooltip effect='dark' content='店铺名' placement='top-start'>
                  <i class='el-icon-office-building' />
                </el-tooltip>
                {row.distributor_name}
              </div>
              <div class='order-time'>
                <el-tooltip effect='dark' content='下单时间' placement='top-start'>
                  <i class='el-icon-time' style={{marginRight:'6px'}} />
                </el-tooltip>
                {moment(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          )
        }
      },
      {
        name: '订单分类',
        key: 'order_holder',
        width: '120',
        render(_, { row }) {
          return <span> { vm.getOrderCategoryName(row.order_holder) } </span>
        }
      },
      {
        name: '开票金额（¥）',
        key: 'invoice_amount',
        width: '120',
        render(_, { row }) {
          return <span> { row.invoice_amount / 100 } </span>
        }
      },
      {
        name: '开票状态',
        key: 'invoice_status',
        width: '120',
        render(h, { row }) {
          if (row.invoice_status === 'success') {
            return <span style={{ color: 'green' }}> {open_status_map[row.invoice_status]} </span>
          } else if (row.invoice_status === 'failed') {
            return <span style={{ color: 'red' }}> {open_status_map[row.invoice_status]} </span>
          } else {
            return <span> {open_status_map[row.invoice_status]} </span>
          }
        }
      },
      {
        name: '抬头类型',
        key: 'invoice_type',
        width: '120',
        render(_, { row }) {
          const typeMap = { enterprise: '企业', individual: '个人' }
          return <span> {typeMap[row.invoice_type]} </span>
        }
      },
      {
        name: '发票抬头',
        key: 'company_title',
        width: '120'
      },
      {
        name: '发票类型',
        key: 'invoice_type_code',
        width: '120',
        render(h, { row }) {
          return <span> { invoice_type_code_map[row.invoice_type_code] } </span>
        }
      },
      {
        name: '开票渠道',
        key: 'invoice_method',
        width: '120',
        render(h, { row }) {
          return <span> {open_status_step_map[row.invoice_method]} </span>
        }
      },
      {
        name: '来源',
        key: 'invoice_source',
        render(h, { row }) {
          return <span> {invoice_source_map[row.invoice_source]} </span>
        }
      },
      {
        name: '会员编号',
        key: 'user_card_code',
        width: '100'
      },
      {
        name: '备注',
        key: 'remark',
        width: '120'
      },
      {
        name: '创建时间',
        key: 'created',
        width: '120',
        render(h, { row }) {
          return <span> {moment(row.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: '更新时间',
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
        label: '发票状态',
        type: 'select',
        defaultValue: '',
        options: open_status_arr
      },
      {
        key: 'invoice_type',
        label: '抬头类型',
        defaultValue: 'individual',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type']}>
                <el-radio label='individual'>个人</el-radio>
                <el-radio label='enterprise'>公司</el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        key: 'invoice_type_code',
        label: '发票类型',
        defaultValue: '02',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type_code']}>
                <el-radio label='02'>电子普通发票</el-radio>
                <el-radio label='01'>专用发票</el-radio>
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
        label: '个人抬头',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'individual'
        }
      },
      {
        key: 'company_title',
        label: '公司抬头',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_tax_number',
        label: '纳税人识别号',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'email',
        label: '收票人邮箱',
        type: 'input',
        defaultValue: ''
      },
      {
        key: 'mobile',
        label: '收票人手机',
        type: 'input',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value['mobile']} placeholder='请输入内容' />
            </div>
          )
        }
      },
      {
        key: 'company_address',
        label: '公司地址',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_telephone',
        label: '公司电话',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_name',
        label: '开户银行',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_account',
        label: '开户行账户',
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
        label: '邮箱',
        type: 'input',
        defaultValue: '',
        required:true,
        message:'请输入邮箱',
        tip:'电子发票需要一定时间才能发送到您的邮箱,请耐心等待'
      }
    ],
    vm
  )

export const logTableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: '操作类型',
        key: 'operator_type',
        render(h, { row }) {
          return <span> {invoice_log_type_map[row.operator_type]} </span>
        }
      },
      {
        name: '操作内容',
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
        name: '操作人',
        key: 'operator'
      },
      {
        name: '时间',
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
        name: '修改前',
        key: 'oldValue'
      },
      {
        name: '修改后',
        key: 'newValue'
      }
    ]
  })
