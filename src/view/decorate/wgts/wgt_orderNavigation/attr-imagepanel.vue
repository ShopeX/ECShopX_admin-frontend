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
  <div class="attr-nav-item">
    <CompTodoList v-model="value" :max="4" :is-show-del="false" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="nav-item--wrap">
          <el-input v-model="scope.data.content" placeholder="导航名称" />
          <div class="nav-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
          </div>
          <div class="cell-value-tip">建议尺寸:（110px * 110px）</div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import Vue from 'vue'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrNavItem',
  components: { CompPickerLink, CompTodoList, CompButton },
  props: {
    value: [Object, Array]
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        content: '导航名称',
        imgUrl: ''
      })
    },
    handleChangeGoods(e, index) {
      Vue.set(this.value, index, {
        ...this.value[index],
        ...e
      })
    },
    onRemoveItem(index) {
      Vue.set(this.value, index, {
        ...this.value[index]
      })
    }
  }
}
</script>
<style lang="scss">
.attr-nav-item {
  .nav-item--picker {
    display: flex;
    margin-top: 10px;
  }
  // .cell-value-tip {
  //   position: relative;
  //   top: -12px;
  // }
}
</style>
