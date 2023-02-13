<style lang="scss">
.picker-zitilist {
  .sp-filter-form {
    margin-bottom: 0;
    .filter-form__bd {
      margin-left: 16px;
    }
  }
  .filter-tools {
    display: flex;
    align-items: center;
    padding: 8px;
    .el-cascader,
    .el-input {
      width: 196px;
      margin-right: 8px;
    }
  }
}
</style>
<template>
  <div class="picker-zitilist">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="输入自提点名称、地址关键词" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      url="/pickuplocation/list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '自提点名称', key: 'name' },
          {
            name: '地址',
            render: (h, { row }) =>
              h('span', {}, `${row.province}${row.city}${row.area}${row.address}`)
          },
          { name: '联系电话', key: 'contract_phone' },
          { name: '绑定店铺', key: 'rel_distributor_name' }
        ]
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
  name: 'PickerZitiList',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择自提点'
  },
  props: ['value'],
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
  created() {
    // this.fetch()
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        name: this.formData.keywords
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const { data = [] } = this.value
      const selectRow = list.filter((item) => data.includes(item.id))
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
