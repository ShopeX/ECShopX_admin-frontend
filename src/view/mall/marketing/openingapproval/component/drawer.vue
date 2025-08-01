<template>
  <div class="cpn_drawer">
    <div ref="box" class="box">
      <div class="title" @click="switchHandle">{{ title }}<i class="el-icon-d-arrow-right" /></div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visibleDrawer', 'title'],
  methods: {
    switchHandle() {
      // debugger
      if (this.visibleDrawer) {
        this.$refs.box.classList.remove('hide')
        this.$refs.box.clientTop
        this.$refs.box.classList.add('show')
        this.$refs.box.clientTop

        this.$emit('close', false)
      } else {
        this.$refs.box.classList.remove('show')
        this.$refs.box.clientTop

        this.$refs.box.classList.add('hide')
        this.$refs.box.clientTop

        this.$emit('close', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.show {
  animation: slide 0.5s forwards;
}
.hide {
  animation: slide 0.5s reverse;
}
.content {
  padding: 20px;
  height: 100%;
  overflow-y: scroll;
  background: #fff;
}
.cpn_drawer {
  .box {
    position: fixed;
    top: 0;
    right: 0;
    background: #fff;
    height: 100%;
    width: 50%;
    z-index: 999;
    // overflow-y: scroll;
    box-shadow: -3px 2px 17px #888888;
    // border: 1px solid #999;
    transform: translateX(0%);
    //  transition: all 3s;
  }
  .title {
    box-shadow: -5px 4px 14px #888888;
    position: absolute;
    top: 0;
    right: 100%;
    width: 40px;
    z-index: 99;
    text-align: center;
    background: #fff;
    padding: 10px 5px;
    font-size: 16px;
    box-sizing: border-box;
    color: #409eff;
  }
}
@keyframes slide {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
