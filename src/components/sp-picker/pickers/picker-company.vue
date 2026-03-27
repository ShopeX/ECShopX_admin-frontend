<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-company {
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
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="picker-company">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name">
        <el-input v-model="formData.name" :placeholder="$t('f5fd2a50.f47e27')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_sn">
        <el-input v-model="formData.enterprise_sn" :placeholder="$t('f5fd2a50.705f0a')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      url="/enterprise"
      :class="['company-finder', { 'no-multiple': !multiple }]"
      :fixed-row-action="true"
      :setting="companySetting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerCompany',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择企业'
  },
  props: ['value'],
  computed: {
    companySetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: t('f5fd2a50.f47e27'), key: 'name' },
          { name: t('f5fd2a50.705f0a'), key: 'enterprise_sn' }
        ]
      }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        enterprise_sn: ''
      },
      regionArea: [],
      loading: false,
      localData: [],
      multiple: this.value.multiple ?? true
    }
  },
  created() {
    this.$options.config.title = this.$t('f5fd2a50.0067d7')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData
      }
      if ('distributor_id' in this.value) {
        params.distributor_id = this.value.distributor_id
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
      this.$refs.finder.refresh()
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
