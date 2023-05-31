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
      <SpFilterForm :model="queryForm" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="category">
          <el-cascader
            v-model="queryForm.category"
            placeholder="管理分类"
            :options="categoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="salesCategory">
          <el-cascader
            v-model="queryForm.salesCategory"
            placeholder="销售分类"
            :options="salesCategoryList"
            :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="name">
          <el-input v-model="queryForm.name" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="sn">
          <el-input v-model="queryForm.sn" placeholder="请输入货号" />
        </SpFilterFormItem>
      </SpFilterForm>

      <SpFinder
        ref="finder"
        :setting="setting"
        :row-actions-align="'left'"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        url="/goods/items"
        @selection-change="onSelectionChange"
      />
    </div>

    <div v-show="typeSelect == 2" class="">
      <SpFilterForm :model="queryForm" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="sn">
          <el-input v-model="queryForm.sn" placeholder="管理分类关键字" />
        </SpFilterFormItem>
      </SpFilterForm>
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
      <SpFilterForm :model="queryForm" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="sn">
          <el-input v-model="queryForm.sn" placeholder="销售分类关键字" />
        </SpFilterFormItem>
      </SpFilterForm>
      <div class="cascader-header">
        <div class="hd">一级</div>
        <div class="hd">二级</div>
        <div class="hd">三级</div>
      </div>
      <el-cascader-panel
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
        salesCategory: [],
        name: '',
        sn: ''
      },
      categoryList: [],
      salesCategoryList: [],
      setting: createSetting({
        columns: [
          { name: '商品ID', key: 'itemId', width: '80' },
          {
            name: '商品名称',
            key: 'name',
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
            name: '价格（¥）',
            key: 'price',
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
  async created() {
    // 管理分类
    const category = await this.$api.goods.getCategory({ is_main_category: true })
    // 销售分类
    const salesCategory = await this.$api.goods.getCategory()
    this.categoryList = category
    this.salesCategoryList = salesCategory
  },
  mounted() {
    // this.refresh(true)
  },
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        item_type: 'normal'
        // ...this.queryForm
      }
    },
    onSearch() {
      this.refresh(true)
    },
    async fetch({ page_no, page_size }) {
      const { category } = this.queryForm
      const query = {
        page: page_no,
        pageSize: page_size,
        item_type: 'normal',
        special_type: ['normal', 'drug'],
        audit_status: 'approved',
        is_sku: false,
        ...this.queryForm,
        category: category[category.length - 1]
      }
      if (!query.distributor_id) {
        query.distributor_id = this.shopid
      }

      const { list, total_count } = await this.$api.goods.getItemsList(query)
      this.list = list
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
