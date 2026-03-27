<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="distributorAftersalesAddress">
    <div style="margin-bottom: 15px">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="handleCreate">
          {{ $t('0d468884.9819a4') }}
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="tableLoading" :data="list" style="width: 100%">
        <el-table-column prop="distributor_name" :label="$t('0d468884.8a0cc2')" width="200px" />
        <el-table-column prop="invoice_head" :label="$t('0d468884.6cbd05')" />
        <el-table-column prop="invoice_code" :label="$t('0d468884.a22d0a')" width="150px" />
        <el-table-column prop="invoice_code" :label="$t('0d468884.9c1f61')" width="200px">
          <template slot-scope="scope">
            <span v-if="1 == scope.row.invoice_type">{{ $t('0d468884.eb6806') }}</span>
            <span v-else-if="2 == scope.row.invoice_type">{{ $t('0d468884.747c7a') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoice_addr" :label="$t('0d468884.508e3d')" />
        <el-table-column prop="invoice_phone_number" :label="$t('0d468884.42c25e')" width="100px" />
        <el-table-column prop="invoice_bank_name" :label="$t('0d468884.16844c')" width="200px" />
        <el-table-column prop="invoice_bank_no" :label="$t('0d468884.4a9880')" width="100px" />
        <el-table-column :label="$t('0d468884.2b6bc0')" width="200px">
          <template slot-scope="scope">
            <el-button circle type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button
              circle
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="content-center content-top-padded">
        <el-pagination
          background=""
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.page_size"
          layout="total, sizes, prev, pager, next"
          :total="total_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        :title="$t('0d468884.a4d703')"
        :visible.sync="relShop.relShopVisible"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="shopLoading" :data="relShop.list">
            <el-table-column prop="shop_id" label="id" width="60" />
            <el-table-column prop="store_name" :label="$t('0d468884.0d4934')" width="300" />
            <el-table-column prop="address" :label="$t('0d468884.9198af')" />
          </el-table>
          <div
            v-if="relShop.total_count > relShop.params.page_size"
            class="content-center content-top-padded"
          >
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="relShop.params.page"
              :total="relShop.total_count"
              :page-size="relShop.params.page_size"
              @current-change="handleRelShopCurrentChange"
            />
          </div>
        </template>
      </el-dialog>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="45%"
      >
        <el-form ref="dataForm" :model="data" label-width="100px">
          <el-form-item :label="$t('0d468884.295713')">
            <template v-if="rel_distributor_ids && operate == 'create'">
              <el-tag
                v-for="(item, index) in rel_distributor_ids"
                :key="item.name"
                :disable-transitions="false"
                closable
                @close="storeClose(rel_distributor_ids, index)"
              >
                {{ item.name }}
              </el-tag>
            </template>
            <el-button
              v-if="rel_distributor_ids && operate == 'create'"
              type="text"
              @click="addStoreAction"
            >
              {{ $t('0d468884.7b91b1') }}
            </el-button>
            <template v-if="operate == 'update'">
              <span>{{ shopname }}</span>
            </template>
          </el-form-item>
          <el-form-item :label="$t('0d468884.6cbd05')">
            <el-input v-model="data.invoice_head" placeholder="" />
          </el-form-item>
          <el-form-item :label="$t('0d468884.a22d0a')">
            <el-input v-model="data.invoice_code" placeholder="" />
          </el-form-item>
          <el-form-item :label="$t('0d468884.9c1f61')">
            <el-radio-group v-model="data.invoice_type">
              <el-radio :label="'1'"> {{ $t('0d468884.eb6806') }} </el-radio>
              <!--              <el-radio :label="'2'">普通发票</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('0d468884.508e3d')">
            <el-input v-if="1 == data.invoice_type" v-model="data.invoice_addr" placeholder="" />
          </el-form-item>
          <el-form-item :label="$t('0d468884.42c25e')">
            <el-input
              v-if="1 == data.invoice_type"
              v-model="data.invoice_phone_number"
              placeholder=""
            />
          </el-form-item>
          <el-form-item :label="$t('0d468884.16844c')">
            <el-input
              v-if="1 == data.invoice_type"
              v-model="data.invoice_bank_name"
              placeholder=""
            />
          </el-form-item>
          <el-form-item :label="$t('0d468884.4a9880')">
            <el-input v-if="1 == data.invoice_type" v-model="data.invoice_bank_no" placeholder="" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('0d468884.c08ab9') }}</el-button>
          <el-button v-if="operate == 'create'" type="primary" @click="createDistributorInvoice">{{
            $t('0d468884.aa7527')
          }}</el-button>
          <el-button v-if="operate == 'update'" type="primary" @click="updateDistributorInvoice">{{
            $t('0d468884.aa7527')
          }}</el-button>
        </span>
      </el-dialog>
    </div>
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-data-ids="relStores"
      :get-status="setStoreStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>

<script>
import {
  getInvoiceList,
  getInvoiceInfo,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '@/api/aftersales'
import StoreSelect from '@/components/storeListSelect/newindex'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    StoreSelect,
    shopSelect
  },
  data() {
    return {
      tableLoading: false,
      shopLoading: false,
      dialogVisible: false,
      storeVisible: false,
      setStoreStatus: false,
      list: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 20
      },
      data: {
        invoice_head: '',
        invoice_code: '',
        invoice_type: '1',
        invoice_addr: '',
        invoice_phone_number: '',
        invoice_bank_name: '',
        invoice_bank_no: ''
      },
      dialogTitle: this.$t('0d468884.9819a4'),
      distributors: [],
      distributor_id: 0,
      shopname: '',
      operate: 'update',
      rel_distributor_ids: [],
      relStores: [],
      relShop: {
        list: [],
        total_count: 0,
        params: {
          page: 1,
          page_size: 20
        },
        relShopVisible: false
      }
    }
  },
  mounted() {
    this.getDistributorInvoiceList()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.dialogVisible = true
      this.operate = 'create'
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.operate = 'update'
      this.shopname = row.distributor_name
      this.data = Object.assign({}, row)
      this.dialogTitle = this.$t('0d468884.454d9b')
    },
    handleDelete(row) {
      this.$confirm(this.$t('0d468884.edc438'), this.$t('0d468884.02d981'), {
        confirmButtonText: this.$t('0d468884.38cf16'),
        cancelButtonText: this.$t('0d468884.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteInvoice(row.invoice_id).then((response) => {
            if (response.data.data.status) {
              this.$message({
                type: 'success',
                message: this.$t('0d468884.fc9bdd')
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$t('0d468884.9cf7a3')
              })
            }
            this.getDistributorInvoiceList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('0d468884.c34281')
          })
        })
    },
    handleSizeChange(val) {
      this.params.page_size = val
    },
    handleCurrentChange(val) {
      this.params.page = val
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    addStoreAction() {
      this.storeVisible = true
      this.setStoreStatus = true
      this.relStores = JSON.parse(JSON.stringify(this.rel_distributor_ids))
    },
    storeClose(list, index) {
      this.setStoreStatus = false
      this.rel_distributor_ids.splice(index, 1)
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      if (data === null || data.length <= 0) return
      this.rel_distributor_ids = data
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    createDistributorInvoice() {
      const ids = []
      this.rel_distributor_ids.forEach(function (value) {
        ids.push(value.distributor_id)
      })
      this.data.distributor_id = ids
      createInvoice(this.data).then((response) => {
        if (response.data.data.status) {
          this.$message({
            message: this.$t('0d468884.3fdaea'),
            type: 'success'
          })
        } else {
          this.$message({
            message: this.$t('0d468884.6452a0'),
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorInvoiceList()
      })
    },
    updateDistributorInvoice(row) {
      updateInvoice(this.data.invoice_id, this.data).then((response) => {
        if (response.data.data.status) {
          this.$message({
            message: this.$t('0d468884.69be67'),
            type: 'success'
          })
        } else {
          this.$message({
            message: this.$t('0d468884.5badb3'),
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorInvoiceList()
      })
    },
    getDistributorInvoiceList() {
      this.tableLoading = true
      getInvoiceList(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
