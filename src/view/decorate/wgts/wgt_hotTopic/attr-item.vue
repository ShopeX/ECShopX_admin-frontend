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
<style lang="scss">
.attr-topic-item {
  .topic-input {
    width: 220px;
    margin-bottom: 6px;
  }
  .comp-picker-link {
    width: 220px;
  }
  .btn-linkpath {
    max-width: 100%;
  }
}
</style>

<template>
  <div class="attr-topic-item">
    <CompTodoList v-model="value" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="topic-item">
          <el-input
            v-model="scope.data.topic"
            placeholder="话题"
            size="small"
            class="topic-input"
          />
          <CompPickerLink :value="scope.data" @change="e => onChangeLink(e, scope.index)" />
        </div>
      </template>
    </CompTodoList>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import Vue from 'vue'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
export default {
  name: 'TopicItem',
  components: {
    CompPickerLink,
    CompTodoList
  },
  props: ['value'],
  data() {
    return {}
  },
  created() {
    // this.localValue = cloneDeep(this.value)
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        id: '',
        topic: ''
      })
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.value[index])
      Vue.set(this.value, index, {
        ...v,
        ...e
      })
    }
  }
}
</script>
