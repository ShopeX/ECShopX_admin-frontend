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
    <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddTabs">
      <template slot="body" slot-scope="scope">
        <div class="coupon-item">
          <SpImagePicker v-model="scope.data.imgUrl" size="small" />
          <div>
            <div class="coupon">{{ scope.data.title || '优惠券名称' }}</div>
            <el-button type="text" @click="onChangeCouponItem(scope.data, scope.index)"
              >
更换优惠券
</el-button
            >
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
        num: 3 - this.localValue.length
      })
      this.localValue = this.localValue.concat(
        data.map((item, index) => {
          return {
            amount: item.reduce_cost,
            desc: item.description,
            id: item.card_id,
            imgUrl: this.localValue[index] ? this.localValue[index].imgUrl : '',
            title: item.title,
            type: item.card_type
          }
        })
      )
    },
    async onChangeCouponItem({ id }, index) {
      const { data } = await this.$picker.coupon({
        data: [id],
        num: 1
      })
      if (data) {
        const [{ reduce_cost, description, card_id, title, card_type }] = data
        Vue.set(this.localValue, index, {
          ...this.localValue[index],
          amount: reduce_cost,
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
