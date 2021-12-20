<template>
  <el-dialog
    class="store-dialog"
    :title="isSynchronize ? '同步模板到店铺' : '选择店铺'"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input
        :placeholder="isSynchronize ? '请选择店铺所在地' : '输入店铺名称'"
        v-model="name"
        clearable
        ><el-button slot="append" icon="el-icon-search" @click="handleIconClick"></el-button
      ></el-input>
    </div>
    <el-table
      ref="multipleTable"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50"></el-table-column>
      <el-table-column prop="name" label="店铺名称"></el-table-column>
      <el-table-column prop="contact" label="联系人"></el-table-column>
      <el-table-column prop="store_name" label="门店"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="tr">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total_count"
        :page-size="pageLimit"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">取 消</el-button>
      <el-button type="primary" v-if="!isSynchronize" @click="saveStoreAction">确 定</el-button>
      <el-button type="primary" v-else @click="saveStoreAction">确 定 同 步</el-button>
      <el-button type="primary" v-if="isSynchronize" @click="saveAllStoreAction"
        >同 步 所 有 门 店</el-button
      >
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
    oldData:{
      type: Array,
      default: function () {
        return []
      }
    },
    // data () {
    //   return {
    //     dataType: 'distributor',
    //     loading: false,
    //     storeData: [],
    //     multipleSelection: [],
    //     pageLimit: 10,
    //     total_count: '',
    //     params: {
    //       page: 1,
    //       pageSize: 10,
    //       is_valid: 'true',
    //       is_app:1
    //     },
    //     name: '',
    //     selectRows: []
    //   }
    // },
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
    }
  },
  data() {
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
      selectRows: []
    }
  },
  mounted() {
    this.getDistributor()
  },
  methods: {
    getDistributor() {
      getDistributorList(this.params).then((response) => {
        this.storeData = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false

        if (this.relDataIds.length > 0) {
          this.$refs.multipleTable.clearSelection()
          this.toggleSelection(this.relDataIds)
        }
      })
    },
    getRowKeys(row) {
      return row.distributor_id
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDistributor()
    },
    handleIconClick() {
      this.params.name = this.name
      this.getDistributor()
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
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.multipleSelection = val
      }
    },
    cancelAction() {
      this.$emit('closeStoreDialog')
      this.$emit('chooseStore', this.oldData)
    },
    saveStoreAction() {
      this.$emit('chooseStore', this.multipleSelection)
      this.$emit('closeStoreDialog')
    },
    saveAllStoreAction() {
      this.$emit('chooseAllStore')
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
    multipleSelection() {
      this.$emit('chooseStore', this.multipleSelection)
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
