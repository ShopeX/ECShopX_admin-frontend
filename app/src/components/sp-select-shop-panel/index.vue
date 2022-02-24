<style lang="scss">
.sp-select-shop-panel {
  .filter-tools {
    display: flex;
    align-items: center;
    padding: 8px;
  }
  .el-cascader,
  .el-input {
    width: 196px;
    margin-right: 8px;
  }
  .el-button--text {
    font-size: 13px;
  }
  .sp-finder-hd {
    display: none;
  }
  .sp-finder-bd {
    padding: 0;
  }
  .el-pagination__editor {
    width: auto;
  }
  .el-table td {
    padding: 5px 0;
  }
  .el-pagination {
    margin: 8px;
    text-align: center;
  }
}
</style>

<template>
  <div class="sp-select-shop-panel">
    <div class="filter-tools">
      <el-cascader
        filterable
        clearable
        placeholder="选择地区筛选店铺"
        ref="region"
        v-model="region"
        :options="district"
        :props="{ checkStrictly: true }"
        @change="onChangeCascader"
        @visible-change="visibleChange"
      >
      </el-cascader>
      <el-input placeholder="请输入店铺名称搜索" v-model="keywords" @change="fetch"></el-input>
      <el-button type="text" @click="reset">重置</el-button>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="list"
        :showHeader="false"
        @selection-change="handleSelectionChange"
        @row-click="onRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="店铺名称"> </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background layout="total, prev, pager, next" :total="total"> </el-pagination>
    </div>

    <!-- <SpFinder
      ref="finder"
      :other-config="{
        showHeader: false
      }"
      :setting="{
        columns: [{ name: '店铺名称', key: 'name' }]
      }"
      @row-click="onRowClick"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/distributors"
    >
    </SpFinder> -->
  </div>
</template>

<script>
import district from '@/common/district.json'
export default {
  name: 'SpSelectShopPanel',
  props: {},
  data() {
    return {
      district,
      region: [],
      keywords: '',
      list: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      selected: []
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const params = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      if (this.keywords) {
        params['name'] = this.keywords
      }

      const regionLabels = []
      const getRegionLabel = (district, i) => {
        if (this.region[i]) {
          const fd = district.find((item) => item.value == this.region[i])
          regionLabels.push(fd.label)
          if (fd.children) {
            getRegionLabel(fd.children, ++i)
          }
        }
      }
      getRegionLabel(this.district, 0)
      console.log('regionLabels:', regionLabels)
      const [province = '', city = '', area = ''] = regionLabels
      params['province'] = province
      params['city'] = city
      params['area'] = area
      
      const { total_count, list } = await this.$api.marketing.getDistributorList(params)
      this.list = list
      this.total = total_count
      this.loading = false
    },
    // beforeSearch({ page, finderId }) {
    //   return {
    //     page,
    //     pageSize: 10,
    //     finderId
    //   }
    // },
    reset() {
      this.keywords = ''
      this.region = []
      this.fetch()
    },
    handleSelectionChange() {},
    onRowClick({ distributor_id, name }) {
      this.$emit('change', {
        name,
        value: distributor_id
      })
    },
    async onChangeCascader() {
      this.fetch()
    },
    visibleChange(visible) {
      this.$emit('visible-change', visible)
    }
  }
}
</script>
