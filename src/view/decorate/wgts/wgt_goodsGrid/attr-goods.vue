<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <CompButton
    placeholder="选择商品"
    format="{0}件商品"
    :value="goodsCount"
    @click="handleClickAdd"
    @remove="onRemoveItem"
    @view="onViewItem"
  />
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
  computed: {
    goodsCount() {
      console.log(this.value.filter(item => !!item.goodsId))
      return this.value.filter(item => !!item.goodsId).length
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
      const list = this.value.map(item => {
        return {
          item_id: item.goodsId,
          pics: [item.imgUrl],
          itemName: item.title,
          itemId: item.goodsId,
          brand_logo: item.brand,
          price: item.price,
          market_price: item.market_price,
          distributor_id: item.distributor_id,
          item_en_name: item.itemEnName,
          promotion_activity: item.promotionActivity,
          medicine_data: item.medicine_data
        }
      })
      console.log(list, 'ids')
      const { data } = await this.$picker.goodsitem({
        data: list
      })
      console.log(data)
      const values = []
      data.forEach(item => {
        if (item.itemId) {
          const obj = {
            imgUrl: item.pics[0],
            linkPage: '',
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price,
            market_price: item.market_price,
            distributor_id: item.distributor_id,
            itemEnName: item.item_en_name,
            promotionActivity: item.promotion_activity,
            medicine_data: item.medicine_data
          }
          values.push(obj)
        }
      })
      this.localValue = values
    },
    onRemoveItem() {
      this.localValue = []
    },
    async onViewItem() {
      const { data } = await this.$picker.editBoard({
        data: this.localValue,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map(item => {
            return {
              imgUrl: item.pics[0],
              linkPage: '',
              title: item.itemName,
              goodsId: item.itemId,
              brand: item.brand_logo,
              price: item.price,
              market_price: item.market_price,
              distributor_id: item.distributor_id,
              itemEnName: item.item_en_name,
              promotionActivity: item.promotion_activity
            }
          })
          return res
        }
      })
      this.localValue = data
    }
  }
}
</script>
