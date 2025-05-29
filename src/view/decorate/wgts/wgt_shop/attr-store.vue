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
    placeholder="选择店铺"
    format="{0}个店铺"
    :value="value.length"
    :view-btn="false"
    @click="handleClickAdd"
    @remove="onRemove"
  />
</template>

<script>
import Vue from 'vue'
import { isArray } from '@/utils'
import CompButton from '../../comps/comp-button'
import { cloneDeep } from 'lodash'
export default {
  name: 'AttrLabel',
  components: { CompButton },
  props: ['value'],
  data() {
    return {
      localValue: null
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
      this.$emit('change')
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const ids = this.value.map(item => item.distributor_id)
      const {
        data
      } = await this.$picker.shop({
        data: ids.length > 0 ? ids : [],
        multiple: true
      })
      if (data) {
        this.localValue = data.map(({ distributor_id, distributor_name, logo, first_letter,online_goods_num,tag_name,name   }) => {
          return {
            distributor_id,
            distributor_name,
            logo,
            first_letter,
            online_goods_num,
            tag_name,
            name
          }
        })
      } else {
        this.onRemove()
      }
    },
    onRemove() {
      this.localValue = []
    }
  }
}
</script>
