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
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 设置路径内容搜索
 * @FilePath: /app/src/components/template_links/comps/wxalink.vue
 * @Date: 2021-01-26 11:40:00
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-26 14:03:34
-->
<template>
  <div class="wxalink">
    <div class="line">
      <div class="name">小程序名称</div>
      <el-select v-model="app_id" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="(item, index) in options"
          :key="`${item.value}${index}`"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="line">
      <div class="name">页面名称</div>
      <el-input v-model="route_name" />
    </div>
    <el-button type="primary" @click="search"> 搜 索 </el-button>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      options: [],
      app_id: '',
      route_name: ''
    }
  },
  async mounted() {
    const { list } = await api.wxa.getWxLinkListSetting({
      page: 1
    })
    this.options = list.map(item => {
      return {
        label: item.app_name,
        value: item.app_id
      }
    })
    this.app_id = this.options.length > 0 ? this.options[0].value : ''
    this.$emit('selectChange', this.app_id)
  },
  methods: {
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    search() {
      this.$emit('onsearch', this.route_name)
    }
  }
}
</script>

<style lang="scss" scoped>
.wxalink {
  display: flex;
  align-items: center;
  .line {
    display: flex;
    align-items: center;
    .name {
      flex-shrink: 0;
      margin-right: 10px;
    }
    &:last-of-type {
      margin: 0 15px;
    }
  }
}
</style>
