<style lang="scss" scoped>
.attr-goods {
  margin-top: 8px;
}
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <div class="attr-goods">
    <el-radio-group v-model="value.type" size="small" style="margin-bottom: 10px">
      <el-radio label="goods">单商品</el-radio>
      <el-radio label="seckill">秒杀活动</el-radio>
      <el-radio label="limitTimeSale">限时特惠</el-radio>
    </el-radio-group>
    <CompButton
      v-if="value.type == 'goods'"
      placeholder="选择商品"
      format="{0}件商品"
      :value="value.data.length"
      @click="handleClickAdd"
      @remove="onRemove"
      @view="onViewItem"
    />
    <CompButton
      v-if="value.type == 'seckill'"
      placeholder="选择秒杀活动"
      format="{0}个秒杀活动"
      :value="value.secKillId ? 1 : 0"
      :view-btn="false"
      @click="onAddSeckill"
      @remove="onRemoveSeckill"
    />
    <CompButton
      v-if="value.type == 'limitTimeSale'"
      placeholder="选择限时特惠"
      format="{0}个限时特惠"
      :value="value.limitTimeSaleId ? 1 : 0"
      :view-btn="false"
      @click="onAddLimitSeckill"
      @remove="onRemoveLimitSeckill"
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
    value: Object
  },
  data() {
    return {
      localValue: {
        data: [],
        secKillGoods: [],
        limitSecKillGoods: [],
        type: '',
        seckillId: '',
        limitTimeSaleId: '',
        lastSeconds: ''
      }
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
      const ids = this.value.data.map(({ goodsId }) => goodsId)
      let list = this.value.data
        .filter(item => item.goodsId)
        .map(item => ({
          pics: [item?.imgUrl],
          itemName: item.title,
          itemId: item.goodsId,
          price: item.price,
          market_price: item.market_price,
          item_id: item.goodsId
        }))
      const { data } = await this.$picker.goodsitem({
        data: list,
        multiple: true
      })
      if (data) {
        this.localValue.data = data.map(
          ({ pics, itemName, itemId, price, market_price, is_prescription }) => {
            return {
              imgUrl: pics[0],
              title: itemName,
              goodsId: itemId,
              price,
              market_price,
              isPrescription: is_prescription
            }
          }
        )
      }
    },
    onRemove() {
      this.localValue.data = []
    },
    async onViewItem() {
      const { data } = await this.$picker.editBoard({
        data: this.localValue.data,
        template: ({ imgUrl }) => {
          return <SpImage src={imgUrl} width={100} height={100} />
        },
        onAdd: async () => {
          const { data } = await this.$picker.goods()
          const res = data.map(({ pics, itemName, itemId, price, market_price }) => {
            return {
              imgUrl: pics[0],
              title: itemName,
              goodsId: itemId,
              price,
              market_price
            }
          })
          return res
        }
      })
      this.localValue.data = data
    },
    async onAddSeckill() {
      const { data } = await this.$picker.seckill({
        data: [this.value.seckillId],
        queryParams: {
          status: 'not_end'
        },
        multiple: false
      })
      if (data) {
        const { list } = await this.$api.promotions.getSeckillItemList({
          seckill_id: data[0].seckill_id,
          page: 1,
          pageSize: 100,
          is_sku: 0
        })
        this.value.secKillId = data[0].seckill_id
        this.value.secKillLastSeconds = data[0].last_seconds
        this.value.secKillStatus = data[0].status
        this.value.secKillGoods = list.map(({ item_pic, item_name, item_id, price }) => {
          return {
            imgUrl: item_pic,
            title: item_name,
            goodsId: item_id,
            price
          }
        })
      } else {
        this.onRemoveSeckill()
      }
    },
    onRemoveSeckill() {
      this.value.secKillId = ''
      this.value.secKillLastSeconds = 0
      this.value.secKillStatus = ''
      this.value.secKillGoods = []
    },
    async onAddLimitSeckill() {
      const { data } = await this.$picker.seckill({
        data: [this.value.limitTimeSaleId],
        dialogTitle: '选择限时特惠活动',
        queryParams: {
          status: 'valid',
          seckill_type: 'limited_time_sale'
        },
        multiple: false
      })
      if (data) {
        const { list } = await this.$api.promotions.getSeckillItemList({
          seckill_id: data[0].seckill_id,
          page: 1,
          pageSize: 100,
          is_sku: 0
        })
        this.value.limitTimeSaleId = data[0].seckill_id
        this.value.limitTimeSaleLastSeconds = data[0].last_seconds
        this.value.limitTimeSaleLastStatus = data[0].status
        this.value.limitTimeSaleGoods = list.map(({ item_pic, item_name, item_id, price }) => {
          return {
            imgUrl: item_pic,
            title: item_name,
            goodsId: item_id,
            price
          }
        })
      } else {
        this.onRemoveLimitSeckill()
      }
    },
    onRemoveLimitSeckill() {
      this.value.limitTimeSaleId = ''
      this.value.limitTimeSaleLastSeconds = 0
      this.value.limitTimeSaleLastStatus = ''
      this.value.limitTimeSaleGoods = []
    }
  }
}
</script>
