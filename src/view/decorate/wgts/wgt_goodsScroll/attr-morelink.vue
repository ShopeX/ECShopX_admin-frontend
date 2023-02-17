<style lang="scss">

</style>
<template>
  <div class="arrt-more-link">
    <CompPickerLink :isShowH5Link="false" :value="moreLink" @change="(e) => onChangeLink(e)" />
  </div>
</template>

<script>
import CompPickerLink from '../../comps/comp-pickerLink'
import { cloneDeep } from 'lodash'

export default {
  name: 'AttrMoreLink',
  components: { CompPickerLink },
  props: ['value'],
  data() {
    return {
      moreLink: null
    }
  },

  watch: {
    value: {
      handler(val) {
        this.moreLink = val ? cloneDeep(val) : { "linkType": 0, "linkUrl": "", "linkPage": "", "id": "", "title": "" }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async onChangeLink(e) {
      this.$emit('input', e)
    }
  }
}
</script>
