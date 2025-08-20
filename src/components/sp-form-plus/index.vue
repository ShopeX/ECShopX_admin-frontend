<template>
  <el-form
    ref="form"
    class="sp-form-plus"
    :class="{
      'sp-form-plus--search-form': formType === 'searchForm',
      'sp-form-plus--inline': inline
    }"
    :model="formData"
    :label-width="labelWidth"
  >
    <div ref="wapperRef" class="sp-form-plus__wapper">
      <FormField
        v-for="item in formItems"
        :key="item.fieldName"
        :component="item.component || 'input'"
        :component-props="item.componentProps"
        :field-name="item.fieldName"
        :form-item-class="item.formItemClass"
        :form-data="formData"
        :is-show="item.isShow"
        :label="`${item.label ? item.label + (colon ? ':' : '') : ''}`"
        :rules="item?.rules"
        :size="formType === 'searchForm' ? 'small' : ''"
        :tip="item.tip"
        :value="formData[item.fieldName]"
        @input="(val) => handleFieldChange(item.fieldName, val)"
      />

      <template v-if="showDefaultActions">
        <div class="sp-form-plus__actions" :style="actionsStyle">
          <el-button v-if="formType !== 'searchForm'" type="primary" @click="handleSubmit">
            <div class="flex items-center">
              <span class="ml-1">保存</span>
            </div>
          </el-button>

          <el-button v-if="formType === 'searchForm'" type="primary" @click="handleSubmit">
            <div class="flex items-center">
              <SpIcon name="search" :size="14" />
              <span class="ml-1">查询</span>
            </div>
          </el-button>

          <el-button v-if="formType === 'searchForm'" @click="handleReset">
            <div class="flex items-center">
              <SpIcon name="refresh" :size="14" />
              <span class="ml-1">重置</span>
            </div>
          </el-button>

          <!-- 搜索表单的扩展按钮 -->
          <el-button v-if="formType === 'searchForm'" type="text" @click="toggleExtend">
            <div class="flex items-center">
              <span>{{ `${extend ? '收起' : '展开'}` }}</span>
              <SpIcon
                :class="{ 'extend-icon': true, 'extend-active': extend }"
                name="chevrons-down"
              />
            </div>
          </el-button>
        </div>
      </template>
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
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '160px'
    },
    layout: {
      type: String,
      default: 'horizontal'
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
          typeof item.value === 'undefined' ? this.value?.[item.fieldName] || '' : item.value
      })
    return {
      formData,
      extend: false
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
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.$emit('input', val)
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
      immediate: false
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
    toggleExtend() {}
  }
}
</script>

<style lang="scss" scoped>
.sp-form-plus {
  ::v-deep .el-select {
    display: block;
  }
  &--inline {
    .sp-form-plus__wapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
  }
  &__actions {
    padding-top: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-column: -2 / -1;
  }
}
</style>
