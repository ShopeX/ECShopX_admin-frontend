<template>
  <el-dialog
    class="store-dialog"
    :title="isSynchronize ? '同步模板到店铺' : '选择店铺'"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <!-- :show-close="isSynchronize?true:false" -->
    <div style="margin-bottom: 15px">
      <el-input
        v-model="name"
        :placeholder="isSynchronize ? '请选择店铺所在地' : '输入店铺名称'"
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
      v-if="storeVisible"
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
        prop="store_name"
        label="门店"
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
        v-if="!isSynchronize"
        type="primary"
        @click="saveStoreAction"
      >确 定</el-button>
      <el-button
        v-else
        type="primary"
        @click="saveStoreAction"
      >确 定 同 步</el-button>
      <el-button
        v-if="isSynchronize"
        type="primary"
        @click="saveAllStoreAction"
      >同 步 所 有 门 店</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDistributorList } from '@/api/marketing'
export default {
  props: {
    relDataIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    oldData: {
      type: Array,
      default: function () {
        return []
      }
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
    },
    isSynchronize: {
      type: Boolean,
      default: false
    },
    getStatus: {
      type: Boolean
    },
    isSingle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataType: 'distributor',
      loading: false,
      storeData: [],
      multipleSelection: [],
      pageLimit: 10,
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        is_valid: 'true',
        is_app: 1
      },
      name: '',
      selectRows: [],
      isFristLoad: true
    }
  },
  computed: {
    showDialog () {
      return this.storeVisible
    }
  },
  watch: {
    sourceType (newVal, oldVal) {
      this.dataType = this.sourceType
    },
    relDataIds: {
      immediate: true,
      handler (newVal) {
        this.selectRows = newVal
      }
    },
    // relDataIds(newVal, oldVal) {
    //   debugger
    //   this.selectRows = newVal
    // },
    getStatus: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.getDistributor()
        }
      }
    }
  },
  methods: {
    initState () {
      this.isFristLoad = true
      this.storeData = []
      // this.selectRows = []
      // this.params = {
      //   page: 1,
      //   pageSize: 10,
      //   is_valid: 'true',
      //   is_app:1
      // }
    },
    getDistributor () {
      getDistributorList(this.params).then((response) => {
        if (this.storeData.length > 0) this.isFristLoad = false
        this.storeData = response.data.data.list
        this.total_count = parseInt(response.data.data.total_count)
        this.loading = false
        this.multipleSelection = []
        // this.$refs.multipleTable.clearSelection()
        console.log('this.isFristLoad', this.isFristLoad)
        console.log('this.selectRows', this.selectRows)
        // 如果是 首次加载，并且是回显 状态 则执行
        if (this.isFristLoad && this.selectRows) {
          console.log('this.selectRows-test', this.selectRows.length, this.selectRows)
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }
      })
    },
    getRowKeys (row) {
      return row.distributor_id
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDistributor()
    },
    handleIconClick () {
      this.params.name = this.name
      this.getDistributor()
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
        // console.log('handleSelectionChange',val)
        this.multipleSelection = val
        val.forEach((item) => {
          let isInArr = this.selectRows.findIndex((n) => n.distributor_id == item.distributor_id)
          if (isInArr == -1) {
            this.selectRows.push(item)
          }
        })
      }
    },
    cancelAction () {
      this.initState()
      this.$emit('closeStoreDialog')
    },
    saveStoreAction () {
      if (this.isSingle && this.multipleSelection.length > 1) {
        this.$message({
          message: '最多选择一个店铺',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      this.initState()
      this.$emit('chooseStore', this.multipleSelection)
    },
    saveAllStoreAction () {
      this.$emit('chooseAllStore')
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
