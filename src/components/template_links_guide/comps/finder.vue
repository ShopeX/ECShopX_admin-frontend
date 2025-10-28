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
  <div class="finder view-flex view-flex-middle">
    <slot />
    <div class="view-flex-item">
      <el-input v-model="keywords" placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keywords: '',
      store: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('onSearch', this.keywords)
    },
    handleChange() {
      this.$emit('onChange', this.distributor)
    }
  }
}
</script>

<style scoped lang="scss">
.finder {
  margin-bottom: 20px;
}
.store-picker {
  padding: 0 20px;
  margin-right: 20px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  &:hover {
    background: #f5f7fa;
  }
  .store-info {
    padding-right: 20px;
  }
  .store-name {
    @include text-overflow();
  }
  .store-address {
    @include text-overflow();
    font-size: 12px;
    color: #999;
  }
}
</style>
