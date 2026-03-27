<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
}
</style>
<template>
  <div class="picker-goodslist">
    <div class="type-select">
      {{ $t('d40ceba9.b30230') }}
      <el-radio-group v-model="typeSelect">
        <el-radio :label="1">{{ $t('d40ceba9.16828f') }}</el-radio>
        <el-radio :label="2">{{ $t('d40ceba9.14a853') }}</el-radio>
        <el-radio :label="3">{{ $t('d40ceba9.bf910a') }}</el-radio>
      </el-radio-group>
    </div>

    <div v-show="typeSelect == 1" class="type-select">
      <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="main_cat_id">
          <el-cascader
            v-model="queryForm.main_cat_id"
            :placeholder="$t('d40ceba9.b3ed9f')"
            :options="categoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="category">
          <el-cascader
            v-model="queryForm.category"
            :placeholder="$t('d40ceba9.392d49')"
            :options="salesCategoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_name">
          <el-input v-model="queryForm.item_name" :placeholder="$t('d40ceba9.d83187')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_bn">
          <el-input v-model="queryForm.item_bn" :placeholder="$t('d40ceba9.40a487')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="approve_status">
          <el-select
            v-model="queryForm.approve_status"
            :placeholder="$t('d40ceba9.599c08')"
            clearable
          >
            <el-option
              v-for="item in statusOptionTranslated"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="supplier_name">
          <el-input v-model="queryForm.supplier_name" :placeholder="$t('d40ceba9.40b1be')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_holder">
          <el-select v-model="queryForm.item_holder" :placeholder="$t('d40ceba9.2af133')" clearable>
            <el-option
              v-for="item in categoryOptionTranslated"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_gift">
          <el-select v-model="queryForm.is_gift" :placeholder="$t('d40ceba9.674022')" clearable>
            <el-option :value="true" :label="$t('d40ceba9.0a60ac')" />
            <el-option :value="false" :label="$t('d40ceba9.c9744f')" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="brand_id">
          <el-select
            v-model="queryForm.brand_id"
            :placeholder="$t('d40ceba9.41b90f')"
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
        :setting="goodslistSetting"
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
        <div class="hd">{{ $t('d40ceba9.117bf1') }}</div>
        <div class="hd">{{ $t('d40ceba9.301d4d') }}</div>
        <div class="hd">{{ $t('d40ceba9.3ba8ac') }}</div>
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
        <div class="hd">{{ $t('d40ceba9.117bf1') }}</div>
        <div class="hd">{{ $t('d40ceba9.301d4d') }}</div>
        <div class="hd">{{ $t('d40ceba9.3ba8ac') }}</div>
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
import { createSetting } from '@shopex-ui/finder'
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
      salevalue: '唇膏',
      categoryList: [],
      salesCategoryList: []
    }
  },
  computed: {
    categoryOptionTranslated() {
      const t = this.$t.bind(this)
      return [
        { title: t('d40ceba9.81a684'), value: 'platform' },
        { title: t('d40ceba9.b1c9d7'), value: 'distributor' },
        { title: t('d40ceba9.45a570'), value: 'supplier' }
      ]
    },
    statusOptionTranslated() {
      const t = this.$t.bind(this)
      return [
        { title: t('d40ceba9.9b7481'), value: 'onsale' },
        { title: t('d40ceba9.2c50a0'), value: 'offline_sale' },
        { title: t('d40ceba9.acf86b'), value: 'only_show' },
        { title: t('d40ceba9.ae83a3'), value: 'instock' }
      ]
    },
    goodslistSetting() {
      const t = this.$t.bind(this)
      const itemSourceMap = this.itemSourceMap
      return createSetting({
        columns: [
          { name: t('d40ceba9.858526'), key: 'itemId', width: '80' },
          {
            name: t('d40ceba9.1fd1d5'),
            key: 'name',
            width: '220',
            render: (h, { row }) =>
              h(
                'div',
                {
                  class: 'flex items-start'
                },
                [
                  h(
                    'div',
                    {
                      class:
                        'w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 mr-2.5'
                    },
                    [
                      h('img', {
                        class: 'max-w-full max-h-full object-contain',
                        attrs: { src: row.pics[0] }
                      })
                    ]
                  ),
                  h('div', { class: 'flex-1' }, [
                    h('div', { class: 'text-gray-800 mt-1' }, row.itemName),
                    h(
                      'div',
                      { class: 'text-xs bg-gray-100 inline-block px-1 leading-[18px]' },
                      row.nospec ? '' : t('d40ceba9.5d60de')
                    )
                  ])
                ]
              )
          },
          { name: t('d40ceba9.ea887b'), key: 'item_spec_desc', width: '120' },
          {
            name: t('d40ceba9.792518'),
            key: 'is_gift',
            formatter: (value, row, col) => {
              return value == '1' ? t('d40ceba9.0a60ac') : t('d40ceba9.c9744f')
            },
            width: '120'
          },
          { name: t('d40ceba9.40b1be'), key: 'supplier_name', width: '120' },
          {
            name: t('d40ceba9.2af133'),
            key: 'item_holder',
            formatter: (value, row, col) => {
              return itemSourceMap[value]
            },
            width: '120'
          },
          {
            name: t('d40ceba9.818fc4'),
            key: 'market_price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          {
            name: t('d40ceba9.e29575'),
            key: 'price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          {
            name: t('d40ceba9.2e2ce2'),
            key: 'cost_price',
            formatter: (value, row, col) => {
              return value / 100
            },
            width: '120'
          },
          { name: t('d40ceba9.0eac88'), key: 'store', width: '120' }
        ]
      })
    },
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
    this.$options.config.title = this.$t('d40ceba9.43d1e2')
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
      getGoodsAttr(this.goodsBranchParams).then((response) => {
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
