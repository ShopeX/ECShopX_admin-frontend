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
  props: ['value', 'distributor'],
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
        data: ids,
        params: {
          distributor_id: this.distributor.id
        },
        paramsFieldExclude: ['distributor_id'],
        multiple: true
      })
      this.localValue = data
    },
    onRemove() {
      this.localValue = []
    }
  }
}
</script>
