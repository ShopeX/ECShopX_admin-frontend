<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="region">
        <el-cascader
          ref="region"
          v-model="formData.region"
          filterable
          clearable
          :placeholder="$t('3a1ca73b.d525df')"
          :options="district"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('3a1ca73b.867738')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="shop_code">
        <el-input v-model="formData.shop_code" :placeholder="$t('3a1ca73b.68f04a')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_category_id">
        <el-select
          v-model="formData.distributor_category_id"
          clearable
          :placeholder="$t('3a1ca73b.459c3e')"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :value="item.category_id"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!isValidFixed" prop="is_valid">
        <el-select v-model="formData.is_valid" clearable :placeholder="$t('3a1ca73b.3fea7c')">
          <el-option value="true" :label="$t('3a1ca73b.7854b5')" />
          <el-option value="false" :label="$t('3a1ca73b.710ad0')" />
          <el-option value="delete" :label="$t('3a1ca73b.0044f6')" />
        </el-select>
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
import { createSetting } from '@shopex-ui/finder'
import { i18n } from '@/i18n'
import district from '@/common/district.json'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerShop',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: i18n.t('3a1ca73b.afa2e6')
  },
  props: ['value'],
  created() {
    this.$options.config.title = this.$t('3a1ca73b.afa2e6')
  },
  data() {
    return {
      formData: {
        region: [],
        keywords: '',
        shop_code: '',
        distributor_category_id: '',
        is_valid: ''
      },
      district,
      categoryList: [],
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    // 调用方通过 queryParams 指定了 is_valid 时，不再展示状态筛选
    isValidFixed() {
      return (
        this.value?.queryParams?.is_valid !== undefined && this.value?.queryParams?.is_valid !== ''
      )
    },
    setting() {
      const t = this.$t.bind(this)
      const columns = [
        { name: t('3a1ca73b.0d4934'), key: 'name' },
        { name: t('3a1ca73b.2419d0'), key: 'distributor_category_name', width: 120 },
        {
          name: t('3a1ca73b.1dbb0d'),
          key: 'distribution_type',
          width: 100,
          formatter: (value, row, col) => {
            if (value == '1') {
              return t('3a1ca73b.059670')
            } else if (value == '0') {
              return t('3a1ca73b.491c0c')
            }
          },
          visible: this.VERSION_PLATFORM()
        },
        { name: t('3a1ca73b.f6d738'), key: 'shop_code' },
        {
          name: t('3a1ca73b.3fea7c'),
          key: 'is_valid',
          width: 100,
          formatter: (value, row, col) => {
            return value == 'true'
              ? t('3a1ca73b.7854b5')
              : value == 'false'
              ? t('3a1ca73b.710ad0')
              : value == 'delete'
              ? t('3a1ca73b.0044f6')
              : ''
          }
        },
        { name: t('3a1ca73b.9198af'), key: 'store_address' }
      ]
      return createSetting({
        columns: columns.filter(({ visible }) => visible !== false)
      })
    }
  },
  created() {
    // this.fetch()
    this.getCategoryList()
  },
  methods: {
    beforeSearch(params) {
      const queryParams = this.value?.queryParams || {}
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
        shop_code: this.formData.shop_code,
        distributor_category_id: this.formData.distributor_category_id,
        province: province,
        city: city,
        area: area,
        distribution_type: this.value?.distribution_type,
        is_valid: this.formData.is_valid,
        ...queryParams
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter((item) => this.value.data.includes(item.distributor_id))
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
    },
    async getCategoryList() {
      try {
        const res = await this.$api.store.getStoreCategoryList({
          page: 1,
          pageSize: 1000
        })
        this.categoryList = res.list || []
      } catch (error) {
        console.error('获取门店分类列表失败:', error)
      }
    }
  }
}
</script>
