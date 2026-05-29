<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
.stats-dialog-body {
  min-height: 120px;
}
.stats-totals {
  margin-bottom: 4px;
}
/* 标题栏右侧需为 el-dialog 关闭按钮留出位置，避免与「下载扫码统计」重叠 */
.stats-scan-dialog__title {
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  padding-right: 48px;
}
.stats-scan-dialog__title-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stats-scan-dialog__title-actions {
  flex-shrink: 0;
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

      <el-dialog
        :visible.sync="statsDialogVisible"
        custom-class="stats-scan-dialog"
        width="900px"
        append-to-body
        @closed="onStatsDialogClosed"
      >
        <div slot="title" class="stats-scan-dialog__title">
          <span class="stats-scan-dialog__title-text">{{ statsDialogTitle }}</span>
          <div class="stats-scan-dialog__title-actions">
            <el-button
              size="mini"
              type="primary"
              :loading="statsDialogLoading"
              @click="downloadStatsInDialog"
            >
              {{ $t('bea3f44a.e01a10') }}
            </el-button>
          </div>
        </div>
        <div v-loading="statsDialogLoading" class="stats-dialog-body">
          <el-descriptions v-if="statsDialogTotals" :column="3" border class="stats-totals">
            <el-descriptions-item :label="$t('bea3f44a.e01a02')">{{
              statsDialogTotals.scan_count
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('bea3f44a.e01a03')">{{
              statsDialogTotals.scan_user_count
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="statsDialogPassphraseEnabled"
              :label="$t('bea3f44a.e01a04')"
              >{{ statsDialogTotals.passphrase_verify_user_count }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('bea3f44a.e01a05')">{{
              statsDialogTotals.bind_user_count
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('bea3f44a.e01a06')">{{
              statsDialogTotals.order_user_count
            }}</el-descriptions-item>
          </el-descriptions>
          <el-table :data="statsDialogList" border stripe max-height="420" style="margin-top: 12px">
            <el-table-column
              prop="enterprise_name"
              :label="$t('bea3f44a.e01a0b')"
              min-width="140"
            />
            <el-table-column prop="enterprise_sn" :label="$t('bea3f44a.e01a0c')" min-width="120" />
            <el-table-column prop="scan_count" :label="$t('bea3f44a.e01a02')" width="100" />
            <el-table-column prop="scan_user_count" :label="$t('bea3f44a.e01a03')" width="100" />
            <el-table-column
              v-if="statsDialogPassphraseEnabled"
              prop="passphrase_verify_user_count"
              :label="$t('bea3f44a.e01a04')"
              width="120"
            />
            <el-table-column prop="bind_user_count" :label="$t('bea3f44a.e01a05')" width="100" />
            <el-table-column prop="order_user_count" :label="$t('bea3f44a.e01a06')" width="100" />
          </el-table>
        </div>
      </el-dialog>
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
      enterpriseList: [],
      statsDialogVisible: false,
      statsDialogLoading: false,
      statsDialogTitle: '',
      statsDialogActivityId: null,
      statsDialogPassphraseEnabled: false,
      statsDialogList: [],
      statsDialogTotals: null
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
            name: this.$t('bea3f44a.e01a07'),
            key: 'download_qrcode',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.downloadActivityQrcode(row)
              }
            }
          },
          {
            name: this.$t('bea3f44a.e01a08'),
            key: 'scan_stats',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.openScanStatsDialog(row)
              }
            }
          },
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
          { name: this.$t('bea3f44a.7a9e2d'), key: 'id', width: 120, fixed: 'left' },
          { name: this.$t('bea3f44a.39834b'), key: 'name', width: 180 },
          {
            name: this.$t('bea3f44a.e01a09'),
            key: 'employee_end_time',
            width: '320',
            formatter: (value, { employee_end_time, employee_begin_time }) => {
              return `${moment(employee_begin_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )} ~ ${moment(employee_end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          },
          {
            name: this.$t('bea3f44a.e01a01'),
            key: 'is_passphrase_enabled',
            width: 120,
            formatter: (value, row) => {
              const on =
                row.is_passphrase_enabled === 1 ||
                row.is_passphrase_enabled === true ||
                row.is_passphrase_enabled === '1'
              if (!on) {
                return '—'
              }
              return '按企业'
            }
          },
          {
            name: this.$t('bea3f44a.e01a02'),
            key: 'scan_count',
            width: 100
          },
          {
            name: this.$t('bea3f44a.e01a03'),
            key: 'scan_user_count',
            width: 100
          },
          {
            name: this.$t('bea3f44a.e01a04'),
            key: 'passphrase_verify_user_count',
            width: 120,
            formatter: (value, row) => {
              const on =
                row.is_passphrase_enabled === 1 ||
                row.is_passphrase_enabled === true ||
                row.is_passphrase_enabled === '1'
              return on ? value : '—'
            }
          },
          {
            name: this.$t('bea3f44a.e01a05'),
            key: 'bind_user_count',
            width: 100
          },
          {
            name: this.$t('bea3f44a.e01a06'),
            key: 'order_user_count',
            width: 100
          },
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
            name: this.$t('bea3f44a.3fea7c'),
            key: 'status_desc'
          }
        ]
      })
    }
  },
  watch: {
    $route(to, from) {
      const toPathNorm = (to.path || '').replace(/\/$/, '')
      const fromPath = (from && from.path) || ''
      // 列表根路径：应用「企业购」或旧版营销路由
      const isListRoot =
        /\/enterprise-purchase\/activity-management$/.test(toPathNorm) ||
        /\/marketing\/employee\/purchase$/.test(toPathNorm)
      // 从创建/成功/商品/亲友子页回到列表时也应拉取最新数据（否则新建活动后从商品页返回看不到新活动）
      const fromActivitySubRoute =
        /\/activity-management\/(create|result\/|goods\/|dependents\/)/.test(fromPath) ||
        /\/employee\/purchase\/(create|result\/|goods\/|dependents\/)/.test(fromPath)
      const needRefresh =
        isListRoot && (String((to.query || {}).refresh || '') === '1' || fromActivitySubRoute)
      if (needRefresh) {
        this.$nextTick(() => {
          this.$refs['finder'] && this.$refs['finder'].refresh()
        })
        // 仅当需要去掉 refresh 查询参数时再 replace，避免与当前 URL 相同触发 NavigationDuplicated（如浏览器返回）
        if (String((to.query || {}).refresh || '') === '1') {
          const { refresh, ...restQuery } = to.query || {}
          this.$router
            .replace({
              path: to.path,
              query: restQuery
            })
            .catch(() => {})
        }
      }
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
    },
    onStatsDialogClosed() {
      this.statsDialogList = []
      this.statsDialogTotals = null
      this.statsDialogPassphraseEnabled = false
      this.statsDialogActivityId = null
    },
    async downloadActivityQrcode(row) {
      try {
        const res = await this.$api.marketing.downloadActivityQrcode(row.id)
        if (res && res.status) {
          this.$message.success(this.$t('bea3f44a.e01a11'))
          this.$export_open_blank('employee_purchase_activity_qrcode')
          return
        }
        throw new Error('invalid export response')
      } catch (e) {
        this.$message.error(this.$t('bea3f44a.e01a0e'))
      }
    },
    async downloadStatsInDialog() {
      if (!this.statsDialogActivityId) {
        return
      }
      try {
        const res = await this.$api.marketing.downloadActivityEnterpriseBehaviorStats(
          this.statsDialogActivityId
        )
        if (res && res.status) {
          this.$message.success(this.$t('bea3f44a.e01a11'))
          this.$export_open_blank('employee_purchase_activity_scan_stats')
          return
        }
        throw new Error('invalid export response')
      } catch (e) {
        this.$message.error(this.$t('bea3f44a.e01a0e'))
      }
    },
    async openScanStatsDialog(row) {
      this.statsDialogTitle = `${this.$t('bea3f44a.e01a0a')} — ${row.name || ''}`
      this.statsDialogActivityId = row.id
      this.statsDialogPassphraseEnabled = !!(
        row.is_passphrase_enabled === 1 ||
        row.is_passphrase_enabled === true ||
        row.is_passphrase_enabled === '1'
      )
      this.statsDialogVisible = true
      this.statsDialogLoading = true
      this.statsDialogList = []
      this.statsDialogTotals = null
      try {
        const data = await this.$api.marketing.getActivityEnterpriseBehaviorStats(row.id)
        const list = (data && data.list) || []
        this.statsDialogList = list
        this.statsDialogTotals = list.reduce(
          (acc, r) => ({
            scan_count: acc.scan_count + (Number(r.scan_count) || 0),
            scan_user_count: acc.scan_user_count + (Number(r.scan_user_count) || 0),
            passphrase_verify_user_count:
              acc.passphrase_verify_user_count + (Number(r.passphrase_verify_user_count) || 0),
            bind_user_count: acc.bind_user_count + (Number(r.bind_user_count) || 0),
            order_user_count: acc.order_user_count + (Number(r.order_user_count) || 0)
          }),
          {
            scan_count: 0,
            scan_user_count: 0,
            passphrase_verify_user_count: 0,
            bind_user_count: 0,
            order_user_count: 0
          }
        )
      } catch (e) {
        this.statsDialogVisible = false
        const msg =
          (e && e.data && e.data.message) ||
          (e && e.data && e.data.error) ||
          (e && e.message) ||
          this.$t('bea3f44a.e01a0e')
        this.$message.error(msg)
      } finally {
        this.statsDialogLoading = false
      }
    }
  }
}
</script>
