<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-article {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
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
  <div class="picker-article">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入页面名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/article/management"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'article_id', width: 80 },
          { name: $t('9bbe0bc6.7526a0'), key: 'title' }
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
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerArticle',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择文章'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  created() {
    this.$options.config.title = this.$t('9bbe0bc6.b72fad')
  },
  methods: {
    beforeSearch(params) {
      // const { keywords } = this.formData
      // if (keywords) {
      //   params = {
      //     ...params,
      //     page_name: keywords
      //   }
      // }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const raw = this.value?.data
      if (raw == null || raw === '') return
      const selectedIds = Array.isArray(raw) ? raw : [raw]
      const selectRows = list.filter((item) =>
        selectedIds.map(String).includes(String(item.article_id))
      )
      if (!selectRows.length) return
      const finderTable = this.$refs.finder?.$refs?.finderTable
      if (!finderTable?.$refs?.finderTable) return
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
