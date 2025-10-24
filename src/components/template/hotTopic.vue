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
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <div class="hotTopic-title">
      {{ base.title }}
    </div>
    <div class="hotTopic-list">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="hotTopic_li"
        :class="base.index == index ? 'checked' : ''"
      >
        {{ item.topic }}
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
  data() {
    return {
      name: '',
      base: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.hotTopic-title {
  font-size: 20px;
  color: #00081c;
  text-align: left;
  padding: 14px 20px;
}
.hotTopic-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  .hotTopic_li {
    border-radius: 2px;
    border: 1px solid #c7c7c7;
    flex-shrink: 0;
    padding: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 8px;
    font-weight: 400;
    color: #00081c;
    letter-spacing: 1px;
  }

  .checked {
    border: 1px solid #00081c;
    background: #00081c;
    border-radius: 2px;
    flex-shrink: 0;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 10px;
    font-weight: 400;
    color: #fff;
    letter-spacing: 1px;
  }
}
</style>
