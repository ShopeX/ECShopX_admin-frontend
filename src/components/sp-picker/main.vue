<style lang="scss">
.sp-picker-dialog {
  .el-dialog__body {
    padding: 0;
    border: 1px solid #dcdcdc;
  }
}
</style>
<template>
  <el-dialog
    class="sp-picker-dialog"
    :title="title"
    :visible.sync="isLocalShow"
    :width="width"
  >
    <PickerType
      v-if="isLocalShow"
      ref="picker"
      :value="value"
      :type="type"
      v-bind="extra"
      @close="handleToggle(false)"
    />

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="isLocalShow = false">取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PickerType from './picker-type'

export default {
  name: 'SpPicker',

  components: { PickerType },

  props: {
    value: Object,
    type: String,
    width: {
      default: '1008px'
    },
    isShow: Boolean,
    extra: Object
  },

  data () {
    const { title } = PickerType.resolvePickerConfig(this.type)

    return {
      title,
      isLocalShow: false
    }
  },

  watch: {
    isShow: {
      immediate: true,
      handler (val) {
        this.isLocalShow = val
      }
    }
  },

  methods: {
    handleToggle (isShow) {
      if (isShow === undefined) isShow = !this.isLocalShow
      this.isLocalShow = isShow
      this.$emit('toggle', isShow)
      if (!isShow) {
        this.$emit('close')
      }
    },
    handleConfirm () {
      const val = this.$refs.picker.getVal()
      this.isLocalShow = false
      this.$emit('input', val)
    }
  }
}
</script>
