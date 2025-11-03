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
  <div
      v-if="start"
      style="padding-top: 5px; clear: both; display:flex;margin-bottom:20px;"
  >
      <el-progress
          style="margin-right:10px"
          :stroke-width="4"
          :percentage="exportPercent"
          type="circle"
          width='40'
      ></el-progress>

      <div>
          <span v-if="exportPercent < 100" style="color: #E6A23C;line-height: 40px;">正在导出数据,请耐心等待，不要关闭窗口！</span>
          <span v-else style="color: #67C23A;line-height: 40px;">导出完成,数据导出成功！</span>
          <el-button v-if="exportPercent < 100" size="mini" type="warning" @click="hanleStop">取消下载</el-button>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { exportCsvData } from '@/api/goods'
export default {
data() {
  return {
    exportPercent: 0,
    csvData: [],
    start: false
  }
},
watch: {
  exportKey: function(val) {
    if (this.start == false && val) {
      this.start = true
      this.startExportCsvData(1, val, this.exportTotal)
    } else {
      this.$message.error('已经存在进行中的导出任务，请等待上个任务执行完毕')
    }
  }
},
computed: {
  ...mapGetters(['exportKey', 'exportTotal'])
},
methods: {
  hanleStop () {
      this.$confirm('确定要取消当前文件导出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.start = false
          this.csvData = []
          this.exportPercent = 0
      }).catch(() => {

      });
  },
  startExportCsvData(page, key, total_count) {
    if (page == 1) {
      this.csvData = []
      this.exportPercent = 0
    }
    exportCsvData({ page: page, key: key, total_count: total_count }).then(
      response => {
        this.exportPercent = response.data.percent
        if (response.data.data.length == 0) {
          let content =
            '\ufeff' + this.csvData.map(e => e.join(',')).join('\n')
          let blob = new Blob([content], {
            type: 'application/vnd.ms-excel'
          })
          const elink = document.createElement('a')
          elink.download = response.data.file_name + '.csv'
          elink.href = window.URL.createObjectURL(blob)
          elink.click()
          window.URL.revokeObjectURL(elink.href)
          this.start = false
          return
        }
        this.csvData = [...this.csvData, ...response.data.data]
        page++
        if (this.start) {
          this.startExportCsvData(page, key, response.data.total_count)
        }
      }
    )
  }
}
}
</script>
