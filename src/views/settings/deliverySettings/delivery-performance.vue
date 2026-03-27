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
      belonginStore: [],
      belongingMerchant: []
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'time',
          label: this.$t('92dbc73e.77cccc'),
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange',
            startPlaceholder: this.$t('92dbc73e.b44c0f'),
            endPlaceholder: this.$t('92dbc73e.1d468b'),
            defaultTime: ['00:00:00', '23:59:59'],
            valueFormat: 'timestamp',
            size: 'default',
            clearable: true
          }
        },
        {
          fieldName: 'delivery_staff_name',
          label: this.$t('92dbc73e.9b3489'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('92dbc73e.c6c579'),
            size: 'default'
          }
        },
        {
          fieldName: 'delivery_staff_mobile',
          label: this.$t('92dbc73e.8098e2'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('92dbc73e.8098e2'),
            size: 'default'
          }
        },
        {
          fieldName: 'distributor_id',
          label: this.$t('92dbc73e.baad7e'),
          component: (context) => {
            const { value, props, onInput, h } = context
            return h('SpSelectShop', {
              props: {
                value,
                clearable: true,
                placeholder: this.$t('92dbc73e.708c9d'),
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
      ]
    },
    setting() {
      return {
        columns: [
          { name: this.$t('92dbc73e.fb92e9'), key: 'staff_no', width: 110 },
          { name: this.$t('92dbc73e.9b3489'), key: 'username', width: 110 },
          { name: this.$t('92dbc73e.8098e2'), key: 'mobile', width: 130 },
          {
            name: this.$t('92dbc73e.baad7e'),
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
            name: this.$t('92dbc73e.737477'),
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return (
                <span>
                  {row.payment_method === 'order'
                    ? this.$t('92dbc73e.ed776f')
                    : this.$t('92dbc73e.705abf')}
                </span>
              )
            }
          },
          { name: this.$t('92dbc73e.cb60c1'), key: 'user_count', width: 110 },
          { name: this.$t('92dbc73e.24b4bb'), key: 'order_count', width: 110 },
          {
            name: this.$t('92dbc73e.86ac6f'),
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
            name: this.$t('92dbc73e.b1862e'),
            key: 'total_fee_count',
            render: (h, { row }) => {
              return <span>{row.total_fee_count / 100}</span>
            }
          },
          {
            name: this.$t('92dbc73e.d355df'),
            key: 'self_delivery_fee_count',
            render: (h, { row }) => {
              return <span>{row.self_delivery_fee_count / 100}</span>
            }
          },
          {
            name: this.$t('92dbc73e.04dbf8'),
            width: 110,
            key: 'staff_type',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_type === 'platform'
                    ? this.$t('92dbc73e.498128')
                    : row.staff_type === 'distributor'
                    ? this.$t('92dbc73e.295713')
                    : this.$t('92dbc73e.0f09a8')}
                </span>
              )
            }
          },
          {
            name: this.$t('92dbc73e.95a141'),
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_attribute === 'full_time'
                    ? this.$t('92dbc73e.63f85b')
                    : this.$t('92dbc73e.7c4f46')}
                </span>
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('92dbc73e.55405e'),
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
                    message: this.$t('92dbc73e.3e1ddd')
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
                    message: this.$t('92dbc73e.89ae53')
                  })
                  return
                }
              }
            }
          }
        ]
      }
    }
  },
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
