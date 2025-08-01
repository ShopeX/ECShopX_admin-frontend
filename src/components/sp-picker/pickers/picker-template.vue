<style lang="scss">
.picker-template {
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
  <div class="picker-template">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="页面名称关键词" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      url="/pagestemplate/lists"
      :class="['template-finder', { 'no-multiple': !multiple }]"
      :fixed-row-action="true"
      :setting="{
        columns: [{ name: '页面名称', key: 'template_title' }]
      }"
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
  name: 'PickerAfterSalesList',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择首页'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      regionArea: [],
      loading: false,
      localData: [],
      multiple: this.value.multiple ?? true
    }
  },
  created() {
    // this.fetch()
  },
  methods: {
    beforeSearch({ page, pageSize }) {
      let params = {
        page_no: page,
        page_size: pageSize,
        name: this.formData.keywords
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const { data = [] } = this.value
      const selectRow = list.filter(item => data.includes(item.pages_template_id))
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
