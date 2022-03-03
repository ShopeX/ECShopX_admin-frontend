<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>

    <!-- <div class="floorImg-title">{{base.title}}</div> -->

    <div class="floorImg">
      <div class="floorImg_img_list" v-if="base.openBackImg">
        <img :src="wximageurl + base.backgroundImg" class="floorImg-imgs" />
        <div class="floorImg_img_li1" v-for="(item, index) in data" :key="index">
          <img class="floorImg_img" :src="wximageurl + item.imgUrl" />
          <div class="imgs_title" :style="'color:' + base.WordColor">{{ item.ImgTitle }}</div>
        </div>
      </div>

      <div class="floorImg_img_list" v-else>
        <div class="floorImg_img_li2" v-for="(item, index) in data" :key="index">
          <img class="floorImg_img" :src="wximageurl + item.imgUrl" />
          <div class="imgs_title" :style="'color:' + base.WordColor">{{ item.ImgTitle }}</div>
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
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.floorImg-title {
  font-size: 20px;
  color: #00081c;
  text-align: center;
  padding: 20px 0;
}
.floorImg {
  // height: 225px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  white-space: nowrap;
  position: relative;
  // background: #0ff;

  .floorImg-imgs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.floorImg_img_list {
  // margin: 0 20px;
  padding: 0 10px 0 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  height: 225px;
  .floorImg_img_li1 {
    width: 160px;
    height: 160px;
    margin-right: 10px;
    z-index: 15;
    flex-shrink: 0;
    position: relative;
    background: #f5f5f5;
    .floorImg_img {
      width: 100%;
      height: 100%;
    }
    .imgs_title {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 14px;
    }
  }

  .floorImg_img_li2 {
    width: 160px;
    height: 230px;
    margin-right: 10px;
    z-index: 15;
    flex-shrink: 0;
    position: relative;
    background: #f5f5f5;
    .floorImg_img {
      width: 100%;
      height: 100%;
    }
    .imgs_title {
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
  }
}
</style>
