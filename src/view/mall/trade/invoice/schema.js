import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { open_status_map, open_status_arr, open_status_step_map, invoice_source_map, invoice_source_arr, invoice_log_type_map } from './constants'

export const tableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      { key: 'order_id', name: '订单号' },
      { key: 'invoice_apply_bn', name: '开票申请流水' },
      { key: 'company_title', name: '抬头名称' },
      { key: 'invoice_source', name: '客户来源', type: 'select', options: invoice_source_arr },
      {
        key: 'show_time',
        name: '创建时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      }
    ],
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
                path: '/financial/invoiceManagement/detail',
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
          return val.invoice_method !== 'online'
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
          return val.invoice_status === 'success' && val.invoice_method === 'online'
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
    ],
    columns: [
      {
        name: '开票申请流水',
        key: 'invoice_apply_bn',
        width: '80'
      },
      {
        name: '区域',
        key: 'regionauth_id',
        render(h, { row }) {
          const str = vm.areas?.find((e) => e.value == row.regionauth_id)?.label
          return <span> {str} </span>
        }
      },
      {
        name: '订单号',
        key: 'order_id',
      },
      {
        name: '开票金额（¥）',
        key: 'invoice_amount',
      },
      {
        name: '开票状态',
        key: 'invoice_status',
        render(h, { row }) {
          if (row.invoice_status === 'success') {
            return <span style={{ color: 'green' }}> {open_status_map[row.invoice_status]} </span>
          }
          else if (row.invoice_status === 'failed') {
            return <span style={{ color: 'red' }}> {open_status_map[row.invoice_status]} </span>
          } else {
            return <span> {open_status_map[row.invoice_status]} </span>
          }
        }
      },
      {
        name: '抬头类型',
        key: 'invoice_type',
        render(_, { row }) {
          const typeMap = { enterprise: '企业', individual: '个人' };
          return <span> {typeMap[row.invoice_type]} </span>
        }
      },
      {
        name: '发票抬头',
        key: 'company_title'
      },

      {
        name: '类型',
        key: 'invoice_method',
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
        key: 'user_id',
      },
      {
        name: '备注',
        key: 'remark',
      },
      {
        name: '创建时间',
        key: 'created',
        render(h, { row }) {
          return <span> {moment(row.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: '更新时间',
        key: 'updated',
        render(h, { row }) {
          return <span> {moment(row.update_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })




export const formSchema = (vm) => bindThisForFormSchema([
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
      return <div>
        <el-radio-group v-model={value['invoice_type']}>
          <el-radio label="individual">个人</el-radio>
          <el-radio label="enterprise">公司</el-radio>
        </el-radio-group>
      </div>
    }
  },
  {
    key: 'company_title',
    label: '个人抬头',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'individual' }
  },
  {
    key: 'company_title',
    label: '公司抬头',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  },
  {
    key: 'company_tax_number',
    label: '纳税人识别号',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  },
  {
    key: 'email',
    label: '收票人邮箱',
    type: 'input',
    defaultValue: '',
  },
  {
    key: 'mobile',
    label: '收票人手机',
    type: 'input',
    defaultValue: '',
    component({ key }, value) {
      return <div>
        <el-input v-model={value['mobile']} type="number" />
      </div>
    }
  },
  {
    key: 'company_address',
    label: '公司地址',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  },
  {
    key: 'company_telephone',
    label: '公司电话',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  },
  {
    key: 'bank_name',
    label: '开户银行',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  },
  {
    key: 'bank_account',
    label: '开户行账户',
    type: 'input',
    defaultValue: '',
    isShow() { return vm.dialogForm.invoice_type === 'enterprise' }
  }
], vm)


export const remarkSchema = (vm) => bindThisForFormSchema([
  {
    key: 'remark',
    label: '',
    type: 'textarea',
    defaultValue: '',
  }
], vm)

export const confirmSchema = (vm) => bindThisForFormSchema([
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    defaultValue: '',
  }
], vm)


export const logTableSchema = (vm) => createSetting({
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
      dataIndex: 'operator_content',
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
export const innerTableSchema = (vm) => createSetting({
  columns: [
    {
      name: '修改前',
      dataIndex: 'oldValue',
    },
    {
      name: '修改后',
      key: 'newValue'
    }
  ]
})
