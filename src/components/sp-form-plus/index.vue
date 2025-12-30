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
      'sp-form-plus--inline': inline,
      'sp-form-plus--collapsed': formType === 'searchForm' && !extend
    }"
    :model="formData"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <div ref="wrapperRef" :class="{ flex: formType === 'searchForm' }">
      <div :class="{
        'sp-form-plus__wrapper': formType === 'searchForm',
        'sp-form-plus__wrapper-inline': inline,
        'sp-form-plus__wrapper-flex': inline && hasFormItemClass,
        'flex-1': true
      }">
        <FormField
          v-for="item in formItems"
          :key="item.fieldName"
          :component="item.component || 'input'"
          :component-props="item.componentProps"
          :field-name="item.fieldName"
          :form-item-class="item.formItemClass"
          :form-data="formData"
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
      <div v-if="showDefaultActions">
        <div class="sp-form-plus__actions items-center justify-end" :style="actionsStyle" v-if="formType !== 'searchForm'">
          <div class="sp-form-plus__actions-btns">
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
              <span class="ml-1">保存</span>
            </el-button>
          </div>
        </div>
        <div class="sp-form-plus__actions ml-1 mt-1 flex-col items-end" :style="actionsStyle" v-else>
          <div class="sp-form-plus__actions-btns">
            <el-button type="primary" @click="handleSubmit">
              <div class="flex items-center">
                <SpIcon name="search" :size="14" />
                <span class="ml-1">查询</span>
              </div>
            </el-button>

            <el-button @click="handleReset">
              <div class="flex items-center">
                <SpIcon name="refresh" :size="14" />
                <span class="ml-1">重置</span>
              </div>
            </el-button>
          </div>
          <!-- 搜索表单的扩展按钮 -->
          <el-button type="text" @click="toggleExtend" v-if="showExtend">
            <div class="flex items-center mt-3">
              <span>{{ extend ? '收起' : '展开' }}</span>
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
      default: 'right',
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
      default: '160px'
    },
    labelInline: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'horizontal'
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
    }
  },
  data() {
    const formData = {}
    this.formItems
      .filter((item) => item.component !== 'group')
      .forEach((item) => {
        formData[item.fieldName] =
          typeof item.value === 'undefined' ? (this.value && this.value[item.fieldName] || '') : item.value
      })
    return {
      formData,
      extend: false,
      showExtend: false,
      rows: 0
    }
  },
  computed: {
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
      return this.formItems.some(item => item.formItemClass)
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
    
    &.sp-form-plus--collapsed {
      .sp-form-plus__wrapper {
        max-height: 85px;
        overflow: hidden;
      }
    }
  }
  // &__wrapper {
  //   display: flex;
  //   flex-wrap: wrap;
  //   gap: 8px;
  //   .form-field {
  //     margin-bottom: 0;
  //   }
  // }
  &__actions {
    padding-top: 40px;
    display: flex;
    grid-column: -2 / -1;
  }
}
</style>
