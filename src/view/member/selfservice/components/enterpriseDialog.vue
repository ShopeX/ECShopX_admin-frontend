<template>
  <el-dialog
    :title="type != 'show' ? '选择内购企业' : '查看内购企业'"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="distributor">
          <el-autocomplete
            v-model="params.distributor.name"
            :fetch-suggestions="queryStoreSearch"
            placeholder="请输入店铺名称"
            @select="handleSelectStore"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="enterName">
          <el-input v-model="params.enterName" placeholder="请输入企业名称" />
        </SpFilterFormItem>
      </SpFilterForm>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :reserve-selection="true" type="selection" width="55" v-if="type != 'show'" />
      <el-table-column prop="id" label="企业ID" />
      <el-table-column prop="enterprise_sn" label="企业名称" />
      <el-table-column prop="enterprise_sn" label="登录类型" v-if="type != 'show'" />
      <el-table-column prop="distributor_name" label="来源店铺" />
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
      <el-button v-if="type != 'show'" type="primary" @click="saveStoreAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRegionauth } from '@/api/regionauth'

export default {
  props: {
    dialogSelect: {
      type: Array,
      default: function () {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'show' // show查看  edit编辑
    }
  },
  data () {
    const initialParams = {
      page: 1,
      pageSize: 10,
      distributor: {
        id: undefined,
        name: undefined
      },
      enterName: ''
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      templateRadio: '',
      dataType: 'regionauth',
      loading: false,
      tableData: [],
      multipleSelection: [],
      pageLimit: 10,
      total_count: '',
      selectRows: [],
      shopList: [],
    }
  },
  computed: {
    showDialog () {
      return this.visible
    }
  },
  watch: {
    dialogSelect (newVal, oldVal) {
      this.selectRows = newVal
    },
    visible (newVal, oldVal) {
      if (newVal) {
        this.getStoreList()
        this.fetchList()
      }
    }
  },
  methods: {
    getRowKeys(val) {
      return val.id
    },
    handleSelectionChange (val) {
      if (val) {
        this.multipleSelection = val
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      console.log(restaurants, this.shopList)
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      debugger
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list.length > 0) {
        list.forEach((row) => {
          this.shopList.push({ 'value': row.name, 'distributor_id': row.distributor_id })
        })
      }
    },
    onSearch() {
      this.params.page = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    async fetchList () {
      this.loading = true
      let params = {
        ...this.params,
      }
      if (params.distributor.id) {
        params.distributor_id = params.distributor.id
      }
      delete params.distributor
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList(params)
      this.tableData = list
      this.total_count = parseInt(total_count)
      this.loading = false
      this.multipleSelection = []
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.fetchList()
    },
    cancelAction () {
      this.onReset()
      this.multipleSelection = []
      this.$emit('closeDialog', false)
    },
    saveStoreAction () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择企业',
          type: 'warning'
        })
        return
      }
      this.$emit('saveEnterprise', this.multipleSelection)
    }
  }
}
</script>

<style type="text/css">
</style>
