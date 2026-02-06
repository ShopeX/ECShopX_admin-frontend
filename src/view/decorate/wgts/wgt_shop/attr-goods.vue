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
    format="{0}个商品"
    :disabled="disabledBtn"
    :value="value.length"
    @click="handleClickAdd"
    @remove="onRemove"
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
  props: ['value', 'distributor'],
  data() {
    return {
      localValue: []
    }
  },
  computed: {
    disabledBtn() {
      const { id } = this.distributor
      return id === ''
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
    },
    distributor: function (nVal, oVal) {
      if (JSON.stringify(nVal) != JSON.stringify(oVal)) {
        this.localValue = []
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const ids = this.value.map(({ goodsId }) => goodsId)
      const { data } = await this.$picker.goods({
        data: ids,
        queryParams: {
          distributor_id: this.distributor.id
        },
        paramsFieldExclude: ['distributor_id'],
        multiple: true
      })
      this.localValue = data.map(({ item_id, pics, price, item_name }) => {
        return {
          goodsId: item_id,
          title: item_name,
          imgUrl: pics?.[0],
          price
        }
      })
    },
    onRemove() {
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
          const res = data.map(({ item_id, pics, price, item_name }) => {
            return {
              goodsId: item_id,
              title: item_name,
              imgUrl: pics?.[0],
              price
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
