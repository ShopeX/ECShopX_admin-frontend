<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SearchForm class="mb-4" @submit="handleSearch" />

      <SpTabs :tab-list="tabList" v-model="activeTab" @change="handleTabChange" />

      <SpFinder
        no-selection
        ref="finder"
        url="/orders"
        row-actions-align="left"
        row-actions-fixed-align="left"
        row-actions-width="120px"
        :fixed-row-action="true"
        :setting="finderSetting"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
      />
    </SpPage>
  </SpRouterView>
</template>

<script>
import { createSetting } from '@shopex/finder'
import _map from 'lodash/map'
import moment from 'moment'
import {
  ORDER_TYPE,
  ORDER_ZITI_STATUS_MAP,
  ORDER_DELIVERY_STATUS_MAP,
  GLOBAL_ORDER_STATUS_MAP
} from '@/consts'
import { IS_ADMIN, VERSION_STANDARD, formatPrice } from '@/utils'
import { useForm } from '@/composables'
import hqbdlycorp from '@/common/hqbdlycorp.json'

const LOCAL_ORDER_TYPE = _map(ORDER_TYPE, item => ({ label: item.title, value: item.value }))

const [SearchForm, SearchFormApi] = useForm({
  formType: 'searchForm',
  formItems: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号'
      },
      fieldName: 'mobile',
      // formItemClass: 'col-start-3',
      label: '手机号',
      value: ''
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号'
      },
      fieldName: 'order_id',
      label: '订单号',
      value: ''
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单类型',
        options: LOCAL_ORDER_TYPE
      },
      fieldName: 'order_class',
      label: '订单类型',
      value: ''
    },
    {
      component: 'DateTimePicker',
      componentProps: {
        type: 'datetimerange'
      },
      fieldName: 'create_time',
      formItemClass: 'col-span-2',
      label: '订单时间',
      value: []
    }
    // {
    //   component: ({ h, value, onInput }) => {
    //     return (
    //       <SpSelectShop
    //         value={value}
    //         size="small"
    //         placeholder="请选择店铺"
    //         onChange={val => {
    //           onInput(val)
    //         }}
    //       />
    //     )
    //   },
    //   fieldName: 'distributor_id',
    //   label: '店铺',
    //   value: ''
    // }
  ],
  inline: true
})

const [DeliveryForm, DeliveryFormApi] = useForm({
  formItems: [
    {
      component: ({ h, value }) => {
        return <div>{value}</div>
      },
      label: '订单号',
      fieldName: 'order_id'
    },
    {
      component: ({ h, value }) => {
        return (
          <el-table border data={value} style="width: 100%">
            <el-table-column prop="item_name" label="商品名" />
            <el-table-column prop="num" label="数量" width="80" />
            <el-table-column
              label="总价"
              width="160"
              scopedSlots={{
                default: scope => <span>{formatPrice(scope.row.total_fee)}</span>
              }}
            />
          </el-table>
        )
      },
      label: '商品信息',
      fieldName: 'goods_info',
      value: []
    },
    {
      component: 'Select',
      label: '快递公司',
      fieldName: 'delivery_corp',
      formItemClass: 'w-1/3',
      componentProps: {
        filterable: true,
        options: _map(hqbdlycorp, item => ({
          label: item.name,
          value: item.value
        }))
      },
      rules: [{ required: true, message: '请选择快递公司' }]
    },
    {
      component: 'Input',
      label: '快递单号',
      fieldName: 'delivery_no',
      formItemClass: 'w-1/3',
      rules: [{ required: true, message: '快递单号不能为空' }]
    }
  ],
  showDefaultActions: false
})

export default {
  components: {
    SearchForm: SearchForm
  },
  data() {
    return {
      datapass_block: 1,
      finderSetting: createSetting({
        actions: [
          {
            name: '详情',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/detail`,
                  query: {
                    orderId: row.order_id,
                    resource: '/mall/trade/normalorders'
                  }
                })
              }
            }
          },
          {
            name: '发货',
            key: 'delivery',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const { orderInfo } = await this.$api.trade.getOrderDetail(row.order_id)
                const goodsInfo = orderInfo?.items || []
                await this.$dialog.open({
                  title: '发货',
                  content: (
                    <DeliveryForm
                      value={{
                        order_id: row.order_id,
                        goods_info: goodsInfo
                      }}
                    />
                  ),
                  confirmBefore: async () => {
                    try {
                      await DeliveryFormApi.validate()
                    } catch (error) {
                      throw new Error('表单验证失败')
                    }
                  }
                })
                const res = await DeliveryFormApi.getFieldsValue()
                await this.$api.trade.delivery({
                  order_id: row.order_id,
                  delivery_corp: res.delivery_corp,
                  delivery_code: res.delivery_code
                })
                this.$message.success('发货成功')
                this.$refs.finder.refresh()
              }
            },
            visible: row => {
              return (
                row.receipt_type == 'logistics' &&
                row.order_status == 'PAYED' &&
                row.delivery_status != 'DONE' &&
                !IS_ADMIN()
              )
            }
          }
        ],
        columns: [
          {
            name: '订单号',
            key: 'order_id',
            width: 220,
            render(h, { row }) {
              return (
                <div>
                  <SpClipboard content={row.order_id} />
                  <div class="flex items-center">
                    <SpIcon class="mr-1" name="store" />
                    {row.distributor_name}
                  </div>
                </div>
              )
            }
          },
          {
            name: '订单时间',
            key: 'create_time',
            width: 180,
            formatter: (value, row, col) => {
              return `${moment(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          },
          {
            name: '运费',
            key: 'freight_fee',
            width: 100,
            formatter: (value, row, col) => {
              return `${formatPrice(value || 0)}`
            }
          },
          {
            name: '订单金额',
            key: 'total_fee',
            width: 120,
            formatter: (value, row, col) => `${formatPrice(value)}`
          },
          {
            name: '联系电话',
            key: 'mobile',
            render(h, { row }) {
              return <SpClipboard content={row.mobile} />
            }
          },
          {
            name: '订单类型',
            key: 'order_class',
            formatter: value => {
              return LOCAL_ORDER_TYPE.find(item => item.value == value)?.label
            }
          },
          {
            name: '订单状态',
            key: 'order_status',
            render(h, { row }) {
              return h(
                'el-tag',
                {
                  props: {
                    type: GLOBAL_ORDER_STATUS_MAP[row.order_status_des]?.type,
                    size: 'mini'
                  }
                },
                row.order_status_msg
              )
            }
          }
        ]
      }),
      activeTab: 'all',
      tabList: [
        { label: '全部订单', name: 'all' },
        { label: '待发货', name: 'notship' },
        { label: '已完成', name: 'done' },
        { label: '未支付', name: 'notpay' },
        { label: '已取消', name: 'cancel' }
      ]
    }
  },
  mounted() {},
  methods: {
    beforeSearch(params) {
      const { create_time, mobile, order_id, order_class, distributor_id } =
        SearchFormApi.getFieldsValue()
      const _params = {
        ...params,
        order_type: 'normal',
        order_class_exclude: 'community',
        is_distribution: 1
      }

      if (create_time.length > 0) {
        _params.time_start_begin = create_time[0].getTime() / 1000
        _params.time_start_end = create_time[1].getTime() / 1000
      }

      order_id && (_params.order_id = order_id)
      mobile && (_params.mobile = mobile)
      order_class && (_params.order_class = order_class)
      distributor_id && (_params.distributor_id = distributor_id)

      if (this.activeTab !== 'all') {
        _params['order_status'] = this.activeTab
      }
      return _params
    },
    afterSearch(response) {
      response.data.data['total_count'] = response.data.data.pager.count
      return response
    },
    handleTabChange(tab) {
      this.$refs.finder.refresh(true)
    },
    handleSearch(form) {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
