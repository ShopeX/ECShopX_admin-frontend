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
    <el-radio-group v-model="value.type" size='small' @change="radioChange" style="margin-bottom: 10px">
      <el-radio label='goods'>单商品</el-radio>
      <el-radio label='seckill'>秒杀活动</el-radio>
      <el-radio label='limitTimeSale'>限时特惠</el-radio>
    </el-radio-group>
    <CompButton
      :clearable="value.data.length > 0"
      @click="handleClickAdd"
      @remove="onRemove"
      v-if="value.type == 'goods'"
    >
      {{ value.data.length > 0 ? `已选: ${value.data.length}` : `选择商品` }}
    </CompButton>
    <AttrSelect v-else :type="value.type" v-model="value.seckillId" />
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
import AttrSelect from './attr-select'

export default {
  name: 'AttrGoods',
  components: { CompButton, AttrSelect },
  props: {
    value: Object
  },
  data() {
    return {
      localValue: {
        data: [],
        type: '',
        seckillId: ''
      }
    }
  },
  watch: {
    localValue: {
      handler: function (nVal) {
        this.$emit('input', nVal)
      },
      deep: true,
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    radioChange (value) {
      this.localValue.type = value
      this.localValue.data = []
      this.localValue.seckillId = ''
    },
    async handleClickAdd() {
      const ids = this.value.data.map(({ goodsId }) => goodsId)
      let reqParams = {
        data: ids,
        multiple: true,
      }
      // if (this.value.length > 0) {
      //   reqParams['params'] = {
      //     distributor_id: this.value[0].distributor_id
      //   }
      // }
      const { data = [] } = await this.$picker.goods(reqParams)
      const values = []
      data.length && data.forEach((item) => {
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
      this.localValue.data = values
    },
    onRemove() {
      this.localValue.data = []
    }
  }
}
</script>
