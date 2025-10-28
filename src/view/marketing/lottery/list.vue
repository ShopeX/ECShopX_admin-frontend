<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="page-body">
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="promotions/getturntableList"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="right"
        no-selection
        :split-count="4"
      >
        <template #tableTop>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="addHandle">添加活动</el-button>
          </div>

          <!-- 选择tab -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in audit_status"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
        </template>
      </SpFinder>

      <SpDialog
        ref="pushLiveCouponDialogRef"
        v-model="lotteryDialogShow"
        title="活动统计"
        :modal="false"
        class="base-form"
        :form="form"
        :form-list="formList"
        :is-show-footer="false"
      />
    </SpRouterView>
  </div>
</template>

<script lang="js">
import { tableSchema, statisticsFormSchema } from './schema'
import api from '@/api'

import { audit_status, status_info_map } from './constants.js'

export default {
  data() {
    return {
      areas: [],
      activeName: 'all',
      audit_status,
      lotteryDialogShow: false,
      form: {},
      dialogData:null,
      editRow:null
    }
  },
  computed: {
    tableSchema() {
      return tableSchema(this)
    },
    formList() {
      return statisticsFormSchema(this)
    }
  },
  watch:{
      '$route'(to,from){
          this.refresh()
      }
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    refresh() {
      this.$refs.finder.refresh(true)
    },
    getAreas() {
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
      })
    },
    // 新增抽奖活动，跳转到抽奖活动编辑页
    addHandle() {
      this.$router.push('/marketing/wheel/editor')
    },
    // 编辑抽奖活动，跳转到编辑页并携带活动ID
    editConfigHandle(row) {
      this.$router.push(`/marketing/wheel/editor/${row.id}`)
    },
    // 终止抽奖活动（接口调用待实现）
    stopHandle(row) {
      api.marketing.downLuckyDrawById({
        activity_id: row.id
      }).then((res) => {
        this.refresh()
        this.$message.success('终止成功')
      }).catch(err => {
        this.$message.error('操作失败')
      })
    },
    // 复制抽奖活动，跳转时通过查询参数携带活动ID
    copyHandle(row) {
      this.$router.push(`/marketing/wheel/editor?id=${row.id}`)
    },
    // 查询接口数据
    async statisticsHandle(row) {
      this.editRow = row
      api.marketing.getTurntableCountById({
        activity_id: row.id
      }).then((res) => {
        this.dialogData = res
      })
      this.lotteryDialogShow = true
    },
    handleClick() {
      this.refresh()
    },
    exportReport() {
      api.marketing.exportLuckyDrawData({
        activity_id: this.editRow.id
      }).then((res) => {
        console.log(res);
        this.$router.push({
          path: '/companydata/report/baseexport?tab=export_luckdraw_log',
        })
      }).catch(err => {
        this.$message.error('导出失败')
      })
    },
    beforeSearch(params) {
      const str = this.activeName == 'all' ? '' : status_info_map[this.activeName]
      params.status = str
      return {
        ...params,
      }
    }
  }
}
</script>

<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
