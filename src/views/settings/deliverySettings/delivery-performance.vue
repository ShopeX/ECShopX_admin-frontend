<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      v-model="params"
      form-type="searchForm"
      :form-items="formItems"
      @submit="onSearch"
      @reset="onSearch"
      :inline="true"
    />

    <SpFinder
      ref="finder"
      url="/datacube/deliverystaffdata"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />
  </SpPage>
</template>
<script>
export default {
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      params: {
        time: [],
        delivery_staff_name: '',
        delivery_staff_mobile: '',
        distributor_id: '',
        merchant_id: ''
      },
      formItems: [
        {
          fieldName: 'time',
          label: '时间筛选',
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            defaultTime: ['00:00:00', '23:59:59'],
            valueFormat: 'timestamp',
            size: 'default',
            clearable: true
          }
        },

        {
          fieldName: 'delivery_staff_name',
          label: '配送员姓名',
          component: 'input',
          componentProps: {
            placeholder: '请输入配送员姓名',
            size: 'default'
          }
        },
        {
          fieldName: 'delivery_staff_mobile',
          label: '手机号',
          component: 'input',
          componentProps: {
            placeholder: '手机号',
            size: 'default'
          }
        },
        {
          fieldName: 'distributor_id',
          label: '所属店铺',
          component: (context) => {
            const { value, props, onInput, h } = context
            return h('SpSelectShop', {
              props: {
                value,
                clearable: true,
                placeholder: '请选择',
                size: 'small',
                ...props
              },

              on: {
                input: onInput
              }
            })
          },
          componentProps: {}
        }
      ],
      setting: {
        columns: [
          { name: '配送员编号', key: 'staff_no', width: 110 },
          { name: '配送员姓名', key: 'username', width: 110 },
          { name: '手机号', key: 'mobile', width: 130 },
          {
            name: '所属店铺',
            key: 'distributor_ids',
            width: 300,
            render: (h, { row }) => {
              return (
                <div>
                  {row.distributor_ids.map((item) => {
                    return (
                      <el-tag key={item.distributor_ids} size='mini'>
                        {item.name}
                      </el-tag>
                    )
                  })}
                </div>
              )
            }
          },
          {
            name: '配送结算方式',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          { name: '配送客户数', key: 'user_count', width: 110 },
          { name: '配送订单量', key: 'order_count', width: 110 },
          {
            name: '配送单价',
            key: 'payment_method',
            render: (h, { row }) => {
              return (
                <span>
                  {row.payment_method === 'order'
                    ? row.payment_fee / 100
                    : `${row.payment_fee / 100}%`}
                </span>
              )
            }
          },
          {
            name: '订单金额',
            key: 'total_fee_count',
            render: (h, { row }) => {
              return <span>{row.total_fee_count / 100}</span>
            }
          },
          {
            name: '配送费用',
            key: 'self_delivery_fee_count',
            render: (h, { row }) => {
              return <span>{row.self_delivery_fee_count / 100}</span>
            }
          },
          {
            name: '配送员类型',
            width: 110,
            key: 'staff_type',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_type === 'platform'
                    ? '平台'
                    : row.staff_type === 'distributor'
                    ? '店铺'
                    : '商家'}
                </span>
              )
            }
          },
          {
            name: '配送员属性',
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>{row.staff_attribute === 'full_time' ? '全职' : '兼职'}</span>
            }
          }
        ],
        actions: [
          {
            name: '导出',
            key: 'add',
            type: 'button',
            slot: 'header',
            buttonType: 'primary',
            action: {
              handler: async (val) => {
                const time = this.params.time || []
                let params = {
                  page: 1,
                  pageSize: 20,
                  type: 'delivery_staffdata',
                  ...this.params,
                  start: time.length >= 2 ? time[0] / 1000 : '',
                  end: time.length >= 2 ? time[1] / 1000 : ''
                }
                let response = await this.$api.trade.datacubeDeliverystaffdataExport(params)
                if (response.status) {
                  this.$message({
                    type: 'success',
                    message: '已加入执行队列，请在设置-导出列表中下载'
                  })
                  this.$export_open(params.type)
                  return
                } else if (response.url) {
                  this.downloadUrl = response.url
                  this.downloadName = response.filename
                  this.downloadView = true
                } else {
                  this.$message({
                    type: 'error',
                    message: '无内容可导出 或 执行失败，请检查重试'
                  })
                  return
                }
              }
            }
          }
        ]
      },
      belonginStore: [],
      belongingMerchant: []
    }
  },
  computed: {},
  watch: {
    'params.time'(val) {
      if (!val) this.params.time = []
    }
  },
  mounted() {
    this.getMerchantsList()
  },
  methods: {
    async getMerchantsList() {
      let params = {
        pageSize: 1000,
        page: 1
      }
      let res1 = await this.$api.mall_marketing.getMerchantsList(params)
      this.belongingMerchant = res1.list
    },

    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      const time = this.params.time || []
      const _params = {
        ...params,
        ...this.params,
        start: time.length >= 2 ? time[0] / 1000 : '',
        end: time.length >= 2 ? time[1] / 1000 : ''
      }
      delete _params.time
      return _params
    }
  }
}
</script>

<style scoped>
::v-deep .sp-finder .el-button--primary {
  @apply mt-3 mb-3 !px-4 !py-2.5;
}
</style>
