<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    class="store-dialog"
    :title="isSynchronize ? $t('f15fc38a.b5c671') : $t('f15fc38a.afa2e6')"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <!-- :show-close="isSynchronize?true:false" -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px">
      <el-input
        v-model="name"
        :placeholder="isSynchronize ? $t('f15fc38a.336865') : $t('f15fc38a.240fdb')"
        clearable
        @keyup.enter.native="handleIconClick"
      />
      <el-input
        v-model="shop_code"
        :placeholder="$t('a523b3a5.68f04a')"
        clearable
        @keyup.enter.native="handleIconClick"
      />
      <el-button icon="el-icon-search" @click="handleIconClick" />
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
      <el-table-column type="selection" :reserve-selection="true" width="50" />
      <el-table-column prop="name" :label="$t('f15fc38a.0d4934')" />
      <el-table-column prop="shop_code" :label="$t('a523b3a5.f6d738')" width="120" />
      <el-table-column prop="contact" :label="$t('f15fc38a.52409d')" />
      <el-table-column prop="is_valid" :label="$t('f15fc38a.3fea7c')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_valid === 'true'">{{ $t('f15fc38a.7854b5') }}</span>
          <span v-else-if="scope.row.is_valid === 'false'">{{ $t('f15fc38a.710ad0') }}</span>
          <span v-else-if="scope.row.is_valid === 'delete'">{{ $t('f15fc38a.0044f6') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="store_name" :label="$t('f15fc38a.a7da92')" />
      <el-table-column prop="address" :label="$t('f15fc38a.765048')" show-overflow-tooltip />
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
      <el-button @click="cancelAction">{{ $t('f15fc38a.c08ab9') }}</el-button>
      <el-button v-if="!isSynchronize" type="primary" @click="saveStoreAction">{{
        $t('f15fc38a.aa7527')
      }}</el-button>
      <el-button v-else type="primary" @click="saveStoreAction">{{
        $t('f15fc38a.38ee33')
      }}</el-button>
      <el-button v-if="isSynchronize" type="primary" @click="saveAllStoreAction">{{
        $t('f15fc38a.90d8ec')
      }}</el-button>
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
    /** 请求 /distributors 时的 is_valid 参数，默认 true；传 cloud_all 时与后端云店全量筛选一致 */
    isValidFilter: {
      type: String,
      default: 'true'
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
    },
    distribution_type: {
      type: String,
      default: ''
    },
    queryParams: {
      type: Object,
      default: () => ({})
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
        is_valid: '',
        is_app: 0,
        distribution_type: ''
      },
      name: '',
      shop_code: '',
      selectRows: [],
      isFristLoad: true
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
    relDataIds: {
      immediate: true,
      handler(newVal) {
        this.selectRows = newVal
      }
    },
    // relDataIds(newVal, oldVal) {
    //   debugger
    //   this.selectRows = newVal
    // },
    getStatus: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getDistributor()
        }
      }
    }
  },
  methods: {
    initState() {
      this.isFristLoad = true
      this.storeData = []
      this.name = ''
      this.shop_code = ''
      // this.selectRows = []
      // this.params = {
      //   page: 1,
      //   pageSize: 10,
      //   is_valid: 'true',
      //   is_app:1
      // }
    },
    getDistributor() {
      this.params.distribution_type = this.distribution_type
      this.params.is_valid = this.isValidFilter
      const requestParams = {
        ...this.params,
        ...this.queryParams
      }
      getDistributorList(requestParams).then((response) => {
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
    getRowKeys(row) {
      return row.distributor_id
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDistributor()
    },
    handleIconClick() {
      this.params.page = 1
      this.params.name = this.name
      this.params.shop_code = this.shop_code
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
    cancelAction() {
      this.initState()
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      if (this.isSingle && this.multipleSelection.length > 1) {
        this.$message({
          message: this.$t('f15fc38a.3c38b5'),
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      this.initState()
      this.$emit('chooseStore', this.multipleSelection)
    },
    saveAllStoreAction() {
      this.$emit('chooseAllStore')
    }
  }
}
</script>

<style scoped lang="scss">
.store-dialog {
  .el-dialog {
    width: 800px;
  }

  .el-checkbox {
    display: inline;
  }

  .tr {
    text-align: right;
    margin-top: 10px;
  }
}
</style>
