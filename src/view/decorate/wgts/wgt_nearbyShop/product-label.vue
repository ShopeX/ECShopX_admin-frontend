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
  <div class="attr-category">
    <CompButton
      placeholder="选择标签"
      format="{0}个标签"
      :value="value.length"
      :view-btn="false"
      @click="onAddLabel"
      @remove="onRemoveLabel"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { queryTagShop } from '@/api/marketing'
import CompButton from '../../comps/comp-button'

export default {
  components: { CompButton },
  props: ['value'],
  data() {
    return {
      tagSelectVisible: false,
      localTagList: [],
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      checked: 0
    }
  },
  watch: {
    localTagList: {
      deep: true,
      handler: function (nVal, oVal) {
        // this.getShop(nVal)
      }
    }
  },
  created() {
    this.localTagList = cloneDeep(this.value.tagList)
  },
  methods: {
    deleteTag(index) {
      this.localTagList.splice(index, 1)
    },
    onEnd(evt) {
      const temp = this.localTagList[evt.oldIndex]
      this.localTagList.splice(evt.oldIndex, 1)
      this.localTagList.splice(evt.newIndex, 0, temp)
    },
    seletedTagsHandle(seletedTags) {
      this.localTagList = seletedTags
    },
    async getShop(val) {
      if (val.length <= 0) {
        this.localShopList = []
        return
      }
      const tag_id = val[this.checked].tag_id
      const result = await queryTagShop({ tag_id })
      const { list } = result.data.data
      this.localShopList = list
      this.$emit('input', {
        tagList: val,
        shopList: list
      })
    },
    tagSelectVisibleHandle() {
      this.tagSelectVisible = !this.tagSelectVisible
    },
    async onAddLabel() {
      const ids = this.value.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.tag({
        data: ids,
        distributor_id: this.$route.query.distributor_id
      })
      this.$emit('input', data)
    },
    onRemoveLabel() {
      this.$emit('input', [])
    }
  }
}
</script>

<style lang="scss" scoped></style>
