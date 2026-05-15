<template>
  <SpPage v-loading="loading">
    <div class="agent-center">
      <h3 class="page-title">ShopeX智能体平台</h3>
      <el-row :gutter="12" class="app-grid">
        <el-col :span="8">
          <el-card shadow="never">
            <div class="wallet-kv-label">平台账号</div>
            <div class="wallet-kv-value">{{ wallet.balance.user_id || '-' }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <div class="wallet-kv-label">免费额度</div>
            <div class="wallet-kv-value">{{ wallet.balance.gift_tokens || 0 }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
              <div class="wallet-kv-label">余额</div>
              <div class="flex">
                <div class="wallet-kv-value">¥ {{ wallet.balance.cash_balance || 0 }}</div>
                <el-button type="text">充值</el-button>
              </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="header-bar">
        <div class="page-title">智能体</div>
        <div class="toolbar">
          <el-input
            v-model.trim="searchKeyword"
            clearable
            placeholder="搜索应用"
            class="search-input"
          />
        </div>
      </div>
      <el-row :gutter="16" class="app-grid">
        <el-col v-for="row in filteredApplications" :key="row.app_id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card shadow="hover" class="app-card">
            <div class='flex'>
              <div class="app-icon-box">
                <img
                  v-if="isHttpImageUrl(row.icon_url)"
                  :src="row.icon_url"
                  :alt="row.app_name || row.app_id"
                  class="app-icon-image"
                />
                <span v-else>{{ getAppInitial(row) }}</span>
              </div>
              <div>
                <div class="app-title">{{ row.app_name || row.app_id }}</div>
                <div class="app-desc">{{ row.description || '暂无描述' }}</div>
              </div>
            </div>
            <div class="app-actions">
              <el-button type="primary" size="small" :disabled="!canApply(row)" @click="apply(row)">
                {{ getApplyButtonLabel(row) }}
              </el-button>
              <el-button size="small" @click="openUsageDialog(row)">查看用量</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog title="钱包" :visible.sync="walletDialogVisible" width="900px" destroy-on-close>
        <div class="wallet-recent-title">最近交易</div>
        <el-table :data="wallet.transactions || []" stripe style="margin-top: 8px">
          <el-table-column label="时间" min-width="180">
            <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="金额" min-width="160">
            <template #default="{ row }">
              <span>¥ {{ row.amount_cash || 0 }}</span>
              <span v-if="row.amount_token"> / {{ row.amount_token }} tokens</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="200" />
        </el-table>
      </el-dialog>

      <el-dialog
        title="应用用量"
        :visible.sync="usageDialogVisible"
        width="900px"
        destroy-on-close
      >
        <div class="usage-toolbar">
          <div class="usage-app-title">
            {{ usageContext.app_name }} ({{ usageContext.app_id }})
          </div>
          <el-button type="primary" size="small" :loading="usageLoading" @click="loadUsage">刷新用量</el-button>
        </div>

        <el-row :gutter="12" style="margin-top: 12px">
          <el-col :span="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">总请求</div>
              <div class="summary-value">{{ usageSummary.total_requests || 0 }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">成功</div>
              <div class="summary-value summary-success">{{ usageSummary.success_count || 0 }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">失败</div>
              <div class="summary-value summary-error">{{ usageSummary.error_count || 0 }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">成功率</div>
              <div class="summary-value">{{ usageSummary.success_rate || 0 }}%</div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" style="margin-top: 12px">
          <el-col :span="8">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">Token 消耗</div>
              <div class="summary-value">{{ usageSummary.total_tokens || 0 }}</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">平均响应</div>
              <div class="summary-value">{{ usageSummary.avg_response_time || 0 }} ms</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">费用</div>
              <div class="summary-value">¥ {{ usageSummary.total_cost || 0 }}</div>
            </el-card>
          </el-col>
        </el-row>

        <div style="margin-top: 16px; font-weight: 600">每日明细</div>
        <el-table v-loading="usageLoading" :data="usageTimeSeries" stripe style="margin-top: 8px" size="small">
          <el-table-column prop="period" label="日期" min-width="120" />
          <el-table-column prop="request_count" label="请求数" width="90" align="center" />
          <el-table-column prop="success_count" label="成功" width="80" align="center" />
          <el-table-column prop="error_count" label="失败" width="80" align="center" />
          <el-table-column label="成功率" width="90" align="center">
            <template #default="{ row }">{{ row.success_rate }}%</template>
          </el-table-column>
          <el-table-column prop="total_tokens" label="Token" width="100" align="center" />
          <el-table-column label="平均响应" width="110" align="center">
            <template #default="{ row }">{{ row.avg_response_time }} ms</template>
          </el-table-column>
          <el-table-column label="费用" width="100" align="center">
            <template #default="{ row }">¥ {{ row.total_cost }}</template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: 'ShopexAgentCenter',
  data() {
    return {
      loading: false,
      applications: [],
      wallet: {
        balance: {},
        transactions: []
      },
      walletNotice: '',
      usageDialogVisible: false,
      walletDialogVisible: false,
      usageLoading: false,
      usageContext: {
        app_name: '',
        app_id: '',
        business_key: ''
      },
      searchKeyword: '',
      usageSummary: {},
      usageTimeSeries: []
    }
  },
  computed: {
    filteredApplications() {
      const keyword = (this.searchKeyword || '').toLowerCase()
      if (!keyword) return this.applications
      return this.applications.filter((row) => {
        const text = [row.app_name, row.app_id, row.description, row.business_key]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return text.includes(keyword)
      })
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatTime(v) {
      if (!v) return '-'
      // 兼容 ISO 8601（含 T、毫秒/微秒、可选 Z 时区）→ "YYYY-MM-DD HH:mm:ss"
      const s = String(v).replace('T', ' ')
      const m = s.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)
      return m ? m[1] : s
    },
    async loadData() {
      this.loading = true
      try {
        const [apps, wallet] = await Promise.all([
          this.$api.shopexAgent.getShopexAgentApplications({ page: 1, page_size: 100 }),
          this.$api.shopexAgent.getShopexAgentWallet({ page: 1, page_size: 20 })
        ])
        this.applications = apps.items || []
        this.wallet = wallet || { balance: {}, transactions: [] }
        this.walletNotice = wallet.recharge_notice || '当前暂不支持在线充值，请联系客服'
      } catch (e) {
        this.$message.error(e.message || '数据加载失败')
      } finally {
        this.loading = false
      }
    },
    canApply(row) {
      if (!row.integrated) return false
      return ['none', 'failed'].includes(row.status)
    },
    getStatusLabel(row) {
      const status = (row.status || '').toLowerCase()
      const map = {
        none: '未开通',
        pending: '申请审核中',
        processing: '应用开通中',
        active: '已开通',
        approved: '已通过',
        failed: '开通失败',
        rejected: '已拒绝'
      }
      return row.status_text || map[status] || '未知状态'
    },
    getStatusTagType(row) {
      const status = (row.status || '').toLowerCase()
      if (status === 'active' || status === 'approved') return 'success'
      if (status === 'pending' || status === 'processing') return 'warning'
      if (status === 'failed' || status === 'rejected') return 'danger'
      return 'info'
    },
    getApplyButtonLabel(row) {
      const status = (row.status || '').toLowerCase()
      if (!row.integrated) return '未接入'
      if (status === 'active') return '已开通'
      if (status === 'approved') return '已通过'
      if (status === 'pending' || status === 'processing') return '审核中'
      if (status === 'failed') return '重新申请'
      if (status === 'rejected') return '已拒绝'
      return '申请应用'
    },
    getAppInitial(row) {
      const name = (row.app_name || row.app_id || 'A').trim()
      return name ? name[0] : 'A'
    },
    isHttpImageUrl(url) {
      return /^https?:\/\//i.test((url || '').trim())
    },
    getPricingLabel(row) {
      const pricing = (row.pricing_model || '').toLowerCase()
      return pricing === 'pay_as_you_go' || pricing === 'subscription' ? '付费' : '免费'
    },
    async apply(row) {
      if (!row.integrated) {
        this.$message.warning('未接入平台')
        return
      }
      try {
        await this.$api.shopexAgent.applyShopexAgentApplication({
          business_key: row.business_key,
          app_id: row.app_id
        })
        this.$message.success('申请已提交')
        await this.loadData()
      } catch (e) {
        this.$message.error(e.message || '开通失败')
      }
    },
    async openUsageDialog(row) {
      this.usageContext = {
        app_name: row.app_name,
        app_id: row.app_id,
        business_key: row.business_key
      }
      this.usageDialogVisible = true
      await this.loadUsage()
    },
    async loadUsage() {
      if (!this.usageContext.app_id) return
      this.usageLoading = true
      try {
        const data = await this.$api.shopexAgent.getShopexAgentUsage({
          app_id: this.usageContext.app_id
        })
        this.usageSummary = data.summary || {}
        this.usageTimeSeries = data.time_series || []
      } catch (e) {
        this.$message.error(e.message || '加载用量失败')
      } finally {
        this.usageLoading = false
      }
    }
  }
}
</script>

<style scoped>
.agent-center {
  padding: 16px;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: 500;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-input {
  width: 220px;
}
.wallet-notice {
  margin-top: 12px;
}
.usage-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.usage-app-title {
  color: #606266;
}
.app-grid {
  margin: 14px 0;
}
.app-card {
  margin-bottom: 16px;
}
.app-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-right: 10px;
  overflow: hidden;
}
.app-icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.app-title {
  font-size: 15px;
  font-weight: 600;
}
.app-desc {
  color: #909399;
  margin-top: 6px;
  min-height: 36px;
}
.app-meta {
  margin-top: 6px;
  color: #606266;
  font-size: 12px;
}
.app-status-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.app-tags {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-category {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}
.app-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.wallet-kv-label {
  color: #909399;
  font-size: 12px;
}
.wallet-kv-value {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 600;
}
.wallet-recent-title {
  margin-top: 14px;
  font-weight: 600;
}
.wallet-line {
  line-height: 28px;
}
.summary-card {
  text-align: center;
}
.summary-label {
  color: #909399;
  font-size: 12px;
}
.summary-value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 600;
}
.summary-success {
  color: #67c23a;
}
.summary-error {
  color: #f56c6c;
}
</style>
