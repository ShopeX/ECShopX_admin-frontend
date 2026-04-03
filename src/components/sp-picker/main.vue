<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.sp-picker-dialog {
  .el-dialog__body {
    padding: 0;
    border: 1px solid #dcdcdc;
  }
}
</style>
<template>
  <el-dialog class="sp-picker-dialog" :title="title" :visible.sync="isLocalShow" :width="width">
    <PickerType
      v-if="isLocalShow"
      ref="picker"
      :value="value"
      :type="type"
      v-bind="extra"
      @close="handleToggle(false)"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="isLocalShow = false">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { i18n } from '@/i18n'
import PickerType from './picker-type'

export default {
  name: 'SpPicker',

  components: { PickerType },

  props: {
    value: Object,
    type: String,
    width: {
      type: String,
      default: '1020px'
    },
    isShow: Boolean,
    extra: Object
  },

  data() {
    const { title: configTitle } = PickerType.resolvePickerConfig(this.type)
    const { dialogTitle } = this.value || {}
    // resolvePickerConfig 读到的是各 picker 静态 config.title（i18n key），此处必须翻译，否则弹窗显示 d81d8932.xxx
    const resolved =
      dialogTitle ||
      (configTitle != null && configTitle !== '' ? i18n.t(String(configTitle)) : configTitle)
    return {
      title: resolved,
      isLocalShow: false
    }
  },

  computed: {
    cancelText() {
      return i18n.t('8e248734.c08ab9')
    },
    confirmText() {
      return i18n.t('8e248734.aa7527')
    }
  },

  watch: {
    isShow: {
      immediate: true,
      handler(val) {
        this.isLocalShow = val
      }
    }
  },

  methods: {
    handleToggle(isShow) {
      if (isShow === undefined) isShow = !this.isLocalShow
      this.isLocalShow = isShow
      this.$emit('toggle', isShow)
      if (!isShow) {
        this.$emit('close')
      }
    },
    handleConfirm() {
      try {
        const val = this.$refs.picker.getVal()
        this.isLocalShow = false
        this.$emit('input', val)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>
