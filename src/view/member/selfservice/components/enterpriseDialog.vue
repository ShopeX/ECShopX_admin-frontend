<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="type != 'show' ? $t('ac2a6290.2fcd25') : $t('ac2a6290.60d2a3')"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="distributor_id">
          <SpSelectShop
            v-model="params.distributor_id"
            clearable
            :placeholder="$t('ac2a6290.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="name">
          <el-input v-model="params.name" :placeholder="$t('ac2a6290.8ded4d')" />
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
      <el-table-column prop="id" :label="$t('ac2a6290.5a83cb')" />
      <el-table-column prop="name" :label="$t('ac2a6290.f47e27')" />
      <el-table-column v-if="type != 'show'" prop="auth_type" :label="$t('ac2a6290.78cbe8')">
        <template slot-scope="scope">
          <div>{{ getValidateTypeName(scope.row.auth_type) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="distributor_name" :label="$t('ac2a6290.53cc55')" />
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
      <el-button @click="cancelAction">{{ $t('ac2a6290.c08ab9') }}</el-button>
      <el-button v-if="type != 'show'" type="primary" @click="saveStoreAction">{{
        $t('ac2a6290.aa7527')
      }}</el-button>
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
      { nameKey: 'ac2a6290.a8b0c2', value: '' },
      { nameKey: 'ac2a6290.8098e2', value: 'mobile' },
      { nameKey: 'ac2a6290.bc1f2d', value: 'account' },
      { nameKey: 'ac2a6290.3bc5e6', value: 'email' },
      { nameKey: 'ac2a6290.22b03c', value: 'qr_code' }
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
    getValidateTypeName(authType) {
      const item = this.VALIDATE_TYPES.find((i) => i.value === authType)
      return item ? this.$t(item.nameKey) : ''
    },
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
          message: this.$t('ac2a6290.321fa5'),
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
