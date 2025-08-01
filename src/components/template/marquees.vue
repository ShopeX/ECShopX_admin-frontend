<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <el-carousel
      class="article"
      height="30px"
      :style="'background-color:' + config.bgcolor"
      :direction="config.direction"
      indicator-position="none"
      arrow="never"
    >
      <el-carousel-item v-for="(item, index) in data" :key="index">
        <div class="article-item" :style="'color:' + config.fontcolor">
          {{ item.title }}
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  created() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.article {
  width: 320px;
  .article-item {
    padding: 0 20px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
