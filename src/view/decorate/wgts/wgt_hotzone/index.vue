<style lang="scss">
.wgt-hotzone {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .wgt-hotzone-bd {
    width: fit-content;
    height: 100%;
    box-sizing: border-box;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }

    .el-image {
      min-width: 100%;
    }
  }

  .wgt-hotzone-error {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
<style lang="scss">
.wgt-hotzone-bd-vertical {
  .el-image__inner {
    min-width: fit-content
  }
}
</style>
<template>
  <div class="wgt-hotzone" :style="outerStyle">
    <div class="wgt-hotzone-bd" :class="{ 'wgt-hotzone-bd-vertical': value.animation === 'vertical' }">
      <el-image :src="value.data.imgUrl" :style="{ height: value.animation === 'vertical' ? value.imgHeight + 'px' : 'auto' }">
        <div slot="error" class="wgt-hotzone-error">
          <img :src="dImage" width="100%" height="100%" style="object-fit: cover;">
        </div>
      </el-image>
    </div>
  </div>
</template>

<script>
import dImage from '@/assets/imgs/default.jpg'
import config from './config'
export default {
  name: 'ImgHotzone',
  wgtName: '热区图',
  wgtDesc: '',
  wgtIcon: 'wgt-hotzone',
  wgtType: 1,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      dImage: dImage
    }
  },
  computed: {
    outerStyle() {
      return {
        paddingTop: this.value.outerMargin.paddedt + 'px',
        paddingBottom: this.value.outerMargin.paddedb + 'px',
        paddingLeft: this.value.outerMargin.paddedl + 'px',
        paddingRight: this.value.outerMargin.paddedr + 'px',
      }
    }
  },
  created() { },
  methods: {}
}
</script>
