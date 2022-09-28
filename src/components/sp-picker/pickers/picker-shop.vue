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
}
</style>
<template>
  <div class="picker-shop">
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
      url="/distributors"
      :fixed-row-action="true"
      :setting="{
        columns: [{ name: '店铺名称', key: 'name' }]
      }"
      :hooks="{
        beforeSearch: beforeSearch
        // afterSearch: afterSearch
      }"
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
      loading: false
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
        area: area
      }
      return params
    },
    onSearch() {
      this.$refs.finder.refresh()
    },
    onSelectionChange(val) {
      this.updateVal(val)
    }
  }
}
</script>
