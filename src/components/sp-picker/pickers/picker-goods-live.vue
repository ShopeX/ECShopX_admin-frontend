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
      <SpFilterFormItem prop="name">
        <el-input v-model="formData.name" clearable placeholder="请输入商品名称" />
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
      :url="url"
      :show-pager-text="`已选中：${localSelection.length}`"
      :fixed-row-action="true"
      :setting="tableSchema"
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
const prdStatusMap = {
  'onsale': '上架',
  'instock': '下架'
}

const tableSchema = (vm) => ({
  columns: [
    {
      name: '商品名称',
      key: 'itemName'
    },
    { name: '品牌', key: 'goods_brand', width: 120 },
    { name: '小镇', key: 'regionauth_name', width: 120 },
    { name: '店铺', key: 'distributor_name', width: 120 },

    { name: '库存', key: 'store', width: 100 },
    {
      name: '上下架状态',
      key: 'approve_status',
      render(_, { row }) {
        return prdStatusMap[row.approve_status]
      }
    },
    {
      name: '审核状态',
      key: 'audit_status',
      render(_, { row }) {
        const textMap = {
          submitting: '待提交',
          approved: '成功',
          processing: '审核中',
          rejected: '审核拒绝'
        }
        return textMap[row.audit_status]
      }
    }
  ]
})

import { cloneDeep } from 'lodash'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { getRegionauthId } from '@/utils'
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
      distributor_id: '',
      name: ''
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      list: [],
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
      return this.IS_DISTRIBUTOR() || (this.VERSION_STANDARD && this.formData.distributor_id)
        ? 'distributor/items'
        : '/goods/items'
    },
    tableSchema() {
      return tableSchema(this)
    }
  },
  created() {
    this.localSelection = cloneDeep(this.value.data) || []
    console.log('????')
    this.rowKey = this.value?.rowKey || 'item_id'
  },
  mounted() {
    this.getGoodsBranchList()
    this.getCategory()
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        item_type: 'normal',
        ...this.formData,
        regionauth_id: getRegionauthId(),
        ...(this.value?.params || {})
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
      console.log(selection, row, '2222')
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        this.localSelection = [row]
        this.$nextTick(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      } else {
        this.localSelection = selection
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
