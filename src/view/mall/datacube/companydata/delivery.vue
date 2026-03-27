<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm class="sp-filter-form" :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="time" :label="$t('b2f40ed3.3b5dd4')" size="max">
        <el-date-picker
          v-model="params.time"
          type="datetimerange"
          :start-placeholder="$t('b2f40ed3.b44c0f')"
          :end-placeholder="$t('b2f40ed3.1d468b')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_staff_name" :label="$t('b2f40ed3.e39850')">
        <el-input v-model="params.delivery_staff_name" :placeholder="$t('b2f40ed3.c6c579')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_staff_mobile" :label="$t('b2f40ed3.ce2bf3')">
        <el-input v-model="params.delivery_staff_mobile" :placeholder="$t('b2f40ed3.8098e2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" :label="$t('b2f40ed3.1861bc')">
        <SpSelectShop
          v-model="params.distributor_id"
          clearable
          :placeholder="$t('b2f40ed3.708c9d')"
        />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem prop="merchant_id" label="所属商家:">
        <el-select v-model="params.merchant_id" filterable placeholder="请选择">
          <el-option
            v-for="item in belongingMerchant"
            :key="item.id"
            :label="item.merchant_name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem> -->
    </SpFilterForm>

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
import { i18n } from '@/i18n'
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
      setting: {
        columns: [
          { name: i18n.t('b2f40ed3.fb92e9'), key: 'staff_no', width: 110 },
          { name: i18n.t('b2f40ed3.9b3489'), key: 'username', width: 110 },
          { name: i18n.t('b2f40ed3.ce2bf3'), key: 'mobile', width: 130 },
          {
            name: i18n.t('b2f40ed3.baad7e'),
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
            name: i18n.t('b2f40ed3.737477'),
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return (
                <span>
                  {row.payment_method === 'order'
                    ? i18n.t('b2f40ed3.ed776f')
                    : i18n.t('b2f40ed3.705abf')}
                </span>
              )
            }
          },
          { name: i18n.t('b2f40ed3.cb60c1'), key: 'user_count', width: 110 },
          { name: i18n.t('b2f40ed3.24b4bb'), key: 'order_count', width: 110 },
          {
            name: i18n.t('b2f40ed3.86ac6f'),
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
            name: i18n.t('b2f40ed3.b1862e'),
            key: 'total_fee_count',
            render: (h, { row }) => {
              return <span>{row.total_fee_count / 100}</span>
            }
          },
          {
            name: i18n.t('b2f40ed3.d355df'),
            key: 'self_delivery_fee_count',
            render: (h, { row }) => {
              return <span>{row.self_delivery_fee_count / 100}</span>
            }
          },
          {
            name: i18n.t('b2f40ed3.04dbf8'),
            width: 110,
            key: 'staff_type',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_type === 'platform'
                    ? i18n.t('b2f40ed3.498128')
                    : row.staff_type === 'distributor'
                    ? i18n.t('b2f40ed3.295713')
                    : i18n.t('b2f40ed3.0f09a8')}
                </span>
              )
            }
          },
          {
            name: i18n.t('b2f40ed3.95a141'),
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_attribute === 'full_time'
                    ? i18n.t('b2f40ed3.63f85b')
                    : i18n.t('b2f40ed3.7c4f46')}
                </span>
              )
            }
          }
        ],
        actions: [
          {
            name: i18n.t('b2f40ed3.066ffd'),
            key: 'add',
            type: 'button',
            slot: 'header',
            buttonType: 'primary',
            action: {
              handler: async (val) => {
                let params = {
                  page: 1,
                  pageSize: 20,
                  type: 'delivery_staffdata',
                  ...this.params,
                  start: this.params.time.length ? this.params.time[0] / 1000 : '',
                  end: this.params.time.length ? this.params.time[1] / 1000 : ''
                }
                let response = await this.$api.trade.datacubeDeliverystaffdataExport(params)
                if (response.status) {
                  this.$message({
                    type: 'success',
                    message: i18n.t('b2f40ed3.3e1ddd')
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
                    message: i18n.t('b2f40ed3.89ae53')
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
  watch: {},
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
      const _params = {
        ...params,
        ...this.params,
        start: this.params.time.length ? this.params.time[0] / 1000 : '',
        end: this.params.time.length ? this.params.time[1] / 1000 : ''
      }
      delete _params.time
      return _params
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 10px;
}
</style>
