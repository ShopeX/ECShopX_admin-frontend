<template>
  <SpPage>
    <div class="zyk_withdraw_audit">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>提现审核</span>
        </div>
        <div class="content">
          <div class="toolbar">
            <el-button 
              type="primary" 
              icon="el-icon-download"
              @click="handleExport"
              :loading="exportLoading"
            >
              导出数据
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
        const confirmText = action === 'approve' ? '确认通过此提现申请？' : '确认拒绝此提现申请？'
        const actionText = action === 'approve' ? '通过' : '拒绝'
        
        await this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: action === 'approve' ? 'success' : 'warning'
        })
        
        // 弹出备注输入框
        const { value: remark } = await this.$prompt('请输入审核备注', '审核备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '备注不能为空'
        })
        
        // 调用审核接口
        const params = {
          apply_id: row.id,
          action: action,
          remark: remark
        }
        console.log('params',params)
        const result = await this.$api.bspay.withdrawAudit(params)
        
        if (result.status) {
          this.$message.success(`${actionText}成功`)
          // 刷新列表
          this.$refs.finder.refresh(true)
        } else {
          this.$message.error(`${actionText}失败`)
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审核失败:', error)
          this.$message.error('审核失败')
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
            this.downloadFile(response.data.file_url, response.data.file_name || '提现数据.xlsx')
            this.$message.success('导出成功')
          } else {
            // 否则提示用户去导出列表下载
            this.$message.success('已加入执行队列，请在设置-导出列表中下载')
            // 打开导出列表弹窗
            this.$export_open('bspay_withdraw')
          }
        } else {
          this.$message.error(response.message || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败')
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