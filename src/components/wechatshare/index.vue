<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<!--
 * @Author: your name
 * @Date: 2021-01-25 16:55:19
 * @LastEditTime: 2021-01-26 11:19:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/espier-shop/app/src/components/wechatshare/index.vue
-->

<template>
  <div class="wechat-share" :style="{ width: width, 'background-color': backgroundColor }">
    <div class="wechat-share-content">
      <div class="header">
        <div class="header_avatar" />
        <div class="header_shopname">
          {{ name }}
        </div>
      </div>
      <div class="title">
        {{ title }}
      </div>
      <div class="img" :style="{ height: calcHeight }">
        <div v-if="!contentImgSrc">小程序图片</div>
        <img
          v-if="contentImgSrc"
          ref="contentImg"
          :src="contentImgSrc"
          :class="{ normalImg: imgType === 0 || imgType === 2, heightImg: imgType === 1 }"
        >
      </div>
      <div class="footer">
        <div class="link">
          <img :src="link">
        </div>
        <div>小程序</div>
      </div>
    </div>
    <div class="wechat-share-avatar">
      <img :src="avatarImgSrc">
    </div>
    <div />
  </div>
</template>

<script>
import link from './link.png'
export default {
  props: {
    width: {
      type: String,
      default: '400px'
    },
    backgroundColor: {
      type: String,
      default: '#eaeaea'
    },
    avatarImgSrc: {
      type: String,
      default:
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2732082268,3232846140&fm=11&gp=0.jpg'
    },
    contentImgSrc: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '小程序标题'
    },
    name: {
      type: String,
      default: '小程序名称'
    },
    footerText: {
      type: String,
      default: '小程序'
    }
  },
  data() {
    return {
      calcHeight: '',
      link,
      //0-正常 1-宽大于高 2-宽小于高
      imgType: 0
    }
  },
  watch: {
    contentImgSrc(val) {
      const self = this
      this.loadImgPromise(val).then(img => {
        self.clipPic(img.width, img.height)
      })
    }
  },
  mounted() {
    this.calcHeight = ('300px'.slice(0, -2) - 32) * (4 / 5) + 'px'
  },
  methods: {
    loadImgPromise(src) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = src
        // 这里改变promise对象状态，并且把图片往下传递
        img.onload = () => {
          resolve(img)
        }
      })
    },
    clipPic(width, height) {
      if (width === height) {
        this.imgType = 0
      } else if (height > width) {
        this.imgType = 2
      } else if (height < width) {
        this.imgType = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-share {
  padding: 10px;
  display: flex;
  justify-content: flex-end;

  &-content {
    width: 300px;
    background: #fff;
    margin-right: 10px;
    position: relative;
    padding: 0px 16px;
    border-radius: 4px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      border: 5px solid transparent;
      border-left-color: #fff;
      top: 15px;
      right: -10px;
      width: 0;
    }

    .header {
      &_avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #d3d3d3;
      }
      &_shopname {
        color: grey;
        margin-left: 6px;
      }
    }
    .title {
      font-size: 15px;
    }
    .img {
      overflow: hidden;
      background: rgb(209, 209, 209);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;

      margin-bottom: 6px;
    }
    .normalImg {
      width: 100%;
    }
    .heightImg {
      height: 100%;
    }
    .footer {
      position: relative;
      line-height: 2;
      display: flex;
      align-items: center;

      &:before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: #e6e6e6;
        content: '';
      }

      .link {
        width: 16px;
        height: 16px;
        background-image: url('./link.png');
        margin-right: 6px;
        line-height: 1;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  &-avatar {
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
</style>
