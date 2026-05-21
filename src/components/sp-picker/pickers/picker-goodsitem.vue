<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-goods {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
  }

  .sp-finder-hd {
    display: none;
  }

  .sp-finder-hd {
    display: none;
  }

  .item-info {
    display: flex;

    .item-image {
      width: 60px;
      margin-right: 8px;
    }

    .sp-image {
      margin-right: 10px;
    }

    .item-name {
      color: #333;
      margin-top: 4px;
    }
  }

  .el-table {
    td {
      padding: 0;
    }
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
  <div class="picker-goods">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" clearable :placeholder="$t('3157a2d5.d83187')" />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="approve_status">
        <el-select v-model="formData.approve_status" clearable :placeholder="$t('3157a2d5.708c9d')">
          <el-option
            v-for="item in salesStatus"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="brand_id">
        <el-select
          v-model="formData.brand_id"
          :placeholder="$t('3157a2d5.f70267')"
          remote
          filterable
          clearable
          :remote-method="getGoodsBranchList"
        >
          <el-option
            v-for="item in goodsBranchList"
            :key="item.attribute_id"
            :label="item.attribute_name"
            :value="item.attribute_id"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="category">
        <el-cascader
          v-model="formData.category"
          :placeholder="$t('3157a2d5.8bb820')"
          clearable
          :options="categoryList"
          :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="isShowFormItem('distributor_id') && !value.isPointGoods"
        prop="distributor_id"
      >
        <SpSelectShop
          v-model="formData.distributor_id"
          clearable
          :placeholder="$t('3157a2d5.06accf')"
          @change="onSearch"
        />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="supplier_name">
        <el-input v-model="formData.supplier_name" :placeholder="$t('3157a2d5.40b1be')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_bn">
        <el-input v-model="formData.item_bn" :placeholder="$t('3157a2d5.35a59c')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_holder">
        <el-select v-model="formData.item_holder" :placeholder="$t('3157a2d5.77ccd0')" clearable>
          <el-option
            v-for="item in goodCategory"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="is_gift">
        <el-select v-model="formData.is_gift" :placeholder="$t('3157a2d5.674022')" clearable>
          <el-option :value="true" :label="$t('3157a2d5.0a60ac')" />
          <el-option :value="false" :label="$t('3157a2d5.c9744f')" />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="is_prescription">
        <el-select
          v-model="formData.is_prescription"
          :placeholder="$t('3157a2d5.9c251b')"
          clearable
        >
          <el-option :value="1" :label="$t('3157a2d5.0a60ac')" />
          <el-option :value="0" :label="$t('3157a2d5.c9744f')" />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      reserve-selection
      row-key="item_id"
      :other-config="{
        'max-height': 416,
        'header-cell-class-name': cellClass
      }"
      :url="url"
      :show-pager-text="`${$t('3157a2d5.a9e74f')}${localSelection.length}`"
      :fixed-row-action="true"
      :setting="goodsitemSetting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @select-all="handleSelectAll"
    />
  </div>
</template>

<script>
import { SALES_STATUS, GOOD_CATEGORY, GOOD_CATEGORY_MAP } from '@/consts'
import { cloneDeep } from 'lodash'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerGoods',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择商品'
  },
  props: ['value'],
  data() {
    const { queryParams } = this.value
    const defaultParams = {
      keywords: '',
      approve_status: 'onsale',
      brand_id: '',
      category: '',
      distributor_id: '',
      supplier_name: '',
      item_holder: '',
      is_gift: '',
      is_prescription: '',
      item_bn: ''
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      type: 'pickerGoodsItem',
      defaultVal: [],
      formData,
      salesStatus: SALES_STATUS,
      list: [],
      goodCategoryMap: GOOD_CATEGORY_MAP,
      goodCategory: GOOD_CATEGORY,
      multipleSelection: [],
      goodsBranchList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      categoryList: [],
      multiple: this.value?.multiple ?? true,
      localSelection: [],
      rowKey: this.value?.rowKey || 'item_id',
      restoringSelection: false
    }
  },
  computed: {
    url() {
      if (this.IS_DISTRIBUTOR() || (this.VERSION_STANDARD() && this.formData.distributor_id)) {
        return '/distributor/items'
      } else {
        if (this.value.isPointGoods) {
          return '/pointsmall/goods/items'
        } else {
          return '/goods/items'
        }
      }
    },
    goodsitemSetting() {
      const t = this.$t.bind(this)
      const goodCategoryMap = this.goodCategoryMap
      return {
        columns: [
          { name: t('3157a2d5.858526'), key: 'item_id', width: 80 },
          {
            name: t('3157a2d5.1fd1d5'),
            key: 'page_name',
            width: 200,
            render: (h, { row }) =>
              h('div', { class: 'item-info' }, [
                h('div', { class: 'item-image' }, [
                  h('SpImage', {
                    props: {
                      src: row.pics[0],
                      width: 60,
                      height: 60
                    }
                  })
                ]),
                h('div', { class: 'item-name' }, row.itemName)
              ])
          },
          { name: t('3157a2d5.b54bd0'), key: 'item_bn', width: 120 },
          {
            name: t('3157a2d5.2af133'),
            key: 'item_holder',
            width: 80,
            render: (h, { row }) => h('span', {}, goodCategoryMap[row.item_holder])
          },
          {
            name: t('3157a2d5.792518'),
            key: 'is_gift',
            width: 80,
            render: (h, { row }) =>
              h('span', {}, row.is_gift == '1' ? t('3157a2d5.0a60ac') : t('3157a2d5.c9744f'))
          },
          { name: t('3157a2d5.40b1be'), key: 'supplier_name', width: 100 },
          {
            name: t('3157a2d5.5cd87e'),
            key: 'market_price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.market_price / 100)
          },
          {
            name: t('3157a2d5.cf0170'),
            key: 'price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.price / 100)
          },
          {
            name: t('3157a2d5.066804'),
            key: 'cost_price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.cost_price / 100)
          },
          { name: t('3157a2d5.0eac88'), key: 'store', width: 100 }
        ]
      }
    }
  },
  created() {
    this.$options.config.title = this.$t('3157a2d5.43d1e2')
    this.localSelection = this.normalizeSelectionList(this.value.data)
    this.syncLocalValFromSelection()
  },
  mounted() {
    this.getGoodsBranchList()
    this.getCategory()
  },
  methods: {
    beforeSearch(params) {
      const { category } = this.formData
      if (this.value.isPointGoods) {
        return {
          ...params,
          item_type: 'normal',
          approve_status: 'onsale',
          is_warning: false,
          ...this.formData,
          category: category[category.length - 1]
        }
      }
      params = {
        ...params,
        item_type: 'normal',
        special_type: ['normal', 'drug'],
        audit_status: 'approved',
        is_sku: false,
        ...this.formData,
        category: category[category.length - 1]
      }
      return params
    },
    rowId(row) {
      if (!row) return ''
      const id = row[this.rowKey] ?? row.item_id ?? row.itemId
      return id != null && id !== '' ? String(id) : ''
    },
    normalizeSelectionList(list) {
      if (!Array.isArray(list)) return []
      const map = new Map()
      list.forEach((item) => {
        if (item == null) return
        if (typeof item === 'string' || typeof item === 'number') {
          const id = String(item)
          map.set(id, { item_id: id, itemId: id })
          return
        }
        const id = this.rowId(item)
        if (id) {
          map.set(id, {
            ...item,
            item_id: item.item_id ?? item.itemId ?? id,
            itemId: item.itemId ?? item.item_id ?? id
          })
        }
      })
      return Array.from(map.values())
    },
    syncLocalValFromSelection() {
      this.localVal = { data: this.localSelection }
    },
    dedupeSelectionList(list) {
      return this.normalizeSelectionList(list)
    },
    afterSearch(response) {
      const { list } = response.data.data
      const idSet = new Set(this.localSelection.map((m) => this.rowId(m)).filter(Boolean))
      if (!idSet.size) return
      const selectRows = list.filter((item) => idSet.has(this.rowId(item)))
      const finderTable = this.$refs.finder?.$refs?.finderTable?.$refs?.finderTable
      if (!finderTable || !selectRows.length) return
      this.restoringSelection = true
      this.$nextTick(() => {
        const sidSet = new Set((finderTable.selection || []).map((m) => this.rowId(m)))
        finderTable.setSelection(selectRows.filter((f) => !sidSet.has(this.rowId(f))))
        this.$nextTick(() => {
          this.restoringSelection = false
        })
      })
    },
    onReset() {
      this.$refs.finder.refresh(true)
    },
    onSearch() {
      this.$refs.finder.initData(true)
    },
    onSelect(selection, row) {
      if (this.restoringSelection) return
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        this.localSelection = row ? [row] : []
        this.$nextTick(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      } else {
        const isAdd = selection.includes(row)
        const rowKeyVal = this.rowId(row)
        const idx = this.localSelection.findIndex((f) => this.rowId(f) === rowKeyVal)

        if (isAdd) {
          if (idx === -1) {
            this.localSelection.push(row)
          } else {
            this.localSelection.splice(idx, 1, row)
          }
        } else if (idx !== -1) {
          this.localSelection.splice(idx, 1)
        }
      }
      this.localSelection = this.dedupeSelectionList(this.localSelection)
      this.updateVal(this.localSelection)
    },
    /**
     * @description 全选只针对当前页 那么在状态改变的时候 应该不考虑未来的选中数据
     * @description 循环调用 onSelect 方法保存或删除当前页选中数据
     * @param list 当前页勾选数据 如果localSelection存在未来页数据 那么页码切换的时候 list中也会有
     */
    async handleSelectAll(list) {
      if (this.restoringSelection) return
      const { finderTable } = this.$refs.finder.$refs
      const currentPageData = finderTable.$refs.finderTable.list
      const currentPageIdSet = new Set(currentPageData.map((m) => this.rowId(m)).filter(Boolean))

      const currentPageSelectList = list.filter((item) => currentPageIdSet.has(this.rowId(item)))

      this.localSelection = this.localSelection.filter(
        (item) => !currentPageIdSet.has(this.rowId(item))
      )

      if (currentPageSelectList.length > 0) {
        this.localSelection.push(...currentPageSelectList)
      }

      this.localSelection = this.dedupeSelectionList(this.localSelection)
      this.updateVal(this.localSelection)

      this.$nextTick(() => {
        if (currentPageSelectList.length > 0) {
          finderTable.$refs.finderTable.setSelection(currentPageSelectList)
        } else {
          finderTable.$refs.finderTable.clearSelection()
        }
      })
    },
    isShowFormItem(key) {
      const { paramsFieldExclude = [] } = this.value
      return !paramsFieldExclude.includes(key)
    },
    async getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    },
    async getCategory() {
      const res = await this.$api.goods.getCategory({ is_show: false })
      this.categoryList = res
    }
  }
}
</script>
