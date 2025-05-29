<template>
  <div>
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="/discountcard/get_user_coupon_list"
        fixed-row-action
        row-actions-width="50px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:tableTop>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="exportHandle">导出</el-button>
            <el-button type="primary" plain @click="loseHandle">作废发放</el-button>
          </div>
        </template>
      </SpFinder>

      <SpDrawer
        v-model="showLogInfoDrawer"
        class="config-drawer"
        :title="'日志'"
        :footer="false"
        :width="800"
      >
        <SpFinder
          ref="finder"
          fixed-row-action
          no-selection
          :data="logInfoData"
          :setting="logTableSchema"
          row-actions-fixed-align="left"
          :show-pager="false"
        />
      </SpDrawer>

      <SpDialog
        ref="loseDialog"
        v-model="loseDialogShow"
        title="作废优惠券发放"
        :modal="false"
        class="base-form"
        :form="loseForm"
        :form-list="loseRuleList"
        @onSubmit="onLoseFormSubmit"
      />
    </SpRouterView>
  </div>
</template>

<script>
import { createTableSchema, createLogTableSchema, loseFormSchema } from './logSchema'
import api from '@/api'
import moment from 'moment'

export default {
  data() {
    return {
      areas: [],
      showLogInfoDrawer: false, // 日志信息抽屉
      logInfoData: [], // 日志信息
      loseDialogShow: false, // 作废发放
      loseForm: {
        lose_reason: ''
      },
      selectedCouponIds: []
    }
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
    },
    logTableSchema() {
      return createLogTableSchema(this)
    },
    loseRuleList() {
      return loseFormSchema(this)
    }
  },
  mounted() {
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
  },
  methods: {
    refreshTable() {
      this.$refs.finder.refresh()
    },
    handleSelectionChange(selection) {
      this.selectedCouponIds = selection
    },
    // 导出
    exportHandle() {
      api.cardticket.exportUserCouponList(this.searchParams).then((res) => {
        const { status, url, filename } = res
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('user_coupon')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    // 作废
    loseHandle() {
      console.log(this.selectedCouponIds)
      if (this.selectedCouponIds.length === 0) {
        this.$message.warning('请选择要作废的优惠券')
        return
      }
      this.loseDialogShow = true
      this.loseForm.lose_reason = ''
    },
    // 查看日志
    showLogInfo(row) {
      api.cardticket
        .getUserCouponLogs({
          code: row.user_card_code,
          page: 1,
          page_size: 1000
        })
        .then((res) => {
          this.logInfoData = res?.list
          this.showLogInfoDrawer = true
        })
    },
    onLoseFormSubmit() {
      api.cardticket
        .cancelUserCoupon({
          coupon_ids: this.selectedCouponIds?.map((el) => el.card_id).join(','),
          cancel_reason: this.loseForm.lose_reason
        })
        .then((res) => {
          if (res.status) {
            this.$message.success('作废成功')
            this.loseDialogShow = false
            this.refreshTable()
          }
        })
    },
    beforeSearch(query) {
      console.log(query)
      if (query.get_date?.length) {
        query.start_time = moment(query?.get_date[0]).format('YYYY-MM-DD')
        query.end_time = moment(query?.get_date[1]).format('YYYY-MM-DD')
      }
      this.searchParams = query
      return query
    }
  }
}
</script>

<style scoped lang="scss"></style>
