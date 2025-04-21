<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
</style>
<style lang="scss">
.activity-status-tabs {
  .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="createActivity">
        新建活动
      </el-button>
    </div>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name" label="活动名称:">
        <el-input v-model="queryForm.name" placeholder="活动名称关键词" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="display_time_begin" label="预热时间:">
        <el-date-picker v-model="queryForm.display_time_begin" type="date" placeholder="选择日期" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="datetime" label="购买时间:" size="max">
        <el-date-picker
          v-model="queryForm.datetime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_id" label="参与企业:" size="max">
        <el-select
          v-model="queryForm.enterprise_id"
          v-scroll="() => pagesQuery.nextPage()"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in enterpriseList"
            :key="`enterprise-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" label="来源店铺:">
        <SpSelectShop v-model="queryForm.distributor_id" clearable placeholder="请选择" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-tabs
      v-model="queryForm.activityState"
      class="activity-status-tabs"
      type="card"
      @tab-click="onSearch"
    >
      <el-tab-pane
        v-for="item in activityStatus"
        :key="item.value"
        :label="item.title"
        :name="item.value"
      />
    </el-tabs>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/employeepurchase/activities"
    />
  </div>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import { createSetting } from '@shopex/finder'
import { IS_DISTRIBUTOR } from '@/utils'
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      queryForm: {
        name: '',
        display_time_begin: '',
        datetime: [],
        enterprise_id: [],
        activityState: 'all',
        distributor_id: ''
      },
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      enterpriseList: [],
      activityStatus: [
        { title: '全部', value: 'all' },
        { title: '未开始', value: 'not_started' },
        { title: '预热中', value: 'warm_up' },
        { title: '进行中', value: 'ongoing' },
        { title: '已暂停', value: 'pending' },
        { title: '已取消', value: 'cancel' },
        { title: '已结束', value: 'over' }
      ],
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              // 平台端 来源店铺非平台则隐藏
              return (
                row.status != 'cancel' &&
                row.status != 'over' &&
                !(this.IS_ADMIN() && row.distributor_id != '0')
              )
            },
            action: {
              handler: async ([row]) => {
                this.$router.push({ path: this.matchHidePage('create/') + row.id })
              }
            }
          },
          {
            name: '查看',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'cancel' || row.status == 'over'
            },
            action: {
              handler: async ([row]) => {
                this.$router.push({ path: this.matchHidePage('create/') + row.id })
              }
            }
          },
          {
            name: '商品',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({
                  path:
                    this.matchHidePage('goods/') + `${row.id}?distributor_id=${row.distributor_id}`
                })
              }
            }
          },
          {
            name: '亲友数据',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({ path: this.matchHidePage('dependents/') + row.id })
              }
            }
          },
          {
            name: '活动订单',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                // const preUrl = this.$route.path.replace('/marketing/employee/purchase','')
                this.$router.push({
                  path: `${
                    IS_DISTRIBUTOR() ? '/shopadmin' : ''
                  }/applications/ec/purchaseorder?activity_id=${row.id}`
                })
              }
            }
          },
          {
            name: '取消',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'not_started'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认取消？`, '提示')
                await this.$api.marketing.cancelPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '提前开始',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'warm_up'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认开始？`, '提示')
                await this.$api.marketing.aheadPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '开始',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'pending'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认开始？`, '提示')
                await this.$api.marketing.activePurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '暂停',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              // 平台端 来源店铺非平台则隐藏
              return row.status == 'ongoing' && !(this.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认暂停？`, '提示')
                await this.$api.marketing.pendingPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '结束',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              // 平台端 来源店铺非平台则隐藏
              return (
                (row.status == 'warm_up' || row.status == 'pending' || row.status == 'ongoing') &&
                !(this.IS_ADMIN() && row.distributor_id != '0')
              )
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认结束？`, '提示')
                await this.$api.marketing.endPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: '活动名称', key: 'name', width: 180 },
          {
            name: '员工额度（元）',
            key: 'employee_limitfee',
            width: '120',
            formatter: (value, row, col) => {
              return value > 0 ? value / 100 : 0
            }
          },
          {
            name: '亲友额度（元）',
            key: 'relative_limitfee',
            width: '120',
            formatter: (value, row, col) => {
              return value > 0 ? value / 100 : 0
            }
          },
          {
            name: '预热时间',
            key: 'display_time',
            width: '220',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '来源店铺',
            key: 'distributor_name'
          },
          {
            name: '购买时间',
            key: 'employee_end_time',
            width: '320',
            formatter: (value, { employee_end_time, employee_begin_time }, col) => {
              return `${moment(employee_begin_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )} ~ ${moment(employee_end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          },
          {
            name: '状态',
            key: 'status_desc'
          }
        ]
      })
    }
  },
  created() {
    this.pagesQuery = new Pages({
      fetch: this.getEnterpriseList
    }).nextPage()
  },
  methods: {
    beforeSearch(params) {
      const {
        name,
        display_time_begin,
        datetime: [buy_time_begin, buy_time_end],
        enterprise_id,
        distributor_id,
        activityState
      } = this.queryForm
      params = {
        ...params,
        enterprise_id,
        distributor_id,
        name
      }
      if (display_time_begin) {
        params = {
          ...params,
          display_time_begin: moment(display_time_begin).unix()
        }
      }
      if (buy_time_begin) {
        params = {
          ...params,
          buy_time_begin: moment(buy_time_begin).unix()
        }
      }
      if (buy_time_end) {
        params = {
          ...params,
          buy_time_end: moment(buy_time_end).unix()
        }
      }
      if (activityState != 'all') {
        params = {
          ...params,
          status: activityState
        }
      }
      return params
    },
    onSearch() {
      this.$refs['finder'].refresh()
    },
    createActivity() {
      this.$router.push({ path: this.matchHidePage('create') })
    },
    async getEnterpriseList({ page, pageSize }) {
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.enterpriseList = this.enterpriseList.concat(list)
    }
  }
}
</script>
