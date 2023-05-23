<style lang="scss" scoped>
.case-item {
  display: flex;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <div>
    <div v-for="(item, index) in value" :key="`case-item__${index}`" class="case-item">
      <SpImagePicker v-model="item.imgUrl" size="small" />
      <CompPickerLink :value="item" @change="(e) => onChangeLink(e, index)" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
export default {
  name: 'AttrItem',
  components: {
    CompPickerLink
  },
  props: ['value'],
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
      const { data } = await this.$picker.image({
        data: [],
        multiple: true,
        num: 3
      })

      this.localValue = data.map((item) => {
        return {
          button: '',
          content: '',
          id: '',
          imgUrl: item.url,
          linkPage: '',
          mainTitle: '',
          subtitle: '',
          subtitleTow: '',
          template: ''
        }
      })
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.localValue[index])
      Vue.set(this.localValue, index, {
        ...v,
        ...e
      })
    }
  }
}
</script>
