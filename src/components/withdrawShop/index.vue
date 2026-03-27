<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="$t('423ebb4e.b5252d')"
      :visible.sync="visible"
      class="couponSelect"
      :before-close="cancelHandle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <div class="query">
        <el-select
          v-model="query.operator_type"
          :placeholder="$t('423ebb4e.3add4b')"
          style="width: 200px"
        >
          <el-option :label="$t('423ebb4e.c079e7')" value="all" />
          <el-option :label="$t('423ebb4e.295713')" value="distributor" />
          <el-option :label="$t('423ebb4e.9019dc')" value="dealer" />
        </el-select>
        <el-input
          :placeholder="$t('423ebb4e.6dbc56')"
          style="width: 400px"
          v-model="query.keywords"
          class="input-with-select"
        >
          <el-button slot="append" @click="queryHandle">{{ $t('423ebb4e.bee912') }}</el-button>
        </el-input>
      </div>
      <div class="list">
        <el-table
          border
          :row-key="getRowKeys"
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" width="55" />
          <el-table-column prop="user_name" :label="$t('423ebb4e.e6f169')" width="220" />
          <el-table-column prop="scope" :label="$t('423ebb4e.4709c8')" width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.operator_type == 'distributor'">{{
                $t('423ebb4e.295713')
              }}</span>
              <span v-else>{{ $t('423ebb4e.9019dc') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="legal_person" :label="$t('423ebb4e.b29725')" width="120" />
          <el-table-column prop="location" :label="$t('423ebb4e.765048')" />
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paging.page"
        :page-sizes="[10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
      <div class="btn">
        <el-button @click="cancelHandle(true)">{{ $t('423ebb4e.625fb2') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('423ebb4e.38cf16') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    seletedBusiness: {
      type: Array
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading: false,
      query: {
        operator_type: '',
        keywords: ''
      },
      total: 0,
      paging: {
        page: 1,
        page_size: 10
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      const { list, total_count } = await this.$api.adapay.seleteBusiness({
        ...this.query,
        ...this.paging
      })
      this.loading = false
      this.tableData = list
      this.total = total_count

      if (this.seletedBusiness.length > 0) {
        this.$refs.multipleTable.clearSelection()
        this.toggleSelection(this.seletedBusiness)
      }
    },
    confirm() {
      this.$emit('saveSeletedBusinessHandle', this.multipleSelection)
    },

    // 获取原先数据加关闭操作
    cancelHandle() {
      this.$emit('closeHandle')
    },

    handleSizeChange(val) {
      this.paging.page_size = val
      this.paging.page = 1
      this.getConfig()
    },
    handleCurrentChange(val) {
      this.paging.page = val
      this.getConfig()
    },
    queryHandle() {
      this.paging.page = 1
      this.getConfig()
    },

    handleSelectionChange(val) {
      // debugger
      console.log('handleSelectionChange', val)
      if (val.length > 0) {
        this.multipleSelection = val
      }
    },
    getRowKeys(val) {
      return val.id
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  watch: {
    // multipleSelection() {
    //   console.log('==this.multipleSelection==', this.multipleSelection)
    //   // if (this.packageId!=undefined) {
    //   this.$emit('seletedDataHandle', this.multipleSelection, this.packageId)
    //   // }
    //   // if (voucher_package !== undefined && voucher_package.length > 0) {
    //   // debugger
    //   // this.$refs.multipleTable.clearSelection()
    //   // this.toggleSelection(arr)
    //   // } else {
    //   // }
    // }
  }
}
</script>

<style lang="scss" scoped>
.couponSelect {
  .query {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list {
    padding: 30px 0px;
  }
  .tips {
    padding: 10px;
    padding-bottom: 0;
    color: #999;
  }
  .btn {
    text-align: right;
    margin-top: 20px;
  }
  .icon {
    font-size: 20px;
    margin-right: 6px;
    color: #409eff;
  }
}
</style>
<style lang="scss">
.couponSelect {
  .el-dialog {
    min-width: 1000px;
  }
}
</style>
