<style lang="scss" scoped>
.coupon-package {
  width: 100%;
  margin-top: 6px;
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
  <div class="coupon-package">
    <CompTodoList
      v-model="localValue"
      is-edit
      :max="20"
      :min="0"
      @onAddItem="handleAdd"
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
  name: 'CouponPackage',
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
    async handleAdd() {
      const { data } = await this.$picker.couponPackage({
        // num: 3 - this.localValue.length
      })
      this.localValue = this.localValue.concat(
        data.map((item, index) => {
          return {
            amount: '',
            desc: item.package_describe,
            package_id: item.package_id,
            imgUrl: this.localValue[index] ? this.localValue[index].imgUrl : '',
            title: item.title,
            type: '',
            get_num: '',
            limit_count: ''
          }
        })
      )
    },
    async onChangeCouponItem({ item, index }) {
      const { package_id } = item
      const { data } = await this.$picker.couponPackage({
        data: [package_id],
        multiple: false
      })
      if (data) {
        const [{ package_describe, package_id, title, get_num, limit_count }] = data
        Vue.set(this.localValue, index, {
          ...this.localValue[index],
          amount: '',
          desc: package_describe,
          package_id: package_id,
          title: title,
          type: '',
          get_num,
          limit_count
        })
      }
    }
  }
}
</script>
