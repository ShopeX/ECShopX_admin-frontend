<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.wgt-page {
  .title-function {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    .title-function-image {
      height: 100%;
      aspect-ratio: 1/1;
    }
  }

  &-content {
    // background-image: url('../../../../assets/imgs/weapp-header.png');
    height: 64px;
    width: 375px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    overflow: hidden;
    padding-right: 94px;
    box-sizing: border-box;
  }

  .header-content-left {
    width: 94px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
  }

  .header-container {
    height: 32px;
    margin-top: 26px;
    line-height: 32px;
    position: relative;
    display: flex;
    align-items: center;

    .title-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      flex: 1;
      min-width: 0;
    }

    .title-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      flex: 1;
      min-width: 0;
    }

    &.has-nearby {
      justify-content: flex-start;

      .title-function.nearby-function {
        max-width: 84px; // 六个汉字的宽度 (6 * 14px)
        flex-shrink: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        .nearby-function-text {
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 60px;
        }

        .nearby-function-icon {
          font-size: 14px;
          color: #333;
        }
      }

      .title-search {
        flex: 1;
        padding-left: 0;
        min-width: 0;

        .search-container {
          max-width: none;
        }
      }
    }

    .title-text {
      font-size: 14px;
      color: #333;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-image {
      height: 100%;
      display: inline-block;
    }

    .title-search {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 0; // 允许 flex 子元素收缩
      margin-left: 0;
      position: relative;
      z-index: 2; // 确保在功能区之上
      box-sizing: border-box;

      // 当有功能区（热区图）时，添加左边距避免覆盖
      .header-container:not(.has-nearby) & {
        margin-left: 105px; // 90px (title-function width) + 15px (padding)
      }

      .search-container {
        display: flex;
        width: 100%;
        max-width: 300px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        box-sizing: border-box;
        margin-right: 5px;

        .search-input {
          flex: 1;
          height: 32px;
          padding: 0 12px 0 20px;
          border-right: none;
          background-color: #fff;
          font-size: 14px;
          outline: none;
          position: relative;

          &::placeholder {
            color: #999;
          }
        }

        .search-icon {
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #999;
          pointer-events: none;
          z-index: 1;
        }

        .search-button {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 32px;
          padding: 0 10px;
          border: none;
          border-radius: 0 4px 4px 0;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
<template>
  <div class="wgt-page" :style="headerStyle" @click="handleClickHeader">
    <div class="wgt-page-content" :style="contentStyle">
      <div
        v-if="value && value.titleStyle != '0'"
        class="header-container"
        :class="{ 'has-nearby': showFunctionArea && functionAreaType === 'nearby' }"
        :style="containerStyle"
      >
        <div class="header-content-left">
          <!-- 功能区：热区图 -->
          <div
            class="title-function"
            v-if="showFunctionArea && functionAreaType === 'hotzone' && functionAreaHotzone?.imgUrl"
          >
            <sp-image class="title-function-image" :src="functionAreaHotzone.imgUrl" />
          </div>
          <!-- 功能区：附近门店 -->
          <div
            v-if="showFunctionArea && functionAreaType === 'nearby'"
            class="title-function nearby-function"
          >
            <p class="nearby-function-text">{{ i18n.t('33e085f7.e94e8b') }}</p>
            <i class="nearby-function-icon el-icon-arrow-down" />
            <!-- 附近门店组件，可根据需要添加 -->
          </div>
        </div>
        <div class="title-container">
          <!-- 标题区：搜索 -->
          <div v-if="value.titleStyle == '3' && value.showSearchButton" class="title-search">
            <div class="search-container">
              <i class="el-icon-search search-icon" />
              <input type="text" class="search-input" placeholder="" />
              <div class="search-button" :style="searchButtonStyle">
                <span>{{ i18n.t('33e085f7.e5f71f') }}</span>
              </div>
            </div>
          </div>
          <!-- 标题区：页面名称 -->
          <div v-if="value.titleStyle == '1'" class="title-text">{{ value.wgtName }}</div>
          <!-- 标题区：图片 -->
          <sp-image
            v-if="value.titleStyle == '2'"
            class="title-image"
            :src="value.titleBackgroundImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const weappHeaderDark = require('@/assets/imgs/weapp-header-dark.png')
const weappHeaderLight = require('@/assets/imgs/weapp-header-light.png')
import { i18n } from '@/i18n'
import config from './config'
export default {
  name: 'Page',
  wgtName: i18n.t('33e085f7.a018ef'),
  wgtDesc: '',
  config: config,
  props: {
    click: Function,
    value: [Object, Array]
  },
  data() {
    return { i18n }
  },
  computed: {
    headerStyle() {
      const { newNavigateStyle } = this.value || {}
      const style = {}

      if (newNavigateStyle?.color) {
        style['background-color'] = newNavigateStyle.color
      }
      if (newNavigateStyle?.image) {
        style['background-image'] = `url(${newNavigateStyle.image})`
        style['background-size'] = 'cover'
        style['background-position'] = 'center'
      }

      return style
    },
    contentStyle() {
      const { navigateBackgroundColor } = this.value || {}
      return {
        'background-image': `url(${
          this.isLight(this.get16ToRgb(navigateBackgroundColor))
            ? weappHeaderDark
            : weappHeaderLight
        })`
      }
    },
    containerStyle() {
      const { titlePosition, titleColor } = this.value || {}
      return {
        'text-align': titlePosition,
        color: titleColor
      }
    },
    showFunctionArea() {
      const pTitleHotSetting = this.value?.pTitleHotSetting
      return pTitleHotSetting && pTitleHotSetting.type && pTitleHotSetting.type !== 'none'
    },
    functionAreaType() {
      return this.value?.pTitleHotSetting?.type || 'none'
    },
    functionAreaHotzone() {
      return this.value?.pTitleHotSetting?.hotzone || {}
    },
    searchButtonStyle() {
      const searchButtonColor = this.value?.searchButtonColor
      if (!searchButtonColor) {
        return {}
      }
      return {
        backgroundColor: searchButtonColor.bgColor,
        color: searchButtonColor.textColor
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
