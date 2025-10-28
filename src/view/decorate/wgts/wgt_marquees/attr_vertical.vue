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
.attr-vertical {
  margin-top: 2px;

  .cate-item {
    height: 32px;
    line-height: 32px;
    width: 220px;
    @include text-overflow();
  }
}
</style>
<template>
  <div class="attr-vertical">
    <CompTodoList v-model="value" :max="20" is-edit @onAddItem="handleAddItem" @edit="onEdit">
      <template slot="body" slot-scope="scope">
        <div class="cate-item">
          {{ scope.data.title }}
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import Vue from 'vue'
import CompTodoList from '../../comps/comp-todoList'

export default {
  name: 'AttrVertical',
  components: {
    CompTodoList
  },
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {}
  },
  methods: {
    async handleAddItem() {
      const { data } = await this.$picker.planting()
      if (data) {
        data.forEach(({ article_id, title }) => {
          this.value.push({
            id: article_id,
            title
          })
        })
      }
    },
    async onEdit({ item, index }) {
      const { id } = this.value[index]
      const { data } = await this.$picker.planting({
        data: [id],
        multiple: false
      })
      if (data) {
        const [{ article_id, title }] = data
        Vue.set(this.value, index, {
          id: article_id,
          title
        })
      }
    }
  }
}
</script>
