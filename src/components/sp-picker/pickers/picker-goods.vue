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
      <SpFilterFormItem prop="supplier_name" >
        <el-input v-model="formData.supplier_name" placeholder="所属供应商" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_holder" >
        <el-select v-model="formData.item_holder" placeholder="请选择商品类型" clearable>
          <el-option
            v-for="item in goodCategory"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="is_gift" >
        <el-select v-model="formData.is_gift"
            placeholder="是否为赠品"
            clearable>
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
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
      :url="IS_DISTRIBUTOR() ? 'distributor/items' : '/goods/items'"
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
          { name: 'SKU编码', key: 'item_bn', width: 120 },
          {
            name: '商品类型',
            key: 'item_holder',
            width: 80,
            render: (h, { row }) => h('span', {}, this.goodCategoryMap[row.item_holder])
          },
          {
            name: '是否赠品',
            key: 'is_gift',
            width: 80,
            render: (h, { row }) => h('span', {}, row.is_gift == '1' ? '是' : '否' )
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
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { SALES_STATUS, GOOD_CATEGORY, GOOD_CATEGORY_MAP } from '@/consts'
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
      is_gift:''
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
      const ids = this.localSelection
      const { list } = response.data.data
      const selectRow = list.filter((f) => ids.includes(f.item_id))
      this.$nextTick(() => {
        const finderTable = this.$refs.finder.$refs.finderTable.$refs.finderTable
        const sids = finderTable.selection.map((m) => m.item_id)

        finderTable.setSelection(selectRow.filter((f) => !sids.includes(f.item_id)))
        console.log(
          selectRow.filter((f) => !sids.includes(f.item_id)),
          '33333333========'
        )
      })
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
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      }
    },
    onSelectionChange(selection) {
      let localVals = this.localVal.data.length > 0 ? this.localVal.data : []
      let objArray = [...selection]
      let uniqueMap = new Map()
      let result = objArray.reduce((unique, item) => {
        if (!uniqueMap.has(item.item_id)) {
          uniqueMap.set(item.item_id, true) // 将 item_id 添加到 Map 中
          unique.push(item) // 将当前对象添加到结果数组中
        }
        return unique
      }, [])
      this.updateVal(result) //存储点击的数据
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
