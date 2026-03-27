<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="zyk_withdraw_audit">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('38eed5f9.91287f') }}</span>
        </div>
        <div class="content">
          <div class="toolbar">
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="handleExport"
              :loading="exportLoading"
            >
              {{ $t('38eed5f9.c7f0d5') }}
            </el-button>
          </div>
          <div class="list">
            <SpFinder
              ref="finder"
              :no-selection="true"
              :setting="setting"
              url="/bspay/withdraw/lists"
              :hooks="{
                beforeSearch: beforeSearch,
                afterSearch: afterSearch
              }"
            />
          </div>
        </div>
      </el-card>
    </div>
  </SpPage>
</template>

<script>
import setting_ from './finder/audit_setting'
import loadingBtn from '@/components/loading-btn'

export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      search_options: [],
      exportLoading: false
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  methods: {
    beforeSearch(params) {
      // 添加固定的 type 参数
      return {
        ...params,
        type: 'audit'
      }
    },

    afterSearch({ data }) {
      const { search_options = {} } = data.data
      this.search_options = search_options.status
    },

    async handleAudit(row, action) {
      try {
        // 弹出确认对话框
        const confirmText =
          action === 'approve' ? this.$t('38eed5f9.0a5f82') : this.$t('38eed5f9.edc5c6')
        const actionText =
          action === 'approve' ? this.$t('38eed5f9.23c1f3') : this.$t('38eed5f9.7173f8')

        await this.$confirm(confirmText, this.$t('38eed5f9.02d981'), {
          confirmButtonText: this.$t('38eed5f9.38cf16'),
          cancelButtonText: this.$t('38eed5f9.625fb2'),
          type: action === 'approve' ? 'success' : 'warning'
        })

        // 弹出备注输入框
        const { value: remark } = await this.$prompt(
          this.$t('38eed5f9.8044cf'),
          this.$t('38eed5f9.200d69'),
          {
            confirmButtonText: this.$t('38eed5f9.38cf16'),
            cancelButtonText: this.$t('38eed5f9.625fb2'),
            inputPattern: /.+/,
            inputErrorMessage: this.$t('38eed5f9.aa94a1')
          }
        )

        // 调用审核接口
        const params = {
          apply_id: row.id,
          action: action,
          remark: remark
        }
        console.log('params', params)
        const result = await this.$api.bspay.withdrawAudit(params)

        if (result.status) {
          this.$message.success(actionText + this.$t('38eed5f9.330363'))
          // 刷新列表
          this.$refs.finder.refresh(true)
        } else {
          this.$message.error(actionText + this.$t('38eed5f9.acd5cb'))
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Audit failed:', error)
          this.$message.error(this.$t('38eed5f9.fe3661'))
        }
      }
    },

    async handleExport() {
      try {
        this.exportLoading = true

        // 构建导出参数，包含固定的 type 参数
        const exportParams = {
          type: 'audit',
          export_type: 'bspay_withdraw'
        }

        // 调用导出接口
        const response = await this.$api.bspay.exportWithdrawData(exportParams)
        if (response.status) {
          // 如果返回了文件URL，直接下载
          if (response.data && response.data.file_url) {
            this.downloadFile(
              response.data.file_url,
              response.data.file_name || this.$t('38eed5f9.97b6c4')
            )
            this.$message.success(this.$t('38eed5f9.105c8a'))
          } else {
            // 否则提示用户去导出列表下载
            this.$message.success(this.$t('38eed5f9.3e1ddd'))
            // 打开导出列表弹窗
            this.$export_open('bspay_withdraw')
          }
        } else {
          this.$message.error(response.message || this.$t('38eed5f9.dd51ab'))
        }
      } catch (error) {
        console.error('Export failed:', error)
        this.$message.error(this.$t('38eed5f9.dd51ab'))
      } finally {
        this.exportLoading = false
      }
    },

    // 下载文件方法
    downloadFile(url, filename) {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_withdraw_audit {
  .clearfix span {
    font-weight: 700;
  }

  .toolbar {
    margin-bottom: 16px;
  }
}
</style>
