<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    class="store-dialog"
    :title="$t('8982b21d.afa2e6')"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input v-model="name" :placeholder="$t('8982b21d.240fdb')" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleIconClick" />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column :label="$t('8982b21d.153fa6')">
        <template slot-scope="scope">
          <el-radio
            v-model="templateRadio"
            :label="scope.row.distributor_id"
            @change.native="getTemplateRow(scope.$index, scope.row)"
          >
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('8982b21d.0d4934')" />
      <el-table-column prop="contact" :label="$t('8982b21d.52409d')" />
      <el-table-column prop="store_name" :label="$t('8982b21d.a7da92')" />
      <el-table-column prop="address" :label="$t('8982b21d.765048')" show-overflow-tooltip />
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
      <el-button @click="cancelAction">{{ $t('8982b21d.c08ab9') }}</el-button>
      <el-button type="primary" @click="saveStoreAction">{{ $t('8982b21d.aa7527') }}</el-button>
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
      templateRadio: '',
      dataType: 'distributor',
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
    sourceType(newVal, oldVal) {
      this.dataType = this.sourceType
    },
    relDataIds(newVal, oldVal) {
      this.selectRows = newVal
    },
    getStatus(newVal, oldVal) {
      this.getDistributor()
    }
  },
  methods: {
    getTemplateRow(index, row) {
      this.multipleSelection = new Array(row)
    },
    getDistributor() {
      getDistributorList(this.params).then((response) => {
        this.storeData = response.data.data.list
        this.total_count = parseInt(response.data.data.total_count)
        this.loading = false
        this.multipleSelection = []
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDistributor()
    },
    handleIconClick() {
      this.params.name = this.name
      this.getDistributor()
    },
    cancelAction() {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
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
