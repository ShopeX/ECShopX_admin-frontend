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
    :disabled="disabledBtn"
    :clearable="value.length > 0"
    @click="handleClickAdd"
    @remove="onRemove"
  >
    {{ value.length > 0 ? `已选: ${value.length}` : `选择标签` }}
  </CompButton>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrLabel',
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
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const ids = this.value.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.tag({
        data: ids,
        params: {
          distributor_id: this.distributor.id
        }
      })
      this.localValue = data
    },
    onRemove() {
      this.localValue = []
    }
  }
}
</script>
