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
      <SpFilterFormItem prop="keywords" :label="$t('a523b3a5.0d4934')">
        <el-input v-model="formData.keywords" :placeholder="$t('a523b3a5.867738')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="shop_code" :label="$t('a523b3a5.f6d738')">
        <el-input v-model="formData.shop_code" :placeholder="$t('a523b3a5.68f04a')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="is_valid" :label="$t('a523b3a5.3fea7c')">
        <el-select v-model="formData.is_valid" :placeholder="$t('a523b3a5.e1c965')" clearable>
          <el-option :label="$t('a523b3a5.a8b0c2')" value="" />
          <el-option :label="$t('a523b3a5.7854b5')" value="true" />
          <el-option :label="$t('a523b3a5.710ad0')" value="false" />
          <el-option :label="$t('a523b3a5.0044f6')" value="delete" />
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
      @select-all="handleSelectAll"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import { cloneDeep } from 'lodash'
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
  created() {
    this.$options.config.title = this.$t('a523b3a5.afa2e6')
  },
  data() {
    return {
      regionauthList: [],
      formData: {
        regionauth_id: '',
        keywords: '',
        shop_code: '',
        is_valid: ''
      },
      district,
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true,
      rowKey: 'distributor_id',
      localSelection: []
    }
  },
  computed: {
    setting() {
      const t = this.$t.bind(this)
      const columns = [
        { name: t('a523b3a5.0d4934'), key: 'name' },
        {
          name: t('a523b3a5.1dbb0d'),
          key: 'distribution_type',
          width: 100,
          formatter: (value) => {
            if (value == '1') return t('a523b3a5.059670')
            if (value == '0') return t('a523b3a5.491c0c')
          },
          visible: this.VERSION_PLATFORM
        },
        {
          name: t('a523b3a5.e28997'),
          key: 'is_valid',
          formatter: (value) =>
            (value === 'true' && t('a523b3a5.7854b5')) ||
            (value === 'false' && t('a523b3a5.710ad0')) ||
            (value === 'delete' && t('a523b3a5.0044f6')) ||
            ''
        },
        { name: t('a523b3a5.f6d738'), key: 'shop_code' },
        { name: t('a523b3a5.9198af'), key: 'store_address' }
      ]
      return createSetting({
        columns: columns.filter(({ visible }) => visible !== false)
      })
    }
  },
  created() {
    this.$options.config.title = this.$t('a523b3a5.afa2e6')
    this.localSelection = cloneDeep(this.value.data) || []
    // this.fetch()
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        name: this.formData.keywords,
        shop_code: this.formData.shop_code,
        distribution_type: this.value?.distribution_type,
        is_valid: this.formData.is_valid || undefined,
        ...(this.value?.params || {})
      }

      if (this.value?.regionauth_id) {
        params.regionauth_id = this.value?.regionauth_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.localSelection.length > 0) {
        const { finderTable } = this.$refs.finder.$refs
        const ids = this.localSelection.map((m) => m[this.rowKey])
        const selectRows = list.filter((item) => ids.includes(item[this.rowKey]))
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        this.localSelection = [row]
        this.$nextTick(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      } else {
        const isAdd = selection.includes(row)
        const idx = this.localSelection.findIndex((f) => f[this.rowKey] === row[this.rowKey])

        if (isAdd && idx === -1) {
          this.localSelection.push(row)
        } else if (!isAdd && idx !== -1) {
          this.localSelection.splice(idx, 1)
        }
      }
      this.localSelection = this.localSelection.filter((item) => item[this.rowKey])
      this.updateVal(this.localSelection)
    },
    /**
     * @description 全选只针对当前页 那么在状态改变的时候 应该不考虑未来的选中数据
     * @description 循环调用 onSelect 方法保存或删除当前页选中数据
     * @param list 当前页勾选数据 如果localSelection存在未来页数据 那么页码切换的时候 list中也会有
     */
    async handleSelectAll(list) {
      const { finderTable } = this.$refs.finder.$refs
      const currentPageData = finderTable.$refs.finderTable.list
      const currentPageDataIds = currentPageData.map((m) => m[this.rowKey])

      // 获取当前页面已选中的数据
      const currentPageSelectList = list.filter((item) =>
        currentPageDataIds.includes(item[this.rowKey])
      )

      // 先移除当前页的所有选中项
      this.localSelection = this.localSelection.filter(
        (item) => !currentPageDataIds.includes(item[this.rowKey])
      )

      // 如果有选中项，则添加到 localSelection
      if (currentPageSelectList.length > 0) {
        this.localSelection.push(...currentPageData)
      }

      this.updateVal(this.localSelection)

      // 更新表格选中状态
      this.$nextTick(() => {
        if (currentPageSelectList.length > 0) {
          finderTable.$refs.finderTable.setSelection(currentPageData)
        } else {
          finderTable.$refs.finderTable.clearSelection()
        }
      })
    }
  }
}
</script>
