<template>
  <el-dialog
    :visible.sync="isLocalShow"
    :title="title"
    :width="dialogSize"
    :before-close="handleBeforeClose"
    @close="handleClose"
  >
    <slot />

    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="computedButtonCancel.visible"
        icon="el-icon-circle-close"
        @click="handleCancel"
      >
        {{ computedButtonCancel.text }}
      </el-button>

      <el-button
        v-if="computedButtonConfirm.visible"
        type="primary"
        icon="el-icon-circle-check"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ computedButtonConfirm.text }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SpDialogPlus',

  props: {
    buttonCancel: {
      type: Object,
      default: () => ({
        visible: true,
        text: '取消'
      })
    },
    buttonConfirm: {
      type: Object,
      default: () => ({
        visible: true,
        text: '确定'
      })
    },
    width: {
      type: String,
      default: '1008px'
    },
    value: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String
    },
    isShow: Boolean
  },

  computed: {
    dialogSize() {
      const SIZE = {
        medium: '1000px',
        small: '800px',
        mini: '600px'
      }
      return SIZE[this.size] || '1200px'
    },
    computedButtonCancel() {
      return {
        visible: true,
        text: '取消',
        ...this.buttonCancel
      }
    },
    computedButtonConfirm() {
      return {
        visible: true,
        text: '确定',
        ...this.buttonConfirm
      }
    }
  },

  data() {
    const { title } = this.value
    return {
      title,
      isLocalShow: false,
      loading: false
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

  created() {
    console.log('main created', this)
  },

  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    handleClose() {
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
    },
    handleConfirm() {
      this.loading = true
      this.$emit('confirm', () => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    padding: 16px 20px;
  }
  .el-dialog__body {
    padding: 12px;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
  }
  .el-dialog__footer {
    padding: 16px 20px;
  }
}
</style>
