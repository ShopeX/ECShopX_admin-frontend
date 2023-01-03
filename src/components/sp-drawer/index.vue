<style lang="scss">
.sp-drawer {
  .el-drawer__header {
    font-size: 16px;
    color: #333;
  }
  .el-drawer__body {
    display: flex;
    flex-direction: column;
  }
  .sp-drawer__content {
    flex: 1;
    padding: 0 10px;
    overflow: auto;
  }
  .sp-drawer__footer {
    height: 60px;
    padding: 10px;
    text-align: center;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
</style>
<template>
  <el-drawer
    ref="drawer"
    v-bind="$attrs"
    :title="title"
    :visible.sync="isShow"
    direction="rtl"
    custom-class="sp-drawer"
    destroy-on-close
    @close="onCloseDrawer"
  >
    <div class="sp-drawer__content">
      <slot />
    </div>
    <div v-if="footer" class="sp-drawer__footer">
      <el-button plain @click="onCloseDrawer">关闭</el-button>
      <el-button type="primary" @click="onConfirmDrawer">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'SpDrawer',
  props: {
    title: {
      type: String,
      default: '抽屉'
    },
    width: {
      type: String,
      default: '200px'
    },
    value: {
      type: Boolean,
      default: false
    },
    footer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {},
  watch: {
    value(nVal, oVal) {
      this.isShow = nVal
    }
  },
  created() {},
  methods: {
    onCloseDrawer() {
      this.$emit('input', false)
    },
    onConfirmDrawer() {
      this.$emit('confirm')
    }
  }
}
</script>
