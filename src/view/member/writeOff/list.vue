<template>
  <div>
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="/discountcard/get_coupon_use_logs"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        row-actions-fixed-align="left"
        :hooks="{
          beforeSearch
        }"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @reset="resetForm"
      >
        <template v-slot:tableTop>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="exportHandle">导出</el-button>
            <el-button type="primary" plain @click="loseHandle">作废核销</el-button>
          </div>
        </template>
        <template v-slot:shop>
          <SpSelectShop v-model="formData.distributor_id" clearable placeholder="请选择店铺" />
        </template>
      </SpFinder>
      <SpDialog
        ref="loseDialog"
        v-model="loseDialogShow"
        title="作废核销记录"
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
import { createTableSchema, loseFormSchema } from './schema'
import api from '@/api'
import moment from 'moment'

export default {
  data() {
    return {
      areas: [],
      loseForm: {
        lose_reason: '',
        img: ''
      },
      formData: {
        distributor_id: ''
      },
      loseDialogShow: false // 作废发放
    }
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
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
    beforeSearch(query) {
      console.log(query)
      if (query.get_date?.length) {
        query.used_time_begin = moment(query?.get_date[0]).format('YYYY-MM-DD')
        query.used_time_begin = moment(query?.get_date[1]).format('YYYY-MM-DD')
      }
      query.distributor_id = this.formData.distributor_id
      this.searchParams = query
      return query
    },
    resetForm() {
      this.formData.distributor_id = ''
    },
    refreshTable() {
      this.$refs.finder.refresh()
    },
    handleSelectionChange() {},
    // 导出
    exportHandle() {
      api.cardticket.exportCouponUseLogs(this.searchParams).then((res) => {
        const { status, url, filename } = res
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('coupon_use_logs')
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
      this.loseDialogShow = true
    },
    onLoseFormSubmit(row) {}
  }
}
</script>

<style scoped lang="scss"></style>
