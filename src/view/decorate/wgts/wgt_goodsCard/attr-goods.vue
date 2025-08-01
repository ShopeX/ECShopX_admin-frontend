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
      console.log(this.value.filter(item => !!item.item_id))
      return this.value.filter(item => !!item.item_id).length
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
          item_id: item.item_id
        }
      })
      const { data } = await this.$picker.goodsitem({
        data: list,
        multiple: false
      })
      const values = []
      data.forEach(item => {
        if (item.itemId) {
          const obj = {
            distributor_id: item.distributor_id,
            img_url: item?.pics?.[0],
            item_id: item.item_id,
            item_name: item.item_name,
            price: item.price,
            sales: item.sales
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
          const { data } = await this.$picker.goodsitem()
          const res = data.map(item => {
            return {
              distributor_id: item.distributor_id,
              img_url: item?.pics?.[0],
              item_id: item.item_id,
              item_name: item.item_name,
              price: item.price,
              sales: item.sales
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
