<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="attr-nav-item">
    <CompTodoList v-model="value" :max="5" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="nav-item--wrap">
          <el-input v-model="scope.data.content" :placeholder="$t('73d80883.8585af')" />
          <div class="nav-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
            <CompPickerLink
              :value="scope.data"
              @change="
                (e) => {
                  handleChangeGoods(e, scope.index)
                }
              "
            />
          </div>
          <div v-if="isBusinessShow" class="cell-value-tip">
            {{ $t('73d80883.52458a') }}
            <CompButton
              :placeholder="$t('73d80883.f5ddb8')"
              :format="$t('73d80883.4a3a7c')"
              :value="scope.data.seletedTags.length"
              :view-btn="false"
              @remove="onRemoveItem(scope.index)"
              @click="onAddLabel(scope.index)"
            />
          </div>
          <div class="cell-value-tip">{{ $t('73d80883.c7e1f0') }}</div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import Vue from 'vue'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrNavItem',
  components: { CompPickerLink, CompTodoList, CompButton },
  props: {
    value: [Object, Array],
    isBusinessShow: Boolean
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        content: i18n.t('73d80883.8585af'),
        seletedTags: [],
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
        ...this.value[index],
        seletedTags: []
      })
    },
    async onAddLabel(index) {
      const ids = this.value[index].seletedTags?.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.shopTag({
        data: ids
      })
      Vue.set(this.value, index, {
        ...this.value[index],
        seletedTags: data
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
