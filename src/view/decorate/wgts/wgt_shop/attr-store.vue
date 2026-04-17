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
    :placeholder="i18n.t('f55802e1.afa2e6')"
    :format="i18n.t('f55802e1.ca9969')"
    :value="value.length"
    :view-btn="false"
    @click="handleClickAdd"
    @remove="onRemove"
  />
</template>

<script>
import { i18n } from '@/i18n'
import CompButton from '../../comps/comp-button'
import { cloneDeep } from 'lodash'
export default {
  name: 'AttrLabel',
  components: { CompButton },
  props: ['value'],
  data() {
    return { i18n, localValue: null }
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
      const ids = this.value.map((item) => item.distributor_id)
      const { data } = await this.$picker.store({
        data: this.value.length > 0 ? this.value : [],
        multiple: true
      })
      if (data) {
        console.log(data, 'data')
        this.localValue = data.map(
          ({
            distributor_id,
            distributor_name,
            logo,
            first_letter,
            online_goods_num,
            tag_name,
            name,
            regionauth_id
          }) => {
            return {
              distributor_id,
              distributor_name,
              logo,
              first_letter,
              online_goods_num,
              tag_name,
              name,
              regionauth_id
            }
          }
        )
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
