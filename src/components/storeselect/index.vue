<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    class="store-dialog"
    :title="$t('1a20dc63.86c570')"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input v-model="name" :placeholder="$t('1a20dc63.4d521c')" clearable>
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
      <el-table-column prop="storeName" :label="$t('1a20dc63.740032')" />
      <el-table-column prop="address" :label="$t('1a20dc63.765048')" show-overflow-tooltip />
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
      <el-button @click="cancelAction">{{ $t('1a20dc63.c08ab9') }}</el-button>
      <el-button type="primary" @click="saveStoreAction">{{ $t('1a20dc63.aa7527') }}</el-button>
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
        rows.forEach((row) => {
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
        val.forEach((item) => {
          console.warn('item', item)
          let isInArr = this.selectRows.findIndex((n) => n.wxShopId == item.wxShopId)
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
        getWxShopsList(this.params).then((response) => {
          this.storeData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          if (this.selectRows) {
            this.selectRows.forEach((item) => {
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
