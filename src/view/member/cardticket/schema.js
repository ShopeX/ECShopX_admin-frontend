import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

// 定义一个映射对象，将英文券类型映射为中文券类型
const cardTypeMap = {
  'groupon': '团购券',
  'discount': '折扣券',
  'gift': '兑换券',
  'new_gift': '兑换券',
  'cash': '满减券',
  'minus': '立减券',
  'money': '现金券',
  'general_coupon': '优惠券',
  'member_card': '会员卡',
  'scenic_ticket': '景点门票',
  'movie_ticket': '电影票',
  'boarding_pass': '飞机票',
  'meeting_ticket': '会议门票',
  'bus_ticket': '汽车票'
}

// 定义 formatCardStr 函数，使用映射对象进行转换
const formatCardStr = (str) => {
  return cardTypeMap[str] || str
}

const base_status = [
  {
    value: '2',
    label: '待审核',
    title: '待审核'
  },
  {
    value: '1',
    label: '审核通过',
    title: '审核通过'
  },
  {
    value: '3',
    label: '审核拒绝',
    title: '审核拒绝'
  },
  {
    value: '4',
    label: '已上架',
    title: '已上架'
  },
  {
    value: '5',
    label: '已下架',
    title: '已下架'
  }
]

export const audit_status = [
  {
    value: 'all',
    label: '全部'
  },
  ...base_status
]

export const createTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '查看',
        key: 'show',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.showConfigHandle(row)
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
              vm.editRowDataHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] !== '4'
        }
      },
      {
        name: '上架',
        key: 'putaway',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.$confirm('确定上架该券吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                vm.changeStatusRowDataHandle(row, '4')
              })
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] === '1' || row['status'] === '5'
        }
      },
      {
        name: '下架',
        key: 'soldout',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.$confirm('确定下架该券吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                vm.changeStatusRowDataHandle(row, '5')
              })
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] === '4'
        }
      },
      {
        name: '审批',
        key: 'approve',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.approveHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] === '2'
        }
      },
      {
        name: '日志',
        key: 'log',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.showLogInfo(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '投放',
        key: 'push',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.pushCouponHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] === '4'
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row, $index]) => {
              vm.deleteRowDataHandle(row, $index)
            },
            2000,
            {
              leading: true
            }
          )
        },
        visible(row) {
          return row['status'] == '1' || row['status'] == '2'
        }
      }
    ],
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      { key: 'title', name: '券标题' },
      { key: 'card_id', name: '券模板ID' },
      {
        key: 'card_type',
        name: '券类型',
        type: 'select',
        options: [
          {
            value: 'discount',
            label: '折扣券'
          },
          {
            value: 'cash',
            label: '代金券'
          },
          {
            value: 'gift',
            label: '兑换券'
          },
          {
            value: 'new_gift',
            label: '兑换券(新)'
          },
          {
            value: 'minus',
            label: '立减券'
          }
        ]
      },
      {
        key: 'po_code',
        name: 'PO编码'
      },
      {
        key: 'budget_code',
        name: 'Budget code',
        type: 'select',
        slot: 'select_shop'
      }
    ],
    columns: [
      {
        name: 'Id',
        key: 'card_id',
        render(_, { row }) {
          return (
            <div>
              {row.card_id}
            </div>
          )
        }
      },
      {
        name: '券标题',
        key: 'title'
      },
      {
        name: '券类型',
        key: 'card_type',
        render(_, { row }) {
          return (
            <el-tag
              type={
                row.card_type === 'discount'
                  ? 'primary'
                  : row.card_type === 'cash'
                    ? 'danger'
                    : 'warning'
              }
              size='mini'
            >
              {formatCardStr(row.card_type)}
            </el-tag>
          )
        }
      },
      {
        name: '规则',
        key: 'rule_text'
      },
      {
        name: '有效期',
        key: 'time',
        render(_, { row }) {
          return (
            <div>
              {row.takeEffect
                ? row.takeEffect
                : `${moment(row.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
                  row.end_time * 1000
                ).format('YYYY-MM-DD HH:mm:ss')}`}
            </div>
          )
        }
      },
      {
        name: 'PO编码',
        key: 'po_code'
      },
      {
        name: 'Budget code',
        key: 'budget_code'
      },
      {
        name: '可领取库存',
        key: 'quantity',
        render(_, { row }) {
          return (
            <span>
              {row.quantity > row.get_num ? row.quantity - row.get_num : 0}
              {row.edit_btn === 'Y' && (
                <el-button type='text' onClick={() => vm.editCouponStore(row.card_id)}>
                  <i class='el-icon-edit' />
                </el-button>
              )}
            </span>
          )
        }
      },
      {
        name: '领取量',
        key: 'get_num'
      },
      {
        name: '使用量',
        key: 'use_num'
      },
      {
        name: '区域',
        key: 'regionauth_name'
      },
      {
        name: '店铺',
        key: 'source_name'
      },
      {
        name: '审核状态',
        key: 'status',
        render(_, { row }) {
          // 审核状态颜色
          // 1 通过 绿色
          // 2 待审核 橘色
          // 3 拒绝 红色
          const color = row.status === '1' ? '#67C23A' : row.status === '2' ? '#E6A23C' : '#F56C6C'
          if (row.status === '3') {
            return (
              <el-tooltip
                class='item'
                effect='dark'
                content={row.refuse_reason}
                placement='top-start'
              >
                <div style={{ color }}>
                  {audit_status.find((item) => item.value === row.status)?.label || '--'}
                </div>
              </el-tooltip>
            )
          }
          return (
            <div style={{ color }}>
              {audit_status.find((item) => item.value === row.status)?.label || '--'}
            </div>
          )
        }
      },
      {
        name: '创建时间',
        key: 'created',
        render(_, { row }) {
          return moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        name: '更新时间',
        key: 'updated',
        render(_, { row }) {
          return moment(row.updated * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    ]
  })

// 日志表格数据
export const createLogTableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: '操作类型',
        key: 'act_type'
      },
      {
        name: '操作内容',
        key: 'spec',
        type: 'table',
        width: '500',
        render(_, { row }) {
          if (row.log_content) {
            return row.log_content
          }
          return (
            <SpFinder
              ref='finder'
              fixed-row-action
              row-actions-width='200px'
              no-selection
              setting={innerTableSchema}
              row-actions-fixed-align='left'
              data={row.log_items}
              show-pager={false}
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
        key: 'create_time',
        render(_, { row }) {
          return <span>{moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      }
    ]
  })

// 嵌套在日志里面的表格信息
const innerTableSchema = {
  columns: [
    {
      name: '修改项',
      key: 'item_name'
    },
    {
      name: '修改前',
      key: 'before'
    },
    {
      name: '修改后',
      key: 'after'
    }
  ]
}

export const createAuditFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '审核状态',
        key: 'status',
        type: 'select',
        required: true,
        message: '请选择审核状态',
        options: [
          {
            value: '1',
            label: '审核通过',
            title: '审核通过'
          },
          {
            value: '3',
            label: '审核拒绝',
            title: '审核拒绝'
          },
        ]
      },
      {
        label: '拒绝原因',
        key: 'refuse_reason',
        type: 'input',
        placeholder: '请输入拒绝原因',
        isShow({ key }, value) {
          return vm.auditForm['status'] === '3'
        }
      }
    ],
    vm
  )

export const createEditForm = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        key: 'type',
        type: 'radio',
        defaultValue: 'increase',
        options: [
          { label: 'increase', name: '增加' },
          { label: 'reduce', name: '减少' }
        ]
      },
      {
        label: '数量',
        key: 'quantity',
        type: 'input',
        defaultValue: 1,
        placeholder: '请输入数量',
        validator(rule, value, callback) {
          const fd = vm.pageData?.find((item) => item.card_id == vm.editForm.card_id) || {}
          if (vm.editForm.type == 'reduce') {
            if (vm.editForm?.quantity > (fd.quantity || 0) - fd.get_num) {
              callback(new Error('减少数量不能大于可领取库存'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    ],
    vm
  )
