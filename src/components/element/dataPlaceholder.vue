<template>
  <div
    v-if="placeholderVisible"
    class="data-placeholder"
    :style="'height:' + height"
  >
    <div class="placeholder-content">
      <i class="iconfont icon-route" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      placeholderVisible: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData (val) {
      this.placeholderVisible = val
    }
  }
}
</script>

<style scoped lang="scss">
.data-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  .placeholder-content {
    text-align: center;
    i {
      font-size: 48px;
      color: #efefef;
      margin-bottom: 10px;
    }
    font-size: 14px;
    color: #ccc;
  }
}
</style>
