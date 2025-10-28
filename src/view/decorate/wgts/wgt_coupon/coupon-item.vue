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
.coupon-wrap {
  width: 100%;
}
.coupon-item {
  display: flex;
}
.coupon {
  flex: 1;
  font-size: 14px;
}
.icon-trash-alt1 {
  color: #888;
  font-size: 13px;
}
</style>
<template>
  <div class="coupon-wrap">
    <CompTodoList
      v-model="localValue"
      is-edit
      :max="20"
      @onAddItem="handleAddTabs"
      @edit="onChangeCouponItem"
    >
      <template slot="body" slot-scope="scope">
        <div class="coupon-item">
          <SpImagePicker v-model="scope.data.imgUrl" size="small" />
          <div>
            <div class="coupon">{{ scope.data.title || '优惠券名称' }}</div>
          </div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompTodoList from '../../comps/comp-todoList'
export default {
  name: 'CouponItem',
  components: { CompTodoList },
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      localValue: []
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleAddTabs() {
      const { data } = await this.$picker.coupon({
        // num: 3 - this.localValue.length
      })
      this.localValue = this.localValue.concat(
        data.map((item, index) => {
          let amount
          if (item.card_type == 'cash') {
            amount = item.reduce_cost
          } else if (item.card_type == 'discount') {
            amount = (100 - parseInt(item.discount)) / 10
          } else {
            amount = item.reduce_cost
          }
          return {
            amount,
            desc: item.description,
            id: item.card_id,
            imgUrl: this.localValue[index] ? this.localValue[index].imgUrl : '',
            title: item.title,
            type: item.card_type
          }
        })
      )
    },
    async onChangeCouponItem({ item, index }) {
      const { id } = item
      const { data } = await this.$picker.coupon({
        data: [id],
        multiple: false
      })
      if (data) {
        const [{ reduce_cost, description, card_id, title, card_type, discount }] = data
        let amount
        if (card_type == 'cash') {
          amount = reduce_cost
        } else if (card_type == 'discount') {
          amount = (100 - parseInt(discount)) / 10
        } else {
          amount = reduce_cost
        }
        Vue.set(this.localValue, index, {
          ...this.localValue[index],
          amount,
          desc: description,
          id: card_id,
          title: title,
          type: card_type
        })
      }
    }
  }
}
</script>
