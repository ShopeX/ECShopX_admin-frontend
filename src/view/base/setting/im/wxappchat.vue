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
<template>
  <SpPage>
    <div class="container">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" />

      <div class="info">
        <div class="text">
          <img :src="normal" class="img">
          <div>
            为丰富小程序的服务能力，提高服务质量，微信为小程序提供客服消息能力，以便小程序用户可以方便快捷地与小程序服务提供方进行沟通。
          </div>
        </div>
        <div class="button">
          <el-button type="primary" @click="handleConfig"> 去配置 </el-button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <i class="el-icon-question" />
          <span class="text">如何配置</span>
        </div>

        <div class="card-info">
          进入微信小程序管理端，进入“<span class="weight">功能</span>“<span class="weight"
            >-客服菜单</span
          >，进行客服添加绑定操作

          <img :src="wechat" class="img">
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
const normal = require(`@/assets/img/ecshopx/1-Normal.png`)
const wechat = require(`@/assets/img/ecshopx/kefu.png`)
export default {
  data() {
    return {
      normal,
      wechat
    }
  },
  methods: {
    handleConfig: function () {
      location.href = 'https://mp.weixin.qq.com/wxamp/wakf'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    font-size: 16px;
    color: #3d4355;
  }
  .info {
    height: 60px;
    background: #f2fbff;
    border-radius: 4px;
    border: 1px solid #ccecff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 0 20px;
    margin-top: 16px;

    .text {
      display: flex;
      align-items: center;
      .img {
        width: 40px;
        height: 40px;
      }
    }

    .button {
      width: 80px;
      flex-basis: 80px;
      text-align: right;
    }
  }
  .card {
    margin-top: 38px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    padding: 16px;

    &-title {
      .text {
        font-size: 14px;
        color: #3d4355;
      }
    }
    &-info {
      margin-top: 8px;
      .weight {
        font-weight: 600;
      }
      .img {
        margin-top: 16px;
        height: 310px;
        display: block;
      }
    }
  }
}
</style>
