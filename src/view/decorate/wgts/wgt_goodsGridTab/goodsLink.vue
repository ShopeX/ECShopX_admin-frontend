<style lang="scss">
.goods-select {
}
</style>
<template>
  <div class="goods-select">
   <CompPickerLink :value="value" @change="(e) => onChangeLink(e)" />
  </div>
</template>

<script>
import CompPickerLink from '../../comps/comp-pickerLink'

export default {
  name: 'GoodsLink',
  components:{CompPickerLink},
  props: ['value'],
  data() {
    return {
      localValue: []
    }
  },
  created() {
  },
  methods: {
    async onChangeLink(e) {
      this.$emit('input', e)
    }
  }
}
</script>
