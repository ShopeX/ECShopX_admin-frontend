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
  .el-table__row {
    &.active {
      td {
        color: var(--primary);
      }
    }
  }
}
</style>

<template>
  <div class="sp-select-shop-panel">
    <div class="filter-tools">
      <el-input v-model="keywords" placeholder="请输入商户名称搜索" @change="fetch" />
      <el-button type="text" @click="reset"> 重置 </el-button>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="list"
        :show-header="false"
        :row-class-name="getRowActive"
        @row-click="onRowClick"
      >
        <!-- <el-table-column width="30">
          <template slot-scope="scope">
            <el-radio
              :value="getRadioValue(scope.row)"
              :label="true"
              @click.native.stop
            />
          </template>
        </el-table-column> -->

        <el-table-column prop="merchant_name" label="商户名称" width="500" />
      </el-table>
    </div>
    <div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="onCurrentChange"
      />
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
  name: 'SpSelectMerchantPanel',
  props: {},
  inject: ['selectMerchant'],
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
      selected: [],
      radio: 0
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    getRowActive({ row, rowIndex }) {
      if (!this.selectMerchant.selectValue) {
        return ''
      } else if (this.selectMerchant.selectValue.value == row.id) {
        return 'active'
      } else {
        return ''
      }
    },
    async fetch() {
      this.loading = true
      const params = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      if (this.keywords) {
        params['merchant_name'] = this.keywords
      }

      const { total_count, list } = await this.$api.marketing.getMerchantsList(params)
      this.list = list
      this.total = total_count
      this.loading = false
    },
    reset() {
      this.keywords = ''
      this.region = []
      this.fetch()
    },
    onCurrentChange(pageIndex) {
      this.pageIndex = pageIndex
      this.fetch()
    },
    onRowClick({ id, merchant_name }) {
      let resValue = {
        name: merchant_name,
        value: id
      }
      if (this.selectMerchant.selectValue && this.selectMerchant.selectValue.value == id) {
        resValue = null
      }
      this.$emit('change', resValue)
    },
    getRadioValue({ id }) {
      if (!this.selectMerchant.selectValue) {
        return false
      } else if (this.selectMerchant.selectValue.value == id) {
        return true
      } else {
        return false
      }
      // debugger
    },
    async onChangeCascader() {
      this.fetch()
    }
  }
}
</script>
