<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div v-if="start" style="padding-top: 5px; clear: both; display: flex; margin-bottom: 20px">
    <el-progress
      style="margin-right: 10px"
      :stroke-width="4"
      :percentage="exportPercent"
      type="circle"
      width="40"
    />

    <div>
      <span v-if="exportPercent < 100" style="color: #e6a23c; line-height: 40px">{{
        $t('089d6e70.45893e')
      }}</span>
      <span v-else style="color: #67c23a; line-height: 40px">{{ $t('089d6e70.498a19') }}</span>
      <el-button v-if="exportPercent < 100" size="mini" type="warning" @click="hanleStop">
        {{ $t('089d6e70.84fac4') }}
      </el-button>
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
    exportKey: function (val) {
      if (this.start == false && val) {
        this.start = true
        this.startExportCsvData(1, val, this.exportTotal)
      } else {
        this.$message.error(this.$t('089d6e70.1be5b4'))
      }
    }
  },
  computed: {
    ...mapGetters(['exportKey', 'exportTotal'])
  },
  methods: {
    hanleStop() {
      this.$confirm(this.$t('089d6e70.8ad17a'), this.$t('089d6e70.02d981'), {
        confirmButtonText: this.$t('089d6e70.38cf16'),
        cancelButtonText: this.$t('089d6e70.625fb2'),
        type: 'warning'
      })
        .then(() => {
          this.start = false
          this.csvData = []
          this.exportPercent = 0
        })
        .catch(() => {})
    },
    startExportCsvData(page, key, total_count) {
      if (page == 1) {
        this.csvData = []
        this.exportPercent = 0
      }
      exportCsvData({ page: page, key: key, total_count: total_count }).then((response) => {
        this.exportPercent = response.data.percent
        if (response.data.data.length == 0) {
          let content = '\ufeff' + this.csvData.map((e) => e.join(',')).join('\n')
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
      })
    }
  }
}
</script>
