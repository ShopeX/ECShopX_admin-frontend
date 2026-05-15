<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="sp-export-log-page">
    <div class="content-bottom-padded export-log-alert-wrap">
      <el-alert type="info" :title="$t('cb7af8ae.d42828')" show-icon>
        <div>{{ $t('cb7af8ae.7de565') }}</div>
      </el-alert>
    </div>
    <div ref="exportTieredNav" class="export-log-tiered-nav">
      <el-tabs v-model="activeGroupName" class="group-tabs export-tier-1" @tab-click="handleGroupClick">
        <el-tab-pane
          v-for="group in exportGroups"
          :key="group.name"
          :label="group.label"
          :name="group.name"
        />
      </el-tabs>
      <div class="export-log-tier-1-caret" :style="tier1CaretStyle" aria-hidden="true" />
      <el-tabs v-model="activeName" class="detail-tabs export-tier-2" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in currentExportTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      />
      <el-table v-loading="loading" :data="exportLogLists" :height="wheight - 260">
        <el-table-column :label="$t('cb7af8ae.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="text" @click.prevent="handleDown(scope.row)">
              {{ $t('cb7af8ae.f26ef9') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="log_id" label="ID" />
        <el-table-column prop="file_name" :label="$t('cb7af8ae.d2e256')" />
        <el-table-column prop="finish_date" :label="$t('cb7af8ae.475dea')" />
        <el-table-column prop="handle_status" :label="$t('cb7af8ae.21b314')">
          <template slot-scope="scope">
            <span v-if="scope.row.handle_status == 'wait'">{{ $t('cb7af8ae.1e57c1') }}</span>
            <span v-if="scope.row.handle_status == 'finish'">{{ $t('cb7af8ae.7be39b') }}</span>
            <span v-if="scope.row.handle_status == 'processing'">{{ $t('cb7af8ae.5d459d') }}</span>
            <span v-if="scope.row.handle_status == 'fail'">{{ $t('cb7af8ae.1012e0') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
      </el-tabs>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { ExportLogList, ExportLogFileDown } from '../../../api/trade'
export default {
  props: ['getStatus'],
  data() {
    return {
      // activeName: this.$store.getters.login_type == 'dealer' ? 'adapay_tradedata' : 'member',
      activeGroupName: '',
      activeName: '',
      create_time: '',
      exportLogLists: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        export_type: '',
        time_start_begin: '',
        time_start_end: ''
      },
      tier1CaretStyle: {
        display: 'none'
      }
    }
  },
  mounted() {
    this.activeTabHandler()
    window.addEventListener('resize', this.updateTier1CaretPosition)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateTier1CaretPosition)
  },
  computed: {
    ...mapGetters(['wheight']),
    exportGroups() {
      const groups = []
      const commonMarketingTabs = [
        { label: this.$t('cb7af8ae.d8defc'), name: 'popularize' },
        { label: this.$t('cb7af8ae.398e76'), name: 'popularizeStatic' },
        { label: this.$t('cb7af8ae.7d75ec'), name: 'popularizeOrder' }
      ]
      if (this.$store.getters.login_type == 'dealer') {
        const financeTabs = []
        if (!this.VERSION_SHUYUN()) {
          financeTabs.push({ label: this.$t('cb7af8ae.355262'), name: 'adapay_tradedata' })
        }
        groups.push(
          { name: 'finance', label: '财务导出', tabs: financeTabs },
          { name: 'marketing', label: '营销导出', tabs: commonMarketingTabs }
        )
      } else if (this.$store.getters.login_type == 'merchant') {
        const orderTabs = [
          { label: this.$t('cb7af8ae.c7af0d'), name: 'normal_master_order' },
          { label: this.$t('cb7af8ae.97e27a'), name: 'normal_order' },
          { label: this.$t('cb7af8ae.12f70e'), name: 'invoice' },
          { label: this.$t('cb7af8ae.f12320'), name: 'aftersale_record_count' },
          { label: this.$t('cb7af8ae.523cb3'), name: 'refund_record_count' }
        ]
        const goodsTabs = [
          { label: this.$t('cb7af8ae.d012d9'), name: 'goods_data' },
          { label: this.$t('cb7af8ae.f83133'), name: 'items' },
          { label: this.$t('cb7af8ae.9bb27d'), name: 'normal_items_tag' },
          { label: this.$t('cb7af8ae.480b38'), name: 'itemcode' }
        ]
        const financeTabs = [{ label: this.$t('cb7af8ae.c67ce6'), name: 'tradedata' }]
        if (!this.VERSION_SHUYUN()) {
          financeTabs.push(
            { label: this.$t('cb7af8ae.75a79c'), name: 'statements' },
            { label: this.$t('cb7af8ae.f7f2df'), name: 'statement_details' }
          )
        }
        const marketingTabs = commonMarketingTabs.concat([
          { label: this.$t('cb7af8ae.41356e'), name: 'export_luckdraw_log' },
          { label: this.$t('cb7af8ae.03c9b1'), name: 'delivery_staffdata' }
        ])
        groups.push(
          { name: 'order', label: '订单售后', tabs: orderTabs },
          { name: 'goods', label: '商品导出', tabs: goodsTabs },
          { name: 'finance', label: '财务导出', tabs: financeTabs },
          { name: 'marketing', label: '营销导出', tabs: marketingTabs }
        )
      } else {
        const memberTabs = [
          { label: this.$t('cb7af8ae.e9cc0a'), name: 'member' },
          { label: this.$t('cb7af8ae.1be670'), name: 'member_point_logs' },
          { label: this.$t('cb7af8ae.fa1b9f'), name: 'distributor_white_list' },
          { label: this.$t('cb7af8ae.d04e78'), name: 'employee_purchase_employees' },
          { label: '活动码导出', name: 'employee_purchase_activity_qrcode' },
          { label: '扫码统计导出', name: 'employee_purchase_activity_scan_stats' }
        ]
        const orderTabs = [
          { label: this.$t('cb7af8ae.8045f7'), name: 'normal_master_order' },
          { label: this.$t('cb7af8ae.b8ffd8'), name: 'normal_order' },
          { label: this.$t('cb7af8ae.daa8e0'), name: 'normal_community_order' },
          { label: this.$t('cb7af8ae.75bfab'), name: 'aftersale_record_count' },
          { label: this.$t('cb7af8ae.ae300f'), name: 'refund_record_count' },
          { label: this.$t('cb7af8ae.e222a6'), name: 'offline_payment' }
        ]
        if (!this.VERSION_IN_PURCHASE()) {
          orderTabs.push({ label: this.$t('cb7af8ae.3c04c9'), name: 'invoice' })
        }
        const goodsTabs = [
          { label: this.$t('cb7af8ae.d012d9'), name: 'goods_data' },
          { label: this.$t('cb7af8ae.f83133'), name: 'items' },
          { label: this.$t('cb7af8ae.e2ace4'), name: 'supplier_goods' },
          { label: this.$t('cb7af8ae.480b38'), name: 'itemcode' }
        ]
        if (!this.VERSION_IN_PURCHASE()) {
          goodsTabs.push(
            { label: this.$t('cb7af8ae.5f46b0'), name: 'distributor_items' },
            { label: this.$t('cb7af8ae.42ff32'), name: 'pointsmallitems' }
          )
        }
        const financeTabs = [
          { label: this.$t('cb7af8ae.b8338a'), name: 'bspay_withdraw' },
          { label: '交易单导出', name: 'tradedata' },
          { label: this.$t('cb7af8ae.c97d08'), name: 'hfpay_trade_record' },
          { label: this.$t('cb7af8ae.b8338a'), name: 'hfpay_withdraw_record' },
          { label: this.$t('cb7af8ae.443bfc'), name: 'bspay_tradedata' }
        ]
        if (!this.VERSION_SHUYUN()) {
          financeTabs.push(
            { label: this.$t('cb7af8ae.3f1191'), name: 'chinaums_division' },
            { label: this.$t('cb7af8ae.d5fc54'), name: 'salesreport_financial' },
            { label: this.$t('cb7af8ae.355262'), name: 'adapay_tradedata' },
            { label: this.$t('cb7af8ae.75a79c'), name: 'statements' },
            { label: this.$t('cb7af8ae.f7f2df'), name: 'statement_details' }
          )
        }
        const marketingTabs = commonMarketingTabs.concat([
          { label: this.$t('cb7af8ae.41356e'), name: 'export_luckdraw_log' }
        ])
        const otherTabs = [{ label: this.$t('cb7af8ae.03c9b1'), name: 'delivery_staffdata' }]
        if (!this.VERSION_IN_PURCHASE()) {
          otherTabs.push({ label: this.$t('cb7af8ae.972304'), name: 'selform_registration_record' })
        }
        if (this.IS_SUPPLIER()) {
          otherTabs.push({ label: this.$t('cb7af8ae.c7af0d'), name: 'supplier_order' })
        }
        groups.push(
          { name: 'member', label: '会员与企业内购', tabs: memberTabs },
          { name: 'order', label: '订单售后', tabs: orderTabs },
          { name: 'goods', label: '商品导出', tabs: goodsTabs },
          { name: 'finance', label: '财务导出', tabs: financeTabs },
          { name: 'marketing', label: '营销导出', tabs: marketingTabs },
          { name: 'other', label: '其他', tabs: otherTabs }
        )
      }
      return groups
        .map((group) => ({
          ...group,
          tabs: group.tabs.filter(Boolean)
        }))
        .filter((group) => group.tabs.length > 0)
    },
    currentExportTabs() {
      const activeGroup = this.exportGroups.find((group) => group.name === this.activeGroupName)
      return activeGroup ? activeGroup.tabs : []
    }
  },
  methods: {
    updateTier1CaretPosition() {
      this.$nextTick(() => {
        const nav = this.$refs.exportTieredNav
        if (!nav || typeof nav.getBoundingClientRect !== 'function') {
          return
        }
        const active = nav.querySelector('.export-tier-1 .el-tabs__item.is-active')
        const header = nav.querySelector('.export-tier-1 .el-tabs__header')
        if (!active || !header) {
          this.tier1CaretStyle = { display: 'none' }
          return
        }
        const navRect = nav.getBoundingClientRect()
        const tabRect = active.getBoundingClientRect()
        const headerRect = header.getBoundingClientRect()
        const cx = tabRect.left + tabRect.width / 2 - navRect.left
        const lineY = headerRect.bottom - navRect.top
        this.tier1CaretStyle = {
          display: 'block',
          left: `${cx}px`,
          top: `${lineY}px`,
          transform: 'translate(-50%, -3px)',
          zIndex: 30
        }
      })
    },
    getDefaultTabByLoginType() {
      const active = this.$store.getters.login_type
      if (active == 'dealer') {
        return 'adapay_tradedata'
      }
      if (active == 'merchant') {
        return 'normal_master_order'
      }
      return 'member'
    },
    findGroupByTab(tabName) {
      return this.exportGroups.find((group) => group.tabs.some((tab) => tab.name === tabName))
    },
    activeTabHandler() {
      const { tab } = this.$route.query
      let targetTab = tab || this.getDefaultTabByLoginType()
      let group = this.findGroupByTab(targetTab)

      if (!group) {
        group = this.exportGroups[0]
        targetTab = group && group.tabs[0] ? group.tabs[0].name : ''
      }
      this.activeGroupName = group ? group.name : ''
      this.activeName = targetTab

      // 设置完 activeName 后立即获取导出列表
      this.$nextTick(() => {
        if (this.activeName) {
          this.getExportLogLists(this.params)
        }
        this.updateTier1CaretPosition()
      })
    },
    // 切换一级分类
    handleGroupClick(tab) {
      this.activeGroupName = tab.name
      const currentTabs = this.currentExportTabs
      if (!currentTabs.some((item) => item.name === this.activeName)) {
        this.activeName = currentTabs[0] ? currentTabs[0].name : ''
      }
      this.params.page = 1
      if (this.activeName) {
        this.getExportLogLists(this.params)
      }
      this.updateTier1CaretPosition()
    },
    // 切换tab
    handleClick(tab) {
      this.activeName = tab.name
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getExportLogLists(this.params)
    },
    dataSearch() {
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    getExportLogLists(params) {
      this.loading = true
      params.export_type = this.activeName
      ExportLogList(params).then((response) => {
        this.exportLogLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    handleDown({ log_id, file_url }) {
      if (this.activeName == 'itemcode' || this.activeName == 'normal_community_order') {
        window.open(file_url)
        return
      }

      ExportLogFileDown({ log_id: log_id }).then((response) => {
        const url = this.genUrl(response.data.data.csv_data, {}) //{}指的是表头，response.data.data.csv_data是后台返回来的数据
        const a = document.createElement('a')
        a.href = url
        a.download = response.data.data.file_name
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    genUrl(encoded, options) {
      const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' }) //返回的格式
      return window.URL.createObjectURL(dataBlob)
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getExportLogLists(this.params)
      }
    },
    activeGroupName() {
      this.updateTier1CaretPosition()
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.text-muted {
  color: #999;
}

.export-log-alert-wrap {
  margin-bottom: 5px;
}

/* 两级导出分类：参考工作台 / 子页 — 一级下三角 + 二级下划线 */
.export-log-tiered-nav {
  position: relative;
  margin-bottom: 4px;
  overflow: visible;
}

/* 一级无业务内容，收起 content 避免挡住下方表格 */
.export-log-tiered-nav ::v-deep .export-tier-1 {
  position: relative;
}

.export-log-tiered-nav ::v-deep .export-tier-1 .el-tabs__content {
  height: 0;
  min-height: 0;
  margin: 0;
  padding: 0 !important;
  overflow: hidden;
  border: none;
  pointer-events: none;
}

.export-log-tiered-nav ::v-deep .export-tier-1 > .el-tabs__header {
  position: relative;
  margin: 0;
  border: none;
}

.export-log-tiered-nav ::v-deep .export-tier-1 .el-tabs__nav-wrap::after {
  display: none;
}

.export-log-tiered-nav ::v-deep .export-tier-1 .el-tabs__active-bar {
  display: none;
}

.export-log-tiered-nav ::v-deep .export-tier-1 .el-tabs__item {
  position: relative;
  height: 44px;
  line-height: 44px;
  padding: 0 20px 8px;
  font-size: 14px;
  color: #606266;
}

.export-log-tiered-nav ::v-deep .export-tier-1 .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 500;
  background-color: #ecf5ff;
  border-radius: 6px 6px 0 0;
}

/* 倒三角：独立浮动层，避免被二级 el-tabs 盖住（::after 在同兄弟树下无法压过后整块二级） */
.export-log-tier-1-caret {
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #409eff;
  pointer-events: none;
}

.export-log-tiered-nav ::v-deep .export-tier-2 > .el-tabs__header {
  position: relative;
  margin: 0;
  padding: 6px 8px 0;
  border-top: 1px solid #ebeef5;
  background: #fff;
}

.export-log-tiered-nav ::v-deep .export-tier-2 .el-tabs__nav-wrap::after {
  display: none;
}

.export-log-tiered-nav ::v-deep .export-tier-2 .el-tabs__item {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  font-size: 13px;
  color: #606266;
}

.export-log-tiered-nav ::v-deep .export-tier-2 .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 500;
}

/* 二级选中：粗下划线 */
.export-log-tiered-nav ::v-deep .export-tier-2 .el-tabs__active-bar {
  height: 3px;
  border-radius: 2px 2px 0 0;
  background-color: #409eff;
}

.export-log-tiered-nav ::v-deep .export-tier-2 > .el-tabs__content {
  padding: 0 12px 12px;
}
</style>
