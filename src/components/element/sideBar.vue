<template>
  <transition>
    <div
      v-show="visible"
      class="side-bar"
      :class="{ 'show': show }"
      :style="'width:' + width + 'vw'"
    >
      <div
        class="side-bar-close iconfont icon-times"
        @click="hideSideBar"
      />
      <div class="side-bar-title">
        {{ title }}
      </div>
      <div class="side-bar-body">
        <slot />
      </div>
      <div class="side-bar-footer">
        <slot name="footer" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true
    },
    width: {
      type: String,
      default: '30'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.show = true
          })
        })
      }
    }
  },
  methods: {
    hideSideBar () {
      this.$emit('update:visible', false)
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.side-bar {
  position: fixed;
  width: 30vw;
  top: 0;
  right: 0;
  bottom: 0;
  transform: translateX(100vw);
  transition: all 0.5s ease;
  background: #fafafa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  opacity: 0;
  z-index: 999;
  &.show {
    transform: translateX(0);
    opacity: 1;
  }
  .side-bar-title {
    padding-right: 30px;
    height: 50px;
    line-height: 65px;
    text-align: right;
    font-size: 16px;
    font-weight: 500;
  }
  .side-bar-close {
    position: absolute;
    left: 20px;
    top: 10px;
    color: #999;
    font-size: 24px;
  }
  .side-bar-body {
    padding: 20px;
    height: calc(100vh - 50px - 80px);
    overflow-y: overlay;
  }
  .side-bar-footer {
    padding: 0 20px;
    height: 80px;
    text-align: center;
  }
}
</style>
