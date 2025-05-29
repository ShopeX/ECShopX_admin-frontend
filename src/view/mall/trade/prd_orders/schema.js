import { maskPhone } from '@/utils'
import { createSetting } from '@shopex/finder'
import { debounce } from 'lodash-es'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'mobile', name: '手机号' },
      { key: 'user_card_code', name: '会员卡号' },
      { key: 'order_id', name: '订单编号' },
      { key: 'oid', name: '商品订单编号' },
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      { key: 'shop_id', name: '店铺', slot: 'shop' },
      {
        key: 'is_invoice',
        name: '开票状态',
        type: 'select',
        options: [
          { label: '已开票', value: '0', title: '已开票' },
          { label: '未开票', value: '1', title: '未开票' }
        ]
      },
      {
        key: 'delivery_method',
        name: '发货方式',
        type: 'select',
        options: []
      },
      {
        key: 'order_type',
        name: '订单类型',
        type: 'select',
        options: [
          { label: '普通订单', value: 'normal' },
          { label: '限时特惠订单', value: 'seckill' },
          { label: '拼团订单', value: 'groups' },
          { label: '砍价助力订单', value: 'bargain' }
        ]
      },
      {
        key: 'sku_code',
        name: 'SKU编码'
      },
      {
        key: 'item_name',
        name: '商品名称'
      },
      {
        key: 'time',
        name: '下单时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      {
        key: 'delivery_time',
        name: '发货时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      {
        key: 'pay_time',
        name: '付款时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      {
        key: 'receipt_type',
        name: '配送方式',
        type: 'select',
        options: [
          {
            label: '物流',
            value: 'logistics',
            title: '物流'
          },
          {
            label: '店铺自提',
            value: 'ziti',
            title: '店铺自提'
          }
        ]
      },
      {
        key: 'source_from',
        name: '订单来源',
        type: 'select',
        options: vm?.orderSourceList
      },
      {
        key: 'order_no',
        name: '订单流水号'
      },
      {
        key: 'trade_id',
        name: '交易单号'
      },
      {
        key: 'transaction_id',
        name: '支付流水号'
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
              vm.detailHandle(row)
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
        key: 'log',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.logHandle(row)
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
        key: 'order_id',
        name: '订单编号'
      },
      {
        key: 'sub_order_id',
        name: '商品订单号'
      },
      {
        key: 'item_info',
        name: '商品订单信息',
        width: 220,
        render(_, { row }) {
          return (
            <div style='display: flex; align-items: flex-start'>
              <img src={row['pic']} style='width: 100px; height: 100px' />
              <div>
                <div
                  class='order-info-item-name'
                  style='display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;'
                >
                  {row?.['item_name']}
                </div>
                <div class='order-info-item-price'>规格:{row['item_spec_desc']}</div>
                <div class='order-info-item-sku'>sku: {row['item_bn']}</div>
              </div>
            </div>
          )
        }
      },
      {
        key: 'num',
        name: '件数',
        width: 120,
        render(h, { row }) {
          return (
            <div>
              <div>{row['num']}</div>
              <div>（已退:¥{row['refunded_num']}）</div>
              {row['aftersales_status'] ? <span>查看售后记录</span> : null}
            </div>
          )
        }
      },
      {
        key: 'total_fee',
        name: '支付金额',
        width: 120,
        render(h, { row }) {
          return (
            <div>
              <div>{row['total_fee']}</div>
              <div>（已退:¥{row['refunded_fee']}）</div>
            </div>
          )
        }
      },
      {
        key: 'order_status',
        name: '商品订单状态',
        width: 120
      },
      {
        key: 'refund_status',
        name: '退款状态',
        width: 120,
        render(h, { row }) {
          return (
            <div>
              <div>{row['refund_status']}</div>
              {row['refund_status'] > 0 ? <span>查看退款记录</span> : null}
            </div>
          )
        }
      },
      {
        key: 'user_info',
        name: '会员信息',
        width: 120,
        render(h, { row, $index }) {
          return (
            <div>
              {/* 眼睛icon */}
              <div
                on-click={() => {
                  vm.showMobileMap[$index] = !vm.showMobileMap[$index]
                  vm.showMobileMap = [...vm.showMobileMap]
                }}
              >
                {vm.showMobileMap[$index] ? row['mobile'] : maskPhone(row['mobile'])}{' '}
                <el-icon class='el-icon-view' />
              </div>
              <div>会员卡号: {row['user_card_code']}</div>
            </div>
          )
        }
      },
      {
        key: 'order_type',
        name: '订单类型',
        width: 120
      },
      {
        key: 'regionauth_name',
        name: '区域',
        width: 120
      },
      {
        key: 'distributor_name',
        name: '来源店铺',
        width: 120
      },
      {
        key: 'receipt_type',
        name: '配送方式',
        width: 120
      },
      {
        key: 'delivery_method',
        name: '发货方式',
        width: 120
      },
      {
        key: 'pay_time',
        name: '付款时间',
        width: 120
      },
      {
        key: 'delivery_time',
        name: '发货时间',
        width: 120
      },
      {
        key: 'sign_time',
        name: '签收时间',
        width: 120
      },
      {
        key: 'is_invoice',
        name: '开票状态',
        width: 120
      },
      {
        key: 'source',
        name: '订单来源',
        width: 120
      },
      {
        key: 'weapp',
        name: '微信场景',
        width: 120
      }
    ]
  })
