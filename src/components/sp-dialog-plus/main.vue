<template>
  <el-dialog
    :visible.sync="isLocalShow"
    :title="title"
    :width="width"
    :before-close="handleBeforeClose"
    @close="handleClose"
  >
    <slot />

    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-circle-close" @click="handleCancel"> 取消 </el-button>

      <el-button
        type="primary"
        icon="el-icon-circle-check"
        :loading="loading"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SpDialogPlus',

  props: {
    width: {
      type: String,
      default: '1008px'
    },
    value: {
      type: Object,
      default: () => ({})
    },
    isShow: Boolean
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
      debugger
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
