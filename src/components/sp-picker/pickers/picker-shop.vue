<style lang="scss">
.picker-shop {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .disableheadselection {
    > .cell .el-checkbox__inner {
      display: none;
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-shop">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
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
        <el-input v-model="formData.keywords" placeholder="请输入店铺名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="shop_code">
        <el-input v-model="formData.shop_code" placeholder="请输入店铺号" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      reserve-selection
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/distributors"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      row-key="distributor_id"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
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
        keywords: '',
        shop_code: ''
      },
      district,
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    setting() {
      const columns = [
        { name: '店铺名称', key: 'name' },
        {
          name: '店铺类型',
          key: 'distribution_type',
          width: 100,
          formatter: (value, row, col) => {
            if (value == '1') {
              return '加盟'
            } else if (value == '0') {
              return '自营'
            }
          },
          visible: this.VERSION_PLATFORM()
        },
        { name: '店铺号', key: 'shop_code' },
        { name: '店铺地址', key: 'store_address' }
      ]
      return createSetting({
        columns: columns.filter(({ visible }) => visible !== false)
      })
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
          const fd = district.find(item => item.value == this.formData.region[i])
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
        shop_code: this.formData.shop_code,
        province: province,
        city: city,
        area: area,
        distribution_type: this.value?.distribution_type
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter(item => this.value.data.includes(item.distributor_id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
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
