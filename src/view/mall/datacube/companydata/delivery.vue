<template>
  <div>
    <SpFilterForm class="sp-filter-form" :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="time" label="时间筛选:" size="max">
        <el-date-picker
          v-model="params.time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_staff_name" label="配送员姓名:">
        <el-input v-model="params.delivery_staff_name" placeholder="请输入配送员姓名" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_staff_mobile" label="手机号:">
        <el-input v-model="params.delivery_staff_mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" label="所属店铺:">
        <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="merchant_id" label="所属商家:">
        <el-select v-model="params.merchant_id" filterable placeholder="请选择">
          <el-option
            v-for="item in belongingMerchant"
            :key="item.id"
            :label="item.merchant_name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
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
  </div>
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
      setting: {
        columns: [
          { name: '配送员编号', key: 'staff_no' ,width: 110,},
          { name: '配送员姓名', key: 'username' ,width: 110,},
          { name: '手机号', key: 'mobile' ,width: 130,},
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
          { name: '配送客户数', key: 'user_count' ,width: 110,},
          { name: '配送订单量', key: 'order_count' ,width: 110,},
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
          { name: '订单金额', key: 'total_fee_count' },
          { name: '配送费用', key: 'self_delivery_fee_count' },
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
            buttonType: 'primary is-plain',
            action: {
              handler: async (val) => {
                let params = {
                  page: 1,
                  pageSize: 20,
                  type: 'delivery_staffdata',
                  ...this.params
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
        start: this.params.time[0],
        end: this.params.time[1]
      }
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
