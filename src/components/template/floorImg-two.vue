<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <!-- <div class="floorImg-title">{{base.title}}</div> -->
    <div class="floorImg">
      <div class="floorImg_img_list">
        <div v-for="(item, index) in data" :key="index" class="floorImg_img_li">
          <img class="floorImg_img" :src="wximageurl + item.imgUrl">
          <div class="imgs_title" :style="'color:' + base.WordColor">
            {{ item.ImgTitle }}
          </div>
        </div>
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
.floorImg-title {
  font-size: 20px;
  color: #00081c;
  text-align: left;
  padding: 20px 10px;
}
.floorImg {
  overflow-x: scroll;
  position: relative;
  display: flex;
  align-items: center;
}
.floorImg_img_list {
  display: flex;
  align-items: center;
  margin: 0 10px;
  height: 230px;
  .floorImg_img_li {
    width: 160px;
    height: 230px;
    margin-right: 10px;
    flex-shrink: 0;
    position: relative;
    .floorImg_img {
      width: 100%;
      height: 100%;
    }
    .imgs_title {
      width: 100%;
      text-align: left;
      padding-left: 10px;
      position: absolute;
      bottom: 14px;
    }
  }
}
</style>
