<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <div class="hotTopic-list">
      <div class="slider-wrap">
        <!-- <img
          :class="item.name"
          v-for="(item, index) in data"
          :key="index"
          :src="item.imgUrl"
          alt=""
        /> -->
        <img :src="data[0].imgUrl || data[1].imgUrl" alt="">

        <!-- <img class="png" :src="data[0].imgUrl" alt="">
        <img class="gif" :src="data[1].imgUrl" alt=""> -->
      </div>
    </div>
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
      name: '',
      base: {},
      data: [],
      png: '',
      gif: ''
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.slider-wrap {
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
}
.gif {
  width: 100%;
}
.png {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
