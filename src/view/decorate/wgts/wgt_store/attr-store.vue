<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
    :placeholder="i18n.t('6074cb51.afa2e6')"
    :format="i18n.t('6074cb51.ca9969')"
    :value="value.id ? 1 : 0"
    :view-btn="false"
    @click="handleClickAdd"
    @remove="onRemove"
  />
</template>

<script>
import { i18n } from '@/i18n'
import Vue from 'vue'
import { isArray } from '@/utils'
import CompButton from '../../comps/comp-button'
import { cloneDeep } from 'lodash'
export default {
  name: 'AttrLabel',
  components: { CompButton },
  props: ['value'],
  data() {
    return {i18n,
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
