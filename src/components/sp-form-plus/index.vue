<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form
    ref="form"
    class="sp-form-plus"
    :class="{
      'sp-form-plus--search-form': formType === 'searchForm',
      'sp-form-plus--display-form': formType === 'displayForm',
      'sp-form-plus--inline': inline,
      'sp-form-plus--collapsed': formType === 'searchForm' && !extend,
      'sp-form-plus--label-top': formType === 'searchForm' && labelPosition === 'top',
      'sp-form-plus--actions-bottom': isSearchActionsBottom
    }"
    :model="formData"
    :label-width="labelWidth"
    :label-position="labelPosition"
    @submit.native.prevent="handleSubmit"
  >
    <div
      ref="wrapperRef"
      :class="{
        flex: formType === 'searchForm' && !isSearchActionsBottom,
        'sp-form-plus__layout-bottom': isSearchActionsBottom
      }"
    >
      <div
        :class="{
          'sp-form-plus__wrapper': formType === 'searchForm',
          'sp-form-plus__wrapper-inline': inline,
          'sp-form-plus__wrapper-flex': inline && hasFormItemClass,
          'flex-1': true
        }"
      >
        <FormField
          v-for="item in formItems"
          :key="item.fieldName"
          :component="item.component || 'input'"
          :component-props="item.componentProps"
          :field-name="item.fieldName"
          :form-item-class="item.formItemClass"
          :cell-width="item.cellWidth || 1"
          :computed-cell-width="getComputedCellWidth(item.cellWidth || 1)"
          :default-cell-width="effectiveDefaultCellWidth"
          :cell-gap="cellGap"
          :form-data="formData"
          :form-type="formType"
          :is-show="item.isShow"
          :label="item.label ? item.label + (colon ? ':' : '') : ''"
          :label-inline="labelInline"
          :rules="item.rules"
          :hide-field-required-mark="hideFieldRequiredMark"
          :size="formType === 'searchForm' ? 'small' : ''"
          :tip="item.tip"
          :value="formData[item.fieldName]"
          @input="(val) => handleFieldChange(item.fieldName, val)"
        />
      </div>
      <div v-if="showDefaultActions" class="sp-form-plus__actions-wrapper">
        <div
          class="sp-form-plus__actions items-center justify-end"
          :style="actionsStyle"
          v-if="formType !== 'searchForm'"
        >
          <div class="sp-form-plus__actions-btns">
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
              <span class="ml-1">{{ $t('2d9168f2.be5fbb') }}</span>
            </el-button>
          </div>
        </div>
        <div
          :class="[
            'sp-form-plus__actions flex-col items-end !pt-0',
            isSearchActionsBottom ? 'mt-3' : 'ml-1 mt-1'
          ]"
          :style="actionsStyle"
          v-else
        >
          <div class="sp-form-plus__actions-btns">
            <el-button type="primary" @click="handleSubmit">
              <div class="flex items-center">
                <SpIcon name="search" :size="14" />
                <span class="ml-1">{{ $t('2d9168f2.bee912') }}</span>
              </div>
            </el-button>

            <el-button @click="handleReset">
              <div class="flex items-center">
                <SpIcon name="refresh" :size="14" />
                <span class="ml-1">{{ $t('2d9168f2.4b9c32') }}</span>
              </div>
            </el-button>
          </div>
          <!-- 搜索表单的扩展按钮 -->
          <el-button type="text" @click="toggleExtend" v-if="showExtend">
            <div class="flex items-center mt-3">
              <span>{{ extend ? $t('2d9168f2.def9e9') : $t('2d9168f2.e2edde') }}</span>
            </div>
          </el-button>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import FormField from './form-field'

export default {
  name: 'SpFormPlus',
  components: {
    FormField
  },
  props: {
    labelPosition: {
      type: String,
      default: 'right'
    },

    colon: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: 'searchForm'
    },
    formItems: {
      type: Array,
      default: () => []
    },
    formApi: {
      type: Object,
      default: () => ({})
    },
    hideFieldRequiredMark: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      //default: '160px'
      default: '100px'
    },
    labelInline: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'horizontal'
    },
    searchActionsLayout: {
      type: String,
      default: '',
      validator: (value) => ['', 'inline', 'bottom-right'].includes(value)
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    showDefaultActions: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    defaultCellWidth: {
      type: Number,
      default: 240
    },
    cellGap: {
      type: Number,
      default: 8
    }
  },
  data() {
    const formData = {}
    this.formItems
      .filter((item) => {
        const isLayoutComponent =
          typeof item.component === 'string' &&
          ['group', 'divider'].includes(item.component.toLowerCase())
        return !isLayoutComponent
      })
      .forEach((item) => {
        formData[item.fieldName] =
          typeof item.value === 'undefined'
            ? (this.value && this.value[item.fieldName]) || ''
            : item.value
      })
    return {
      formData,
      extend: false,
      showExtend: false,
      rows: 0
    }
  },
  computed: {
    effectiveDefaultCellWidth() {
      if (this.formType === 'searchForm') {
        return this.defaultCellWidth
      }
      return null
    },
    actionsStyle() {
      return this.formType === 'searchForm'
        ? {
            width: '100%',
            'text-align': 'right'
          }
        : {
            'padding-left': `${this.labelWidth}`,
            'justify-content': 'flex-start',
            'margin-bottom': '22px'
          }
    },
    // 检查是否有表单项使用了 formItemClass
    hasFormItemClass() {
      return this.formItems.some((item) => item.formItemClass)
    },
    effectiveSearchActionsLayout() {
      if (this.formType !== 'searchForm') return 'inline'
      if (this.searchActionsLayout) return this.searchActionsLayout
      return this.labelPosition === 'top' ? 'bottom-right' : 'inline'
    },
    isSearchActionsBottom() {
      return this.formType === 'searchForm' && this.effectiveSearchActionsLayout === 'bottom-right'
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.$emit('input', val)
        this.formItems.forEach((item) => {
          if (item.isShow) {
            item.isShow(val[item.fieldName], val)
          }
        })
      },
      deep: true, // 深度监听对象内部变化
      immediate: true // 初始化时不触发
    },
    value: {
      handler(val) {
        Object.keys(val).forEach((key) => {
          this.formData[key] = val[key]
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.formType === 'searchForm') {
      this.$nextTick(() => {
        this.calcRows()
      })
      // 监听窗口大小变化
      const handleResize = () => {
        setTimeout(() => {
          this.calcRows()
        }, 50)
      }
      window.addEventListener('resize', handleResize)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', handleResize)
      })
    }
  },
  methods: {
    getComputedCellWidth(cellWidth) {
      if (this.effectiveDefaultCellWidth === null) {
        return null
      }
      return cellWidth * this.effectiveDefaultCellWidth + (cellWidth - 1) * this.cellGap
    },
    // 处理字段值变化
    handleFieldChange(fieldName, value) {
      this.$set(this.formData, fieldName, value)
      // this.$emit('field-change', { fieldName, value })
    },
    // 提交表单
    async handleSubmit() {
      await this.validate()
      this.$emit('submit', this.formData)
    },
    // 重置表单
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    },
    // 验证表单
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, object) => {
          if (valid) {
            resolve(this.formData)
          } else {
            reject(object)
          }
        })
      })
    },
    // 重置指定字段
    resetField(field) {
      this.$refs.form.resetField(field)
    },
    // 清除验证
    clearValidate(props) {
      this.$refs.form.clearValidate(props)
    },
    // 切换展开/收起
    toggleExtend() {
      this.extend = !this.extend
    },
    // 计算行数，判断是否需要显示展开/收起按钮
    calcRows() {
      if (!this.$refs.wrapperRef || this.formType !== 'searchForm') {
        return
      }
      this.$nextTick(() => {
        const container = this.$refs.wrapperRef
        if (!container) {
          return
        }
        const wrapper = container.querySelector('.sp-form-plus__wrapper')
        if (!wrapper) {
          this.showExtend = false
          return
        }

        const formFields = Array.from(wrapper.querySelectorAll('.form-field'))

        if (formFields.length === 0) {
          this.showExtend = false
          return
        }

        // 通过检查每个表单项的 top 位置来判断行数
        // 这是最准确的方法，适用于所有布局方式（grid、flex等）
        const rowPositions = new Set()
        const wrapperRect = wrapper.getBoundingClientRect()

        formFields.forEach((field) => {
          const fieldRect = field.getBoundingClientRect()
          const relativeTop = Math.round(fieldRect.top - wrapperRect.top)
          // 将相近的位置归为同一行（允许 3px 误差）
          let foundRow = false
          for (const pos of rowPositions) {
            if (Math.abs(relativeTop - pos) <= 3) {
              foundRow = true
              break
            }
          }
          if (!foundRow) {
            rowPositions.add(relativeTop)
          }
        })
        const rows = rowPositions.size
        this.rows = rows
        // 如果超过2行，显示展开/收起按钮
        this.showExtend = rows > 2
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-form-plus {
  ::v-deep .el-select {
    display: block;
  }
  &--inline {
    .sp-form-plus__wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 8px;
      .form-field {
        margin-bottom: 0;
      }
    }
    // 当有 formItemClass 时，使用 flex 布局
    .sp-form-plus__wrapper-flex {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      .form-field {
        margin-bottom: 0;
      }
    }
    .sp-form-plus__actions {
      padding-top: 0;
    }
  }
  &--search-form {
    background-color: #f6f7f9;
    box-sizing: content-box;
    padding: 16px 16px 16px;
    overflow: hidden;

    .sp-form-plus__wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0; //允许 flex 子元素缩小
      overflow: hidden; //防止内容溢出

      .form-field {
        margin-bottom: 0;
        // 当空间不足时，允许表单项缩小或换行
        max-width: 100%;
        overflow: hidden;
      }
    }

    &.sp-form-plus--collapsed {
      .sp-form-plus__wrapper {
        max-height: 85px;
        overflow: hidden;
      }
    }

    // 按钮容器包装器，防止被压缩
    .sp-form-plus__actions-wrapper {
      flex-shrink: 0;
      min-width: fit-content;
    }
  }

  &--label-top {
    ::v-deep .el-form-item__label {
      float: none;
      display: block;
      padding: 0 0 6px;
      text-align: left;
      line-height: 20px;
    }

    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
      line-height: normal;
    }
  }

  &--actions-bottom {
    .sp-form-plus__layout-bottom {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .sp-form-plus__wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px 24px;
      width: 100%;

      .form-field {
        width: 100% !important;
        max-width: none !important;
        flex: initial !important;
      }
    }

    .sp-form-plus__actions-wrapper {
      width: 100%;
      min-width: 0;
    }

    .sp-form-plus__actions {
      width: 100%;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 0;
      margin-top: 16px !important;
    }

    .sp-form-plus__actions-btns {
      display: flex;
      justify-content: flex-end;
    }
  }
  &__actions {
    padding-top: 40px;
    display: flex;
    grid-column: -2 / -1;
  }
}
</style>
