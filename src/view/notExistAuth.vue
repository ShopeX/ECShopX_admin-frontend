<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="notExistAuth_page">
    <el-card class="box-card card">
      <div class="box">
        <img :src="require('@/assets/img/warning.png')" alt="">
        <p>{{ $t('84bc684d.848bbe') }}</p>
      </div>
      <p class="message">
        {{ $t('84bc684d.e5eaa4') }}
      </p>
      <button type="submit" @click="golink()">{{ $t('84bc684d.0d57fb') }}</button>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    golink() {
      window.parent.postMessage(
        {
          cmd: 'notExistAuth'
        },
        '*'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.notExistAuth_page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  background: rgb(244, 244, 244);

  .card {
    width: 400px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 20px;
    .box {
      width: 220px;
      margin: 0 auto;
      p {
        text-align: center;
        padding: 30px 0;
        font-size: 16px;
      }
      img {
        display: block;
        margin: 0 auto;
      }
    }
    .message {
      text-align: center;
      font-size: 14px;
      color: #999;
      line-height: 2;
    }
    button {
      display: block;
      margin: 60px auto;
      box-sizing: border-box;
      text-align: center;
      width: 90%;
      height: 34px;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background: #53a3e8;
    }
  }
}
</style>
<style lang="scss">
.box-card {
  min-width: 0px;
}
</style>
