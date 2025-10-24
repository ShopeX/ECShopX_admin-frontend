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
<style lang="scss" scoped>
.attr-horizontal {
  margin-top: 4px;
  .cate-input {
    width: 220px;
  }
}
</style>
<template>
  <div class="attr-horizontal">
    <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddhorizontal">
      <template slot="body" slot-scope="scope">
        <div class="cate-item">
          <el-input
            v-model="scope.data.title"
            class="cate-input"
            size="small"
            placeholder="文本内容"
          />
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import CompTodoList from '../../comps/comp-todoList'

export default {
  name: 'AttrHorizontal',
  components: {
    CompTodoList
  },
  props: {
    value: {
      type: Array
    },
    direction: {
      type: String
    }
  },
  data() {
    return {
      localValue: []
    }
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    }
  },

  created() {
    this.localValue = this.value
  },
  methods: {
    handleAddhorizontal() {
      this.localValue.push({ title: '' })
    }
  }
}
</script>
