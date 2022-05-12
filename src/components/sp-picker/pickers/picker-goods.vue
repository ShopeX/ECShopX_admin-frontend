<style lang="scss">
.picker-goods {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
    margin-bottom: 0;

    &-item {
      // margin-bottom: 8px;
    }
  }
  .item-info {
    display: flex;
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
  .el-pagination {
    padding: 10px;
    text-align: center;
  }
}
</style>
<template>
  <div class="picker-goods">
    <SpFilterForm
      :model="params"
      size="small"
      @onSearch="onSearch"
      @onReset="onSearch"
    >
      <SpFilterFormItem prop="keywords">
        <el-input
          v-model="params.keywords"
          clearable
          placeholder="请输入商品名称"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="approve_status">
        <el-select
          v-model="params.approve_status"
          clearable
          placeholder="请选择"
        >
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
          v-model="params.brand_id"
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
          v-model="params.category"
          placeholder="请选择分类"
          clearable
          :options="categoryList"
          :props="{ value: 'category_id', checkStrictly: true }"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="shopid == 0"
        prop="distributor_id"
      >
        <SpSelectShop
          v-model="params.distributor_id"
          clearable
          placeholder="请选择店铺"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <div>
      <el-table
        v-loading="loading"
        border
        :data="list"
        height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          label="全选"
        />
        <el-table-column
          label="商品ID"
          prop="itemId"
          width="100"
        />
        <el-table-column
          label="商品名称"
          min-width="200"
        >
          <template slot-scope="scope">
            <div class="item-info">
              <SpImage
                :src="scope.row.pics[0]"
                :width="60"
                :height="60"
              />
              <div>
                <div class="item-name">
                  {{ scope.row.itemName }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="价格（¥）"
          prop="price"
          width="150"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.price / 100 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          prop="store"
          width="150"
        />
      </el-table>
    </div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="pageCur"
      :page-size="pageSize"
      :total="pageCount"
      @current-change="goPage"
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
  data () {
    return {
      shopid: this.value.shopid || 0,
      pageSize: 10,
      params: {
        keywords: '',
        approve_status: 'onsale',
        brand_id: '',
        category: '',
        distributor_id: ''
      },
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
      categoryList: []
    }
  },
  created () {},
  mounted () {
    this.refresh(true)
    this.getGoodsBranchList()
    this.getCategory()
  },
  methods: {
    onSearch () {
      this.refresh(true)
    },
    async fetch ({ page_no, page_size }) {
      const { category } = this.params
      const query = {
        page: page_no,
        pageSize: page_size,
        item_type: 'normal',
        special_type: ['normal', 'drug'],
        audit_status: 'approved',
        is_sku: false,
        ...this.params,
        category: category[category.length - 1]
      }
      if (!query.distributor_id) {
        query.distributor_id = this.shopid
      }

      const { list, total_count } = await this.$api.goods.getItemsList(query)
      this.list = list
      return { count: total_count }
    },
    async getGoodsBranchList (searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    },
    async getCategory () {
      const res = await this.$api.goods.getCategory({ is_show: false })
      this.categoryList = res
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.updateVal(val)
    },
    handleClickCatgory ({ image_cat_id }) {
      this.selectCatgory = image_cat_id
      this.refresh(true)
    }
  }
}
</script>
