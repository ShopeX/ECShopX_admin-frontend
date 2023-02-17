<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <CompButton :clearable="value.length > 0" @click="handleClickAdd" @remove="onRemove">
    {{ value.length > 0 ? `已选: ${value.length}` : `选择商品` }}
  </CompButton>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrGoods',
  components: { CompButton },
  props: {
    value: Array,
    distributor: Object
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
    async handleClickAdd() {
      const ids = this.value.map(({ goodsId }) => goodsId)
      const { data } = await this.$picker.goods({
        multiple: true
      })
      const values = []
      data?.length && data.forEach((item) => {
        if (item.itemId) {
          const obj = {
            imgUrl: item.pics[0],
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price,
            distributor_id: item.distributor_id,
            itemEnName: item.item_en_name,
            promotionActivity: item.promotion_activity
          }
          values.push(obj)
        }
      })
      this.localValue = values
    },
    onRemove() {
      this.localValue = []
    }
  }
}
</script>
