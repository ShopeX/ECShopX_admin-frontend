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
    title="选择门店11"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input v-model="name" placeholder="输入店铺名称" clearable>
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
      @select-all="selectAll"
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
import { getWxShopsList } from '@/api/shop'
export default {
  props: {
    relDataIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    getStatus: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    storeVisible: {
      type: Boolean,
      default: false
    },
    sourceType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataType: 'distributor',
      loading: false,
      storeData: [],
      selectRows: [],
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
    sourceType(newVal, oldVal) {
      this.dataType = this.sourceType
    },
    relDataIds(newVal, oldVal) {
      this.selectRows = newVal
    },
    getStatus(newVal, oldVal) {
      this.getWxshop()
    }
  },
  methods: {
    getWxshop() {
      //let param = {}
      getWxShopsList(this.params).then(response => {
        this.storeData = response.data.data.list
        this.total_count = parseInt(response.data.data.total_count)
        this.loading = false
        this.multipleSelection = []
        this.$refs.multipleTable.clearSelection()
        if (this.selectRows) {
          this.storeData.forEach(item => {
            const isHave = this.selectRows.findIndex(n => {
              if (n.wxShopId) {
                return n.wxShopId && n.wxShopId == item.wxShopId
              } else {
                return n == item.wxShopId
              }
            })
            if (isHave !== -1) {
              setTimeout(() => {
                this.$refs.multipleTable.toggleRowSelection(item)
              })
            }
          })
        }
      })
    },
    getRowKeys(row) {
      return row.wxShopId
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getWxshop()
    },
    handleIconClick() {
      this.params.name = this.name
      this.getWxshop()
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
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.multipleSelection = val
        const newVal = this.selectRows.filter(item => {
          const isHaveRow = this.storeData.some(row => {
            if (item.wxShopId) {
              return item.wxShopId == row.wxShopId
            } else {
              return item == row.wxShopId
            }
          })
          return !isHaveRow
        })
        this.selectRows = [...newVal, ...val]
      } else {
        const list = this.selectRows.filter(row => {
          const isHave = this.storeData.some(item => {
            if (row.wxShopId) {
              return item.wxShopId == row.wxShopId
            } else {
              return item.wxShopId == row
            }
          })
          return !isHave
        })
        this.selectRows = list
      }
    },
    // 全选事件
    selectAll(val) {
      if (val.length > 0) {
        this.multipleSelection = val
        val.forEach(item => {
          let isInArr = -1
          if (this.selectRows.length > 0) {
            isInArr = this.selectRows.findIndex(n => {
              if (n.wxShopId) {
                return n.wxShopId == item.wxShopId
              } else {
                return n.wxShopId == item.wxShopId
              }
            })
          }
          if (isInArr === -1) {
            this.selectRows.push(item)
          }
        })
      } else {
        const list = this.selectRows.filter(item => {
          const isHave = this.storeData.some(n => item.wxShopId === n.wxShopId)
          return !isHave
        })
        this.selectRows = list
      }
    },
    cancelAction() {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      this.$emit('chooseStore', this.selectRows)
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
