<style lang="scss">
.attr-class {
  .comp-todolist {
    margin-bottom: 10px;
  }

  .cate-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .comp-button {
    min-width: 80px;
  }

  .cate-name {
    width: 90px;
    margin-right: 4px;
  }
}
</style>
<template>
  <div class="attr-class">
    <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddTabs">
      <template slot="body" slot-scope="scope">
        <div class="cate-item">
          <el-input v-model="scope.data.tabTitle" class="cate-name" size="small" />
          <el-radio-group
            v-model="scope.data.type"
            size="small"
            style="margin-bottom: 10px; margin-top: 10px"
          >
            <el-radio label="normal">普通商品</el-radio>
            <el-radio label="point">积分商品</el-radio>
          </el-radio-group>
          <CompButton
            v-if="scope.data.type == 'point'"
            :value="scope.data.pointGoods.length"
            placeholder="选择积分商品"
            format="{0}件商品"
            @click="handleSelectPointGoods(scope.data.pointGoods, scope.index)"
            @remove="onRemovePointItem(scope.index)"
            @view="onViewPointItem(scope.index)"
          />
          <CompButton
            v-else
            :value="scope.data.goodsList.length"
            placeholder="选择商品"
            format="{0}件商品"
            @click="handleSelectGoods(scope.data.goodsList, scope.index)"
            @remove="onRemoveItem(scope.index)"
            @view="onViewItem(scope.index)"
          />
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
// import classifyDialog from "./classifyDialog.vue"
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
import CompTodoList from '../../comps/comp-todoList'
export default {
  name: 'AttrClass',
  components: { CompButton, CompTodoList },
  props: ['value'],
  data() {
    return {
      localValue: []
    }
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleSelectGoods(items, index) {
      let list = items
        .filter((item) => item.goodsId)
        .map((item) => ({
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
        }))
      const { data } = await this.$picker.goodsitem({
        data: list,
        isPointGoods: this.localValue[index].type === 'point',
        multiple: true
      })
      let values = []
      data &&
        data.forEach(item => {
          if (item.itemId) {
            let obj = {
              imgUrl: item.pics[0],
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
      this.localValue[index].goodsList = values
    },
    async handleSelectPointGoods(items, index) {
      let list = items
        .filter((item) => item.goodsId)
        .map((item) => ({
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
          medicine_data: item.medicine_data,
          point: item.point
        }))
      let values = []
      const { data } = await this.$picker.goodsitem({
        data: list,
        isPointGoods: this.localValue[index].type === 'point',
        multiple: true
      })
      data?.forEach((item) => {
        if (item.itemId) {
          let obj = {
            imgUrl: item.pics[0],
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price,
            market_price: item.market_price,
            distributor_id: item.distributor_id,
            itemEnName: item.item_en_name,
            promotionActivity: item.promotion_activity,
            medicine_data: item.medicine_data,
            point: item.point
          }
          values.push(obj)
        }
      })
      this.localValue[index].pointGoods = values
    },
    handleAddTabs() {
      this.localValue.push({ tabTitle: '标签', goodsList: [], type: 'normal', pointGoods: [] })
    },
    onRemoveItem(index) {
      this.localValue[index].goodsList = []
    },
    onRemovePointItem(index) {
      this.localValue[index].pointGoods = []
    },
    async onViewItem(index) {
      const { data } = await this.$picker.editBoard({
        data: this.localValue[index].goodsList,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map(item => {
            return {
              imgUrl: item.pics[0],
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
      this.localValue[index].goodsList = data
    },
    async onViewPointItem(index) {
      const { data } = await this.$picker.editBoard({
        data: this.localValue[index].pointGoods,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map((item) => {
            return {
              imgUrl: item.pics[0],
              title: item.itemName,
              goodsId: item.itemId,
              brand: item.brand_logo,
              price: item.price,
              market_price: item.market_price,
              distributor_id: item.distributor_id,
              itemEnName: item.item_en_name,
              promotionActivity: item.promotion_activity,
              medicine_data: item.medicine_data,
              point: item.point
            }
          })
          return res
        }
      })
      this.localValue[index].pointGoods = data
    }
  }
}
</script>
