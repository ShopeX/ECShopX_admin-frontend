<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFormPlus
        ref="searchForm"
        class="mb-4"
        v-model="searchParams"
        form-type="searchForm"
        :inline="true"
        :form-items="searchFormItems"
        @submit="handleSearch"
        @reset="handleSearch"
      />

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
import { createSetting } from '@shopex-ui/finder'
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
import { i18n } from '@/i18n'

const LOCAL_ORDER_TYPE = _map(ORDER_TYPE, (item) => ({ label: item.title, value: item.value }))

const [DeliveryForm, DeliveryFormApi] = useForm({
  formItems: [
    {
      component: ({ h, value }) => {
        return <div>{value}</div>
      },
      label: i18n.t('2345face.1e8dc2'),
      fieldName: 'order_id'
    },
    {
      component: ({ h, value }) => {
        return (
          <el-table border data={value} style='width: 100%'>
            <el-table-column prop='item_name' label={i18n.t('2345face.de5472')} />
            <el-table-column prop='num' label={i18n.t('2345face.0bf60b')} width='80' />
            <el-table-column
              label={i18n.t('2345face.4df53f')}
              width='160'
              scopedSlots={{
                default: (scope) => <span>{formatPrice(scope.row.total_fee)}</span>
              }}
            />
          </el-table>
        )
      },
      label: i18n.t('2345face.b433e6'),
      fieldName: 'goods_info',
      value: []
    },
    {
      component: 'Select',
      label: i18n.t('2345face.f3af96'),
      fieldName: 'delivery_corp',
      formItemClass: 'w-1/3',
      componentProps: {
        filterable: true,
        options: _map(hqbdlycorp, (item) => ({
          label: item.name,
          value: item.value
        }))
      },
      rules: [{ required: true, message: i18n.t('2345face.8367e8') }]
    },
    {
      component: 'Input',
      label: i18n.t('2345face.3c016d'),
      fieldName: 'delivery_no',
      formItemClass: 'w-1/3',
      rules: [{ required: true, message: i18n.t('2345face.a8318c') }]
    }
  ],
  showDefaultActions: false
})

export default {
  data() {
    return {
      searchParams: {
        mobile: '',
        order_id: '',
        order_class: '',
        create_time: []
      },
      datapass_block: 1,
      finderSetting: createSetting({
        actions: [
          {
            name: this.$t('2345face.f26225'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/detail`,
                  query: {
                    orderId: row.order_id,
                    resource: this.isSelfOrderList ? this.$route.path : '/mall/trade/normalorders'
                  }
                })
              }
            }
          },
          {
            name: this.$t('2345face.045315'),
            key: 'delivery',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const { orderInfo } = await this.$api.trade.getOrderDetail(row.order_id)
                const goodsInfo = orderInfo?.items || []
                await this.$dialog.open({
                  title: this.$t('2345face.045315'),
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
                      throw new Error(this.$t('2345face.53aadf'))
                    }
                  }
                })
                const res = await DeliveryFormApi.getFieldsValue()
                await this.$api.trade.delivery({
                  order_id: row.order_id,
                  delivery_corp: res.delivery_corp,
                  delivery_code: res.delivery_code
                })
                this.$message.success(this.$t('2345face.2c8dba'))
                this.$refs.finder.refresh()
              }
            },
            visible: (row) => {
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
            name: this.$t('2345face.1e8dc2'),
            key: 'order_id',
            width: 220,
            render(h, { row }) {
              return (
                <div>
                  <SpClipboard content={row.order_id} />
                  <div class='flex items-center'>
                    <SpIcon class='mr-1' name='store' />
                    {row.distributor_name}
                  </div>
                </div>
              )
            }
          },
          {
            name: this.$t('2345face.56e3f8'),
            key: 'create_time',
            width: 180,
            formatter: (value, row, col) => {
              return `${moment(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          },
          {
            name: this.$t('2345face.9a935b'),
            key: 'freight_fee',
            width: 100,
            formatter: (value, row, col) => {
              return `${formatPrice(value || 0)}`
            }
          },
          {
            name: this.$t('2345face.b1862e'),
            key: 'total_fee',
            width: 120,
            formatter: (value, row, col) => `${formatPrice(value)}`
          },
          {
            name: this.$t('2345face.09a1f6'),
            key: 'mobile',
            render(h, { row }) {
              return <SpClipboard content={row.mobile} />
            }
          },
          {
            name: this.$t('2345face.5cd56b'),
            key: 'order_class',
            formatter: (value) => {
              return LOCAL_ORDER_TYPE.find((item) => item.value == value)?.label
            }
          },
          {
            name: this.$t('2345face.86f6cf'),
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
        { label: this.$t('2345face.dbb4d8'), name: 'all' },
        { label: this.$t('2345face.d8476e'), name: 'notship' },
        { label: this.$t('2345face.fad522'), name: 'done' },
        { label: this.$t('2345face.608afd'), name: 'notpay' },
        { label: this.$t('2345face.2111cc'), name: 'cancel' }
      ]
    }
  },
  computed: {
    isSelfOrderList() {
      return this.$route.meta?.aliasName === 'tradenormalshoporders'
    },
    searchFormItems() {
      return [
        {
          fieldName: 'mobile',
          label: this.$t('2345face.8098e2'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('2345face.6e4f4b')
          }
        },
        {
          fieldName: 'order_id',
          label: this.$t('2345face.1e8dc2'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('2345face.e9e836')
          }
        },
        {
          fieldName: 'order_class',
          label: this.$t('2345face.5cd56b'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('2345face.249ee7'),
            options: LOCAL_ORDER_TYPE
          }
        },
        {
          fieldName: 'create_time',
          label: this.$t('2345face.56e3f8'),
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange'
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(params) {
      const { create_time, mobile, order_id, order_class, distributor_id } = this.searchParams
      const _params = {
        ...params,
        order_type: 'normal'
      }

      if (this.isSelfOrderList) {
        // 自营订单：仅线上店铺订单，对齐旧 shopList 筛选
        _params.order_class_exclude = 'drug,pointsmall'
        _params.order_holder = 'self,self_supplier'
        _params.distributor_id = 0
      } else {
        _params.order_class_exclude = 'community'
        _params.is_distribution = 1
      }

      if (create_time && create_time.length > 0) {
        const start = create_time[0]
        const end = create_time[1]
        _params.time_start_begin =
          typeof start?.getTime === 'function' ? start.getTime() / 1000 : start / 1000
        _params.time_start_end =
          typeof end?.getTime === 'function' ? end.getTime() / 1000 : end / 1000
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
    handleSearch() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
