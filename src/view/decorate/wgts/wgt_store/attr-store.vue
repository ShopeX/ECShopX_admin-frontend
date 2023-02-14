<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <CompButton :clearable="value.id !== ''" @click="handleClickAdd" @remove="onRemove">
    {{ value.id !== '' ? `已选: ${value.name}` : `选择店铺` }}
  </CompButton>
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
      const { id } = this.value
      const {
        data: [shop]
      } = await this.$picker.shop({
        data: id ? [id] : [],
        multiple: false
      })
      if (shop) {
        const { distributor_id, logo, name } = shop
        this.localValue = {
          id: distributor_id,
          logo,
          name
        }
      } else {
        this.onRemove()
      }
    },
    onRemove() {
      this.localValue = {
        id: '',
        logo: '',
        name: ''
      }
    }
  }
}
</script>
