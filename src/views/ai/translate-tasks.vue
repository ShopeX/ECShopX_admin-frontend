<template>
  <SpPage>
    <div slot="page-header" class="page-header">
      <el-button type="primary" size="small" @click="openCreateDialog">{{ $t('2a2a72e5.87da21') }}</el-button>
      <el-button size="small" @click="fetchTasks">{{ $t('2a2a72e5.694fc5') }}</el-button>
    </div>

    <!-- 任务列表 -->
    <el-table v-loading="loading" :data="tasks" border style="width: 100%">
      <el-table-column prop="task_id" :label="$t('2a2a72e5.3a3778')" width="80" />
      <el-table-column :label="$t('2a2a72e5.5ebda1')" width="140">
        <template slot-scope="{ row }">{{ getTypeLabel(row.task_type) }}</template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.3fea7c')" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="statusTagType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.129d05')" min-width="160">
        <template slot-scope="{ row }">{{ formatLangs(row.target_languages) }}</template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.8aa769')" width="160">
        <template slot-scope="{ row }">
          <span>{{ $t('2a2a72e5.330363') }}: {{ row.success_count || 0 }}</span>
          <span style="margin: 0 4px">/</span>
          <span>{{ $t('2a2a72e5.acd5cb') }}: {{ row.failed_count || 0 }}</span>
          <span style="margin: 0 4px">/</span>
          <span>{{ $t('2a2a72e5.599b5a') }}: {{ row.total_count || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.eca37c')" width="160">
        <template slot-scope="{ row }">{{ formatTime(row.created) }}</template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.a001a2')" width="160">
        <template slot-scope="{ row }">{{ formatTime(row.updated) }}</template>
      </el-table-column>
      <el-table-column :label="$t('2a2a72e5.2b6bc0')" width="120">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="openDetail(row)">{{ $t('2a2a72e5.f26225') }}</el-button>
          <el-button
            v-if="row.status === 'failed' || row.status === 'partial_success'"
            type="text"
            size="small"
            @click="handleRetry(row)"
          >{{ $t('2a2a72e5.132c5c') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 16px; text-align: right">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="(p) => { page = p; fetchTasks() }"
      />
    </div>

    <!-- 新增翻译任务弹窗 -->
    <el-dialog
      :title="$t('2a2a72e5.87da21')"
      :visible.sync="createVisible"
      width="720px"
      top="6vh"
      append-to-body
      @open="onDialogOpen"
    >
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="120px">
        <el-form-item :label="$t('2a2a72e5.06d482')" prop="task_type">
          <el-select
            v-model="createForm.task_type"
            :placeholder="$t('2a2a72e5.708c9d')"
            style="width: 280px"
            @change="onTaskTypeChange"
          >
            <el-option-group
              v-for="group in taskTypeGroups"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('2a2a72e5.129d05')" prop="target_languages" :rules="[{ type: 'array', required: true, message: $t('2a2a72e5.c91ca0'), trigger: 'change' }]">
          <el-checkbox-group v-model="createForm.target_languages">
            <el-checkbox
              v-for="(label, code) in langLabels"
              :key="code"
              :label="code"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 数据选择区域 -->
        <el-form-item v-if="createForm.task_type" :label="$t('2a2a72e5.1d1629')">
          <div class="selector-wrapper">
            <div v-if="selectorLoading" style="padding: 20px; text-align: center">
              <i class="el-icon-loading" />
            </div>
            <template v-else>
              <el-table
                ref="selectorTable"
                :data="selectorData"
                border
                size="small"
                :row-key="currentConfig && currentConfig.rowKey || 'id'"
                :lazy="currentConfig && currentConfig.isTree"
                :load="currentConfig && currentConfig.isTree ? loadCategoryChildren : undefined"
                :tree-props="currentConfig && currentConfig.isTree ? { children: 'children', hasChildren: 'has_children' } : undefined"
                style="width: 100%"
                @selection-change="onSelectionChange"
              >
                <el-table-column type="selection" width="45" :reserve-selection="true" />
                <el-table-column
                  :label="'ID'"
                  :width="currentConfig && currentConfig.isTree ? 140 : 90"
                >
                  <template slot-scope="{ row }">{{ row[currentConfig && currentConfig.rowKey || 'id'] }}</template>
                </el-table-column>
                <el-table-column :label="getNameColumnLabel()">
                  <template slot-scope="{ row }">{{ getRowName(row) }}</template>
                </el-table-column>
                <el-table-column v-if="showTypeColumn" :label="$t('2a2a72e5.226b09')" width="120">
                  <template slot-scope="{ row }">{{ getMarketingTypeLabel(row.marketing_type) }}</template>
                </el-table-column>
              </el-table>

              <div v-if="currentConfig && !currentConfig.isTree" style="margin-top: 8px; text-align: right">
                <el-pagination
                  :current-page="selectorPage"
                  :page-size="selectorPageSize"
                  :total="selectorTotal"
                  layout="total, prev, pager, next"
                  small
                  @current-change="onSelectorPageChange"
                />
              </div>

              <div style="margin-top: 8px; color: #909399; font-size: 12px">
                {{ $t('2a2a72e5.7bf54e') }} {{ selectedIds.length }} {{ $t('2a2a72e5.f932ef') }}
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="createVisible = false">{{ $t('2a2a72e5.625fb2') }}</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          :disabled="selectedIds.length === 0 || createForm.target_languages.length === 0"
          @click="handleCreateTask"
        >{{ $t('2a2a72e5.f5f585') }}</el-button>
      </span>
    </el-dialog>

    <!-- 任务详情弹窗 -->
    <el-dialog
      :title="$t('2a2a72e5.4a98bf')"
      :visible.sync="detailVisible"
      width="560px"
      append-to-body
    >
      <div v-if="detailTask">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item :label="$t('2a2a72e5.3a3778')">{{ detailTask.task_id }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.5ebda1')">{{ getTypeLabel(detailTask.task_type) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.3fea7c')">
            <el-tag :type="statusTagType(detailTask.status)" size="small">{{ getStatusLabel(detailTask.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.129d05')">{{ formatLangs(detailTask.target_languages) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.330363')">{{ detailTask.success_count || 0 }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.acd5cb')">{{ detailTask.failed_count || 0 }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.599b5a')">{{ detailTask.total_count || 0 }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.eca37c')">{{ formatTime(detailTask.created) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('2a2a72e5.a001a2')">{{ formatTime(detailTask.updated) }}</el-descriptions-item>
          <el-descriptions-item v-if="detailTask.error_msg || detailTask.error_message" :label="$t('2a2a72e5.4604d5')" :span="2">
            <span style="color: #F56C6C">{{ detailTask.error_msg || detailTask.error_message }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
import { getTranslateTasks, createTranslateTask, getTranslateTask, retryTranslateTask } from '@/api/translation'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { getCardList } from '@/api/cardticket'
import { getMarketingActivityList, seckillActivityGetList } from '@/api/promotions'
import { getDistributorCategory } from '@/api/distributor'
import { getDistributorList } from '@/api/marketing'
import { LANGUAGES, getCurrentCountryCode } from '@/i18n/index'

export default {
  name: 'TranslateTasks',
  data() {
    return {
      loading: false,
      tasks: [],
      page: 1,
      pageSize: 20,
      total: 0,

      createVisible: false,
      submitting: false,
      createForm: {
        task_type: '',
        target_languages: []
      },
      createRules: {
        task_type: [{ required: true, message: this.$t('2a2a72e5.cc4436'), trigger: 'change' }]
      },

      selectorLoading: false,
      selectorData: [],
      selectorPage: 1,
      selectorPageSize: 10,
      selectorTotal: 0,
      selectedIds: [],

      detailVisible: false,
      detailTask: null
    }
  },
  computed: {
    langLabels() {
      const currentCode = getCurrentCountryCode()
      const labels = {}
      Object.values(LANGUAGES).forEach((cfg) => {
        if (cfg.countryCode !== currentCode) {
          labels[cfg.countryCode] = cfg.label
        }
      })
      return labels
    },
    taskTypeGroups() {
      return [
        {
          label: this.$t('2a2a72e5.9897d8'),
          types: [
            { value: 'goods.items', label: this.$t('2a2a72e5.a02e2a') },
            { value: 'goods.category.management', label: this.$t('2a2a72e5.b3ed9f') },
            { value: 'goods.category.sale', label: this.$t('2a2a72e5.392d49') },
            { value: 'goods.tag', label: this.$t('2a2a72e5.0f394b') },
            { value: 'goods.brand', label: this.$t('2a2a72e5.ef6fc3') },
            { value: 'goods.params', label: this.$t('2a2a72e5.8686bb') },
            { value: 'goods.spec', label: this.$t('2a2a72e5.5fceb3') }
          ]
        },
        {
          label: this.$t('2a2a72e5.0f5629'),
          types: [
            { value: 'shop.category', label: this.$t('2a2a72e5.0f5629') },
            { value: 'shop.info', label: this.$t('2a2a72e5.ddda9e') }
          ]
        },
        {
          label: this.$t('2a2a72e5.2f3635'),
          types: [
            { value: 'marketing.coupon', label: this.$t('2a2a72e5.2f3635') }
          ]
        },
        {
          label: this.$t('2a2a72e5.252caa'),
          types: [
            { value: 'marketing.fulldiscount', label: this.$t('2a2a72e5.1c120b') },
            { value: 'marketing.fullminus', label: this.$t('2a2a72e5.94b1fd') },
            { value: 'marketing.fullgift', label: this.$t('2a2a72e5.8e2405') },
            { value: 'marketing.pluspricebuy', label: this.$t('2a2a72e5.54e654') },
            { value: 'marketing.seckill', label: this.$t('2a2a72e5.a0aaca') },
            { value: 'marketing.package', label: this.$t('2a2a72e5.3e9a00') }
          ]
        }
      ]
    },
    taskTypeLabels() {
      const map = {}
      this.taskTypeGroups.forEach((g) => {
        g.types.forEach((t) => {
          map[t.value] = t.label
        })
      })
      return map
    },
    currentConfig() {
      return this.getTypeConfig(this.createForm.task_type)
    },
    showTypeColumn() {
      return ['marketing.fulldiscount', 'marketing.fullminus', 'marketing.fullgift', 'marketing.pluspricebuy'].includes(
        this.createForm.task_type
      )
    }
  },
  created() {
    this.fetchTasks()
  },
  methods: {
    getTypeConfig(taskType) {
      const marketingTypeMap = {
        'marketing.fulldiscount': 'full_discount',
        'marketing.fullminus': 'full_minus',
        'marketing.fullgift': 'full_gift',
        'marketing.pluspricebuy': 'plus_price_buy'
      }
      const configs = {
        'goods.items': {
          rowKey: 'item_id',
          nameField: 'item_name',
          fetch: (p) => getItemsList({ page: p.page, pageSize: p.pageSize, item_type: 'normal' })
        },
        'goods.category.management': {
          rowKey: 'category_id',
          nameField: 'category_name',
          isTree: true,
          fetchLevel: (parentId) =>
            getCategory({ parent_id: parentId !== undefined ? parentId : 0, is_main_category: true })
        },
        'goods.category.sale': {
          rowKey: 'category_id',
          nameField: 'category_name',
          isTree: true,
          fetchLevel: (parentId) =>
            getCategory({ parent_id: parentId !== undefined ? parentId : 0 })
        },
        'goods.tag': {
          rowKey: 'tag_id',
          nameField: 'tag_name',
          fetch: (p) => getTagList({ page: p.page, pageSize: p.pageSize })
        },
        'goods.brand': {
          rowKey: 'attribute_id',
          nameField: 'attribute_name',
          fetch: (p) => getGoodsAttr({ page: p.page, pageSize: p.pageSize, attribute_type: 'brand' })
        },
        'goods.params': {
          rowKey: 'attribute_id',
          nameField: 'attribute_name',
          fetch: (p) => getGoodsAttr({ page: p.page, pageSize: p.pageSize, attribute_type: 'item_params' })
        },
        'goods.spec': {
          rowKey: 'attribute_id',
          nameField: 'attribute_name',
          fetch: (p) => getGoodsAttr({ page: p.page, pageSize: p.pageSize, attribute_type: 'item_spec' })
        },
        'shop.category': {
          rowKey: 'category_id',
          nameField: 'category_name',
          fetch: (p) => getDistributorCategory({ page: p.page, pageSize: p.pageSize })
        },
        'shop.info': {
          rowKey: 'distributor_id',
          nameField: 'name',
          fetch: (p) => getDistributorList({ page: p.page, pageSize: p.pageSize })
        },
        'marketing.coupon': {
          rowKey: 'card_id',
          nameField: 'title',
          fetch: (p) => getCardList({ page: p.page, pageSize: p.pageSize })
        },
        'marketing.seckill': {
          rowKey: 'seckill_id',
          nameField: 'activity_name',
          fetch: (p) => seckillActivityGetList({ page: p.page, pageSize: p.pageSize })
        },
        'marketing.package': {
          rowKey: 'package_id',
          nameField: 'package_name',
          fetch: (p) => getMarketingActivityList({ page: p.page, pageSize: p.pageSize, marketing_type: 'package' })
        }
      }
      if (marketingTypeMap[taskType]) {
        configs[taskType] = {
          rowKey: 'marketing_id',
          nameField: 'marketing_name',
          fetch: (p) =>
            getMarketingActivityList({
              page: p.page,
              pageSize: p.pageSize,
              marketing_type: marketingTypeMap[taskType]
            })
        }
      }
      return configs[taskType] || null
    },

    actualTaskType(frontendType) {
      const map = {
        'goods.category.management': 'goods.category',
        'goods.category.sale': 'goods.category',
        'marketing.fulldiscount': 'marketing.promotion',
        'marketing.fullminus': 'marketing.promotion',
        'marketing.fullgift': 'marketing.promotion',
        'marketing.pluspricebuy': 'marketing.promotion'
      }
      return map[frontendType] || frontendType
    },

    async fetchTasks() {
      this.loading = true
      try {
        const res = await getTranslateTasks({ page: this.page, page_size: this.pageSize })
        const data = res.data.data || {}
        this.tasks = data.items || data.list || []
        this.total = data.total_count || data.total || 0
      } catch (e) {
        this.$message.error(e.message || '获取任务列表失败')
      } finally {
        this.loading = false
      }
    },

    formatLangs(codes) {
      if (!Array.isArray(codes) || codes.length === 0) return ''
      return codes.map((c) => this.langLabels[c] || c).join('、')
    },

    /**
     * 后端 created / updated 是秒级 unix 时间戳（int），统一在前端格式化成
     * `YYYY-MM-DD HH:mm:ss`。兼容字符串/0/空值。
     */
    formatTime(ts) {
      if (!ts) return ''
      const num = typeof ts === 'number' ? ts : Number(ts)
      if (!num) return typeof ts === 'string' ? ts : ''
      const d = new Date(num * 1000)
      if (isNaN(d.getTime())) return ''
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },

    openCreateDialog() {
      this.createForm = { task_type: '', target_languages: [] }
      this.selectorData = []
      this.selectedIds = []
      this.selectorPage = 1
      this.selectorTotal = 0
      this.createVisible = true
    },

    onDialogOpen() {
      if (this.$refs.selectorTable) {
        this.$refs.selectorTable.clearSelection()
      }
    },

    onTaskTypeChange() {
      this.selectorData = []
      this.selectedIds = []
      this.selectorPage = 1
      this.selectorTotal = 0
      if (this.$refs.selectorTable) {
        this.$refs.selectorTable.clearSelection()
      }
      this.loadSelectorData()
    },

    async loadSelectorData() {
      const cfg = this.currentConfig
      if (!cfg) return
      this.selectorLoading = true
      try {
        if (cfg.isTree) {
          const res = await cfg.fetchLevel(0)
          const data = res.data.data || {}
          this.selectorData = (data.items || data.list || data || []).map((item) => ({
            ...item,
            has_children: item.has_children === '1' || item.has_children === true
          }))
          this.selectorTotal = 0
        } else {
          const res = await cfg.fetch({ page: this.selectorPage, pageSize: this.selectorPageSize })
          const data = res.data.data || {}
          this.selectorData = data.items || data.list || []
          this.selectorTotal = data.total_count || data.total || 0
        }
      } catch (e) {
        this.$message.error(e.message || '获取数据失败')
      } finally {
        this.selectorLoading = false
      }
    },

    async loadCategoryChildren(row, treeNode, resolve) {
      const cfg = this.currentConfig
      if (!cfg || !cfg.fetchLevel) {
        resolve([])
        return
      }
      try {
        const res = await cfg.fetchLevel(row[cfg.rowKey])
        const data = res.data.data || {}
        const children = (data.items || data.list || data || []).map((item) => ({
          ...item,
          has_children: item.has_children === '1' || item.has_children === true
        }))
        resolve(children)
      } catch (e) {
        resolve([])
      }
    },

    async onSelectorPageChange(p) {
      this.selectorPage = p
      await this.loadSelectorData()
    },

    onSelectionChange(rows) {
      const cfg = this.currentConfig
      if (!cfg) return
      this.selectedIds = rows.map((r) => r[cfg.rowKey])
    },

    getRowName(row) {
      const cfg = this.currentConfig
      if (!cfg) return ''
      return row[cfg.nameField] || ''
    },

    getNameColumnLabel() {
      const typeNameMap = {
        'goods.items': '商品名称',
        'goods.category.management': '分类名称',
        'goods.category.sale': '分类名称',
        'goods.tag': '标签名',
        'goods.brand': '品牌名',
        'goods.params': '参数名',
        'goods.spec': '规格名',
        'shop.category': '分类名称',
        'shop.info': '店铺名称',
        'marketing.coupon': '优惠券名称',
        'marketing.seckill': '活动名称',
        'marketing.package': '套餐名称',
        'marketing.fulldiscount': this.$t('2a2a72e5.39834b'),
        'marketing.fullminus': this.$t('2a2a72e5.39834b'),
        'marketing.fullgift': this.$t('2a2a72e5.39834b'),
        'marketing.pluspricebuy': this.$t('2a2a72e5.39834b')
      }
      return typeNameMap[this.createForm.task_type] || '名称'
    },

    getMarketingTypeLabel(type) {
      const map = {
        full_discount: this.$t('2a2a72e5.1c120b'),
        full_minus: this.$t('2a2a72e5.94b1fd'),
        full_gift: this.$t('2a2a72e5.8e2405'),
        plus_price_buy: this.$t('2a2a72e5.54e654')
      }
      return map[type] || type
    },

    async handleCreateTask() {
      if (this.selectedIds.length === 0) {
        this.$message.warning(this.$t('2a2a72e5.914235'))
        return
      }
      if (this.createForm.target_languages.length === 0) {
        this.$message.warning(this.$t('2a2a72e5.c91ca0'))
        return
      }
      this.submitting = true
      try {
        const res = await createTranslateTask({
          task_type: this.actualTaskType(this.createForm.task_type),
          source_language: getCurrentCountryCode(),
          target_languages: this.createForm.target_languages,
          data_ids: this.selectedIds
        })
        const taskId = res.data.data && res.data.data.task_id
        this.$message.success(this.$t('2a2a72e5.5d9c5e') + taskId)
        this.createVisible = false
        this.fetchTasks()
      } catch (e) {
        this.$message.error(this.$t('2a2a72e5.3d6b61') + (e.message || ''))
      } finally {
        this.submitting = false
      }
    },

    async openDetail(row) {
      try {
        const res = await getTranslateTask(row.task_id)
        this.detailTask = res.data.data || row
        this.detailVisible = true
      } catch (e) {
        this.$message.error(this.$t('2a2a72e5.181421'))
        this.detailTask = row
        this.detailVisible = true
      }
    },

    async handleRetry(row) {
      try {
        await this.$confirm(this.$t('2a2a72e5.d84b07'), this.$t('2a2a72e5.e83a25'), { type: 'warning' })
        await retryTranslateTask(row.task_id)
        this.$message.success(this.$t('2a2a72e5.bcbe11'))
        this.fetchTasks()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(this.$t('2a2a72e5.c0ab61') + (e.message || ''))
        }
      }
    },

    getTypeLabel(taskType) {
      return this.taskTypeLabels[taskType] || taskType
    },

    getStatusLabel(status) {
      const map = {
        pending: this.$t('2a2a72e5.65dd9e'),
        running: this.$t('2a2a72e5.46e386'),
        success: this.$t('2a2a72e5.fad522'),
        failed: this.$t('2a2a72e5.acd5cb'),
        partial_success: this.$t('2a2a72e5.983b68')
      }
      return map[status] || status
    },

    statusTagType(status) {
      const map = {
        pending: 'info',
        running: '',
        success: 'success',
        failed: 'danger',
        partial_success: 'warning'
      }
      return map[status] || 'info'
    }
  }
}
</script>

<style scoped>
.page-header {
  padding: 12px 0;
}
.selector-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  max-height: 420px;
  overflow-y: auto;
}
</style>
