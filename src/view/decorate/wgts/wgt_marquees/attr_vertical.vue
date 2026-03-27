<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.attr-vertical {
  flex: 1;

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
      <template slot="header" slot-scope="scope">
        {{ i18n.t('114eac0e.e8f87a') }}{{ scope.index + 1 }}
      </template>
      <template slot="body" slot-scope="scope">
        <div class="cate-item">
          {{ scope.data.title }}
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
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
    return { i18n }
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
