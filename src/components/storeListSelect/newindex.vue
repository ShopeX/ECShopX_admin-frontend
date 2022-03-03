<template>
  <el-dialog
    class="store-dialog"
    title="选择店铺"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input
        v-model="name"
        placeholder="输入店铺名称"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleIconClick"
        />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="50"
      />
      <el-table-column
        prop="name"
        label="店铺名称"
      />
      <el-table-column
        prop="contact"
        label="联系人"
      />
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip
      />
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="tr"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageLimit"
        @current-change="handleCurrentChange"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">取 消</el-button>
      <el-button
        type="primary"
        @click="saveStoreAction"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDistributorEasyList } from '@/api/marketing'
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
    }
  },
  data () {
    return {
      loading: false,
      storeData: [],
      multipleSelection: [],
      pageLimit: 10,
      selectRows: [],
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
    showDialog () {
      return this.storeVisible
    }
  },
  watch: {
    relDataIds (newVal, oldVal) {
      if (newVal) {
        this.selectRows = newVal
      } else {
        this.selectRows = []
      }
    },
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.params.is_valid = this.isValid ? this.isValid : 'true'
        this.getNewsList()
      }
    }
  },
  methods: {
    getRowKeys (row) {
      return row.shop_id
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getNewsList()
    },
    handleIconClick () {
      this.params.name = this.name
      this.getNewsList()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      if (val) {
        this.multipleSelection = val
        val.forEach((item) => {
          let isInArr = -1
          if (this.selectRows.length > 0) {
            isInArr = this.selectRows.findIndex((n) => n.shop_id == item.shop_id)
          }
          if (isInArr == -1) {
            this.selectRows.push(item)
          }
        })
      }
    },
    cancelAction () {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction () {
      this.$emit('chooseStore', this.multipleSelection)
    },
    getNewsList () {
      if (this.getStatus) {
        this.loading = true
        getDistributorEasyList(this.params).then((response) => {
          this.storeData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          if (this.selectRows) {
            this.selectRows.forEach((item) => {
              this.$refs.multipleTable.toggleRowSelection(item, true)
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
