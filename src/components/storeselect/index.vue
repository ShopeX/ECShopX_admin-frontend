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
<template>
  <el-dialog
    class="store-dialog"
    title="选择门店"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input v-model="name" placeholder="输入门店名称" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleIconClick" />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @select="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50" />
      <el-table-column prop="storeName" label="门店名称" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
    </el-table>
    <div v-if="total_count > params.pageSize" class="tr">
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageLimit"
        @current-change="handleCurrentChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">取 消</el-button>
      <el-button type="primary" @click="saveStoreAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getWxShopsList } from '../../api/shop'
export default {
  props: ['storeVisible', 'getStatus', 'isValid', 'relShopIds'],
  data() {
    return {
      loading: false,
      storeData: [],
      multipleSelection: [],
      pageLimit: 10,
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        is_valid: 'true'
      },
      name: ''
    }
  },
  computed: {
    showDialog() {
      return this.storeVisible
    }
  },
  watch: {
    relShopIds(newVal, oldVal) {
      if (newVal) {
        this.selectRows = newVal
      } else {
        this.selectRows = []
      }
      console.log('11', this.selectRows)
    },
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.params.is_valid = this.isValid ? this.isValid : 'true'
        this.getNewsList()
      }
    }
  },
  methods: {
    getRowKeys(row) {
      return row.wxShopId
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getNewsList()
    },
    handleIconClick() {
      this.params.name = this.name
      this.getNewsList()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val, row) {
      console.log('row', row)
      if (val) {
        this.multipleSelection = val
        val.forEach(item => {
          console.warn('item', item)
          let isInArr = this.selectRows.findIndex(n => n.wxShopId == item.wxShopId)
          if (isInArr == -1) {
            this.selectRows.push(item)
          }
        })
      }
      console.warn('this.selectRows', this.selectRows)
    },

    cancelAction() {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      this.$emit('chooseStore', this.multipleSelection)
    },
    getNewsList() {
      if (this.getStatus) {
        this.loading = true
        getWxShopsList(this.params).then(response => {
          this.storeData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          if (this.selectRows) {
            this.selectRows.forEach(item => {
              console.log('item', item)
              this.$refs.multipleTable.toggleRowSelection(item)
            })
          }
        })
      }
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
