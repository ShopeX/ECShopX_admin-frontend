<template>
  <SpPage class="page-audience-selection">
    <div class="flex mb-1">
      <div class="w-[300px]">
        <span class="text-red-500 mr-1">*</span>
        <span class="font-medium">{{ $t('b0eef2c3.8086be') }}</span>
        <el-input
          v-model="rulesName"
          :placeholder="$t('b0eef2c3.6f81f3')"
          class="mt-2"
          maxlength="50"
          show-word-limit
          :disabled="!isEditMode"
        />
      </div>
      <div class="ml-5 flex-1">
        <span class="font-medium">{{ $t('b0eef2c3.fafac0') }}</span>
        <el-input
          v-model="description"
          type="textarea"
          show-word-limit
          :rows="2"
          maxlength="100"
          :placeholder="$t('b0eef2c3.ff913c')"
          :disabled="!isEditMode"
        />
      </div>
    </div>
    <div class="flex min-h-[calc(100vh-200px)] gap-5">
      <!-- 左侧特征选择面板 -->
      <div class="w-[300px] border border-[#e4e7ed] rounded bg-white overflow-y-auto">
        <div
          class="px-4 py-2 flex justify-between items-center border-b border-[#e4e7ed] font-medium"
        >
          <span>{{ $t('b0eef2c3.236d89') }}</span>
          <div>
            <el-button
              type="text"
              v-if="activeCollapse.length === 0"
              size="small"
              @click="expandAll"
              >
{{ $t('b0eef2c3.699371') }}
</el-button
            >
            <el-button type="text" v-else size="small" @click="collapseAll">
{{
              $t('b0eef2c3.b77295')
            }}
</el-button>
          </div>
        </div>
        <el-collapse v-model="activeCollapse">
          <el-collapse-item
            v-for="category in characteristicCategories"
            :key="category.type"
            :name="category.type"
            :title="getCategoryTitle(category.type)"
          >
            <div class="p-2 flex flex-wrap gap-2">
              <div
                v-for="item in category.sub"
                :key="item.type"
                :class="[
                  'min-w-[135px] text-center p-0.5 border rounded cursor-pointer transition-all duration-300',
                  isActive(item.type)
                    ? 'border-[#409eff] bg-[#ecf5ff] text-[#409eff]'
                    : 'border-[#e4e7ed] hover:border-[#409eff] hover:text-[#409eff]'
                ]"
                @click="addCharacteristic(category, item)"
              >
                {{ item.lebel }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 右侧表单区域 -->
      <div class="flex-1 overflow-hidden">
        <div
          class="border border-[#e4e7ed] rounded bg-white flex flex-col overflow-hidden h-[calc(100vh-300px)]"
        >
          <div class="px-4 py-2 border-b border-[#e4e7ed] font-medium">
            <span>{{ $t('b0eef2c3.c4300d') }}</span>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <!-- 按分类分组渲染 -->
            <template v-for="category in characteristicCategories">
              <!-- 只显示有表单项的分类 -->
              <div v-if="hasCategoryItems(category.type)" :key="category.type" class="mb-6">
                <!-- 分类标题 -->
                <div class="mb-3 px-2">
                  <span class="text-base font-semibold text-[#303133]">{{
                    getCategoryTitle(category.type)
                  }}</span>
                </div>

                <!-- 分类级别的 total_condition（下单时间等公用条件） -->
                <template v-for="(totalCondition, tcIndex) in category.total_condition">
                  <div
                    v-if="totalCondition && totalCondition.condition_type"
                    :key="`${category.type}-total-${tcIndex}`"
                    class="mb-4 border border-[#e4e7ed] rounded bg-[#fafafa]"
                  >
                    <div class="px-4 py-3 border-b border-[#e4e7ed] bg-white">
                      <span class="font-medium">{{ totalCondition.lebel }}</span>
                    </div>
                    <div class="p-4">
                      <CompForm
                        :item="getCategoryTotalCondition(category.type, tcIndex)"
                        :index="`${category.type}-${tcIndex}`"
                        :disabled="!isEditMode"
                        @update="
                          (idx, updated) =>
                            handleCategoryTotalConditionUpdate(category.type, tcIndex, updated)
                        "
                      />
                    </div>
                  </div>
                </template>

                <!-- 该分类下的子模块表单 -->
                <div
                  v-for="item in getCategoryFormItems(category.type)"
                  :key="item.id"
                  class="mb-4 border border-[#e4e7ed] rounded bg-[#fafafa]"
                >
                  <div
                    class="flex justify-between items-center px-4 py-3 border-b border-[#e4e7ed] bg-white"
                  >
                    <span class="font-medium">{{ item.lebel }}</span>
                    <i
                      v-if="isEditMode"
                      class="el-icon-close cursor-pointer text-[#909399] hover:text-[#f56c6c]"
                      @click="removeCharacteristicByItem(item)"
                    />
                  </div>
                  <div class="p-4">
                    <!-- 渲染子条件表单 -->
                    <div v-if="item.condition_type">
                      <CompForm
                        :item="item"
                        :index="getFormItemIndex(item)"
                        :disabled="!isEditMode"
                        @update="updateCharacteristic"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 空状态 -->
            <div v-if="formItems.length === 0" class="text-center p-4 pt-6">
              <span class="text-[#909399]">{{ $t('b0eef2c3.8f0a51') }}</span>
            </div>
          </div>

          <div class="py-1.5 px-4 border-t border-[#e4e7ed] flex items-center bg-white">
            <span class="pr-2">{{ $t('b0eef2c3.5df9fd', [estimateCount]) }}</span>
            <el-button
              type="primary"
              size="small"
              :disabled="!isEditMode"
              @click="onSearchChange"
              >
{{ $t('b0eef2c3.bee912') }}
</el-button
            >
          </div>
        </div>
        <div
          class="border border-[#e4e7ed] rounded bg-white flex flex-col overflow-hidden max-h-[calc(100vh-200px)] mt-4"
        >
          <div class="px-4 py-2 border-b border-[#e4e7ed] font-medium">
            <span>{{ $t('b0eef2c3.d2a769') }}</span>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <el-button
              type="primary"
              size="small"
              @click="showTagDialog = true"
              :disabled="!isEditMode"
              >
{{ $t('b0eef2c3.d2a769') }}
</el-button
            >

            <!-- 已选标签展示 -->
            <div v-if="selectedTags.length > 0" class="mt-4">
              <div class="font-medium mb-2 text-[#606266]">{{ $t('b0eef2c3.e98819') }}</div>
              <div class="flex flex-wrap items-center">
                <el-tag
                  v-for="(tag, index) in selectedTags"
                  :key="index"
                  :closable="isEditMode"
                  :disable-transitions="false"
                  @close="removeSelectedTag(index)"
                  class="mr-2 mb-2"
                >
                  {{ tag.tag_name }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 批量打标签弹框 -->
          <CompTagsMore
            :visible.sync="showTagDialog"
            :selected-tags="selectedTags"
            @confirm="handleTagsConfirm"
          />
        </div>
      </div>
    </div>
    <template slot="page-footer">
      <div class="text-center">
        <el-button @click="handleCancel">
{{
          isEditMode ? $t('b0eef2c3.625fb2') : $t('b0eef2c3.5f4112')
        }}
</el-button>
        <el-button v-if="isEditMode" type="primary" @click="handleSave">
{{
          $t('b0eef2c3.be5fbb')
        }}
</el-button>
      </div>
    </template>
  </SpPage>
</template>

<script>
import CompForm from './components/CompForm'
import CompTagsMore from './components/CompTagsMore'
import dayjs from 'dayjs'

export default {
  inject: ['refresh'],
  components: {
    CompForm,
    CompTagsMore
  },
  data() {
    return {
      activeCollapse: ['member', 'order'],
      formItems: [],
      nextId: 1,
      estimateCount: '-',
      showTagDialog: false,
      selectedTags: [],
      rulesName: '',
      description: '',
      ruleId: null, // 规则ID，如果有则是详情页
      isEditMode: true, // 是否为编辑模式，false为只读模式
      totalConditions: {}, // { categoryType: [{ value: ... }, ...] }
      characteristicCategories: []
    }
  },
  mounted() {
    // 检查是否有ID参数
    const id = this.$route.query.id
    if (id) {
      this.ruleId = id
      this.isEditMode = false
    }
    this.getStructureInfo().then(() => {
      if (id) {
        this.loadRuleDetail(id)
      }
    })
  },
  methods: {
    getCategoryTitle(type) {
      const titleMap = {
        member: this.$t('b0eef2c3.32fd76'),
        order: this.$t('b0eef2c3.a6d10d')
      }
      return titleMap[type] || type
    },
    isActive(type) {
      return this.formItems.some((item) => item.type === type)
    },
    addCharacteristic(category, item) {
      if (!this.isEditMode) return
      // 如果已存在，不重复添加
      if (this.isActive(item.type)) {
        return
      }

      // 初始化分类的 total_condition（如果存在）
      if (
        category.total_condition &&
        Array.isArray(category.total_condition) &&
        category.total_condition.length > 0
      ) {
        if (!this.totalConditions[category.type]) {
          // 初始化数组，为每个 total_condition 创建对应的值对象
          const totalConditionsArray = category.total_condition.map((tc) => {
            let initialValue = null
            if (tc.condition_type === 'timeRange') {
              initialValue = []
            }
            return {
              ...tc,
              value: initialValue
            }
          })
          this.$set(this.totalConditions, category.type, totalConditionsArray)
        }
      }

      const newItem = {
        id: this.nextId++,
        type: item.type,
        lebel: item.lebel,
        condition_type: item.condition_type,
        unit: item.unit || '',
        map_value: item.map_value || [],
        value: null,
        categoryType: category.type // 记录所属分类
      }

      this.formItems.push(newItem)
    },
    removeCharacteristic(index) {
      const item = this.formItems[index]
      this.formItems.splice(index, 1)

      // 如果删除后该分类下没有其他项了，清理 total_condition
      if (item && item.categoryType) {
        const hasOtherItems = this.formItems.some(
          (formItem) => formItem.categoryType === item.categoryType
        )
        if (!hasOtherItems) {
          this.$delete(this.totalConditions, item.categoryType)
        }
      }
    },
    updateCharacteristic(index, updatedItem) {
      this.$set(this.formItems, index, updatedItem)
    },
    expandAll() {
      this.activeCollapse = this.characteristicCategories.map((cat) => cat.type)
    },
    collapseAll() {
      this.activeCollapse = []
    },
    hasCategoryItems(categoryType) {
      // 检查该分类下是否有已添加的表单项
      return this.formItems.some((item) => {
        const category = this.characteristicCategories.find((cat) => cat.type === categoryType)
        return category && category.sub.some((subItem) => subItem.type === item.type)
      })
    },
    getCategoryFormItems(categoryType) {
      // 获取指定分类下的所有表单项
      const category = this.characteristicCategories.find((cat) => cat.type === categoryType)
      if (!category) return []

      return this.formItems.filter((item) => {
        return category.sub.some((subItem) => subItem.type === item.type)
      })
    },
    getFormItemIndex(item) {
      // 获取表单项在 formItems 中的索引
      return this.formItems.findIndex((formItem) => formItem.id === item.id)
    },
    removeCharacteristicByItem(item) {
      // 根据 item 对象删除表单项
      const index = this.getFormItemIndex(item)
      if (index !== -1) {
        this.removeCharacteristic(index)
      }
    },
    getCategoryTotalCondition(categoryType, index = 0) {
      // 获取分类的 total_condition 对象（根据索引）
      if (this.totalConditions[categoryType] && this.totalConditions[categoryType][index]) {
        return this.totalConditions[categoryType][index]
      }
      const category = this.characteristicCategories.find((cat) => cat.type === categoryType)
      if (
        category &&
        category.total_condition &&
        Array.isArray(category.total_condition) &&
        category.total_condition[index]
      ) {
        // 初始化整个数组
        if (!this.totalConditions[categoryType]) {
          const totalConditionsArray = category.total_condition.map((tc) => {
            let initialValue = null
            if (tc.condition_type === 'timeRange') {
              initialValue = []
            }
            return {
              ...tc,
              value: initialValue
            }
          })
          this.$set(this.totalConditions, categoryType, totalConditionsArray)
        }
        return this.totalConditions[categoryType][index] || null
      }
      return null
    },
    handleCategoryTotalConditionUpdate(categoryType, index, updated) {
      if (this.totalConditions[categoryType] && this.totalConditions[categoryType][index]) {
        this.$set(this.totalConditions[categoryType], index, {
          ...this.totalConditions[categoryType][index],
          value: updated.value
        })
      }
    },
    async onSearchChange() {
      const condition = this.buildConditionsData()
      if (!condition || condition.length === 0)
        return this.$message.error(this.$t('b0eef2c3.294301'))
      console.log('condition', condition)
      const { matched_count } = await this.$api.member.getSegmentRulePreview({
        condition: condition
      })
      console.log('matched_count', matched_count)
      this.estimateCount = matched_count || 0
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleTagsConfirm(tags) {
      this.selectedTags = tags
    },
    removeSelectedTag(index) {
      this.selectedTags.splice(index, 1)
    },
    buildConditionsData() {
      return this.characteristicCategories
        .map((category) => {
          const categoryItems = this.formItems.filter((item) => {
            return category.sub.some((subItem) => subItem.type === item.type)
          })
          if (categoryItems.length === 0) {
            return null
          }
          const sub = categoryItems.map((item) => {
            const subConfig = category.sub.find((s) => s.type === item.type)
            const result = {
              type: item.type,
              lebel: item.lebel
            }
            if (subConfig.condition_type) {
              result.condition_type = subConfig.condition_type
            }
            if (subConfig.unit) {
              result.unit = subConfig.unit
            }
            if (subConfig.map_value) {
              result.map_value = subConfig.map_value
            }
            let valueArr = null
            if (item.condition_type && item.value !== null && item.value !== undefined) {
              if (item.condition_type === 'timeRange') {
                if (Array.isArray(item.value)) {
                  valueArr = item.value.map((timestamp) => dayjs(timestamp).unix())
                }
              } else if (item.condition_type === 'number_rang') {
                if (typeof item.value === 'object' && item.value !== null) {
                  valueArr = [
                    item.value.min !== undefined ? item.value.min : 0,
                    item.value.max !== undefined ? item.value.max : 0
                  ]
                }
              } else if (item.condition_type === 'number_items') {
                if (Array.isArray(item.value)) {
                  valueArr = item.value.map((g) => g.item_id || g)
                }
              } else if (item.condition_type === 'mapping') {
                if (Array.isArray(item.value)) {
                  valueArr = item.value
                }
              } else if (item.condition_type === 'radio') {
                valueArr = [item.value]
              }
            }
            if (valueArr !== null && valueArr !== undefined) {
              result.params = valueArr
            }
            return result
          })
          const totalConditionArray = []
          if (category.total_condition && category.total_condition.length > 0) {
            const totalConditions = this.totalConditions[category.type] || []

            category.total_condition.forEach((tc, index) => {
              if (tc && tc.condition_type) {
                const totalConditionItem = {
                  condition_type: tc.condition_type,
                  lebel: tc.lebel || '',
                  unit: tc.unit || ''
                }
                const categoryTotalCondition = totalConditions[index]
                // 从 value 字段读取数据并转换为 params
                if (
                  categoryTotalCondition &&
                  categoryTotalCondition.value !== null &&
                  categoryTotalCondition.value !== undefined
                ) {
                  let valueArr = null
                  const conditionType = categoryTotalCondition.condition_type

                  if (conditionType === 'timeRange') {
                    if (Array.isArray(categoryTotalCondition.value)) {
                      valueArr = categoryTotalCondition.value.map((timestamp) =>
                        dayjs(timestamp).unix()
                      )
                    }
                  } else if (conditionType === 'number_rang') {
                    // 金额区间：传递数组 [最小值, 最大值]
                    if (
                      typeof categoryTotalCondition.value === 'object' &&
                      categoryTotalCondition.value !== null
                    ) {
                      valueArr = [
                        categoryTotalCondition.value.min,
                        categoryTotalCondition.value.max
                      ]
                    }
                  } else if (conditionType === 'number_items') {
                    // 选择商品：传递商品ID数组
                    if (Array.isArray(categoryTotalCondition.value)) {
                      valueArr = categoryTotalCondition.value.map((g) => g.item_id)
                    }
                  } else if (conditionType === 'mapping') {
                    // 复选框：value1=选中的值数组
                    if (Array.isArray(categoryTotalCondition.value)) {
                      valueArr = categoryTotalCondition.value
                    }
                  } else if (conditionType === 'radio') {
                    // 单选框：传递数组 [选中的值]
                    valueArr = [categoryTotalCondition.value]
                  }

                  if (valueArr !== null && valueArr !== undefined) {
                    totalConditionItem.params = valueArr
                  }
                }
                totalConditionArray.push(totalConditionItem)
              }
            })
          }
          return {
            type: category.type,
            total_condition: totalConditionArray,
            sub: sub
          }
        })
        .filter((category) => category !== null && category.sub.length > 0)
    },
    async handleSave() {
      if (!this.isEditMode) return
      // 验证标签名称必填
      if (!this.rulesName || this.rulesName.trim() === '') {
        this.$message.error(this.$t('b0eef2c3.6f81f3'))
        return
      }

      const condition = this.buildConditionsData()
      const params = {
        rule_name: this.rulesName,
        description: this.description,
        condition: JSON.stringify(condition),
        tag_ids: this.selectedTags.map((tag) => tag.tag_id)
      }
      await this.$api.member.saveSegmentRule(params)
      console.log('保存配置:', params, condition)
      this.$message.success(this.$t('b0eef2c3.3b1083'))
      this.refresh()
      this.$router.go(-1)
    },
    async getStructureInfo() {
      const data = await this.$api.member.getMemberStructure()
      this.characteristicCategories = data
      return data
    },
    async loadRuleDetail(id) {
      try {
        const detail = await this.$api.member.getSegmentRuleDetail(id)
        // 填充基本信息
        this.rulesName = detail.rule_name || ''
        this.description = detail.description || ''

        // 填充标签
        if (detail.tags && Array.isArray(detail.tags)) {
          this.selectedTags = detail.tags
        }

        // 解析条件数据
        if (detail.condition) {
          this.fillConditionData(detail.condition)
        }
      } catch (error) {
        console.error('加载详情失败:', error)
      }
    },
    fillConditionData(conditionData) {
      // 遍历条件数据，填充到表单中
      conditionData.forEach((category) => {
        if (!category || !category.type) return
        if (
          category.total_condition &&
          Array.isArray(category.total_condition) &&
          category.total_condition.length > 0
        ) {
          const categoryConfig = this.characteristicCategories.find(
            (cat) => cat.type === category.type
          )
          if (categoryConfig && categoryConfig.total_condition) {
            if (!this.totalConditions[category.type]) {
              const totalConditionsArray = categoryConfig.total_condition.map((tc, index) => {
                const totalConditionData = category.total_condition[index]
                let value = null
                if (totalConditionData && totalConditionData.params) {
                  const params = totalConditionData.params
                  if (tc.condition_type === 'timeRange') {
                    value = Array.isArray(params)
                      ? params.map((timestamp) => dayjs.unix(timestamp).valueOf())
                      : []
                  } else if (tc.condition_type === 'number_rang') {
                    value =
                      Array.isArray(params) && params.length >= 2
                        ? { min: params[0], max: params[1] }
                        : { min: 0, max: 0 }
                  } else if (tc.condition_type === 'number_items') {
                    value = Array.isArray(params) ? params.map((id) => ({ item_id: id })) : []
                  } else if (tc.condition_type === 'mapping') {
                    value = Array.isArray(params) ? params : []
                  } else if (tc.condition_type === 'radio') {
                    value = Array.isArray(params) && params.length > 0 ? params[0] : null
                  }
                }

                return {
                  ...tc,
                  value: value
                }
              })
              this.$set(this.totalConditions, category.type, totalConditionsArray)
            }
          }
        }
        if (category.sub && Array.isArray(category.sub) && category.sub.length > 0) {
          const categoryConfig = this.characteristicCategories.find(
            (cat) => cat.type === category.type
          )
          if (categoryConfig) {
            category.sub.forEach((subItem) => {
              const subConfig = categoryConfig.sub.find((s) => s.type === subItem.type)
              if (subConfig) {
                const formItem = {
                  id: this.nextId++,
                  type: subItem.type,
                  lebel: subItem.lebel || subConfig.lebel,
                  condition_type: subItem.condition_type || subConfig.condition_type,
                  unit: subItem.unit || subConfig.unit || '',
                  map_value: subItem.map_value || subConfig.map_value || [],
                  value: null,
                  categoryType: category.type
                }
                if (subItem.params) {
                  const params = subItem.params
                  if (formItem.condition_type === 'timeRange') {
                    formItem.value = Array.isArray(params)
                      ? params.map((timestamp) => dayjs.unix(timestamp).valueOf())
                      : []
                  } else if (formItem.condition_type === 'number_rang') {
                    formItem.value =
                      Array.isArray(params) && params.length >= 2
                        ? { min: params[0], max: params[1] }
                        : { min: 0, max: 0 }
                  } else if (formItem.condition_type === 'number_items') {
                    formItem.value = Array.isArray(params)
                      ? params.map((id) => ({ item_id: id }))
                      : []
                  } else if (formItem.condition_type === 'mapping') {
                    formItem.value = Array.isArray(params) ? params : []
                  } else if (formItem.condition_type === 'radio') {
                    formItem.value = Array.isArray(params) && params.length > 0 ? params[0] : null
                  }
                }
                this.formItems.push(formItem)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__wrap {
  border: none !important;
}
::v-deep .el-collapse-item__header {
  border: none !important;
  padding: 0 10px !important;
}

.el-icon-close {
  cursor: pointer;
  color: #909399;

  &:hover {
    color: #f56c6c;
  }
}
</style>
