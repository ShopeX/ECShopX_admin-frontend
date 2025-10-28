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
  <div class="img-box-wrap" :class="{ inline: inline }" @click="handleClick">
    <div v-if="removeBtn" class="remove-btn iconfont icon-trash-alt" @click="handleRemove" />
    <div
      class="img-box"
      :class="{ 'border-dashed': border === 'dashed', 'border-none': border === 'none' }"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <img v-if="imgUrl" :src="imgUrl" alt="">
      <i v-else class="iconfont" :class="icon" :style="'font-size:' + width * 0.3 + 'px'" />
    </div>
    <div v-if="bottomInfo" class="bottom-info">
      {{ bottomInfo }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100'
    },
    height: {
      type: String,
      default: '100'
    },
    border: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    removeBtn: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'icon-camera'
    },
    bottomInfo: {
      type: String
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    handleRemove() {
      if (!this.removeBtn) return
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box-wrap {
  position: relative;
  &.inline {
    display: inline-block;
    vertical-align: middle;
  }
  .bottom-info {
    position: absolute;
    bottom: 0;
    line-height: 1.5;
    text-align: center;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }
  .remove-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 0 3px 0 3px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
  }
}
.img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #efefef;
  border-radius: 5px;
  overflow: hidden;
  background: #f8f8f8;
  cursor: pointer;
  &.border-solid {
    border-style: dashed;
  }
  &.border-none {
    border: none;
  }
  .iconfont {
    color: #eaeaea;
  }
  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
