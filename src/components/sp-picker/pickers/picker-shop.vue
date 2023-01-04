<style lang="scss">
.picker-shop {
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
  <div class="picker-shop">
    <!-- multiple：{{ multiple }}, {{ value }} -->
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="region">
        <el-cascader
          ref="region"
          v-model="formData.region"
          filterable
          clearable
          placeholder="选择地区筛选店铺"
          :options="district"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入店铺名称搜索" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      url="/distributors"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '店铺名称', key: 'name' },
          { name: '店铺地址', key: 'store_address' }
        ]
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
import district from '@/common/district.json'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerShop',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择店铺'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district,
      regionArea: [],
      loading: false,
      multiple: this.value.multiple ?? true
    }
  },
  created() {
    // this.fetch()
  },
  methods: {
    beforeSearch(params) {
      const regionLabels = []
      const getRegionLabel = (district, i) => {
        if (this.formData.region[i]) {
          const fd = district.find((item) => item.value == this.formData.region[i])
          regionLabels.push(fd.label)
          if (fd.children) {
            getRegionLabel(fd.children, ++i)
          }
        }
      }
      if (this.formData.region.length > 0) {
        getRegionLabel(this.district, 0)
      }
      const [province = '', city = '', area = ''] = regionLabels
      params = {
        ...params,
        name: this.formData.keywords,
        province: province,
        city: city,
        area: area,
        distribution_type: this.value.distribution_type
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      console.log(this.value.data)
      const selectRows = list.filter((item) => this.value.data.includes(item.distributor_id))
      const { finderTable } = this.$refs.finder.$refs
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    },
    onSearch() {
      this.$refs.finder.refresh()
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
