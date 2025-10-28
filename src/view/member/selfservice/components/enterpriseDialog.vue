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
    :title="type != 'show' ? '选择内购企业' : '查看内购企业'"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="distributor_id">
          <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="name">
          <el-input v-model="params.name" placeholder="请输入企业名称" />
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
      <el-table-column
        v-if="type != 'show'"
        :reserve-selection="true"
        type="selection"
        width="55"
      />
      <el-table-column prop="id" label="企业ID" />
      <el-table-column prop="name" label="企业名称" />
      <el-table-column v-if="type != 'show'" prop="auth_type" label="登录类型">
        <template slot-scope="scope">
          <div>{{ VALIDATE_TYPES.find(item => item.value == scope.row.auth_type)?.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="distributor_name" label="来源店铺" />
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
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    const VALIDATE_TYPES = [
      { name: '全部', value: '' },
      { name: '手机号', value: 'mobile' },
      { name: '账号密码', value: 'account' },
      { name: '邮箱', value: 'email' },
      { name: '二维码', value: 'qr_code' }
    ]
    const initialParams = {
      page: 1,
      pageSize: 10,
      distributor_id: '',
      name: ''
    }
    return {
      VALIDATE_TYPES,
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
      selectRows: []
    }
  },
  computed: {
    showDialog() {
      return this.visible
    }
  },
  watch: {
    dialogSelect(newVal, oldVal) {
      this.selectRows = newVal
    },
    visible(newVal, oldVal) {
      if (newVal) {
        this.fetchList()
      }
    }
  },
  methods: {
    getRowKeys(val) {
      return val.id
    },
    handleSelectionChange(val) {
      if (val) {
        this.multipleSelection = val
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
      this.onSearch()
    },
    async fetchList() {
      this.loading = true
      let params = {
        ...this.params
      }
      if (this.data.activity_id) {
        params.activity_id = this.data.activity_id
      }
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList(params)
      this.tableData = list
      this.total_count = parseInt(total_count)
      this.loading = false
      this.multipleSelection = []
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchList()
    },
    cancelAction() {
      this.multipleSelection = []
      this.$emit('closeDialog', false)
    },
    saveStoreAction() {
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

<style type="text/css"></style>
