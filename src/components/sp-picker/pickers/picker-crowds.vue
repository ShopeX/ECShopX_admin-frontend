<style lang="scss">
.picker-crowds {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .filter-tools {
    display: flex;
    align-items: center;
    padding: 8px;
    .el-cascader,
    .el-input {
      width: 196px;
      margin-right: 8px;
    }
  }
}
</style>
<template>
  <div class="picker-crowds">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="tag_name">
        <el-input v-model="formData.tag_name" clearable placeholder="标签名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="tag_id">
        <el-input v-model="formData.tag_id" placeholder="标签ID" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      reserve-selection
      row-key="tag_id"
      :other-config="{
        'max-height': 416,
        'header-cell-class-name': cellClass
      }"
      url="/member/tag"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'tag_id', width: 80 },
          { name: '标签名称', key: 'tag_name' }
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
import { getRegionauthId } from '@/utils'
export default {
  name: 'PickerCrowds',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择人群标签'
  },
  props: ['value'],
  data() {
    const { queryParams } = this.value
    const defaultParams = {
      tag_name:'',
      tag_id:'',
      status:'1',
      is_onlyactive:'1'
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      list: [],
      multipleSelection: [],
      multiple: this.value?.multiple ?? true,
      localSelection: []
    }
  },
  computed: {},
  created() {
    this.localSelection = cloneDeep(this.value.data) || []
    this.rowKey = this.value?.rowKey || 'tag_id'
  },
  mounted() {},
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData,
         regionauth_id: getRegionauthId()
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
