import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      { key: 'card_title', name: '优惠券名称' },
      {
        key: 'card_type', name: '券类型', type: 'select', options: [
          {
            label: '折扣券',
            value: 'discount',
            name: 'discount'
          },
          {
            label: '满减券',
            value: 'cash',
            name: 'cash'
          },
          {
            label: '兑换券',
            value: 'new_gift',
            name: 'new_gift'
          },
          {
            label: '立减券',
            value: 'minus',
            name: 'minus'
          },
        ]
      },
      { key: 'code', name: '优惠券券码' },
      { key: 'card_id', name: '券模板ID' },
      { key: 'user_card_code', name: '会员卡号' },
      { key: 'mobile', name: '手机号' },
      {
        key: 'used_status', name: '核销类型', type: 'select', options: [
          {
            label: '核销',
            value: 'consume',
            name: 'consume'
          },
          {
            label: '回退',
            value: 'callback',
            name: 'callback'
          },
          {
            label: '作废',
            value: 'cancel',
            name: 'cancel'
          }
        ]
      },
      { key: 'use_distributor_id', name: '核销店铺', slot: "shop" },
      {
        key: 'begin_date',
        name: '核销时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-DD'
      },
    ],
    columns: [
      {
        name: '核销流水',
        key: 'used_order'
      },
      {
        name: '核销时间',
        key: 'used_time',
        width: '140px',
      },
      {
        name: '券模板ID',
        key: 'card_id'
      },
      {
        name: '优惠券名称',
        key: 'title',
      },
      {
        name: '券类型',
        key: 'card_type',
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
        name: '券面额',
        key: 'card_discount'
      },
      {
        name: '实际核销金额',
        key: 'discount_fee'
      },
      {
        name: '区域',
        key: 'regionauth_name'
      },
      {
        name: '有效期',
        key: 'use_num',
        render(_, { row }) {
          return row.begin_date ? `${row.begin_date} - ${row.end_date}` : '-'
        }
      },
      {
        name: '会员卡号',
        key: 'user_card_code'
      },
      {
        name: '手机号',
        key: 'mobile',
      },
      {
        name: '核销订单',
        key: 'used_order',
        render(_, { row }) {
          return row?.used_order ? <span style={{ color: '#409EFF', textDecoration: 'underline' }} onClick={() => {
            vm.$router.push(`/order/detail/${row.used_order}`)
          }}>{row?.used_order}</span> : '-'
        }
      },
      {
        name: '核销店铺',
        key: 'shop_name',
      }
    ]
  })

export const loseFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        key: 'text',
        component(_, value) {
          return (
            <div>
              <div>作废核销记录后,优惠券可再次核销</div>
            </div>
          )
        }
      },
      {
        label: '原因',
        key: 'lose_reason',
        component(_, value) {
          return (
            <div>
              <el-input v-model={value['lose_reason']} type='textarea' placeholder='请输入' />
            </div>
          )
        }
      },
      {
        label: '图片',
        key: 'img',
        component(_, value) {
          return (
            <div>
              <SpImagePicker v-model={value['img']} />
            </div>
          )
        }
      }
    ],
    vm
  )
