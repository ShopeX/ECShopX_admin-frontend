<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
</style>

<template>
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" :label="$t('bea3f44a.1cadc0')">
          <el-input v-model="queryForm.name" :placeholder="$t('bea3f44a.51260a')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="display_time_begin" :label="$t('bea3f44a.3e77c2')">
          <el-date-picker
            v-model="queryForm.display_time_begin"
            type="date"
            :placeholder="$t('bea3f44a.2bebdd')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="datetime" :label="$t('bea3f44a.639213')" size="max">
          <el-date-picker
            v-model="queryForm.datetime"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('bea3f44a.981cbe')"
            :start-placeholder="$t('bea3f44a.b44c0f')"
            :end-placeholder="$t('bea3f44a.1d468b')"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="enterprise_id" :label="$t('bea3f44a.a49095')" size="max">
          <el-select
            v-model="queryForm.enterprise_id"
            v-scroll="() => pagesQuery.nextPage()"
            multiple
            :placeholder="$t('bea3f44a.708c9d')"
          >
            <el-option
              v-for="(item, index) in enterpriseList"
              :key="`enterprise-item__${index}`"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" :label="$t('bea3f44a.16f2bc')">
          <SpSelectShop
            v-model="queryForm.distributor_id"
            clearable
            :placeholder="$t('bea3f44a.708c9d')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="createActivity">
          {{ $t('bea3f44a.adc8df') }}
        </el-button>
      </div>

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
    </SpPage>
  </SpRouterView>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import { createSetting } from '@shopex-ui/finder'
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
      enterpriseList: []
    }
  },
  computed: {
    activityStatus() {
      return [
        { title: this.$t('bea3f44a.a8b0c2'), value: 'all' },
        { title: this.$t('bea3f44a.dd4e55'), value: 'not_started' },
        { title: this.$t('bea3f44a.7e19ab'), value: 'warm_up' },
        { title: this.$t('bea3f44a.fb852f'), value: 'ongoing' },
        { title: this.$t('bea3f44a.a2d930'), value: 'pending' },
        { title: this.$t('bea3f44a.2111cc'), value: 'cancel' },
        { title: this.$t('bea3f44a.047fab'), value: 'over' }
      ]
    },
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('bea3f44a.95b351'),
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
                this.$router.push({ path: this.matchRoutePath('create/') + row.id })
              }
            }
          },
          {
            name: this.$t('bea3f44a.607e7a'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'cancel' || row.status == 'over'
            },
            action: {
              handler: async ([row]) => {
                this.$router.push({ path: this.matchRoutePath('create/') + row.id })
              }
            }
          },
          {
            name: this.$t('bea3f44a.9897d8'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({
                  path:
                    this.matchRoutePath('goods/') + `${row.id}?distributor_id=${row.distributor_id}`
                })
              }
            }
          },
          {
            name: this.$t('bea3f44a.0a822f'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({ path: this.matchRoutePath('dependents/') + row.id })
              }
            }
          },
          {
            name: this.$t('bea3f44a.35420b'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                // const preUrl = this.$route.path.replace('/marketing/employee/purchase','')
                this.$router.push({
                  path: `${
                    IS_DISTRIBUTOR() ? '/shopadmin' : ''
                  }/applications/enterprise-purchase/activity-order?activity_id=${row.id}`
                })
              }
            }
          },
          {
            name: this.$t('bea3f44a.625fb2'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'not_started'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('bea3f44a.f14703'), this.$t('bea3f44a.02d981'))
                await this.$api.marketing.cancelPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('bea3f44a.de86a4'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'warm_up'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('bea3f44a.93acf6'), this.$t('bea3f44a.02d981'))
                await this.$api.marketing.aheadPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('bea3f44a.a3e3b8'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'pending'
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('bea3f44a.93acf6'), this.$t('bea3f44a.02d981'))
                await this.$api.marketing.activePurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('bea3f44a.8d63ef'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'ongoing' && !(this.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('bea3f44a.687c58'), this.$t('bea3f44a.02d981'))
                await this.$api.marketing.pendingPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('bea3f44a.12f1d7'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return (
                (row.status == 'warm_up' || row.status == 'pending' || row.status == 'ongoing') &&
                !(this.IS_ADMIN() && row.distributor_id != '0')
              )
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('bea3f44a.263e04'), this.$t('bea3f44a.02d981'))
                await this.$api.marketing.endPurchaseActivity(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: this.$t('bea3f44a.39834b'), key: 'name', width: 180 },
          {
            name: this.$t('bea3f44a.ed13b6'),
            key: 'employee_limitfee',
            width: '120',
            formatter: (value, row, col) => {
              return value > 0 ? value / 100 : 0
            }
          },
          {
            name: this.$t('bea3f44a.085938'),
            key: 'relative_limitfee',
            width: '120',
            formatter: (value, row, col) => {
              return value > 0 ? value / 100 : 0
            }
          },
          {
            name: this.$t('bea3f44a.c9dc32'),
            key: 'display_time',
            width: '220',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: this.$t('bea3f44a.53cc55'),
            key: 'distributor_name'
          },
          {
            name: this.$t('bea3f44a.059c1e'),
            key: 'employee_end_time',
            width: '320',
            formatter: (value, { employee_end_time, employee_begin_time }, col) => {
              return `${moment(employee_begin_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )} ~ ${moment(employee_end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          },
          {
            name: this.$t('bea3f44a.3fea7c'),
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
      this.$router.push({ path: this.matchRoutePath('create') })
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
