<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <div>
    <el-radio-group v-model="value.type" size="small" style="margin-bottom: 10px">
      <el-radio label="normal">普通商品</el-radio>
      <el-radio label="point">积分商品</el-radio>
    </el-radio-group>
    <CompButton
      v-if="value.type == 'point'"
      placeholder="选择积分商品"
      format="{0}件商品"
      :value="value.pointGoods.length"
      @click="handleClickPointAdd"
      @remove="onRemovePointItem"
      @view="onViewPointItem"
    />
    <CompButton
      v-else
      placeholder="选择商品"
      format="{0}件商品"
      :value="value.data.length"
      @click="handleClickAdd"
      @remove="onRemoveItem"
      @view="onViewItem"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrGoods',
  components: { CompButton },
  props: {
    value: Object,
    distributor: Object
  },
  data() {
    return {
      localValue: {
        data: [],
        pointGoods: [],
        type: 'normal'
      }
    }
  },
  computed: {
    goodsCount() {
      console.log(this.value.data.filter((item) => !!item.goodsId))
      return this.value.data.filter((item) => !!item.goodsId).length
    }
  },
  watch: {
    localValue: {
      handler: function (nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const list =this.value.data.map(item=>{
        return {
          item_id:item.goodsId,
          pics:[item.imgUrl],
          itemName:item.title,
          itemId:item.goodsId,
          brand_logo:item.brand,
          price:item.price,
          market_price:item.market_price,
          distributor_id:item.distributor_id,
          item_en_name:item.itemEnName,
          promotion_activity:item.promotionActivity,
          medicine_data:item.medicine_data
        }
      })
      console.log(list,'ids')
      const { data } = await this.$picker.goodsitem({
        isPointGoods: this.value.type === 'point',
        data:list
      })
      console.log(data)
      const values = []
      data.forEach((item) => {
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
            medicine_data:item.medicine_data
          }
          values.push(obj)
        }
      })
      this.localValue.data = values
    },
    onRemoveItem() {
      this.localValue.data = []
    },
    onRemovePointItem() {
      this.localValue.pointGoods = []
    },
    async onViewItem() {
      const { data } = await this.$picker.editBoard({
        data: this.localValue.data,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map((item) => {
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
      this.localValue.data = data
    },
    async handleClickPointAdd() {
      const list =this.value.pointGoods.map(item=>{
        return {
          item_id:item.goodsId,
          pics:[item.imgUrl],
          itemName:item.title,
          itemId:item.goodsId,
          brand_logo:item.brand,
          price:item.price,
          market_price:item.market_price,
          distributor_id:item.distributor_id,
          item_en_name:item.itemEnName,
          promotion_activity:item.promotionActivity,
          medicine_data:item.medicine_data,
          point: item.point
        }
      })
      console.log(list,'ids')
      const { data } = await this.$picker.goodsitem({
        isPointGoods: this.value.type === 'point',
        data:list
      })
      console.log(data)
      const values = []
      data.forEach((item) => {
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
            medicine_data:item.medicine_data,
            point: item.point
          }
          values.push(obj)
        }
      })
      this.localValue.pointGoods = values
    },
    async onViewPointItem() {
      const { data } = await this.$picker.editBoard({
        data: this.localValue.pointGoods,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map((item) => {
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
              promotionActivity: item.promotion_activity,
              point: item.point
            }
          })
          return res
        }
      })
      this.localValue.pointGoods = data
    },
  }
}
</script>
