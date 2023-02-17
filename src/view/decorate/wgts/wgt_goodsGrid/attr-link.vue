<style lang="scss">

</style>
<template>
  <div class="goods-select">
    <CompPickerLink :value="localValue" @change="(e) => onChangeLink(e)" />
  </div>
</template>

<script>
import CompPickerLink from '../../comps/comp-pickerLink'
import { cloneDeep } from 'lodash'

export default {
  name: 'AttrLink',
  components: { CompPickerLink },
  props: ['value'],
  data() {
    return {
      localValue: null
    }
  },
  created() {
    this.localValue = this.value
      ? cloneDeep(this.value)
      : { 'linkType': 0, 'linkUrl': '', 'linkPage': '', 'id': '', 'title': '' }
  },
  methods: {
    async onChangeLink(e) {
      this.localValue = e
      this.$emit('input', e)
    }
  }
}
</script>
