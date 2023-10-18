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
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" clearable placeholder="请输入商品名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="approve_status">
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
      <SpFilterFormItem prop="brand_id">
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
      <SpFilterFormItem prop="category">
        <el-cascader
          v-model="formData.category"
          placeholder="请选择分类"
          clearable
          :options="categoryList"
          :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
        />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="isShowFormItem('distributor_id')" prop="distributor_id">
        <SpSelectShop
          v-model="formData.distributor_id"
          clearable
          placeholder="请选择店铺"
          @change="onSearch"
        />
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
      url="/goods/items"
      show-pager-text="已选中：${n}"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '商品ID', key: 'item_id', width: 80 },
          {
            name: '商品名称',
            key: 'page_name',
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
          {
            name: '价格（¥）',
            key: 'price',
            width: 150,
            render: (h, { row }) => h('span', {}, row.price / 100)
          },
          { name: '库存', key: 'store', width: 150 }
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
import { SALES_STATUS } from '@/consts'
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
      distributor_id: ''
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      salesStatus: SALES_STATUS,
      list: [],
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
  created() {
    this.localSelection = this.value.data || []
  },
  mounted() {
    this.getGoodsBranchList()
    this.getCategory()
  },
  methods: {
    beforeSearch(params) {
      const { category } = this.formData
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
        const selectRows = list.filter((item) => this.localSelection.includes(item.item_id))
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
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      }
    },
    onSelectionChange(selection) {
      this.localSelection = []
      this.updateVal(selection)
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
