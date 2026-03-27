<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-aftersales {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  // .filter-tools {
  //   display: flex;
  //   align-items: center;
  //   padding: 8px;
  //   .el-cascader,
  //   .el-input {
  //     width: 196px;
  //     margin-right: 8px;
  //   }
  // }
}
</style>
<template>
  <div class="picker-aftersales">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('51253cd4.af37a1')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      url="/distributors/aftersales"
      :fixed-row-action="true"
      :setting="{
        columns: [{ name: $t('51253cd4.0d4934'), key: 'name' }]
      }"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerAfterSalesList',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择店铺'
  },
  props: ['value'],
  created() {
    this.$options.config.title = this.$t('51253cd4.afa2e6')
  },
  data() {
    return {
      formData: {
        keywords: ''
      },
      regionArea: [],
      loading: false,
      localData: []
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        name: this.formData.keywords,
        merchant_id: this.value.merchant_id,
        distributor_id: this.value.distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const { data = [] } = this.value
      const selectRow = list.filter((item) => data.includes(item.distributor_id))
      const finderTable = this.$refs['finder'].$refs.finderTable.$refs.finderTable

      setTimeout(() => {
        finderTable.setSelection(selectRow)
      })
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelectionChange(val) {
      this.updateVal(val)
    }
  }
}
</script>
