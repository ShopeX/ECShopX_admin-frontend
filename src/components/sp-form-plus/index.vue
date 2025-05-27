<template>
  <el-form ref="form" class="sp-form-plus" :model="formData" :label-width="labelWidth">
    <div ref="wapperRef" class="sp-form-plus__wapper">
      <FormField
        v-for="item in formItems"
        :key="item.fieldName"
        :component="item.component || 'input'"
        :component-props="item.componentProps"
        :field-name="item.fieldName"
        :label="item.label"
        :rules="item.rules"
        :value="formData[item.fieldName]"
        @input="(val) => handleFieldChange(item.fieldName, val)"
      />
    </div>

    <template v-if="showDefaultActions">
      <div class="sp-form-plus__actions">
        <el-button @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </template>
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
    formItems: {
      type: Array,
      default: () => []
    },
    formApi: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '160px'
    },
    showDefaultActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: this.initFormData()
    }
  },
  watch: {
    formItems: {
      handler() {
        this.formData = this.initFormData()
      },
      deep: true
    }
  },
  created() {
    console.log('initial formItems:', this.formItems)
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      const formData = {}
      this.formItems.forEach((item) => {
        formData[item.fieldName] = item.value || ''
      })
      return formData
    },
    // 处理字段值变化
    handleFieldChange(fieldName, value) {
      console.log('field change:', fieldName, value)
      this.$set(this.formData, fieldName, value)
      this.$emit('field-change', { fieldName, value })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData)
        }
      })
    },
    // 重置表单
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    },
    // 验证表单
    validate() {
      debugger
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          valid ? resolve(this.formData) : reject(new Error('表单验证失败'))
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
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-form-plus {
  ::v-deep .el-select {
    display: block;
  }
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}
</style>
