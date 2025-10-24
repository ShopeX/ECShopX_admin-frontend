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
  <!-- <SpRouterView> -->
  <SpPage>
    <div class="smsAccountPage">
      <div
        v-if="$route.path.indexOf('ali_sms') === -1 && $route.path.indexOf('shopex_sms') === -1"
        class="smsBox"
      >
        <section
          v-for="(item, index) in sms"
          :key="item.title"
          class="box-card"
          @click="tabClick(index)"
        >
          <img :src="item.img" alt="">
          <span>{{ item.title }}</span>
          <div v-if="index == 0" class="title">
            {{ aliyunsms_status ? '已启用' : '未启用' }}
          </div>
          <div v-else class="title">
            {{ aliyunsms_status ? '未启用' : '已启用' }}
          </div>
        </section>
      </div>
      <router-view />
    </div>
  </SpPage>
  <!-- </SpRouterView> -->
</template>

<script>
const ali = require('@/assets/img/aliNote/aliyun.png')
const shopex = require('@/assets/img/aliNote/shopex.png')
import { getaliSmsStatus } from '@/api/sms'

export default {
  data() {
    return {
      sms: [
        {
          title: '阿里云短信',
          img: ali
        },
        {
          title: '商派短信',
          img: shopex
        }
      ],
      aliyunsms_status: false
    }
  },
  created() {},
  async mounted() {
    const result = await getaliSmsStatus()
    this.aliyunsms_status = result.data.data.aliyunsms_status
  },
  async updated() {
    const result = await getaliSmsStatus()
    this.aliyunsms_status = result.data.data.aliyunsms_status
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.$router.push({
            path: this.matchRoutePath('ali_sms')
          })
          break
        default:
          this.$router.push({
            path: this.matchRoutePath('shopex_sms')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scope>
.smsBox {
  .box-card {
    max-width: 240px;
    position: relative;
    cursor: pointer;
    margin-right: 20px;
    float: left;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    &:hover {
      box-shadow: 2px 2px 10px 4px rgb(0 0 0 / 10%);
    }
    img {
      display: block;
      width: 100%;
    }
    span {
      font-size: 16px;
      font-weight: 600;
      position: absolute;
      top: 30%;
      left: 22%;
      transform: translate(-50%, -50%);
    }
    .title {
      text-align: center;
      padding: 10px 0;
    }
  }
}
</style>
