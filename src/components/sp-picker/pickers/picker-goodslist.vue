<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss">
.picker-goodslist {
  .type-select {
    margin: 16px 10px;
  }
  .sp-filter-form {
    padding: 8px 8px 0 8px;
    // margin-bottom: 10px;
  }
  .sp-finder-hd {
    display: none;
  }
  .item-info {
    display: flex;
    .item-image {
      margin-right: 10px;
      width: 80px;
    }
    .item-name {
      color: #333;
      margin-top: 4px;
    }
    .item-sku {
      font-size: 12px;
      background-color: #f0f2f5;
      display: inline-block;
      padding: 0 4px;
      line-height: 18px;
    }
  }
  .cascader-header {
    display: flex;
    background-color: #f0f2f5;
    margin-top: 10px;
    .hd {
      color: #222;
      width: 180px;
      padding: 6px 20px;
      border-left: 1px solid #e8e8e8;
    }
  }
}
</style>
<template>
  <div class="picker-goodslist">
    <div class="type-select">
      选择商品:
      <el-radio-group v-model="typeSelect">
        <el-radio :label="1">从全部商品选择</el-radio>
        <el-radio :label="2">按管理分类选择</el-radio>
        <el-radio :label="3">按销售分类选择</el-radio>
      </el-radio-group>
    </div>

    <div v-show="typeSelect == 1">
      <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="main_cat_id">
          <el-cascader
            v-model="queryForm.main_cat_id"
            placeholder="管理分类"
            :options="categoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="category">
          <el-cascader
            v-model="queryForm.category"
            placeholder="销售分类"
            :options="salesCategoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_name">
          <el-input v-model="queryForm.item_name" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_bn">
          <el-input v-model="queryForm.item_bn" placeholder="请输入货号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="approve_status">
          <el-select v-model="queryForm.approve_status" placeholder="选择状态" clearable>
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="supplier_name">
          <el-input v-model="queryForm.supplier_name" placeholder="所属供应商" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_holder">
          <el-select v-model="queryForm.item_holder" placeholder="商品类型" clearable>
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_gift">
          <el-select v-model="queryForm.is_gift" placeholder="是否为赠品" clearable>
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="brand_id">
          <el-select
            v-model="queryForm.brand_id"
            placeholder="选择品牌"
            remote
            filterable
            :remote-method="getGoodsBranchList"
            clearable
          >
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <SpFinder
        ref="finder"
        :setting="setting"
        :row-actions-align="'left'"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        :url="goodsUrl"
        @selection-change="onSelectionChange"
      />
    </div>

    <div v-show="typeSelect == 2" class="">
      <!-- <SpFilterForm :model="queryForm" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="item_bn">
          <el-input v-model="queryForm.item_bn" placeholder="管理分类关键字" />
        </SpFilterFormItem>
      </SpFilterForm> -->
      <div class="cascader-header">
        <div class="hd">一级</div>
        <div class="hd">二级</div>
        <div class="hd">三级</div>
      </div>
      <el-cascader-panel
        :options="categoryList"
        :props="{
          checkStrictly: true,
          label: 'category_name',
          value: 'category_id',
          multiple: true
        }"
        @change="onChangeCategory"
      />
    </div>

    <div v-show="typeSelect == 3">
      <!-- <SpFilterForm :model="queryForm" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="item_bn">
          <el-input v-model="queryForm.item_bn" placeholder="销售分类关键字" />
        </SpFilterFormItem>
      </SpFilterForm> -->
      <div class="cascader-header">
        <div class="hd">一级</div>
        <div class="hd">二级</div>
        <div class="hd">三级</div>
      </div>
      <el-cascader-panel
        v-model="salevalue"
        :options="salesCategoryList"
        :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
        @change="onChangeSalesCategory"
      />
    </div>
  </div>
</template>

<script>
import { SALES_STATUS } from '@/consts'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { createSetting } from '@shopex/finder'
import { GOOD_CATEGORY_MAP } from '@/consts'
import { getGoodsAttr } from '@/api/goods'

export default {
  name: 'PickerGoods',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择商品'
  },
  props: ['value'],
  data() {
    return {
      typeSelect: 1,
      queryForm: {
        category: [],
        main_cat_id: [],
        item_name: '',
        item_bn: '',
        sn: '',

        supplier_name: '',
        item_holder: '',
        is_gift: '',
        approve_status: '',
        brand_id: ''
      },
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      goodsBranchList: [],
      itemSourceMap: GOOD_CATEGORY_MAP,
      categoryOption: [
        {
          title: '自营商品',
          value: 'platform'
        },
        {
          title: '商户商品',
          value: 'distributor'
        },
        {
          title: '供应商商品',
          value: 'supplier'
        }
      ],
      statusOption: [
        {
          title: '前台可销售',
          value: 'onsale'
        },
        {
          title: '前台不展示',
          value: 'offline_sale'
        },
        {
          title: '前台仅展示',
          value: 'only_show'
        },
        {
          title: '不可销售',
          value: 'instock'
        }
      ],
      salevalue: '唇膏',
      categoryList: [],
      salesCategoryList: [],
      setting: createSetting({
        columns: [
          { name: '商品ID', key: 'itemId', width: '80' },
          {
            name: '商品名称',
            key: 'name',
            width: '220',
            render: (h, { row }) =>
              h(
                'div',
                {
                  class: 'item-info'
                },
                [
                  h('el-image', {
                    class: 'item-image',
                    props: { src: row.pics[0], fit: 'cover' }
                  }),
                  h('div', { class: 'item-name-wrap' }, [
                    h('div', { class: 'item-name' }, row.itemName),
                    h('div', { class: 'item-sku' }, row.nospec ? '' : '多规格')
                  ])
                ]
              )
          },
          {
            name: '规格',
            key: 'item_spec_desc',
            width: '120'
          },
          {
            name: '是否赠品',
            key: 'is_gift',
            formatter: (value, row, col) => {
              return value == '1' ? '是' : '否'
            },
            width: '120'
          },
          {
            name: '所属供应商',
            key: 'supplier_name',
            width: '120'
          },
          {
            name: '商品类型',
            key: 'item_holder',
            formatter: (value, row, col) => {
              return this.itemSourceMap[value]
            },
            width: '120'
          },

          {
            name: '市场价',
            key: 'market_price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          {
            name: '销售价',
            key: 'price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          {
            name: '成本价',
            key: 'cost_price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          {
            name: '库存',
            key: 'store',
            width: '120'
          }
        ]
      })
    }
  },
  computed: {
    goodsUrl() {
      if (
        (this.VERSION_STANDARD() && this.IS_DISTRIBUTOR()) ||
        !(
          this.VERSION_PLATFORM() ||
          !this.value?.distributor_id ||
          this.value?.distributor_id == '0'
        )
      ) {
        return 'distributor/items'
      } else {
        return '/goods/items'
      }
    }
  },
  async created() {
    await this.getCategoryInfo()
    this.getGoodsBranchList()
  },
  mounted() {
    // this.refresh(true)
  },
  methods: {
    async getCategoryInfo() {
      // 管理分类
      const category = await this.$api.goods.getCategory({ is_main_category: true })

      // 销售分类
      const salesCategory = await this.$api.goods.getCategory()
      this.categoryList = category
      this.salesCategoryList = salesCategory
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        item_type: 'normal',
        ...this.queryForm,
        distributor_id: this.value?.distributor_id,
        keywords: this.queryForm.item_name.trim()
      }
      delete _params.item_name
      return _params
    },
    onSearch() {
      this.refresh(true)
    },
    getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      getGoodsAttr(this.goodsBranchParams).then(response => {
        this.goodsBranchList = response.data.data.list
        console.log(111, this.goodsBranchList)
      })
    },
    async fetch({ page_no, page_size }) {
      const { category, main_cat_id } = this.queryForm
      const query = {
        page: page_no,
        pageSize: page_size,
        item_type: 'normal',
        special_type: ['normal', 'drug'],
        audit_status: 'approved',
        is_sku: false,
        ...this.queryForm,
        category: category[category.length - 1],
        main_cat_id: main_cat_id[main_cat_id.length - 1]
      }
      if (!query.distributor_id) {
        query.distributor_id = this.shopid
      }

      const { list, total_count } = await this.$api.goods.getItemsList(query)
      this.list = list
      this.$refs['finder'].refresh()
      return { count: total_count }
    },
    onChangeCategory(e) {
      this.updateVal({
        type: 'category',
        value: e
      })
    },
    onChangeSalesCategory(e) {
      this.updateVal({
        type: 'salesCategory',
        value: e
      })
    },
    onSelectionChange(selection) {
      this.updateVal({
        type: 'goods',
        value: selection
      })
    }
  }
}
</script>
