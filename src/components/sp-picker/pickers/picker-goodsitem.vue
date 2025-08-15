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
        <el-input v-model="formData.keywords" clearable placeholder="请输入商品名称" />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="approve_status">
        <el-select v-model="formData.approve_status" clearable placeholder="请选择">
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
          placeholder="请选择品牌"
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
          placeholder="请选择分类"
          clearable
          :options="categoryList"
          :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
        />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="isShowFormItem('distributor_id') && !value.isPointGoods" prop="distributor_id">
        <SpSelectShop
          v-model="formData.distributor_id"
          clearable
          placeholder="请选择店铺"
          @change="onSearch"
        />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="supplier_name">
        <el-input v-model="formData.supplier_name" placeholder="所属供应商" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_bn">
        <el-input v-model="formData.item_bn" placeholder="请输入商品货号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_holder">
        <el-select v-model="formData.item_holder" placeholder="请选择商品类型" clearable>
          <el-option
            v-for="item in goodCategory"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="is_gift">
        <el-select v-model="formData.is_gift" placeholder="是否为赠品" clearable>
          <el-option :value="true" label="是" />
          <el-option :value="false" label="否" />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!value.isPointGoods" prop="is_prescription">
        <el-select v-model="formData.is_prescription" placeholder="是否处方药" clearable>
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
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
      :show-pager-text="`已选中：${localSelection.length}`"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '商品ID', key: 'item_id', width: 80 },
          {
            name: '商品名称',
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
          { name: 'SKU编码', key: 'item_bn', width: 120 },
          {
            name: '商品类型',
            key: 'item_holder',
            width: 80,
            render: (h, { row }) => h('span', {}, goodCategoryMap[row.item_holder])
          },
          {
            name: '是否赠品',
            key: 'is_gift',
            width: 80,
            render: (h, { row }) => h('span', {}, row.is_gift == '1' ? '是' : '否')
          },
          { name: '所属供应商', key: 'supplier_name', width: 100 },

          {
            name: '市场价（¥）',
            key: 'market_price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.market_price / 100)
          },
          {
            name: '销售价（¥）',
            key: 'price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.price / 100)
          },
          {
            name: '成本价（¥）',
            key: 'cost_price',
            width: 100,
            render: (h, { row }) => h('span', {}, row.cost_price / 100)
          },
          { name: '库存', key: 'store', width: 100 }
        ]
      }"
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
      item_bn:""
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
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
      localSelection: []
    }
  },
  computed: {
    url() {
      if (this.IS_DISTRIBUTOR() || (this.VERSION_STANDARD && this.formData.distributor_id)){
        return '/distributor/items'
      } else {
        if (this.value.isPointGoods) {
          return '/pointsmall/goods/items'
        } else {
          return '/goods/items'
        }
      }
    }
  },
  created() {
    this.localSelection = cloneDeep(this.value.data) || []
    this.rowKey = this.value?.rowKey || 'item_id'
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
    onReset() {
      this.$refs.finder.refresh(true)
    },
    onSearch() {
      this.$refs.finder.initData(true)
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
      this.localSelection = this.localSelection.filter((item) => item.itemId)
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
