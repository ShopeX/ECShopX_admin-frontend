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
      <!-- <el-switch v-model="is_distributor" active-text="店铺" inactive-text="门店" @change="handleIconClick"></el-switch> -->
    </div>
    <div style="margin-bottom: 15px" />
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
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="50"
      />
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="contact"
        label="联系人"
      />
      <!-- <el-table-column prop="store_name" label="门店"></el-table-column> -->
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
    },
    sourceType: {
      type: String,
      default: 'distributor'
    },
    returnType: {
      type: String,
      default: 'selectRow'
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
      name: '',
      is_distributor: true
    }
  },
  computed: {
    showDialog () {
      return this.storeVisible
    }
  },
  watch: {
    relDataIds: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.selectRows = newVal
          this.getNewsList()
        } else {
          this.selectRows = []
        }
      },
      immediate: true,
      deep: true
    },
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.params.is_valid = this.isValid ? this.isValid : 'true'
        this.getNewsList()
      }
    },
    sourceType (newVal, oldVal) {
      console.log(newVal)
      if (newVal) {
      }
    }
  },
  methods: {
    getRowKeys (row) {
      return row.distributor_id
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getNewsList()
    },
    handleIconClick () {
      this.params.name = this.name
      this.params.is_distributor = this.is_distributor
      console.log(this.params)
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
      if (val.length > 0) {
        this.multipleSelection = val
        const newVal = this.selectRows.filter((item) => {
          const isHaveRow = this.storeData.some((row) => {
            if (item.distributor_id) {
              return item.distributor_id == row.distributor_id
            } else {
              return item == row.distributor_id
            }
          })
          return !isHaveRow
        })
        this.selectRows = [...newVal, ...val]
      } else {
        const list = this.selectRows.filter((row) => {
          const isHave = this.storeData.some((item) => {
            if (row.distributor_id) {
              return item.distributor_id == row.distributor_id
            } else {
              return item.distributor_id == row
            }
          })
          return !isHave
        })
        this.selectRows = list
      }
    },
    // 全选事件
    selectAll (val) {
      if (val.length > 0) {
        this.multipleSelection = val
        val.forEach((item) => {
          let isInArr = -1
          if (this.selectRows.length > 0) {
            isInArr = this.selectRows.findIndex((n) => {
              if (n.distributor_id) {
                return n.distributor_id == item.distributor_id
              } else {
                return n.distributor_id == item.distributor_id
              }
            })
          }
          if (isInArr === -1) {
            this.selectRows.push(item)
          }
        })
      } else {
        const list = this.selectRows.filter((item) => {
          const isHave = this.storeData.some((n) => item.distributor_id === n.distributor_id)
          return !isHave
        })
        this.selectRows = list
      }
    },
    cancelAction () {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction () {
      if (this.returnType === 'selectRow') {
        this.$emit('chooseStore', this.selectRows)
      } else {
        this.$emit('chooseStore', this.multipleSelection)
      }
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
            this.storeData.forEach((item) => {
              const isHave = this.selectRows.findIndex((n) => {
                if (n.distributor_id) {
                  return n.distributor_id && n.distributor_id == item.distributor_id
                } else {
                  return n == item.distributor_id
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
