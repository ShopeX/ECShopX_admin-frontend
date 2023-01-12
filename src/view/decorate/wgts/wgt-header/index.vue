<style lang="scss">
.wgt-header {
  &-content {
    // background-image: url('../../../../assets/imgs/weapp-header.png');
    height: 64px;
    width: 375px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    overflow: hidden;
  }
  .header-container {
    height: 32px;
    margin-top: 26px;
    padding: 0 30px;
    line-height: 32px;
    .title-image {
      max-height: 100%;
      max-width: 64px;
      display: inline-block;
    }
  }
}
</style>
<template>
  <div class="wgt-header" :style="headerStyle" @click="handleClickHeader">
    <div class="wgt-header-content" :style="contentStyle">
      <div v-if="value" class="header-container" :style="containerStyle">
        <span v-if="value.pageBackgroundStyle == '1'">{{ value.wgtName }}</span>
        <sp-image v-else class="title-image" :src="value.pageBackgroundImage" />
      </div>
    </div>
  </div>
</template>

<script>
const weappHeaderDark = require('@/assets/imgs/weapp-header-dark.png')
const weappHeaderLight = require('@/assets/imgs/weapp-header-light.png')
import config from './config'
export default {
  name: 'Header',
  wgtName: '页面设置',
  wgtDesc: '',
  config: config,
  props: {
    click: Function,
    value: [Object, Array]
  },
  data() {
    return {}
  },
  computed: {
    headerStyle() {
      console.log('headerStyle:', this)
      const { navigateStyle, navigateBackgroundColor, navigateBackgroundImage } = this.value || {}
      if (navigateStyle == '1') {
        return {
          'background-color': navigateBackgroundColor
        }
      } else {
        return {
          'background-image': `url(${navigateBackgroundImage})`,
          'background-size': 'cover',
          'background-position': 'center'
        }
      }
    },
    contentStyle() {
      const { navigateStyle, navigateBackgroundColor } = this.value || {}
      return {
        'background-image': `url(${
          this.isLight(this.get16ToRgb(navigateBackgroundColor))
            ? weappHeaderDark
            : weappHeaderLight
        })`
      }
    },
    containerStyle() {
      const { titlePosition, pageBackgroundColor } = this.value || {}
      return {
        'text-align': titlePosition,
        'color': pageBackgroundColor
      }
    }
  },
  created() {},
  methods: {
    handleClickHeader() {
      this.$emit('change')
    },
    isLight(rgb = [0, 0, 0]) {
      return 0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2] > 255 / 2
    },
    get16ToRgb(str) {
      var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
      if (!reg.test(str)) {
        return
      }
      let newStr = str.toLowerCase().replace(/\#/g, '')
      let len = newStr.length
      if (len == 3) {
        let t = ''
        for (var i = 0; i < len; i++) {
          t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
        }
        newStr = t
      }
      let arr = [] //将字符串分隔，两个两个的分隔
      for (let i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2)
        arr.push(parseInt('0x' + s))
      }
      return arr
    }
  }
}
</script>
