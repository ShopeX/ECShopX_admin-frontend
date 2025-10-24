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
  <div>
    <slot />
    <div class="gray-box">
      <div class="floor">
        <img
          :src="
            t_data.config.imgUrl ||
            'https://fakeimg.pl/1000x240/F8F8F8/CCC/?text=Image&font=helvetica'
          "
          alt=""
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ImgHotzone',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      t_data: this.data
    }
  }
}
</script>
<style lang="scss" scoped>
.gray-box {
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  .title {
    padding-left: 30px;
    position: relative;
    z-index: 10;
    height: 60px;
    padding: 0 10px 0 24px;
    border-bottom: 1px solid #d4d4d4;
    border-radius: 8px 8px 0 0;
    box-shadow: rgba(0, 0, 0, 0.06) 0 1px 7px;
    background: #f3f3f3;
    background: -webkit-linear-gradient(#fbfbfb, #ececec);
    background: linear-gradient(#fbfbfb, #ececec);
    line-height: 60px;
    font-size: 18px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: #626262;
      display: inline-block;
    }
  }
  .floor {
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}
</style>
